"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function SmoothScroll({ children }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lenisInstance = null;
    let animationFrameId = null;

    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.8,
        });

        // Synchronize GSAP ScrollTrigger with Lenis if GSAP is present
        if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
          lenisInstance.on("scroll", window.ScrollTrigger.update);
          window.gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        } else {
          function raf(time) {
            lenisInstance?.raf(time);
            animationFrameId = requestAnimationFrame(raf);
          }
          animationFrameId = requestAnimationFrame(raf);
        }
      } catch (err) {
        console.warn("Lenis smooth scroll fallback to native browser scroll:", err);
      }
    };

    initLenis();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
