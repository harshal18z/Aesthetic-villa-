import React, { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollFilm } from "@/components/film/ScrollFilm";
import { ManifestoStory } from "@/components/sections/ManifestoStory";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { TreatmentsSection } from "@/components/sections/TreatmentsSection";
import { ClinicalGuideSection } from "@/components/sections/ClinicalGuideSection";
import { Gallery3D } from "@/components/gallery/Gallery3D";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { Footer } from "@/components/layout/Footer";
import { MessageSquare } from "lucide-react";

export function App() {
  const [selectedTreatment, setSelectedTreatment] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [navbarVisible, setNavbarVisible] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 2.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Fallback scroll listener to ensure navbar shows when scrolling past the film
    const handleScroll = () => {
      const filmEl = document.getElementById("film");
      if (filmEl) {
        const filmBottom = filmEl.offsetTop + filmEl.offsetHeight - window.innerHeight * 1.2;
        if (window.scrollY >= filmBottom) {
          setNavbarVisible(true);
        } else if (window.scrollY < filmBottom - 200) {
          setNavbarVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Global scroll-reveal for non-film sections ──
    const revealEls = document.querySelectorAll(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
      revealObs.disconnect();
    };
  }, []);

  const handleSelectTreatment = (title: string) => {
    setSelectedTreatment(title);
    const bookEl = document.getElementById("book");
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    const treatmentsEl = document.getElementById("treatments");
    if (treatmentsEl) {
      treatmentsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-[#F6F2EC] text-[#2B2118] selection:bg-[#B8955A]/30 selection:text-[#2B2118]"
    >
      {/* Floating Navbar — Hidden until user reaches "Your visit, unhurried." */}
      <Navbar
        visible={navbarVisible}
        activeCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onBookClick={() => handleSelectTreatment("")}
      />

      <main>
        {/* 1. Cinematic 3D Scroll Film */}
        <ScrollFilm onShowNavbar={setNavbarVisible} />

        {/* 2. Manifesto + Villa Story (with 3rd image moving transition) */}
        <ManifestoStory />

        {/* 3. Meet Dr. Tejashree */}
        <DoctorSection />

        {/* 4. Comprehensive Dental Treatments with Category Filter */}
        <TreatmentsSection
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelectTreatment={handleSelectTreatment}
        />

        {/* 5. In-Depth Clinical Guide & FAQ (Information Gathering from Top Dental Clinics) */}
        <ClinicalGuideSection />

        {/* 6. 3D Spatial Gallery */}
        <Gallery3D />

        {/* 7. Patient Reviews */}
        <ReviewsSection />

        {/* 8. Frequently Asked Questions (FAQ) */}
        <FAQSection />

        {/* 9. Appointment Booking */}
        <BookingSection preselectedTreatment={selectedTreatment} />
      </main>

      <Footer />

      {/* WhatsApp Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/919226856934"
          target="_blank"
          rel="noopener noreferrer"
          id="whatsapp-cta"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
          title="Chat with Dr. Tejashree on WhatsApp"
          style={{ width: "3.5rem", height: "3.5rem" }}
        >
          <MessageSquare className="w-6 h-6 fill-white" />
        </a>
      </div>
    </div>
  );
}

export default App;
