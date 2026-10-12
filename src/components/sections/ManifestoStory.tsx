import React, { useRef, useEffect } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { Compass } from "lucide-react";
import { useScrollParallax } from "@/hooks/useScrollParallax";

export const ManifestoStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const img0Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const relScroll = useScrollParallax(sectionRef);

  return (
    <div
      id="villa-story"
      ref={sectionRef}
      className="relative py-24 sm:py-36 bg-[#F6F2EC] overflow-hidden"
    >
      {/* Parallax Floating Ambient Light Orbs */}
      <div
        className="absolute top-1/3 left-10 w-96 h-96 rounded-full pointer-events-none will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(184,149,90,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: `translateY(${relScroll * 0.15}px)`,
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(232,220,198,0.35) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: `translateY(${relScroll * -0.1}px)`,
        }}
      />

      {/* ── Manifesto Section ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32 text-center relative z-10">
        <p className="text-xs tracking-[0.28em] uppercase text-[#7A5E2E] font-semibold mb-6">
          The Villa Manifesto
        </p>
        <blockquote className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal leading-[1.18] tracking-tight">
          "A sanctuary where dental care feels unhurried. Where natural light, warm travertine, and serene quiet do as much as modern science. Where you arrive as a guest, and leave with a smile you recognise."
        </blockquote>
      </section>

      {/* ── First Split: Villa Lounge with Parallax ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left: Parallax image frame — img/0.webp */}
          <div className="relative">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B8955A]/30 bg-[#E8DCC6]/30 aspect-[4/3] group"
              style={{ perspective: "800px" }}
            >
              <img
                ref={img0Ref}
                src="/img/0.webp"
                alt="Sunlit lounge with bouclé armchairs at The Aesthetic Villa"
                className="w-full h-full object-cover will-change-transform"
                style={{
                  transform: `translateY(${Math.max(-40, Math.min(40, relScroll * 0.1))}px) scale(1.12)`,
                  transition: "transform 0.1s linear",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold block mb-1">
                  Kothrud, Pune
                </span>
                <p className="font-serif text-xl sm:text-2xl font-light">
                  Designed to soothe the senses, before your treatment even begins.
                </p>
              </div>
            </div>

            {/* Floating badge with counter-parallax */}
            <div
              className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#B8955A]/30 shadow-xl hidden sm:block will-change-transform"
              style={{
                transform: `translateY(${relScroll * -0.06}px)`,
              }}
            >
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7A5E2E] block">
                Ambience
              </span>
              <span className="font-serif text-lg font-medium text-[#2B2118]">
                Private Villa Retreat
              </span>
            </div>
          </div>

          {/* Right: Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-[#B8955A]" />
              <span>Our Philosophy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118] font-normal tracking-tight leading-[1.1]">
              A House, Not a Hospital.
            </h2>
            <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
              Founded by <strong>Dr. Tejashree Kulkarni</strong> in Kothrud, Pune, The Aesthetic Villa was conceived from a single observation: clinical white rooms and rushing dentists heighten patient anxiety.
            </p>
            <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
              We replaced rigid dental environments with an Italian villa aesthetic — arched doorways, soothing ambient acoustics, artisanal travertine surfaces, and floor-to-ceiling garden greenery.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition hover-glow">
                <span className="font-serif text-3xl text-[#7A5E2E] block font-semibold mb-1">
                  100%
                </span>
                <span className="text-xs text-[#5a4a38] font-medium leading-snug block">
                  Focused 1-on-1 Patient Time
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition hover-glow">
                <span className="font-serif text-3xl text-[#7A5E2E] block font-semibold mb-1">
                  Zero
                </span>
                <span className="text-xs text-[#5a4a38] font-medium leading-snug block">
                  Rushed Consultations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Second Split: 3rd Image — img/2.webp with DRAMATIC Moving Transition ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left: Text */}
          <div
            className="space-y-6 order-2 lg:order-1 will-change-transform"
            style={{
              transform: `translateY(${Math.max(-30, Math.min(30, relScroll * -0.05))}px)`,
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-[#B8955A]" />
              <span>The Space</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118] font-normal tracking-tight leading-[1.1]">
              Where Calm Meets Craft.
            </h2>
            <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
              Every corner of The Aesthetic Villa has been designed with intention — from the travertine reception desk overlooking the garden to private consultation rooms bathed in natural daylight.
            </p>
            <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
              Step inside and feel the difference that architecture makes to healing. There are no waiting rooms here — only a sanctuary that puts your comfort first.
            </p>
          </div>

          {/* Right: img/2.webp with dramatic Ken Burns + 3D moving transition on scroll */}
          <div className="relative order-1 lg:order-2">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B8955A]/30 aspect-[4/3] group"
              style={{
                perspective: "1000px",
                // The outer container tilts in 3D as the user scrolls
                transform: `perspective(1000px) rotateY(${Math.max(-6, Math.min(6, relScroll * 0.008))}deg) rotateX(${Math.max(-3, Math.min(3, relScroll * -0.003))}deg)`,
                transition: "transform 0.15s linear",
                willChange: "transform",
              }}
            >
              <img
                ref={img2Ref}
                src="/img/2.webp"
                alt="Travertine reception desk overlooking garden at The Aesthetic Villa"
                className="w-full h-full object-cover will-change-transform"
                style={{
                  // Dramatic Ken Burns + parallax: scale up while scrolling + vertical parallax
                  transform: `
                    translateY(${Math.max(-55, Math.min(55, relScroll * 0.14))}px)
                    translateX(${Math.max(-20, Math.min(20, relScroll * 0.03))}px)
                    scale(${Math.min(1.22, 1.1 + Math.abs(relScroll) * 0.00008)})
                  `,
                  transition: "transform 0.12s linear",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/75 via-transparent to-transparent" />

              {/* Moving light shaft overlay — parallax light effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(
                    ${115 + relScroll * 0.04}deg,
                    transparent 30%,
                    rgba(232,220,198,0.18) 50%,
                    transparent 70%
                  )`,
                  transition: "background 0.1s linear",
                }}
              />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold block mb-1">
                  The Reception
                </span>
                <p className="font-serif text-xl sm:text-2xl font-light">
                  Architecture that eases anxiety before a word is spoken.
                </p>
              </div>

              {/* 3D depth shimmer border */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(184,149,90,0.25), inset 0 0 60px rgba(184,149,90,0.05)",
                }}
              />
            </div>

            {/* Floating badge with opposite parallax direction */}
            <div
              className="absolute -bottom-6 -right-6 bg-[#2B2118]/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#B8955A]/40 shadow-xl hidden sm:block will-change-transform"
              style={{
                transform: `translateY(${relScroll * 0.07}px)`,
              }}
            >
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D9B878] block">
                Interior Design
              </span>
              <span className="font-serif text-lg font-medium text-white">
                Italian Villa Aesthetic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics Grid with Parallax Floating Shift ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 sm:p-12 rounded-3xl bg-[#E8DCC6]/45 border border-[#B8955A]/35 backdrop-blur-sm shadow-sm">
          {CLINIC_INFO.stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center will-change-transform"
              style={{
                transform: `translateY(${((idx % 2 === 0 ? 1 : -1) * relScroll * 0.035).toFixed(1)}px)`,
              }}
            >
              <span className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal block mb-2">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-[#7A5E2E] font-semibold tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
