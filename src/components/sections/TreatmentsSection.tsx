import React, { useState, useRef } from "react";
import { TREATMENTS, Treatment } from "@/data/treatments";
import {
  Sparkles,
  Shield,
  Syringe,
  Sun,
  Heart,
  Zap,
  Crown,
  Trash2,
  SmilePlus,
  Scissors,
  Star,
  Layers,
  AlignCenter,
  ArrowRight,
  Check,
} from "lucide-react";
import { useScrollParallax } from "@/hooks/useScrollParallax";

interface TreatmentsSectionProps {
  onSelectTreatment?: (serviceTitle: string) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({
  onSelectTreatment,
  activeCategory,
  onCategoryChange,
}) => {
  const [internalFilter, setInternalFilter] = useState<string>("All");
  const selectedFilter = activeCategory !== undefined ? activeCategory : internalFilter;

  const handleFilterSelect = (cat: string) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalFilter(cat);
    }
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollParallax();

  const sectionTop = sectionRef.current?.offsetTop || 0;
  const relScroll = scrollY - sectionTop;

  const categories = [
    "All",
    "Restorative & Surgical",
    "Cosmetic Dentistry",
    "Endodontics",
    "Prosthodontics",
    "Orthodontics",
  ];

  const filteredTreatments = TREATMENTS.filter((t) => {
    if (selectedFilter === "All") return true;
    return t.category.includes(selectedFilter);
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-5 h-5 text-[#B8955A]" />;
      case "Shield":
        return <Shield className="w-5 h-5 text-[#B8955A]" />;
      case "Star":
        return <Star className="w-5 h-5 text-[#B8955A]" />;
      case "Crown":
        return <Crown className="w-5 h-5 text-[#B8955A]" />;
      case "AlignCenter":
        return <AlignCenter className="w-5 h-5 text-[#B8955A]" />;
      case "SmilePlus":
        return <SmilePlus className="w-5 h-5 text-[#B8955A]" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-[#B8955A]" />;
      case "Sun":
        return <Sun className="w-5 h-5 text-[#B8955A]" />;
      case "Scissors":
        return <Scissors className="w-5 h-5 text-[#B8955A]" />;
      case "Layers":
        return <Layers className="w-5 h-5 text-[#B8955A]" />;
      case "Trash2":
        return <Trash2 className="w-5 h-5 text-[#B8955A]" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-[#B8955A]" />;
      case "Syringe":
        return <Syringe className="w-5 h-5 text-[#B8955A]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B8955A]" />;
    }
  };

  return (
    <section
      id="treatments"
      ref={sectionRef}
      className="relative py-24 sm:py-36 bg-[#F6F2EC] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-radial from-[#B8955A]/10 via-[#E8DCC6]/15 to-transparent blur-3xl pointer-events-none will-change-transform"
        style={{
          transform: `translate(-50%, ${relScroll * 0.08}px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs tracking-[0.28em] uppercase text-[#7A5E2E] font-semibold mb-3">
            Evidence-Based Care
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            Clinical Treatments
          </h2>
          <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
            Every procedure is carried out with digital precision, biocompatible materials, and a focus on lasting structural health.
          </p>
        </div>

        {/* Category Controls: Responsive Dropdown for Mobile + Luxury Pills for Desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          {/* Mobile Category Dropdown */}
          <div className="sm:hidden w-full max-w-xs relative">
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterSelect(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 rounded-2xl bg-white border border-[#B8955A]/40 text-xs font-semibold uppercase tracking-wider text-[#2B2118] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8955A]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Treatments" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterSelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedFilter === cat
                    ? "bg-[#2B2118] text-white shadow-md scale-105"
                    : "bg-white/80 hover:bg-white text-[#4a3c2d] border border-[#B8955A]/25 hover:border-[#B8955A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 14 Treatments Grid with Staggered Parallax Float */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTreatments.map((treatment, idx) => {
            // Column parallax factor (3 columns)
            const col = idx % 3;
            const colSpeed = col === 0 ? 0.03 : col === 1 ? -0.02 : 0.04;
            const colOffset = Math.max(-25, Math.min(25, relScroll * colSpeed));

            return (
              <div
                key={treatment.id}
                className="group relative p-6 sm:p-8 rounded-3xl bg-white/85 border border-[#B8955A]/25 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between will-change-transform"
                style={{
                  transform: `translateY(${colOffset}px)`,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-xl sm:text-2xl text-[#7A5E2E] font-light">
                      {treatment.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#E8DCC6]/40 flex items-center justify-center group-hover:scale-115 transition-transform duration-300">
                      {getIcon(treatment.iconName)}
                    </div>
                  </div>

                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7A5E2E] block mb-1">
                    {treatment.category}
                  </span>

                  <h3 className="font-serif text-2xl font-medium text-[#2B2118] mb-3 group-hover:text-[#7A5E2E] transition-colors">
                    {treatment.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5a4a38] leading-relaxed mb-5">
                    {treatment.description}
                  </p>

                  {/* Key Benefits */}
                  <ul className="space-y-2 mb-6">
                    {treatment.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-[#2B2118]/80 font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-[#B8955A]/20 flex items-center justify-between">
                  {treatment.duration && (
                    <span className="text-[11px] text-[#7A5E2E] font-medium">
                      Duration: {treatment.duration}
                    </span>
                  )}
                  <a
                    href="#book"
                    onClick={() => onSelectTreatment?.(treatment.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2B2118] group-hover:text-[#7A5E2E] transition-colors cursor-pointer"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
