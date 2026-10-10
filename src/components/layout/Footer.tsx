import React from "react";
import { Link } from "react-router-dom";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { MapPin, Phone, Mail, Clock, Lock } from "lucide-react";
import { ClinicLogo } from "./ClinicLogo";

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#1A140E] text-[#F3E9D6] pt-20 pb-12 border-t border-[#B8955A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col with Official Clinic Logo */}
          <div className="lg:col-span-4 space-y-4">
            <ClinicLogo size="md" variant="dark" />
            <p className="text-xs text-[#D8CDBA] leading-relaxed max-w-sm pt-2">
              A private villa retreat in Kothrud, Pune, where advanced dental science meets unhurried hospitality. Led by Chief Dental Surgeon Dr. Tejashree Kulkarni.
            </p>
            <div className="pt-2">
              <span className="text-[10px] tracking-widest uppercase text-[#D9B878] font-semibold block mb-1">
                Official Clinical Accreditation
              </span>
              <img
                src="/img/clinic-logo-mark.png"
                alt="The Aesthetic Villa emblem"
                className="w-12 h-auto opacity-90"
              />
            </div>
          </div>

          {/* Visit & Timings from Logo */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D9B878]" />
              <span>Visit The Villa</span>
            </h4>
            <p className="text-sm text-[#F3E9D6] leading-relaxed">
              {CLINIC_INFO.contact.address}
            </p>

            <h4 className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold flex items-center gap-2 pt-3">
              <Clock className="w-4 h-4 text-[#D9B878]" />
              <span>Appointment Hours</span>
            </h4>
            <p className="text-sm font-medium text-white">
              {CLINIC_INFO.contact.timings.weekdays}
            </p>
            <p className="text-xs text-[#D9B878] uppercase tracking-wider font-semibold">
              {CLINIC_INFO.contact.timings.sunday}
            </p>
          </div>

          {/* Contact & Map */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D9B878]" />
              <span>Contact Directly</span>
            </h4>
            <div className="space-y-1">
              <a
                href={`tel:${CLINIC_INFO.contact.phoneClean}`}
                className="text-base font-medium text-white hover:text-[#D9B878] block transition-colors"
              >
                {CLINIC_INFO.contact.phone}
              </a>
              <a
                href={`mailto:${CLINIC_INFO.contact.email}`}
                className="text-xs text-[#D8CDBA] hover:underline block flex items-center gap-1.5 pt-1"
              >
                <Mail className="w-3.5 h-3.5 text-[#D9B878]" />
                <span>{CLINIC_INFO.contact.email}</span>
              </a>
            </div>

            {/* Interactive Google Map Embed */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#B8955A]/30 shadow-lg mt-4">
              <iframe
                title="The Aesthetic Villa Location"
                src={CLINIC_INFO.contact.googleMapsEmbed}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Legal & Medical Disclaimers */}
        <div className="pt-8 text-center sm:flex sm:justify-between text-[11px] text-[#A69B89] space-y-2 sm:space-y-0">
          <p className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} {CLINIC_INFO.name}. All Rights Reserved.</span>
            <span className="opacity-40">·</span>
            <Link
              to="/admin"
              className="text-[#A69B89] hover:text-[#D9B878] transition-colors inline-flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </p>
          <p className="max-w-xl text-left sm:text-right">
            Medical Disclaimer: Information on this site is for educational purposes and does not constitute a doctor-patient relationship until clinical consultation.
          </p>
        </div>
      </div>
    </footer>
  );
};
