import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "./mediaService";

export interface BookingDetails {
  name: string;
  phone: string;
  email?: string;
  treatment: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export const DOCTOR_INFO = {
  phone: "+91 9226856934",
  phoneRaw: "919226856934",
  email: "theaestheticvilla@gmail.com",
  clinic: "The Aesthetic Villa · Skin & Dental Clinic",
  address: "SHOP NO. 4, PRATHMA CHS, Paramhans Nagar, Opposite Pebbles Urbania, Kothrud, Pune",
};

const LOCAL_BOOKINGS_KEY = "aesthetic_villa_bookings_v1";

class BookingNotificationService {
  /**
   * Generates formatted WhatsApp URL to send appointment details to Dr. Tejashree Kulkarni (+91 9226856934)
   */
  public getDoctorWhatsAppUrl(booking: BookingDetails): string {
    const message = [
      `*🏥 NEW APPOINTMENT REQUEST - The Aesthetic Villa*`,
      ``,
      `*👤 Patient Name:* ${booking.name.trim()}`,
      `*📞 Patient Phone:* ${booking.phone.trim()}`,
      `*📧 Email:* ${booking.email?.trim() || "Not provided"}`,
      `*🦷 Treatment Needed:* ${booking.treatment}`,
      `*📅 Preferred Date:* ${booking.preferredDate?.trim() || "Earliest available"}`,
      `*⏰ Preferred Time:* ${booking.preferredTime?.trim() || "Any convenient time"}`,
      `*📝 Notes / Concerns:* ${booking.notes?.trim() || "None specified"}`,
      ``,
      `_Submitted via theaestheticvilla.com_`,
    ].join("\n");

    return `https://wa.me/${DOCTOR_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Generates formatted WhatsApp URL for the patient's own WhatsApp with confirmation details
   */
  public getPatientWhatsAppConfirmationUrl(booking: BookingDetails): string {
    const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
    // Default country code 91 if 10 digits
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = [
      `*Hello ${booking.name.trim()},*`,
      ``,
      `Thank you for requesting an appointment at *${DOCTOR_INFO.clinic}*.`,
      `Here is a summary of your consultation request:`,
      `• *Treatment:* ${booking.treatment}`,
      `• *Date:* ${booking.preferredDate?.trim() || "Earliest available"}`,
      `• *Slot:* ${booking.preferredTime?.trim() || "Any convenient time"}`,
      ``,
      `Dr. Tejashree Kulkarni (+91 9226856934) will connect with you shortly to confirm your visit.`,
      `📍 *Location:* ${DOCTOR_INFO.address}`,
    ].join("\n");

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Sends email notification to Doctor (theaestheticvilla@gmail.com) and Patient via EmailJS
   */
  public async sendEmailNotifications(booking: BookingDetails): Promise<{
    doctorEmailSent: boolean;
    patientEmailSent: boolean;
    error?: string;
  }> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_1y5153h";
    const ownerTemplateId = import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID || "template_x34t0hv";
    const patientTemplateId = import.meta.env.VITE_EMAILJS_PATIENT_TEMPLATE_ID || "template_czgcflk";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "MXUrD7Iv57envCYKk";

    let doctorEmailSent = false;
    let patientEmailSent = false;

    // 1. Send Email to Doctor (theaestheticvilla@gmail.com)
    try {
      const doctorTemplateParams = {
        to_email: DOCTOR_INFO.email,
        doctor_email: DOCTOR_INFO.email,
        patient_name: booking.name,
        patient_phone: booking.phone,
        patient_email: booking.email || "Not provided",
        treatment: booking.treatment,
        preferred_date: booking.preferredDate || "Earliest Available",
        preferred_time: booking.preferredTime || "Any Convenient Time",
        notes: booking.notes || "No additional notes",
        clinic_name: DOCTOR_INFO.clinic,
        doctor_phone: DOCTOR_INFO.phone,
        submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      };

      await emailjs.send(serviceId, ownerTemplateId, doctorTemplateParams, publicKey);
      doctorEmailSent = true;
    } catch (err) {
      console.warn("EmailJS doctor email dispatch failed:", err);
    }

    // 2. Send Confirmation Email to Patient (if email provided)
    if (booking.email && booking.email.includes("@")) {
      try {
        const patientTemplateParams = {
          to_email: booking.email,
          to_name: booking.name,
          patient_name: booking.name,
          treatment: booking.treatment,
          preferred_date: booking.preferredDate || "Earliest Available",
          preferred_time: booking.preferredTime || "Any Convenient Time",
          doctor_name: "Dr. Tejashree Kulkarni",
          doctor_phone: DOCTOR_INFO.phone,
          doctor_email: DOCTOR_INFO.email,
          clinic_name: DOCTOR_INFO.clinic,
          clinic_address: DOCTOR_INFO.address,
        };

        await emailjs.send(serviceId, patientTemplateId, patientTemplateParams, publicKey);
        patientEmailSent = true;
      } catch (err) {
        console.warn("EmailJS patient confirmation email failed:", err);
      }
    }

    // 3. Also persist lead to Supabase / Local storage
    await this.saveBookingRecord(booking);

    return { doctorEmailSent, patientEmailSent };
  }

  /**
   * Saves the booking record into Supabase table (or localStorage backup)
   */
  public async saveBookingRecord(booking: BookingDetails): Promise<void> {
    const record = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: booking.name.trim(),
      phone: booking.phone.trim(),
      email: booking.email?.trim() || null,
      treatment: booking.treatment,
      preferred_date: booking.preferredDate?.trim() || null,
      preferred_time: booking.preferredTime?.trim() || null,
      notes: booking.notes?.trim() || null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await (supabase as any).from("appointment_bookings").insert([record]);
      } catch (e) {
        // Fallback to local
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || "[]");
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify([record, ...local]));
    } catch (e) {
      /* ignore */
    }
  }
}

export const bookingNotificationService = new BookingNotificationService();
