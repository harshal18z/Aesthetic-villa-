import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GALLERY_ITEMS,
  GALLERY_CATEGORIES,
  GalleryMediaItem,
} from "@/data/galleryData";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  ZoomIn,
  Video,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   Tiny helpers
   ───────────────────────────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/* ─────────────────────────────────────────────────────────────────────────
   3-D Scroll-driven card
   ───────────────────────────────────────────────────────────────────────── */
interface Card3DProps {
  item: GalleryMediaItem;
  index: number;
  totalInRow: number;
  onOpen: (item: GalleryMediaItem, index: number) => void;
  delay: number;
}

const Card3D: React.FC<Card3DProps> = ({ item, index, totalInRow, onOpen, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Intersection observer for scroll-reveal
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Mouse-tilt 3D effect per card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: -y * 12, y: x * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // Alternating column depth offset for 3D stagger feel
  const col = index % totalInRow;
  const depthZ = col === 0 ? 0 : col === 1 ? 20 : col === 2 ? 8 : 12;

  const entryStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${depthZ}px)`
      : `perspective(900px) rotateX(4deg) translateY(60px) translateZ(-40px)`,
    transition: `opacity 0.7s ${delay}ms cubic-bezier(0.22,1,0.36,1), transform 0.7s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,
    transformStyle: "preserve-3d",
    willChange: "transform, opacity",
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(item, index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/70 border border-[#B8955A]/25 shadow-md hover:shadow-[0_24px_60px_rgba(184,149,90,0.22)] transition-shadow duration-500"
      style={entryStyle}
    >
      {/* Image / thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DCC6]/30">
        <img
          src={item.type === "video" ? item.thumbnailUrl || item.url : item.url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/75 via-transparent to-transparent opacity-55 group-hover:opacity-80 transition-opacity duration-400" />

        {/* Video play badge */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 text-[#2B2118] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="w-5 h-5 ml-0.5 fill-[#2B2118]" />
            </div>
          </div>
        )}

        {/* Category pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/85 text-[#2B2118] backdrop-blur-sm shadow-sm border border-[#B8955A]/20">
          {item.category}
        </span>

        {/* Zoom icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#2B2118] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
          <ZoomIn className="w-4 h-4" />
        </div>

        {/* 3D depth shimmer on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-[#B8955A]/0 group-hover:from-white/10 group-hover:to-[#B8955A]/10 transition-all duration-500 pointer-events-none"
          style={{ transform: "translateZ(1px)" }}
        />
      </div>

      {/* Card info */}
      <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-sm">
        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#2B2118] mb-1 line-clamp-1 group-hover:text-[#7A5E2E] transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-[#5a4a38] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Scroll-driven 3D Horizontal Strip (cinematic row)
   ───────────────────────────────────────────────────────────────────────── */
interface CinematicStripProps {
  items: GalleryMediaItem[];
  onOpen: (item: GalleryMediaItem, index: number, items: GalleryMediaItem[]) => void;
}

const CinematicStrip: React.FC<CinematicStripProps> = ({ items, onOpen }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const currentX = useRef(0);
  const targetX = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const vpH = window.innerHeight;
      // When strip's center crosses viewport: 0 = entering top, 1 = exiting bottom
      const t = clamp(1 - (rect.top + rect.height / 2) / (vpH + rect.height / 2));
      const maxScroll = track.scrollWidth - track.clientWidth;
      targetX.current = -t * maxScroll * 0.85;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const raf = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.07);
      if (track) {
        track.style.transform = `translateX(${currentX.current.toFixed(2)}px)`;
      }
      animRef.current = requestAnimationFrame(raf);
    };
    animRef.current = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="overflow-hidden py-4">
      <div
        ref={trackRef}
        className="flex gap-5 w-max"
        style={{ willChange: "transform" }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => onOpen(item, i, items)}
            className="group relative cursor-pointer w-[280px] sm:w-[340px] shrink-0 rounded-2xl overflow-hidden border border-[#B8955A]/25 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            style={{
              transform: `perspective(600px) rotateY(${(i % 3 - 1) * 3}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#E8DCC6]/30">
              <img
                src={item.type === "video" ? item.thumbnailUrl || item.url : item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/75 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-[#2B2118] text-[#2B2118]" />
                  </div>
                </div>
              )}
              <span className="absolute bottom-3 left-3 font-serif text-base text-white font-medium drop-shadow">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Main Gallery3D component
   ───────────────────────────────────────────────────────────────────────── */
export const Gallery3D: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightbox, setLightbox] = useState<{
    item: GalleryMediaItem;
    index: number;
    list: GalleryMediaItem[];
  } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "strip">("grid");
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) =>
    activeCategory === "All" ? true : item.category === activeCategory
  );

  const openLightbox = useCallback(
    (item: GalleryMediaItem, index: number, list?: GalleryMediaItem[]) => {
      setLightbox({ item, index, list: list || filteredItems });
    },
    [filteredItems]
  );

  const closeLightbox = () => setLightbox(null);

  const nextItem = () => {
    if (!lightbox) return;
    const nextIdx = (lightbox.index + 1) % lightbox.list.length;
    setLightbox({ ...lightbox, item: lightbox.list[nextIdx], index: nextIdx });
  };

  const prevItem = () => {
    if (!lightbox) return;
    const prevIdx = (lightbox.index - 1 + lightbox.list.length) % lightbox.list.length;
    setLightbox({ ...lightbox, item: lightbox.list[prevIdx], index: prevIdx });
  };

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <section
      id="gallery-3d"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#F6F2EC] overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(184,149,90,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(232,220,198,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DCC6]/50 border border-[#B8955A]/30 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>3D Spatial Gallery</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight mb-4">
            A Glimpse Inside the Villa
          </h2>
          <p className="text-[#4a3c2d] text-base sm:text-lg leading-relaxed">
            Explore our sunlit clinical suites, advanced sterilisation tech, restorative artistry, and patient walkthroughs in rich spatial perspective.
          </p>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = GALLERY_ITEMS.filter((i) =>
                cat === "All" ? true : i.category === cat
              ).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#2B2118] text-[#F6F2EC] shadow-md scale-105"
                      : "bg-white/80 hover:bg-white text-[#4a3c2d] border border-[#B8955A]/20"
                  }`}
                >
                  {cat === "Videos" && <Video className="w-3.5 h-3.5 text-[#B8955A]" />}
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#7A5E2E]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/80 rounded-full p-1 border border-[#B8955A]/20 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#2B2118] text-white shadow"
                  : "text-[#4a3c2d] hover:text-[#2B2118]"
              }`}
            >
              3D Grid
            </button>
            <button
              onClick={() => setViewMode("strip")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "strip"
                  ? "bg-[#2B2118] text-white shadow"
                  : "text-[#4a3c2d] hover:text-[#2B2118]"
              }`}
            >
              Cinematic
            </button>
          </div>
        </div>

        {/* GRID VIEW — Scroll-Reveal 3D Cards */}
        {viewMode === "grid" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            style={{ perspective: "1200px" }}
          >
            {filteredItems.map((item, idx) => (
              <Card3D
                key={item.id}
                item={item}
                index={idx}
                totalInRow={4}
                onOpen={(it, i) => openLightbox(it, i)}
                delay={Math.min((idx % 4) * 80, 240)}
              />
            ))}
          </div>
        )}

        {/* CINEMATIC STRIP VIEW — Scroll-driven horizontal parallax */}
        {viewMode === "strip" && (
          <div>
            <p className="text-center text-xs text-[#7A5E2E] tracking-widest uppercase font-semibold mb-6">
              Scroll to pan through the gallery
            </p>
            <CinematicStrip
              items={filteredItems}
              onOpen={(item, i, list) => openLightbox(item, i, list)}
            />
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1A140E]/96 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          style={{ animation: "galleryFadeIn 0.35s ease-out both" }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous */}
          <button
            onClick={(e) => { e.stopPropagation(); prevItem(); }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextItem(); }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Content */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.item.type === "video" && lightbox.item.videoEmbedUrl ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={lightbox.item.videoEmbedUrl}
                  title={lightbox.item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                className="relative max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl"
                style={{ transform: "perspective(1000px)" }}
              >
                <img
                  src={lightbox.item.url}
                  alt={lightbox.item.title}
                  className="max-h-[75vh] w-auto object-contain mx-auto rounded-2xl"
                />
              </div>
            )}

            {/* Caption */}
            <div className="mt-5 text-center text-white max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#D9B878] font-semibold block mb-1.5">
                {lightbox.item.category} &nbsp;·&nbsp; {lightbox.index + 1} of {lightbox.list.length}
              </span>
              <h4 className="font-serif text-2xl font-normal mb-1">{lightbox.item.title}</h4>
              {lightbox.item.description && (
                <p className="text-sm text-gray-300 leading-relaxed">{lightbox.item.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};
