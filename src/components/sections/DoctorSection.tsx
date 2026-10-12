import React, { useRef } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import doctorImg from "@/assets/clinic/doctor-pink-blazer.jpg";
import { Award, CheckCircle, Shield, Heart, Sparkles } from "lucide-react";
import { useScrollParallax } from "@/hooks/useScrollParallax";

export const DoctorSection: React.FC = () => {
  const { doctor } = CLINIC_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const relScroll = useScrollParallax(sectionRef);

  const badgeIcons = [Award, CheckCircle, Shield, Heart];

  return (
    <section
      id="doctor"
      ref={sectionRef}
      className="relative py-24 sm:py-36 bg-[#F6F2EC] border-t border-[#B8955A]/20 overflow-hidden"
    >
      {/* Background ambient lighting orb */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-radial from-[#B8955A]/12 to-transparent blur-3xl pointer-events-none will-change-transform"
        style={{
          transform: `translateY(${relScroll * -0.12}px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs tracking-[0.28em] uppercase text-[#7A5E2E] font-semibold mb-3">
            The Clinician Behind Your Smile
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            Meet {doctor.name}
          </h2>
          <p className="text-sm sm:text-base text-[#7A5E2E] font-medium tracking-wide">
            {doctor.title} · {doctor.qualification} · {doctor.experience}
          </p>
        </div>

        {/* Doctor Split Profile with Parallax Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Column with Parallax */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B8955A]/30 bg-[#E8DCC6]/40 aspect-[4/5] group">
              <img
                src={doctorImg}
                alt={`${doctor.name} - Chief Dental Surgeon`}
                className="w-full h-full object-cover object-top origin-top transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
                style={{
                  transform: `translateY(${Math.max(-30, Math.min(30, relScroll * 0.06))}px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/85 via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-serif text-2xl sm:text-3xl font-medium block">
                  {doctor.name}
                </span>
                <span className="text-xs text-[#D9B878] tracking-widest uppercase font-semibold block mt-1">
                  Chief Dental Surgeon · Aesthetic & Restorative Specialist
                </span>
              </div>
            </div>

            {/* Ambient decorative seal badge with counter-parallax */}
            <div
              className="absolute -bottom-6 -right-6 hidden sm:flex w-28 h-28 rounded-full bg-[#2B2118] text-[#F6F2EC] items-center justify-center p-3 text-center border-2 border-[#B8955A] shadow-2xl rotate-6 will-change-transform"
              style={{
                transform: `translateY(${relScroll * -0.08}px) rotate(6deg)`,
              }}
            >
              <span className="text-[10px] tracking-wider uppercase font-semibold leading-tight text-[#D9B878]">
                8+ Years<br />Clinical Excellence
              </span>
            </div>
          </div>

          {/* Details & Badges */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2B2118] font-medium">
                Compassionate Care Built on Scientific Rigor
              </h3>
              <p className="text-[#4a3c2d] text-base leading-relaxed">
                {doctor.bio}
              </p>
              <blockquote className="p-4 rounded-2xl bg-[#E8DCC6]/35 border-l-4 border-[#B8955A] italic text-sm text-[#2B2118] leading-relaxed">
                “{doctor.philosophy}”
              </blockquote>
            </div>

            {/* Specialization Tags */}
            <div>
              <span className="text-xs tracking-wider uppercase text-[#7A5E2E] font-semibold block mb-3">
                Core Clinical Specializations:
              </span>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/85 border border-[#B8955A]/30 text-[#2B2118] shadow-sm hover:border-[#B8955A] transition"
                  >
                    <Sparkles className="w-3 h-3 text-[#B8955A]" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Clinical Credentials & Academic Background */}
            <div className="p-5 rounded-2xl bg-[#E8DCC6]/30 border border-[#B8955A]/30 space-y-2">
              <span className="text-xs tracking-wider uppercase text-[#7A5E2E] font-semibold block">
                Academic & Clinical Credentials:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2B2118]/85 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                  <span>Experienced Dental Surgeon (MUHS Registered)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                  <span>Certified Rotary Endodontics Expert</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                  <span>Maharashtra Dental Council Registered</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                  <span>Indian Dental Association (IDA) Member</span>
                </li>
              </ul>
            </div>

            {/* 4 Trust Badges with Staggered Parallax Float */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {doctor.badges.map((b, idx) => {
                const Icon = badgeIcons[idx % badgeIcons.length];
                const stagger = idx % 2 === 0 ? 0.03 : -0.02;
                return (
                  <div
                    key={b.label}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/80 border border-[#B8955A]/20 shadow-sm hover:shadow-md transition will-change-transform"
                    style={{
                      transform: `translateY(${Math.max(-20, Math.min(20, relScroll * stagger))}px)`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#E8DCC6]/60 flex items-center justify-center shrink-0 text-[#7A5E2E]">
                      <Icon className="w-5 h-5 text-[#B8955A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#2B2118]">
                        {b.label}
                      </h4>
                      <p className="text-xs text-[#5a4a38] mt-0.5">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
