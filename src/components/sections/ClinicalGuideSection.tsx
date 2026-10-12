import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  Info,
  Clock,
  HeartHandshake,
  Microscope,
  FileText,
  HelpCircle,
  Activity,
  Award
} from "lucide-react";
import { CLINIC_INFO } from "@/data/clinicInfo";

interface ClinicalGuideTopic {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  leadParagraph: string;
  detailedPoints: {
    heading: string;
    description: string;
  }[];
  clinicalHighlights: string[];
  durationEstimate: string;
  recoveryNote: string;
}

const CLINICAL_TOPICS: ClinicalGuideTopic[] = [
  {
    id: "rct-guide",
    badge: "Endodontic Mastery",
    title: "Advanced Rotary Root Canal Treatment (RCT)",
    subtitle: "Painless, single-sitting tooth preservation using computerized rotary endodontics and bio-ceramic sealers.",
    leadParagraph:
      "When deep tooth decay, trauma, or cracks penetrate into the inner vascular pulp, severe pain and infection arise. At The Aesthetic Villa in Kothrud, we practice precision-guided, rotary endodontics designed to save your natural tooth seamlessly without the discomfort traditionally associated with older dental techniques.",
    detailedPoints: [
      {
        heading: "1. Digital Radiovisiography (RVG) & Apex Localization",
        description:
          "High-precision digital sensors measure canal depth to a fraction of a millimeter, preventing over-instrumentation and eliminating painful guesswork."
      },
      {
        heading: "2. Nickel-Titanium Rotary Instrumentation",
        description:
          "Ultra-flexible rotary NiTi files gently navigate naturally curved canals, clearing bacteria and necrotic pulp while preserving healthy structural dentin."
      },
      {
        heading: "3. Ultrasonic Disinfection & Bio-Ceramic Obturation",
        description:
          "High-frequency acoustic irrigation reaches micro-canals, followed by hermetic sealing with biocompatible bioceramics that reliably protect against longterm bacterial reinfection."
      },
      {
        heading: "4. Monolithic Crown Reinforcement",
        description:
          "Once sealed, the tooth is rebuilt and protected with a precision-milled zirconia or ceramic crown to restore 100% natural chewing force and longevity."
      }
    ],
    clinicalHighlights: [
      "Zero-pain protocol with gentle local anesthesia",
      "Single-sitting completion in over 85% of cases",
      "Saves your natural tooth root and jawbone structure",
      "Biocompatible hermetic seal preventing recurrence"
    ],
    durationEstimate: "45–60 minutes per sitting",
    recoveryNote: "Normal eating can typically resume within hours after anesthesia subsides."
  },
  {
    id: "implants-guide",
    badge: "Oral Implantology",
    title: "Titanium Dental Implants & Longterm Tooth Replacement",
    subtitle: "The gold standard in tooth restoration: structurally integrating with jawbone for longterm stability.",
    leadParagraph:
      "Unlike removable partial dentures or conventional bridges that compromise adjacent healthy teeth, dental implants replace the root itself. Fabricated from medical-grade pure titanium, implants undergo osseointegration — a natural biological fusion with your jawbone that restores youthful facial aesthetics and 100% bite strength.",
    detailedPoints: [
      {
        heading: "1. Three-Dimensional Diagnostic Evaluation",
        description:
          "We evaluate bone density, nerve pathways, and sinus anatomy using precision digital imaging to meticulously plan implant angulation."
      },
      {
        heading: "2. Minimally Invasive Titanium Fixture Placement",
        description:
          "The biocompatible titanium post is positioned into the jawbone using gentle surgical protocols, creating a rigid foundation that stimulates bone maintenance."
      },
      {
        heading: "3. Biological Osseointegration Phase",
        description:
          "Over 8 to 12 weeks, living bone cells attach securely to the micro-textured implant surface, providing anchorage as robust as a natural tooth root."
      },
      {
        heading: "4. Custom Aesthetic Crown Restoration",
        description:
          "A custom abutment and shade-matched zirconia crown are fastened atop the implant, indistinguishable in appearance and function from neighboring teeth."
      }
    ],
    clinicalHighlights: [
      "Prevents bone loss and sunken facial hollows",
      "Preserves adjacent healthy teeth without filing down enamel",
      "Longterm solution with routine oral hygiene",
      "Restores 100% natural chewing capability"
    ],
    durationEstimate: "Staged care (2 visits + bone integration)",
    recoveryNote: "Minimal discomfort; most patients return to normal routine the next morning."
  },
  {
    id: "cosmetics-guide",
    badge: "Aesthetic Dentistry",
    title: "Digital Smile Architecture & Teeth Whitening",
    subtitle: "Harmonizing tooth shade, translucency, and facial contours for a radiant, unforced aesthetic.",
    leadParagraph:
      "A radiant smile is a balance of biology and artistic balance. Dr. Tejashree Kulkarni combines digital facial proportion mapping with handcrafted porcelain veneers, composite artistry, and light-activated teeth whitening to design smiles that look remarkably authentic and vibrant.",
    detailedPoints: [
      {
        heading: "1. Digital Smile Planning & Proportion Analysis",
        description:
          "We analyze your incisal edge position, lip curvature, and facial golden ratios to craft veneers and crowns that flatter your distinctive facial anatomy."
      },
      {
        heading: "2. In-Office Safe Teeth Whitening (1–3 Shades Brighter)",
        description:
          "Using neutral-pH whitening formulations activated by targeted dental illumination, we lift stubborn extrinsic and intrinsic stains by 1–3 shades without weakening enamel."
      },
      {
        heading: "3. Ultra-Thin Porcelain Veneers & Direct Composite Bonding",
        description:
          "Hand-layered feldspathic and lithium-disilicate veneers correct chips, gaps, or discolorations with minimal tooth reduction."
      },
      {
        heading: "4. Enamel Remineralization & Gloss Polishing",
        description:
          "Every whitening session concludes with deep fluoridated and calcium remineralization to eliminate sensitivity and ensure a smooth, lasting gloss."
      }
    ],
    clinicalHighlights: [
      "Natural 1–3 shade brighten without enamel thinning",
      "Camera-ready, camera-tested cosmetic finishes",
      "Zero gum sensitivity with barrier gingival dam protection",
      "Custom ceramic translucency matching real tooth enamel"
    ],
    durationEstimate: "Whitening: 45 mins | Veneers: 2 visits",
    recoveryNote: "Instant results; simply avoid staining foods (red wine, dark tea) for 48 hours."
  },
  {
    id: "preventive-guide",
    badge: "Preventive & Periodontal Care",
    title: "Ultrasonic Scaling, Stain Polishing & Gum Health",
    subtitle: "Gentle removal of stubborn calculus and bio-film to safeguard gums from periodontitis.",
    leadParagraph:
      "Even meticulous daily brushing misses calcified subgingival plaque (calculus). Left untreated, bacteria inflame gums, triggering bleeding, halitosis, and irreversible bone recession. Routine preventive care preserves your smile's foundational support.",
    detailedPoints: [
      {
        heading: "1. Gentle Ultrasonic Micro-Vibration Scaling",
        description:
          "High-frequency ultrasonic scalers safely dislodge hardened tartar and stubborn tobacco or tea stains using cavitation water spray without scratching enamel."
      },
      {
        heading: "2. Debunking the Scaling Myth",
        description:
          "Dental cleaning does NOT weaken or thin teeth. It eliminates toxic bacteria colonies that would otherwise destroy supporting jawbone and gum tissue."
      },
      {
        heading: "3. Prophylactic Diamond Paste Polishing",
        description:
          "Fine-grit remineralizing polishing pastes smooth micro-irregularities on the tooth surface, preventing new plaque from quickly adhering."
      },
      {
        heading: "4. Periodontal Pocket Evaluation & Home Care Regimen",
        description:
          "We measure gingival pocket depths and supply personalized interdental cleaning instructions suited to your dental architecture."
      }
    ],
    clinicalHighlights: [
      "Prevents gingivitis, bad breath, and loose teeth",
      "Gentle ultrasonic technology with zero enamel damage",
      "Removes deep coffee, tea, and smoker stains",
      "Recommended every 6 months for longterm oral wellness"
    ],
    durationEstimate: "30–40 minutes",
    recoveryNote: "Immediate fresh feeling; clean smooth teeth right away."
  }
];

export const ClinicalGuideSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("rct-guide");

  const currentTopic = CLINICAL_TOPICS.find((t) => t.id === activeTab) || CLINICAL_TOPICS[0];

  return (
    <section id="clinical-guide" className="py-24 sm:py-32 bg-[#F6F2EC] border-t border-[#B8955A]/25 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-radial from-[#B8955A]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-radial from-[#E8DCC6]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-3">
            <Microscope className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Patient Knowledge & Clinical Guide</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            Evidence-Based Dentistry, Demystified
          </h2>
          <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
            Informed patients make confident decisions. Explore detailed insights into our clinical procedures, sterilization rigor, and restorative protocols practiced by Dr. Tejashree Kulkarni in Kothrud, Pune.
          </p>
        </div>

        {/* ── Clinical Guide Tab Navigation ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CLINICAL_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === topic.id
                  ? "bg-[#2B2118] text-white shadow-lg scale-105"
                  : "bg-white/80 hover:bg-white text-[#4a3c2d] border border-[#B8955A]/25 hover:border-[#B8955A]"
              }`}
            >
              <span>{topic.badge}</span>
            </button>
          ))}
        </div>

        {/* ── Active Clinical Detail Showcase ── */}
        <div className="bg-white/85 rounded-3xl border border-[#B8955A]/30 p-6 sm:p-10 shadow-xl mb-20 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Overview and Steps */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#7A5E2E] block mb-1">
                  {currentTopic.badge}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#2B2118] font-medium mb-3">
                  {currentTopic.title}
                </h3>
                <p className="text-sm font-medium text-[#7A5E2E] leading-relaxed mb-4">
                  {currentTopic.subtitle}
                </p>
                <p className="text-[#4a3c2d] text-sm sm:text-base leading-relaxed">
                  {currentTopic.leadParagraph}
                </p>
              </div>

              {/* Step-by-step clinical methodology */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2B2118] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B8955A]" />
                  <span>Clinical Workflow & Step-by-Step Procedure:</span>
                </h4>
                <div className="grid grid-cols-1 gap-3.5">
                  {currentTopic.detailedPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#F6F2EC]/80 border border-[#B8955A]/20 space-y-1"
                    >
                      <h5 className="text-sm font-semibold text-[#2B2118]">
                        {pt.heading}
                      </h5>
                      <p className="text-xs text-[#5a4a38] leading-relaxed">
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Highlights, Stats & Recovery */}
            <div className="lg:col-span-5 space-y-6">
              {/* Key Clinical Benefits Box */}
              <div className="p-6 rounded-3xl bg-[#E8DCC6]/40 border border-[#B8955A]/35 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B8955A]" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#2B2118]">
                    Key Patient Takeaways
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {currentTopic.clinicalHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2B2118] font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Time & Comfort Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#B8955A]/25 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A5E2E] font-semibold uppercase mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#B8955A]" />
                    <span>Duration</span>
                  </div>
                  <p className="text-xs font-semibold text-[#2B2118]">
                    {currentTopic.durationEstimate}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#B8955A]/25 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A5E2E] font-semibold uppercase mb-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#B8955A]" />
                    <span>Comfort</span>
                  </div>
                  <p className="text-xs font-semibold text-[#2B2118]">
                    Painless Anesthesia
                  </p>
                </div>
              </div>

              {/* Recovery Guidance */}
              <div className="p-4 rounded-2xl bg-[#2B2118] text-[#F6F2EC] space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#D9B878]" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#D9B878]">
                    Recovery & Post-Care
                  </span>
                </div>
                <p className="text-xs text-[#E8DCC6] leading-relaxed">
                  {currentTopic.recoveryNote}
                </p>
              </div>

              {/* CTA link */}
              <div className="pt-2">
                <a
                  href="#book"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#7A5E2E] hover:bg-[#2B2118] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all duration-300"
                >
                  <span>Book Consultation for this Treatment</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Clinical Pillars of The Villa in Kothrud ── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs tracking-widest uppercase font-semibold text-[#7A5E2E] block mb-2">
              Why Kothrud Chooses Us
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#2B2118]">
              The Aesthetic Villa Clinical Difference
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DCC6]/60 flex items-center justify-center text-[#7A5E2E] mb-4">
                <ShieldCheck className="w-5 h-5 text-[#B8955A]" />
              </div>
              <h4 className="text-base font-semibold text-[#2B2118] mb-2">
                Class-B Autoclave Sterilization
              </h4>
              <p className="text-xs text-[#5a4a38] leading-relaxed">
                Hospital-grade multi-barrier sterilization protocols and single-use pouches opened right before your eyes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DCC6]/60 flex items-center justify-center text-[#7A5E2E] mb-4">
                <Zap className="w-5 h-5 text-[#B8955A]" />
              </div>
              <h4 className="text-base font-semibold text-[#2B2118] mb-2">
                Digital Low-Radiation RVG
              </h4>
              <p className="text-xs text-[#5a4a38] leading-relaxed">
                Instant digital radiography yielding crisp chairside diagnostics with 80% lower radiation exposure than conventional films.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DCC6]/60 flex items-center justify-center text-[#7A5E2E] mb-4">
                <Award className="w-5 h-5 text-[#B8955A]" />
              </div>
              <h4 className="text-base font-semibold text-[#2B2118] mb-2">
                8+ Years Clinical Mastery
              </h4>
              <p className="text-xs text-[#5a4a38] leading-relaxed">
                Led by Chief Dental Surgeon Dr. Tejashree Kulkarni, with over 4,500+ smiles successfully restored across Pune.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#B8955A]/25 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DCC6]/60 flex items-center justify-center text-[#7A5E2E] mb-4">
                <HeartHandshake className="w-5 h-5 text-[#B8955A]" />
              </div>
              <h4 className="text-base font-semibold text-[#2B2118] mb-2">
                Unhurried 1-on-1 Consults
              </h4>
              <p className="text-xs text-[#5a4a38] leading-relaxed">
                We take the time to answer every question transparently, explaining procedures, stages, and options without rush.
              </p>
            </div>
          </div>
        </div>

        {/* ── Direct Link to Comprehensive FAQ Hub ── */}
        <div className="max-w-4xl mx-auto mt-16 p-8 sm:p-10 rounded-3xl bg-white/85 border border-[#B8955A]/30 text-center shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Comprehensive Patient FAQ</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#2B2118] mb-2 font-normal">
            Have Questions About Procedures, Timings, or Costs?
          </h3>
          <p className="text-xs sm:text-sm text-[#5a4a38] max-w-xl mx-auto mb-6 leading-relaxed">
            We have compiled answers to over 50+ questions covering appointments, root canals, dental implants, pediatric care, and pricing in our dedicated FAQ section.
          </p>
          <a
            href="#faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2118] hover:bg-[#3D2F22] text-white text-xs font-semibold tracking-wider uppercase shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            <span>Browse All 50+ FAQs</span>
            <ChevronDown className="w-4 h-4 text-[#D9B878]" />
          </a>
        </div>
      </div>
    </section>
  );
};
