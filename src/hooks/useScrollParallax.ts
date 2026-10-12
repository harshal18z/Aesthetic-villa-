import { useState, useEffect } from "react";

export function useScrollParallax(sectionRef?: React.RefObject<HTMLElement | null>) {
  const [relScroll, setRelScroll] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      // Completely disable parallax on mobile/tablet (< 1024px) to keep content static and clean
      if (typeof window === "undefined" || window.innerWidth < 1024) {
        setRelScroll(0);
        return;
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef && sectionRef.current) {
            setRelScroll(window.scrollY - sectionRef.current.offsetTop);
          } else {
            setRelScroll(window.scrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return relScroll;
}
