import React, { useState, useRef, useEffect } from "react";
import { Phone, Calendar, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { ClinicLogo } from "./ClinicLogo";

interface NavbarProps {
  onBookClick?: () => void;
  visible?: boolean;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookClick,
  visible = false,
  activeCategory = "All",
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treatmentsDropdownOpen, setTreatmentsDropdownOpen] = useState(false);
  const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const treatmentCategories = [
    { label: "All Treatments", value: "All" },
    { label: "Restorative & Surgical", value: "Restorative & Surgical" },
    { label: "Cosmetic Dentistry", value: "Cosmetic Dentistry" },
    { label: "Endodontics", value: "Endodontics" },
    { label: "Prosthodontics", value: "Prosthodontics" },
    { label: "Orthodontics", value: "Orthodontics" },
  ];

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setTreatmentsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setTreatmentsDropdownOpen(false);
    }, 180);
  };

  const handleCategoryClick = (catValue: string) => {
    if (onSelectCategory) {
      onSelectCategory(catValue);
    }
    setTreatmentsDropdownOpen(false);
    setMobileMenuOpen(false);
    const treatmentsEl = document.getElementById("treatments");
    if (treatmentsEl) {
      treatmentsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "The Villa", href: "#villa-story" },
    { label: "Implant Craft", href: "#film" },
    { label: "Treatments", href: "#treatments", isDropdown: true },
    { label: "Dr. Tejashree", href: "#doctor" },
    { label: "3D Gallery", href: "#gallery-3d" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100 bg-[#F6F2EC]/92 backdrop-blur-md border-b border-[#B8955A]/30 py-3 shadow-md"
          : "-translate-y-full opacity-0 pointer-events-none py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Authentic Clinic Logo */}
        <a
          href="#villa-story"
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <ClinicLogo size="sm" variant="light" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      // Allow normal jump if desired or open
                      handleCategoryClick("All");
                    }}
                    className="inline-flex items-center gap-1 text-xs tracking-wider uppercase font-medium text-[#4a3c2d] hover:text-[#7A5E2E] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B8955A] group-hover:after:w-full after:transition-all"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        treatmentsDropdownOpen ? "rotate-180 text-[#7A5E2E]" : ""
                      }`}
                    />
                  </a>

                  {/* Desktop Dropdown Menu */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 transition-all duration-200 ${
                      treatmentsDropdownOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="p-2 rounded-2xl bg-[#F6F2EC] border border-[#B8955A]/35 shadow-2xl backdrop-blur-xl">
                      <div className="px-3 py-1.5 border-b border-[#B8955A]/20 mb-1">
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7A5E2E]">
                          Clinical Disciplines
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {treatmentCategories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => handleCategoryClick(cat.value)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              activeCategory === cat.value
                                ? "bg-[#2B2118] text-[#F6F2EC]"
                                : "text-[#2B2118] hover:bg-[#E8DCC6]/60 hover:text-[#7A5E2E]"
                            }`}
                          >
                            <span>{cat.label}</span>
                            {activeCategory === cat.value && (
                              <Sparkles className="w-3 h-3 text-[#D9B878]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-wider uppercase font-medium text-[#4a3c2d] hover:text-[#7A5E2E] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B8955A] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${CLINIC_INFO.contact.phoneClean}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#B8955A]/30 bg-white/70 hover:bg-white text-xs font-medium text-[#2B2118] transition shadow-sm"
            title="Call The Aesthetic Villa"
          >
            <Phone className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>{CLINIC_INFO.contact.phone}</span>
          </a>

          <a
            href="#book"
            onClick={onBookClick}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#2B2118] hover:bg-[#7A5E2E] text-white text-xs sm:text-sm font-medium tracking-wide shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#2B2118] hover:bg-black/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6F2EC] border-b border-[#B8955A]/30 px-6 py-4 space-y-3 animate-fadeIn max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div key={link.label} className="border-b border-black/5 py-1">
                  <button
                    onClick={() => setMobileTreatmentsOpen(!mobileTreatmentsOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-[#2B2118] py-2"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 text-[#7A5E2E] ${
                        mobileTreatmentsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileTreatmentsOpen && (
                    <div className="pl-3 pb-2 space-y-1 animate-fadeIn">
                      {treatmentCategories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategoryClick(cat.value)}
                          className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                            activeCategory === cat.value
                              ? "bg-[#2B2118] text-white"
                              : "text-[#4a3c2d] hover:bg-[#E8DCC6]/60"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#2B2118] py-2 border-b border-black/5"
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href={`tel:${CLINIC_INFO.contact.phoneClean}`}
              className="flex items-center gap-2 text-sm font-medium text-[#7A5E2E]"
            >
              <Phone className="w-4 h-4" />
              <span>Call Clinic: {CLINIC_INFO.contact.phone}</span>
            </a>
            <p className="text-[11px] text-[#7A5E2E] mt-1">
              Hours: 2 PM | 5 PM to 8 PM
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
