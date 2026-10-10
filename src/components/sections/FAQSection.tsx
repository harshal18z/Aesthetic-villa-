import React, { useState, useMemo } from "react";
import { ALL_FAQS, FAQ_CATEGORIES, FAQItem } from "@/data/faqs";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { HelpCircle, Search, ChevronDown, Phone, MessageSquare, Sparkles, X } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("c1");

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 bg-[#F6F2EC] border-t border-[#B8955A]/25 relative overflow-hidden"
    >
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-radial from-[#B8955A]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] bg-radial from-[#E8DCC6]/25 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DCC6]/60 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Patient Knowledge & Answers</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#2B2118] text-base sm:text-lg leading-relaxed font-normal">
            Clear, doctor-verified answers to everything you need to know about treatments, costs, safety, and care at The Aesthetic Villa in Kothrud, Pune.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A5E2E]/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, e.g. root canal, cost, implant, pain, timing…"
              className="w-full bg-white/95 border border-[#B8955A]/35 rounded-full pl-11 pr-10 py-3.5 text-sm text-[#2B2118] placeholder-[#7A5E2E]/60 shadow-sm focus:outline-none focus:border-[#B8955A] focus:ring-2 focus:ring-[#B8955A]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#7A5E2E]/60 hover:text-[#2B2118] cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All"
                ? ALL_FAQS.length
                : ALL_FAQS.filter((item) => item.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenFaqId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#2B2118] text-white shadow-md scale-105"
                    : "bg-white/80 hover:bg-white text-[#4a3c2d] border border-[#B8955A]/25"
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-3.5 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white/70 border border-[#B8955A]/25 rounded-3xl p-8">
              <HelpCircle className="w-8 h-8 text-[#B8955A] mx-auto mb-3 opacity-60" />
              <p className="text-base font-medium text-[#2B2118] mb-1">
                No matching questions found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-[#7A5E2E] mb-4">
                Have a specific dental inquiry? Dr. Tejashree is just a call or message away.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="text-xs font-semibold px-4 py-2 rounded-full bg-[#B8955A] text-white hover:bg-[#a3824c] transition"
              >
                View All FAQs
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-[#B8955A]/25 bg-white/90 shadow-sm hover:border-[#B8955A]/45 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex-1 pr-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A5E2E] mb-1">
                        {faq.category}
                      </div>
                      <h3 className="font-semibold text-base sm:text-[17px] text-[#1C140D] leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-[#B8955A] text-white rotate-180 shadow-sm"
                          : "bg-[#E8DCC6]/70 text-[#5A401A]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-3 text-sm text-[#241A11] leading-relaxed border-t border-[#B8955A]/20 bg-[#FCFAF7] font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div
          style={{ backgroundColor: "#221A12" }}
          className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#221A12] via-[#2A2016] to-[#36291C] text-white p-8 sm:p-10 border border-[#B8955A]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D9B878] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B878]" />
              <span>Unhurried Patient Care</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-2 text-white tracking-tight">
              Still have a question about your teeth?
            </h3>
            <p className="text-xs sm:text-sm text-[#EADEC9] max-w-xl leading-relaxed font-normal">
              Dr. Tejashree Kulkarni offers transparent, unhurried 1-on-1 consultations where all your doubts are answered before any treatment begins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${CLINIC_INFO.contact.phoneClean}`}
              className="px-6 py-3 rounded-full bg-white text-[#2B2118] hover:bg-[#F6F2EC] text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <Phone className="w-4 h-4 text-[#B8955A]" />
              <span>Call Doctor</span>
            </a>
            <a
              href={`https://wa.me/${CLINIC_INFO.contact.phoneClean.replace("+", "")}?text=Hello%20Dr.%20Tejashree,%20I%20have%20a%20question%20regarding%20my%20dental%20care`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
