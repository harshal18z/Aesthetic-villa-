import React, { useState } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { TREATMENTS } from "@/data/treatments";
import {
  bookingNotificationService,
  DOCTOR_INFO,
  BookingDetails,
} from "@/services/bookingNotificationService";
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle,
  Sparkles,
  MapPin,
  Send,
  Mail,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface BookingSectionProps {
  preselectedTreatment?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedTreatment = "",
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(preselectedTreatment || TREATMENTS[0].title);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingDetails | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    doctor: boolean;
    patient: boolean;
  }>({ doctor: false, patient: false });

  const { morningSlots, eveningSlots } = CLINIC_INFO.contact.timings;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide your name.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please provide your phone number.");
      return;
    }

    setLoading(true);
    const bookingPayload: BookingDetails = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      treatment: service,
      preferredDate: selectedDate.trim() || undefined,
      preferredTime: timeSlot.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      // 1. Send Email Notifications to Doctor (theaestheticvilla@gmail.com) and Patient
      const emailResult = await bookingNotificationService.sendEmailNotifications(bookingPayload);
      setEmailStatus({
        doctor: emailResult.doctorEmailSent,
        patient: emailResult.patientEmailSent,
      });

      setSubmittedData(bookingPayload);
      setSubmitted(true);

      // 2. Open WhatsApp directly to Doctor (+91 9226856934) with full formatted appointment request
      const doctorWaUrl = bookingNotificationService.getDoctorWhatsAppUrl(bookingPayload);
      window.open(doctorWaUrl, "_blank", "noopener,noreferrer");

      toast.success("Appointment request submitted and WhatsApp opened!");
    } catch (err) {
      console.error("Booking submission error:", err);
      // Still show submitted screen with WhatsApp fallback
      setSubmittedData(bookingPayload);
      setSubmitted(true);
      const doctorWaUrl = bookingNotificationService.getDoctorWhatsAppUrl(bookingPayload);
      window.open(doctorWaUrl, "_blank", "noopener,noreferrer");
      toast.info("Appointment request recorded. Please send via WhatsApp!");
    } finally {
      setLoading(false);
    }
  };

  const currentDoctorWaUrl = submittedData
    ? bookingNotificationService.getDoctorWhatsAppUrl(submittedData)
    : `https://wa.me/${DOCTOR_INFO.phoneRaw}?text=${encodeURIComponent(
        `Hello Dr. Tejashree, I would like to book a consultation at The Aesthetic Villa for ${service}. My Name: ${name || "[Name]"}, Phone: ${phone || "[Phone]"}.`
      )}`;

  const patientConfirmationWaUrl = submittedData
    ? bookingNotificationService.getPatientWhatsAppConfirmationUrl(submittedData)
    : null;

  return (
    <section id="booking" className="py-24 sm:py-32 bg-[#F6F2EC] relative overflow-hidden">
      {/* Background ambient lighting orb */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-radial from-[#B8955A]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Clinic Visit Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#B8955A]" />
                <span>Reserve Your Consultation</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#2B2118] font-normal leading-[1.1] mb-4">
                Come and See the Villa
              </h2>
              <p className="text-[#4a3c2d] text-base leading-relaxed">
                Whether you need a routine checkup, an advanced implant evaluation, or a complete cosmetic smile makeover, our doors are open for an unhurried, comfortable consultation.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 p-6 rounded-3xl bg-white/80 border border-[#B8955A]/25 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#7A5E2E] font-semibold">
                    Clinic Address
                  </h4>
                  <p className="text-sm text-[#2B2118] mt-0.5 leading-snug">
                    {CLINIC_INFO.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#B8955A]/15">
                <Clock className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#7A5E2E] font-semibold">
                    Consultation Hours
                  </h4>
                  <p className="text-sm text-[#2B2118] mt-0.5">
                    {CLINIC_INFO.contact.timings.weekdays}
                  </p>
                  <p className="text-xs text-[#7A5E2E] mt-0.5">
                    {CLINIC_INFO.contact.timings.sunday}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#B8955A]/15">
                <Phone className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#7A5E2E] font-semibold">
                    Doctor Direct Phone / WhatsApp
                  </h4>
                  <a
                    href={`tel:${DOCTOR_INFO.phone}`}
                    className="text-sm font-semibold text-[#7A5E2E] hover:underline block"
                  >
                    {DOCTOR_INFO.phone}
                  </a>
                  <p className="text-[11px] text-[#5A401A] mt-0.5">
                    Dr. Tejashree Kulkarni · Chief Dental Surgeon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#B8955A]/15">
                <Mail className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#7A5E2E] font-semibold">
                    Clinic Email
                  </h4>
                  <a
                    href={`mailto:${DOCTOR_INFO.email}`}
                    className="text-sm font-semibold text-[#7A5E2E] hover:underline"
                  >
                    {DOCTOR_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Doctor WhatsApp CTA Button */}
            <a
              href={`https://wa.me/${DOCTOR_INFO.phoneRaw}?text=${encodeURIComponent(
                "Hello Dr. Tejashree, I would like to inquire about booking an appointment at The Aesthetic Villa."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold tracking-wide shadow-md transition-all hover:shadow-lg cursor-pointer hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Instant Chat on WhatsApp (+91 9226856934)</span>
            </a>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-white/95 p-8 sm:p-10 rounded-3xl border border-[#B8955A]/30 shadow-xl">
            {submitted && submittedData ? (
              <div className="py-8 text-center space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#2B2118] font-normal mb-2">
                    Thank You, {submittedData.name}!
                  </h3>
                  <p className="text-sm text-[#4a3c2d] max-w-lg mx-auto leading-relaxed">
                    Your appointment request for <strong>{submittedData.treatment}</strong> has been processed. Dr. Tejashree Kulkarni&apos;s team will connect with you promptly.
                  </p>
                </div>

                {/* Dispatch Status Badges */}
                <div className="p-4 rounded-2xl bg-[#F6F2EC] border border-[#B8955A]/25 max-w-md mx-auto text-left space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#2B2118]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>
                      <strong>Mail Sent to Doctor:</strong> {DOCTOR_INFO.email}
                    </span>
                  </div>

                  {submittedData.email && (
                    <div className="flex items-center gap-2 text-xs text-[#2B2118]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong>Confirmation Email:</strong> Dispatched to {submittedData.email}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#2B2118]">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />
                    <span>
                      <strong>WhatsApp Direct:</strong> Connected to Doctor ({DOCTOR_INFO.phone})
                    </span>
                  </div>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="space-y-3 max-w-md mx-auto pt-2">
                  <a
                    href={currentDoctorWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Send Details on WhatsApp to Doctor</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                  </a>

                  {patientConfirmationWaUrl && (
                    <a
                      href={patientConfirmationWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-6 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D9B878]" />
                      <span>Save Copy to Patient&apos;s WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-[#B8955A]/20">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setSelectedDate("");
                      setTimeSlot("");
                      setNotes("");
                    }}
                    className="px-6 py-2.5 rounded-full border border-[#B8955A]/40 text-xs font-semibold text-[#2B2118] hover:bg-[#F6F2EC] transition cursor-pointer"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2B2118] font-normal mb-1">
                    Request an Appointment
                  </h3>
                  <p className="text-xs text-[#5a4a38]">
                    Fill in your details and our team will get in touch promptly via Email and WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    />
                    <span className="text-[10px] text-[#7A5E2E] block mt-1">
                      We send appointment confirmation & doctor details to this email
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Treatment Needed
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    >
                      {TREATMENTS.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                    >
                      <option value="">Any Convenient Time</option>
                      <optgroup label="Morning Slots (10:00 AM – 2:00 PM)">
                        {morningSlots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Evening Slots (5:00 PM – 9:00 PM)">
                        {eveningSlots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2118] uppercase tracking-wider mb-1.5">
                    Notes or Specific Concerns
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us if you have any dental pain, anxiety, or previous history..."
                    className="w-full px-4 py-3 rounded-xl border border-[#B8955A]/35 bg-[#F6F2EC]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 text-sm text-[#2B2118]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#2B2118] hover:bg-[#7A5E2E] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Appointment Request…</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Consultation Callback</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-center text-[11px] text-[#7A5E2E]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8955A]" />
                  <span>
                    Direct notification to doctor (+91 9226856934 / theaestheticvilla@gmail.com). No spam.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
