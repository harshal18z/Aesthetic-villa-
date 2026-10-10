import React, { useEffect, useRef, useState, useCallback } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { TiltedGridHero, TiltedGridImage } from "@/components/ui/tilted-grid-hero";

const TILTED_GRID_IMAGES: TiltedGridImage[] = [
  { src: "/img/0.webp", alt: "The Aesthetic Villa Reception and Boucle Lounge" },
  { src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80", alt: "Architectural tranquility and modern dental suite" },
  { src: "/img/2.webp", alt: "Travertine reception desk overlooking garden" },
  { src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80", alt: "Aesthetic dentistry smile rehabilitation" },
  { src: "/img/3.webp", alt: "Private consultation and unhurried clinical suite" },
  { src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80", alt: "Precision ceramic craftsmanship and dental instruments" },
  { src: "/img/9.webp", alt: "Sunlit courtyard and tranquil greenery view" },
  { src: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80", alt: "Warm tranquil consultation lounge" },
  { src: "/img/10.webp", alt: "State-of-the-art sterile dental operatory" },
  { src: "/img/17.webp", alt: "The Aesthetic Villa architectural entrance" },
];

// Helper utilities
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const fade = (p: number, a: number, b: number, c: number, d: number) =>
  p < a || p > d ? 0 : p < b ? seg(p, a, b) : p <= c ? 1 : 1 - seg(p, c, d);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

class FrameSequence {
  key: string;
  n: number;
  cv: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null = null;
  img: HTMLImageElement[];
  last = -1;
  isSmall = false;

  constructor(key: string, n: number, cv: HTMLCanvasElement | null) {
    this.key = key;
    this.n = n;
    this.cv = cv;
    if (cv) {
      this.ctx = cv.getContext("2d", { alpha: false });
    }
    this.img = new Array(n);
    this.isSmall = typeof window !== "undefined" && window.innerWidth <= 700;
  }

  url(i: number) {
    const folder = this.isSmall ? "m" : "d";
    const num = String(i + 1).padStart(3, "0");
    return `/frames/${this.key}/${folder}/${num}.webp`;
  }

  order() {
    const st = this.isSmall ? 2 : 1;
    const a: number[] = [];
    for (let i = 0; i < this.n; i++) {
      if (i % st === 0 || i === this.n - 1) a.push(i);
    }
    return a;
  }

  load(i: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.img[i]) return resolve();
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        this.img[i] = im;
        resolve();
      };
      im.onerror = () => resolve();
      im.src = this.url(i);
    });
  }

  async loadList(list: number[], conc = 6, onEach?: () => void) {
    const q = list.slice();
    const worker = async () => {
      while (q.length) {
        const idx = q.shift();
        if (idx !== undefined) {
          await this.load(idx);
          onEach?.();
        }
      }
    };
    await Promise.all(Array.from({ length: conc }, worker));
  }

  resize() {
    if (!this.cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.cv.clientWidth * dpr);
    const h = Math.round(this.cv.clientHeight * dpr);
    if (w && (this.cv.width !== w || this.cv.height !== h)) {
      this.cv.width = w;
      this.cv.height = h;
      this.last = -1;
    }
  }

  draw(f: number) {
    if (!this.cv || !this.ctx) return;
    const i = clamp(Math.round(f), 0, this.n - 1);
    if (i === this.last) return;

    let im: HTMLImageElement | null = null;
    for (let d = 0; d < this.n; d++) {
      if (this.img[i - d]) {
        im = this.img[i - d];
        break;
      }
      if (this.img[i + d]) {
        im = this.img[i + d];
        break;
      }
    }
    if (!im) return;
    this.last = i;

    const c = this.ctx;
    const W = this.cv.width;
    const H = this.cv.height;
    c.fillStyle = "#F6F2EC";
    c.fillRect(0, 0, W, H);

    const s = Math.min(W / im.naturalWidth, H / im.naturalHeight);
    const w = im.naturalWidth * s;
    const h = im.naturalHeight * s;
    c.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }
}

interface ScrollFilmProps {
  onShowNavbar?: (show: boolean) => void;
}

export const ScrollFilm: React.FC<ScrollFilmProps> = ({ onShowNavbar }) => {
  const filmRef = useRef<HTMLDivElement>(null);
  const cvARef = useRef<HTMLCanvasElement>(null);
  const cvCRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sequences (A: Arrival, C: 360° Rotation - Macro B removed per user request)
  const seqsRef = useRef<{
    A: FrameSequence | null;
    C: FrameSequence | null;
  }>({ A: null, C: null });

  // DOM elements refs for direct 60fps style updates without React re-render lag
  const stageRef = useRef<HTMLDivElement>(null);
  const lARef = useRef<HTMLDivElement>(null);
  const lTiltedGridRef = useRef<HTMLDivElement>(null);
  const lHeroRef = useRef<HTMLDivElement>(null);
  const lAsmRef = useRef<HTMLDivElement>(null);
  const lRotRef = useRef<HTMLDivElement>(null);
  const lJRef = useRef<HTMLDivElement>(null);
  const lPlanRef = useRef<HTMLDivElement>(null);
  const lArchRef = useRef<HTMLDivElement>(null);
  const lSealRef = useRef<HTMLDivElement>(null);
  const lWellRef = useRef<HTMLDivElement>(null);
  const lCloseRef = useRef<HTMLDivElement>(null);

  const heroImgRef = useRef<HTMLImageElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const pFixRef = useRef<HTMLDivElement>(null);
  const pScrRef = useRef<HTMLDivElement>(null);
  const pAbuRef = useRef<HTMLDivElement>(null);
  const pCroRef = useRef<HTMLDivElement>(null);
  const asmGlowRef = useRef<HTMLDivElement>(null);

  const callout1Ref = useRef<HTMLDivElement>(null);
  const callout2Ref = useRef<HTMLDivElement>(null);
  const callout3Ref = useRef<HTMLDivElement>(null);
  const callout4Ref = useRef<HTMLDivElement>(null);

  const jpathRef = useRef<SVGPathElement>(null);
  
  // 3D Jaw Section moving elements
  const jawContainerRef = useRef<HTMLDivElement>(null);
  const jawImgRef = useRef<HTMLImageElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const cn1Ref = useRef<SVGPathElement>(null);
  const cn2Ref = useRef<SVGPathElement>(null);
  const pl1Ref = useRef<HTMLDivElement>(null);
  const pl2Ref = useRef<HTMLDivElement>(null);

  const archPathRef = useRef<SVGPathElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const shaftsRef = useRef<HTMLDivElement>(null);
  const bloomfullRef = useRef<HTMLDivElement>(null);

  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3aRef = useRef<HTMLDivElement>(null);
  const t3bRef = useRef<HTMLDivElement>(null);
  const t4aRef = useRef<HTMLDivElement>(null);
  const t4bRef = useRef<HTMLDivElement>(null);
  const t7Ref = useRef<HTMLDivElement>(null);
  const t8Ref = useRef<HTMLDivElement>(null);
  const t9Ref = useRef<HTMLDivElement>(null);
  const t10Ref = useRef<HTMLDivElement>(null);
  const t11Ref = useRef<HTMLDivElement>(null);

  const jCardsRef = useRef<HTMLDivElement[]>([]);
  const jDotsRef = useRef<HTMLSpanElement[]>([]);

  // Smooth visibility and translation helpers
  const setVis = (el: HTMLElement | null, v: number) => {
    if (!el) return;
    el.style.opacity = String(v);
    el.style.visibility = v > 0.005 ? "visible" : "hidden";
  };

  const T = (el: HTMLElement | null, v: number, dy = 24) => {
    if (!el) return;
    setVis(el, v);
    el.style.transform = `translateY(${(1 - v) * dy}px)`;
  };

  const BL = (el: HTMLElement | null, v: number) => {
    if (!el) return;
    el.style.opacity = String(v);
    el.style.filter = `blur(${((1 - v) * 12).toFixed(1)}px)`;
    el.style.transform = `translateY(${(1 - v) * 8}px)`;
  };

  // Main deterministic render function
  const renderFilm = useCallback((p: number) => {
    p = clamp(p);
    setScrollProgress(p);

    // Notify navbar visibility: keep hidden until user reaches "Your visit, unhurried."
    if (onShowNavbar) {
      onShowNavbar(p >= 0.94);
    }

    const { A, C } = seqsRef.current;

    /* 1. ARRIVAL (0.00 - 0.14) */
    if (A) A.draw(seg(p, 0, 0.08) * (A.n - 1));
    setVis(lARef.current, 1 - seg(p, 0.075, 0.088));

    // Curved 3D Tilted Grid Hero replaces static stills 0 & 2
    const tgOp = fade(p, 0.075, 0.088, 0.148, 0.162);
    setVis(lTiltedGridRef.current, tgOp);

    T(t1Ref.current, fade(p, -0.05, -0.04, 0.065, 0.078));

    /* 2. HERO IMPLANT (0.15 - 0.24) */
    const h = fade(p, 0.155, 0.17, 0.225, 0.245);
    setVis(lHeroRef.current, h);
    if (heroImgRef.current) {
      heroImgRef.current.style.transform = `scale(${lerp(0.94, 1.05, seg(p, 0.165, 0.235))})`;
    }
    if (rimRef.current) {
      rimRef.current.style.opacity = String(h);
    }
    T(t2Ref.current, h);

    /* 3. ASSEMBLY (Part by Part) (0.24 - 0.36) */
    const asmOp = fade(p, 0.24, 0.256, 0.345, 0.365);
    setVis(lAsmRef.current, asmOp);
    const a = seg(p, 0.255, 0.34);

    if (pCroRef.current) {
      const k = ease(seg(a, 0.62, 1.0));
      pCroRef.current.style.transform = `translateY(${(k * 224 / 257 * 100).toFixed(2)}%)`;
    }
    if (pAbuRef.current) {
      const k = ease(seg(a, 0.30, 0.70));
      pAbuRef.current.style.transform = `translateY(${(k * 199 / 233 * 100).toFixed(2)}%)`;
    }
    if (pScrRef.current) {
      const k = ease(seg(a, 0, 0.38));
      pScrRef.current.style.transform = `translateY(${(k * 170 / 153 * 100).toFixed(2)}%)`;
      pScrRef.current.style.opacity = String(1 - seg(a, 0.22, 0.42));
    }
    if (asmGlowRef.current) {
      asmGlowRef.current.style.opacity = String(Math.sin(Math.PI * seg(a, 0.55, 1)) * 0.85);
    }
    T(t3aRef.current, fade(p, 0.246, 0.258, 0.285, 0.3) * asmOp);
    T(t3bRef.current, fade(p, 0.295, 0.31, 0.34, 0.358) * asmOp);

    /* 4. 360° ROTATION (0.36 - 0.53) */
    const rot = fade(p, 0.355, 0.37, 0.515, 0.535);
    setVis(lRotRef.current, rot);
    if (C) C.draw(seg(p, 0.365, 0.525) * (C.n - 1));

    T(t4aRef.current, fade(p, 0.37, 0.382, 0.43, 0.445) * rot);
    T(t4bRef.current, fade(p, 0.45, 0.462, 0.51, 0.525) * rot);

    BL(callout1Ref.current, fade(p, 0.375, 0.39, 0.43, 0.445));
    BL(callout2Ref.current, fade(p, 0.39, 0.405, 0.43, 0.445));
    BL(callout3Ref.current, fade(p, 0.455, 0.47, 0.51, 0.525));
    BL(callout4Ref.current, fade(p, 0.47, 0.485, 0.51, 0.525));

    /* 5. PATIENT JOURNEY (Directly after 360° Rotation - Macro Section Removed) (0.53 - 0.71) */
    const jo = fade(p, 0.53, 0.545, 0.705, 0.72);
    setVis(lJRef.current, jo);

    const J0 = 0.545;
    const JS = 0.032;
    const jStart = [J0, J0 + JS, J0 + 2 * JS, J0 + 2.55 * JS, J0 + 3 * JS, J0 + 4 * JS];
    jCardsRef.current.forEach((el, i) => {
      if (!el) return;
      const r = ease(seg(p, jStart[i] - 0.009, jStart[i] + 0.007));
      el.style.clipPath = `circle(${(r * 80).toFixed(1)}% at 50% 45%)`;
      el.style.visibility = r > 0 ? "visible" : "hidden";
    });

    const st = clamp(Math.floor((p - J0) / JS), 0, 4);
    if (jpathRef.current) {
      const progressInSteps = (st + ease(seg(p, J0 + st * JS + 0.004, J0 + st * JS + JS * 0.8))) / 4;
      jpathRef.current.style.strokeDashoffset = String(1 - clamp(progressInSteps, 0, 1));
    }
    jDotsRef.current.forEach((dot, idx) => {
      if (!dot) return;
      dot.classList.toggle("bg-[#B8955A]", idx === st);
      dot.classList.toggle("text-white", idx === st);
      dot.classList.toggle("bg-[#B8955A]/30", idx < st);
    });

    /* 6. COMPUTER-GUIDED SURGERY (3D JAW WITH DYNAMIC MOVING TRANSITION!) (0.72 - 0.86) */
    const pl = fade(p, 0.715, 0.73, 0.85, 0.865);
    setVis(lPlanRef.current, pl);
    const dk = fade(p, 0.712, 0.728, 0.848, 0.865);
    if (stageRef.current) {
      stageRef.current.style.background = dk > 0.05 ? "#1A140E" : "#F6F2EC";
    }

    // Dynamic 3D Moving Transition for the 3D Jaw
    const q = seg(p, 0.73, 0.855); // progress within digital planning
    if (jawContainerRef.current) {
      // 3D rotation, scaling, and lateral floating motion on scroll
      const rotY = lerp(-14, 10, ease(q));
      const rotX = lerp(8, -3, ease(q));
      const transX = lerp(-30, 25, ease(q));
      const transZ = lerp(-20, 35, ease(q));
      const scale = lerp(0.95, 1.08, ease(q));

      jawContainerRef.current.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateX(${transX}px) translateZ(${transZ}px) scale(${scale})`;
    }

    // Holographic laser scan line moving vertically across the jawbone
    if (scanLineRef.current) {
      const scanY = ease(q);
      scanLineRef.current.style.top = `${(scanY * 85 + 5).toFixed(1)}%`;
      scanLineRef.current.style.opacity = String(Math.sin(Math.PI * q) * 0.95);
    }

    // Radial scanner spot tracking
    if (spotRef.current) {
      let sx = 49, sy = 60.5, sr = 24;
      if (q < 0.2) {
        const k = ease(q / 0.2);
        sx = lerp(32, 49, k);
        sy = lerp(42, 60.5, k);
      } else if (q < 0.45) {
        sx = 49; sy = 60.5;
      } else if (q < 0.65) {
        const k = ease((q - 0.45) / 0.2);
        sx = lerp(49, 58.5, k);
        sy = lerp(60.5, 35.5, k);
      } else if (q < 0.85) {
        sx = 58.5; sy = 35.5;
      } else {
        const k = ease((q - 0.85) / 0.15);
        sx = 58.5; sy = 35.5; sr = lerp(24, 75, k);
      }
      spotRef.current.style.setProperty("--sx", sx + "%");
      spotRef.current.style.setProperty("--sy", sy + "%");
      spotRef.current.style.setProperty("--sr", sr + "%");
    }

    if (cn1Ref.current) cn1Ref.current.style.strokeDashoffset = String(1 - ease(seg(q, 0.2, 0.45)));
    if (cn2Ref.current) cn2Ref.current.style.strokeDashoffset = String(1 - ease(seg(q, 0.55, 0.8)));
    if (pl1Ref.current) pl1Ref.current.style.opacity = String(seg(q, 0.32, 0.45));
    if (pl2Ref.current) pl2Ref.current.style.opacity = String(seg(q, 0.7, 0.83));
    T(t7Ref.current, fade(p, 0.73, 0.745, 0.84, 0.858) * pl);

    /* 7. SMILE ARCH (0.865 - 0.915) */
    const ar = fade(p, 0.862, 0.875, 0.91, 0.922);
    setVis(lArchRef.current, ar);
    if (archPathRef.current) {
      archPathRef.current.style.strokeDashoffset = String(1 - ease(seg(p, 0.872, 0.898)));
    }
    if (bloomRef.current) {
      const bl = seg(p, 0.89, 0.912);
      bloomRef.current.style.opacity = String(Math.sin(Math.PI * bl) * 0.9);
      bloomRef.current.style.transform = `translateX(${lerp(-70, 70, bl)}%)`;
    }
    T(t8Ref.current, fade(p, 0.87, 0.882, 0.905, 0.918) * ar);

    /* 8. SEAL STAMP (0.918 - 0.945) */
    const se = fade(p, 0.915, 0.925, 0.942, 0.952);
    setVis(lSealRef.current, se);
    const sk = seg(p, 0.918, 0.932);
    const sc = sk < 1 ? lerp(1.7, 1, outBack(sk)) : 1;
    const squash = sk > 0.55 && sk < 0.85 ? 1 - 0.06 * Math.sin(Math.PI * seg(sk, 0.55, 0.85)) : 1;
    if (sealRef.current) {
      sealRef.current.style.transform = `scale(${sc * (1 + (1 - squash) * 0.5)},${sc * squash})`;
      sealRef.current.style.opacity = String(seg(p, 0.916, 0.925));
    }
    if (ringRef.current) {
      const rk = seg(p, 0.928, 0.945);
      ringRef.current.style.opacity = String(rk > 0 && rk < 1 ? 0.8 * (1 - rk) : 0);
      ringRef.current.style.transform = `translate(-50%,-50%) scale(${lerp(0.5, 1.8, ease(rk))})`;
    }
    T(t9Ref.current, fade(p, 0.922, 0.932, 0.942, 0.95) * se);

    /* 9. RETREAT / CALM (0.945 - 0.97) */
    const we = fade(p, 0.942, 0.952, 0.968, 0.978);
    setVis(lWellRef.current, we);
    if (shaftsRef.current) {
      shaftsRef.current.style.transform = `translateX(${lerp(-4, 4, seg(p, 0.942, 0.975))}%)`;
    }
    T(t10Ref.current, fade(p, 0.948, 0.956, 0.966, 0.976) * we);

    /* 10. CLOSE & TRANSITION CTA ("Your visit, unhurried.") (0.97 - 1.0) */
    const cl = seg(p, 0.968, 1);
    setVis(lCloseRef.current, seg(p, 0.965, 0.974));
    if (bloomfullRef.current) {
      bloomfullRef.current.style.transform = `translate(-50%,-50%) scale(${ease(seg(p, 0.968, 0.995)).toFixed(3)})`;
    }
    T(t11Ref.current, seg(p, 0.978, 0.995));
    if (t11Ref.current) {
      t11Ref.current.style.pointerEvents = cl > 0.9 ? "auto" : "none";
    }
  }, [onShowNavbar]);

  // Initialize sequences and progressive image loading
  useEffect(() => {
    const seqA = new FrameSequence("A", 96, cvARef.current);
    const seqC = new FrameSequence("C", 120, cvCRef.current);

    seqsRef.current = { A: seqA, C: seqC };

    seqA.resize();
    seqC.resize();

    const handleResize = () => {
      seqA.resize();
      seqC.resize();
      if (filmRef.current) {
        const top = filmRef.current.offsetTop;
        const height = filmRef.current.offsetHeight - window.innerHeight;
        const progress = height > 0 ? clamp((window.scrollY - top) / height) : 0;
        renderFilm(progress);
      }
    };
    window.addEventListener("resize", handleResize);

    const boot = async () => {
      const orderA = seqA.order();
      const initialBatch = Math.ceil(orderA.length * 0.2);
      let count = 0;
      const totalInitial = initialBatch + 2;

      const tick = () => {
        count++;
        setLoadProgress(Math.min(100, Math.round((count / totalInitial) * 100)));
      };

      const heroImg = new Image();
      const heroPromise = new Promise((r) => {
        heroImg.onload = heroImg.onerror = r;
        heroImg.src = "/img/hero.webp";
      });

      await Promise.all([
        seqA.loadList(orderA.slice(0, initialBatch), 6, tick),
        heroPromise.then(tick),
      ]);

      setLoadProgress(100);
      setLoading(false);

      if (filmRef.current) {
        const top = filmRef.current.offsetTop;
        const height = filmRef.current.offsetHeight - window.innerHeight;
        const progress = height > 0 ? clamp((window.scrollY - top) / height) : 0;
        renderFilm(progress);
      }

      // Load remaining frames in background
      seqA.loadList(orderA.slice(initialBatch), 6);
      seqC.loadList(seqC.order(), 6);
    };

    boot();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [renderFilm]);

  // Scroll listener with requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking || !filmRef.current) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!filmRef.current) return;
        const top = filmRef.current.offsetTop;
        const height = filmRef.current.offsetHeight - window.innerHeight;
        const progress = height > 0 ? clamp((window.scrollY - top) / height) : 0;
        renderFilm(progress);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [renderFilm]);

  return (
    <>
      {/* Cinematic Initial Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#F6F2EC] flex flex-col items-center justify-center text-center transition-opacity duration-700">
          <span className="font-serif text-3xl sm:text-4xl text-[#2B2118] font-medium tracking-tight mb-4">
            {CLINIC_INFO.name}
          </span>
          <div className="w-48 sm:w-64 h-[2px] bg-[#2B2118]/15 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#B8955A] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#7A5E2E] font-medium">
            Preparing your private villa visit · {loadProgress}%
          </span>
        </div>
      )}

      {/* Main Scroll Film Stage */}
      <section
        id="film"
        ref={filmRef}
        className="relative h-[1800vh] bg-[#F6F2EC]"
        aria-label="Scroll film: Private Villa Dental Journey"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-screen w-full overflow-hidden bg-[#F6F2EC] transition-colors duration-500"
        >
          {/* Progress Bar & Hint */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/5 z-40">
            <div
              className="h-full bg-[#B8955A] transition-all duration-75 ease-out"
              style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
            />
          </div>

          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none transition-opacity duration-500 ${
              scrollProgress < 0.015 ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#7A5E2E] font-medium block animate-bounce">
              Scroll down to explore
            </span>
          </div>

          {/* 1. ARRIVAL CANVAS & STILLS */}
          <div
            ref={lARef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              <canvas
                ref={cvARef}
                className="w-full h-full object-cover"
                role="img"
                aria-label="Villa entrance at golden hour"
              />
            </div>
          </div>

          {/* Chapter 1 Text Overlays */}
          <div
            ref={t1Ref}
            className="absolute bottom-12 sm:bottom-20 left-6 sm:left-16 z-30 max-w-xl opacity-0 pointer-events-none bg-gradient-to-r from-[#F6F2EC]/95 via-[#F6F2EC]/70 to-transparent p-6 rounded"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-2">
              The Aesthetic Villa · Pune
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal leading-[1.05]">
              Healthcare that feels like home.
            </h1>
          </div>

          {/* CURVED 3D TILTED GRID HERO CYLINDER (Replaces Stills 0 & 2) */}
          <div
            ref={lTiltedGridRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto opacity-0 z-20"
          >
            <TiltedGridHero
              images={TILTED_GRID_IMAGES}
              className="w-full h-full max-w-[177.78vh] aspect-video"
              speed={4}
              tileHeight={27}
              curve={78}
              gap={7}
            >
              <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 sm:py-16 text-center pointer-events-auto">
                <div className="px-6">
                  <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-2 drop-shadow-xs">
                    The Aesthetic Villa · Kothrud
                  </p>
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2B2118] font-normal tracking-tight">
                    Every frame,
                    <br />
                    brought into focus.
                  </h2>
                </div>
                <p className="max-w-md text-xs sm:text-sm text-[#4a3c2d] px-6 leading-relaxed bg-[#F6F2EC]/85 backdrop-blur-xs py-2 rounded-full border border-[#B8955A]/25">
                  Images curve in from one edge, flatten out at the centre, then fade away round the other.
                </p>
              </div>
            </TiltedGridHero>
          </div>

          {/* 2. HERO IMPLANT */}
          <div
            ref={lHeroRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video flex items-center justify-center">
              <div
                ref={rimRef}
                className="absolute w-[45%] h-[85%] rounded-full bg-radial from-[#B8955A]/30 via-[#E8DCC6]/20 to-transparent blur-2xl animate-pulse"
              />
              <img
                ref={heroImgRef}
                src="/img/hero.webp"
                alt="Floating titanium dental implant with ceramic crown"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          <div
            ref={t2Ref}
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-2">
              The Implant
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118] font-normal leading-tight mb-3">
              Precision Crafted for Life
            </h2>
            <p className="text-sm text-[#4a3c2d] leading-relaxed">
              Engineered with medical-grade biocompatible titanium, designed to integrate seamlessly into your natural jawbone.
            </p>
          </div>

          {/* 3. ASSEMBLY (Part by Part) */}
          <div
            ref={lAsmRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              <img
                src="/img/plate.webp"
                alt="Background plate"
                className="absolute inset-0 w-full h-full object-contain opacity-75"
              />
              <div
                ref={asmGlowRef}
                className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-radial from-[#B8955A]/50 to-transparent blur-xl opacity-0"
              />

              {/* Implant parts */}
              <div
                ref={pFixRef}
                className="absolute left-[31.25%] top-[62.31%] w-[37.5%] h-[33.06%] will-change-transform"
              >
                <img src="/img/part_fixture.webp" alt="Titanium fixture" className="w-full h-full object-fill" />
                <span className="absolute left-[66%] top-[42%] text-[10px] sm:text-xs tracking-widest uppercase text-[#7A5E2E] font-medium whitespace-nowrap">
                  Fixture Body
                </span>
              </div>

              <div
                ref={pScrRef}
                className="absolute left-[31.25%] top-[48.15%] w-[37.5%] h-[14.17%] will-change-transform"
              >
                <img src="/img/part_screw.webp" alt="Abutment screw" className="w-full h-full object-fill" />
                <span className="absolute left-[66%] top-[42%] text-[10px] sm:text-xs tracking-widest uppercase text-[#7A5E2E] font-medium whitespace-nowrap">
                  Locking Screw
                </span>
              </div>

              <div
                ref={pAbuRef}
                className="absolute left-[31.25%] top-[26.57%] w-[37.5%] h-[21.57%] will-change-transform"
              >
                <img src="/img/part_abut.webp" alt="Abutment" className="w-full h-full object-fill" />
                <span className="absolute left-[66%] top-[42%] text-[10px] sm:text-xs tracking-widest uppercase text-[#7A5E2E] font-medium whitespace-nowrap">
                  Precision Abutment
                </span>
              </div>

              <div
                ref={pCroRef}
                className="absolute left-[31.25%] top-[2.78%] w-[37.5%] h-[23.8%] will-change-transform"
              >
                <img src="/img/part_crown.webp" alt="Ceramic crown" className="w-full h-full object-fill" />
                <span className="absolute left-[66%] top-[42%] text-[10px] sm:text-xs tracking-widest uppercase text-[#7A5E2E] font-medium whitespace-nowrap">
                  Zirconia Crown
                </span>
              </div>
            </div>
          </div>

          <div
            ref={t3aRef}
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Precision
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118]">Part by part.</h2>
          </div>

          <div
            ref={t3bRef}
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Micron Tolerance
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118] mb-3">Made to fit forever.</h2>
            <p className="text-sm text-[#4a3c2d]">
              Every component is calibrated for optimal biological seal, preventing bacterial micro-leakage and bone loss.
            </p>
          </div>

          {/* 4. 360° ROTATION WITH 3D CALLOUTS */}
          <div
            ref={lRotRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              <canvas
                ref={cvCRef}
                className="w-full h-full object-contain"
                role="img"
                aria-label="Dental implant rotating in 360 degrees"
              />

              {/* Interactive 3D Callouts */}
              <div
                ref={callout1Ref}
                className="absolute left-[60%] top-[24%] flex items-center gap-2 text-xs tracking-wider uppercase text-[#2B2118] font-semibold opacity-0"
              >
                <span className="w-8 h-[1px] bg-[#B8955A]" />
                <span className="bg-white/85 px-2.5 py-1 rounded backdrop-blur shadow-sm border border-[#B8955A]/30">
                  Translucent Crown
                </span>
              </div>

              <div
                ref={callout2Ref}
                className="absolute left-[58%] top-[40%] flex items-center gap-2 text-xs tracking-wider uppercase text-[#2B2118] font-semibold opacity-0"
              >
                <span className="w-8 h-[1px] bg-[#B8955A]" />
                <span className="bg-white/85 px-2.5 py-1 rounded backdrop-blur shadow-sm border border-[#B8955A]/30">
                  Custom Titanium Abutment
                </span>
              </div>

              <div
                ref={callout3Ref}
                className="absolute left-[60%] top-[62%] flex items-center gap-2 text-xs tracking-wider uppercase text-[#2B2118] font-semibold opacity-0"
              >
                <span className="w-8 h-[1px] bg-[#B8955A]" />
                <span className="bg-white/85 px-2.5 py-1 rounded backdrop-blur shadow-sm border border-[#B8955A]/30">
                  Pure Grade-IV Titanium
                </span>
              </div>

              <div
                ref={callout4Ref}
                className="absolute right-[53%] top-[74%] flex items-center gap-2 text-xs tracking-wider uppercase text-[#2B2118] font-semibold opacity-0"
              >
                <span className="bg-white/85 px-2.5 py-1 rounded backdrop-blur shadow-sm border border-[#B8955A]/30">
                  Self-Tapping Threads
                </span>
                <span className="w-8 h-[1px] bg-[#B8955A]" />
              </div>
            </div>
          </div>

          <div
            ref={t4aRef}
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              360° Inspection
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118]">Every angle scrutinized.</h2>
          </div>

          <div
            ref={t4bRef}
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Geometric Harmony
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118]">Built for longterm stability.</h2>
          </div>

          {/* 5. PATIENT JOURNEY (Directly after 360° Rotation) */}
          <div
            ref={lJRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const imgs = ["9", "10", "11", "3", "17", "14"];
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      if (el) jCardsRef.current[i] = el;
                    }}
                    className="absolute inset-0 bg-[#F6F2EC]"
                    style={{ clipPath: "circle(0% at 50% 45%)" }}
                  >
                    <img
                      src={`/img/${imgs[i]}.webp`}
                      alt={`Journey step ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              })}

              {/* Journey overlay timeline card */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#F6F2EC]/92 backdrop-blur-md border border-[#B8955A]/40 px-6 py-4 rounded-xl shadow-lg w-[90%] max-w-lg text-center">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#7A5E2E] tracking-wider uppercase">
                  <span>Step-by-Step Care</span>
                  <span>Unhurried & Transparent</span>
                </div>
                <div className="relative w-full h-1 bg-black/10 rounded-full mb-3 overflow-hidden">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      ref={jpathRef}
                      d="M0 2H500"
                      stroke="#B8955A"
                      strokeWidth="4"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset="1"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-[#4a3c2d]">
                  {["01 Consult", "02 3D Scan", "03 Placement", "04 Healing", "05 Final Smile"].map(
                    (step, idx) => (
                      <span
                        key={step}
                        ref={(el) => {
                          if (el) jDotsRef.current[idx] = el;
                        }}
                        className="px-2 py-0.5 rounded transition-colors"
                      >
                        {step}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 6. COMPUTER-GUIDED SURGERY (3D JAW MODEL WITH DYNAMIC MOVING TRANSITION!) */}
          <div
            ref={lPlanRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video flex items-center justify-center">
              {/* Dynamic 3D Moving Container */}
              <div
                ref={jawContainerRef}
                className="relative w-full h-full will-change-transform flex items-center justify-center"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  ref={jawImgRef}
                  src="/img/8.webp"
                  alt="Digital 3D implant planning jaw model"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(217,184,120,0.15)]"
                />

                {/* Moving Holographic Medical Laser Scan Line */}
                <div
                  ref={scanLineRef}
                  className="absolute left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#D9B878] to-transparent shadow-[0_0_15px_#D9B878] pointer-events-none opacity-0"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-[#D9B878]/30 blur-sm" />
                </div>

                {/* Scanner Target Radial Spot */}
                <div
                  ref={spotRef}
                  className="absolute inset-0 pointer-events-none transition-all"
                  style={{
                    background:
                      "radial-gradient(circle var(--sr, 24%) at var(--sx, 49%) var(--sy, 60.5%), transparent 20%, rgba(26,20,14,0.7) 80%)",
                  }}
                />

                {/* Animated HUD Vectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    ref={cn1Ref}
                    d="M490 340 L490 440 L300 440"
                    stroke="#D9B878"
                    strokeWidth="2"
                    fill="none"
                    pathLength="1"
                    strokeDasharray="1"
                  />
                  <path
                    ref={cn2Ref}
                    d="M585 200 L585 110 L740 110"
                    stroke="#D9B878"
                    strokeWidth="2"
                    fill="none"
                    pathLength="1"
                    strokeDasharray="1"
                  />
                </svg>

                {/* Floating HUD Callouts */}
                <div
                  ref={pl1Ref}
                  className="absolute left-[14%] top-[72%] text-xs font-semibold text-[#D9B878] tracking-widest uppercase bg-black/75 px-3 py-1.5 rounded-lg border border-[#D9B878]/40 shadow-lg"
                >
                  Guided Surgical Stent Planning
                </div>
                <div
                  ref={pl2Ref}
                  className="absolute left-[70%] top-[16%] text-xs font-semibold text-[#D9B878] tracking-widest uppercase bg-black/75 px-3 py-1.5 rounded-lg border border-[#D9B878]/40 shadow-lg"
                >
                  Volumetric Bone Density Assessment
                </div>
              </div>
            </div>
          </div>

          <div
            ref={t7Ref}
            className="absolute top-16 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none text-[#F3E9D6]"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#D9B878] font-semibold mb-2">
              Computer-Guided Surgery
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl mb-3">See it before it happens.</h2>
            <p className="text-sm text-[#D8CDBA] leading-relaxed">
              Sub-millimeter accuracy using CBCT digital diagnostics eliminates guesswork and ensures rapid, painless recovery.
            </p>
          </div>

          {/* 7. SMILE ARCH */}
          <div
            ref={lArchRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              <img src="/img/14.webp" alt="Natural smile arc" className="w-full h-full object-contain" />
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 2576 1438"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  ref={archPathRef}
                  d="M330 640 C 520 740 700 800 900 800 S 1140 822 1288 822 S 1660 800 1880 800 C 2060 800 2150 730 2250 640"
                  stroke="#B8955A"
                  strokeWidth="6"
                  fill="none"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              </svg>
              <div
                ref={bloomRef}
                className="absolute inset-0 bg-radial from-[#B8955A]/40 to-transparent blur-3xl opacity-0"
              />
            </div>
          </div>

          <div
            ref={t8Ref}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-30 max-w-lg opacity-0 pointer-events-none bg-[#F6F2EC]/85 px-6 py-4 rounded-xl border border-[#B8955A]/30 backdrop-blur-sm"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Aesthetic Architecture
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118]">Drawn, not stamped.</h2>
            <p className="text-sm text-[#4a3c2d] mt-2">
              Every curve honors your natural facial symmetry, speech dynamics, and lip support.
            </p>
          </div>

          {/* 8. SEAL STAMP */}
          <div
            ref={lSealRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video flex items-center justify-center">
              <div
                ref={ringRef}
                className="absolute w-64 h-64 rounded-full border border-[#B8955A] opacity-0"
              />
              <img
                ref={sealRef}
                src="/img/clinic-logo-dark.png"
                alt="The Aesthetic Villa Official Mark"
                className="w-56 sm:w-80 h-auto object-contain relative z-10 drop-shadow-md"
              />
            </div>
          </div>

          <div
            ref={t9Ref}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center z-30 max-w-lg opacity-0 pointer-events-none"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Our Clinical Mark
            </p>
            <p className="text-sm text-[#4a3c2d] mt-1">Pune's Premier Dental & Skin Retreat</p>
          </div>

          {/* 9. RETREAT / CALM */}
          <div
            ref={lWellRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="relative w-full max-w-[177.78vh] aspect-video">
              <img
                src="/img/17.webp"
                alt="Armchair with tea by sunny garden window"
                className="w-full h-full object-contain"
              />
              <div
                ref={shaftsRef}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#E8DCC6]/30 to-[#B8955A]/20 pointer-events-none"
              />
            </div>
          </div>

          <div
            ref={t10Ref}
            className="absolute bottom-16 left-6 sm:left-16 z-30 max-w-lg opacity-0 pointer-events-none bg-[#F6F2EC]/85 p-6 rounded-xl border border-[#B8955A]/30 backdrop-blur"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-1">
              Private Villa Retreat
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2118]">Less clinic. More calm.</h2>
          </div>

          {/* 10. CLOSE & TRANSITION CTA ("Your visit, unhurried.") */}
          <div
            ref={lCloseRef}
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            <div
              ref={bloomfullRef}
              className="absolute w-[180vw] h-[180vh] rounded-full bg-radial from-[#F6F2EC] via-[#E8DCC6] to-[#F6F2EC]"
            />
          </div>

          <div
            ref={t11Ref}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center z-30 max-w-xl opacity-0"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#7A5E2E] font-semibold mb-2">
              Begin Your Journey
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#2B2118] font-normal mb-6">
              Your visit, unhurried.
            </h2>
            <a
              href="#book"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2B2118] hover:bg-[#7A5E2E] text-white text-base font-medium tracking-wide shadow-xl transition-all duration-300 hover:scale-105"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
