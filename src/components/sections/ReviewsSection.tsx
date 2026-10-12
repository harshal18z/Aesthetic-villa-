import React, { useState, useEffect, useRef } from "react";
import { ALL_REVIEWS, GOOGLE_REVIEWS, JUSTDIAL_REVIEWS, Review } from "@/data/reviews";
import { reviewsService } from "@/services/reviewsService";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { Star, ChevronDown, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { useScrollParallax } from "@/hooks/useScrollParallax";

export const ReviewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Google" | "JustDial">("All");
  const [displayCount, setDisplayCount] = useState<number>(9);
  const [reviewsData, setReviewsData] = useState<{
    all: Review[];
    google: Review[];
    justdial: Review[];
    dynamicCount: number;
  }>({
    all: ALL_REVIEWS,
    google: GOOGLE_REVIEWS,
    justdial: JUSTDIAL_REVIEWS,
    dynamicCount: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const relScroll = useScrollParallax(sectionRef);

  useEffect(() => {
    let isMounted = true;
    reviewsService.getAllMergedReviews().then((data) => {
      if (isMounted) {
        setReviewsData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const reviewsToDisplay =
    activeTab === "Google"
      ? reviewsData.google
      : activeTab === "JustDial"
      ? reviewsData.justdial
      : reviewsData.all;

  const visibleReviews = reviewsToDisplay.slice(0, displayCount);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative py-24 sm:py-36 bg-[#F6F2EC] border-t border-[#B8955A]/20 overflow-hidden"
    >
      {/* Background ambient lighting orb */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-radial from-[#B8955A]/12 to-transparent blur-3xl pointer-events-none will-change-transform"
        style={{
          transform: `translateY(${relScroll * 0.1}px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-[#B8955A] text-[#B8955A]" />
            <span>4.9 / 5.0 Average Rating</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            In Patients’ Own Words
          </h2>
          <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
            Real stories from individuals and families who trusted Dr. Tejashree Kulkarni and The Aesthetic Villa with their smiles.
          </p>
        </div>

        {/* Source Filter Tabs & Google Review Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {(["All", "Google", "JustDial"] as const).map((tab) => {
            const count =
              tab === "Google"
                ? reviewsData.google.length
                : tab === "JustDial"
                ? reviewsData.justdial.length
                : reviewsData.all.length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setDisplayCount(9);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#2B2118] text-white shadow-md scale-105"
                    : "bg-white/80 hover:bg-white text-[#4a3c2d] border border-[#B8955A]/20"
                }`}
              >
                <span>{tab} Reviews</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}

          <a
            href={CLINIC_INFO.contact.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#B8955A]/15 hover:bg-[#B8955A]/25 text-[#7A5E2E] border border-[#B8955A]/40 transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer ml-1"
          >
            <Star className="w-3.5 h-3.5 fill-[#B8955A] text-[#B8955A]" />
            <span>Review Us on Google</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>

        {/* Reviews Masonry / Grid with Parallax Depth Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleReviews.map((rev, idx) => {
            const col = idx % 3;
            const colOffset = Math.max(-20, Math.min(20, relScroll * (col === 0 ? 0.025 : col === 1 ? -0.015 : 0.035)));

            return (
              <div
                key={rev.id}
                className="p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#B8955A]/25 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between will-change-transform"
                style={{
                  transform: `translateY(${colOffset}px)`,
                }}
              >
                <div>
                  {/* Rating stars & verified badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#B8955A] text-[#B8955A]"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {rev.isCustom && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Recent</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A5E2E] bg-[#E8DCC6]/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#B8955A]" />
                        <span>{rev.source} Verified</span>
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#2B2118] leading-relaxed italic mb-6">
                    “{rev.text}”
                  </p>
                </div>

                {/* Author & Date */}
                <div className="pt-3 border-t border-[#B8955A]/15 flex items-center justify-between">
                  <span className="font-serif text-lg font-medium text-[#2B2118]">
                    {rev.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A5E2E] font-medium">
                    {rev.date || "Patient"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More & Leave Review Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          {displayCount < reviewsToDisplay.length && (
            <button
              onClick={() => setDisplayCount((prev) => prev + 9)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-white text-[#2B2118] text-xs font-semibold tracking-wider uppercase border border-[#B8955A]/40 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <span>Load More Reviews</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          <a
            href={CLINIC_INFO.contact.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B8955A] hover:bg-[#A38248] text-white text-xs font-semibold tracking-wider uppercase shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            <span>Write a Google Review</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
