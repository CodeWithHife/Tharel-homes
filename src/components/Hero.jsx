"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Home,
  Building,
  Building2,
  Key,
  MapPin,
  Hotel,
  Warehouse,
  Store,
  DoorOpen,
  Handshake,
  FileText,
  Compass,
  ShieldCheck,
  Landmark,
  Tag,
  Briefcase,
  Layers,
  Sparkles,
  Map,
  Boxes,
  Globe,
  Castle,
  Bed,
  Sofa,
  Bath,
} from "lucide-react";

const stats = [
  { value: 200, suffix: "+", label: "Properties Listed" },
  { value: 1500, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
];

const audiences = [
  {
    role: "buyer",
    label: "Buyers",
    sub: "Find your next home",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-3v-6h-9v6h-3A1.5 1.5 0 0 1 3 19.5z" />
      </svg>
    ),
  },
  {
    role: "realtor",
    label: "Realtors",
    sub: "List & manage properties",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    role: "hotel",
    label: "Hotel Operators",
    sub: "Manage bookings",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9" />
        <path d="M13 18v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
        <path d="M3 18h18" />
        <circle cx="6" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function StatItem({ value, suffix, label }) {
  const numRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const initCounter = () => {
      if (typeof window === "undefined" || !window.gsap) return;
      const gsap = window.gsap;

      if (reducedMotion) {
        if (numRef.current) numRef.current.innerText = value;
        return;
      }

      const obj = { val: 0 };
      gsap.fromTo(
        obj,
        { val: 0 },
        {
          val: value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: numRef.current,
            start: "top 95%",
            once: true,
          },
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.innerText = Math.floor(obj.val);
            }
          },
        }
      );
    };

    const timer = setTimeout(initCounter, 100);
    return () => clearTimeout(timer);
  }, [value, reducedMotion]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span
        style={{
          color: "#1A1C23",
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 800,
          lineHeight: 1,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "-0.02em",
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span ref={numRef}>0</span>
        {suffix}
      </span>
      <span
        style={{
          color: "#6B7280",
          fontSize: "clamp(9px, 1.5vw, 11px)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: "6px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ctx = null;

    const startAnimations = () => {
      if (typeof window === "undefined" || !window.gsap) {
        setTimeout(startAnimations, 100);
        return;
      }
      const gsap = window.gsap;

      ctx = gsap.context(() => {
        if (reducedMotion) return;

        // Entrance Timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-content .badge", { duration: 0.6, opacity: 0, y: 20 })
          .from(".hero-content h1", { duration: 0.9, opacity: 0, y: 50, scale: 0.98 }, "-=0.3")
          .from(".hero-content .h-subcopy", { duration: 0.7, opacity: 0, y: 30 }, "-=0.4")
          .from(".hero-content .h-audience-wrapper", { duration: 0.7, opacity: 0, y: 30 }, "-=0.4")
          .from(".hero-content .h-buttons-row", { duration: 0.7, opacity: 0, y: 30 }, "-=0.3")
          .from(".hero-content .h-stats-card", { duration: 0.8, opacity: 0, y: 40, scale: 0.96 }, "-=0.4")
          .from(
            ".artwork-icons .icon-float",
            {
              duration: 1.2,
              opacity: 0,
              scale: 0.2,
              stagger: 0.05,
              ease: "back.out(2)",
            },
            "-=0.6"
          );

        // Continuous Silk Background Flow
        gsap.to(".silk-blob-1", {
          duration: 25,
          x: "+=200",
          y: "+=100",
          scale: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".silk-blob-2", {
          duration: 30,
          x: "-=250",
          y: "+=150",
          scale: 1.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".silk-blob-3", {
          duration: 20,
          x: "+=150",
          y: "-=100",
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".silk-blob-4", {
          duration: 22,
          x: "-=180",
          y: "-=120",
          scale: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".silk-blob-5", {
          duration: 28,
          x: "+=120",
          y: "+=80",
          scale: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Icons Floating Animation - Dynamic & Vibrant
        const icons = document.querySelectorAll(".artwork-icons .icon-float");
        icons.forEach((icon, i) => {
          const delay = i * 0.08;
          const duration = 4.5 + (i % 5) * 1.2;
          const yOffset = -25 - (i % 6) * 10;
          const xOffset = 20 + (i % 5) * 8;

          gsap.to(icon, {
            duration: duration,
            y: yOffset,
            x: i % 2 === 0 ? xOffset : -xOffset,
            scale: 1 + (i % 4) * 0.08,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + 0.2,
          });
        });

        // Gentle Rotations
        gsap.to(".icon-1, .icon-5, .icon-10, .icon-15, .icon-21", {
          duration: 8,
          rotation: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });

        gsap.to(".icon-3, .icon-7, .icon-12, .icon-18, .icon-22", {
          duration: 6,
          rotation: -15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.8,
        });

        gsap.to(".icon-11, .icon-17, .icon-20", {
          duration: 9,
          rotation: 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        });
      });
    };

    startAnimations();

    // Parallax Effect on Mouse Move
    const handleMouseMove = (e) => {
      if (typeof window === "undefined" || !window.gsap) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;

      window.gsap.to(".artwork-icons .icon-float", {
        duration: 1.8,
        x: (i, el) => {
          const speed = parseFloat(el.dataset.speed) || 1.2 + (i % 4) * 0.2;
          return x * 0.6 * speed;
        },
        y: (i, el) => {
          const speed = parseFloat(el.dataset.speed) || 1.2 + (i % 4) * 0.2;
          return y * 0.6 * speed;
        },
        ease: "power2.out",
        stagger: 0.02,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion]);

  return (
    <>
      <style jsx global>{`
        :root {
          --gold: #D4AF37;
          --gold-light: #E8D5A3;
          --gold-soft: rgba(212, 175, 55, 0.15);
          --dark: #1A1C23;
          --gray: #6B7280;
          --white: #FFFFFF;
          --off-white: #FCFAF5;
          --blush: #F0E3D9;
          --sage: #D6D8C9;
        }

        .hero-silk {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 140px 0 90px;
          position: relative;
          overflow: hidden;
          background: var(--off-white);
        }

        /* ===== SILK BACKGROUND ===== */
        .silk-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .silk-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          mix-blend-mode: soft-light;
          opacity: 0.6;
        }

        .silk-blob-1 {
          width: 700px;
          height: 700px;
          background: var(--gold);
          top: -15%;
          left: -10%;
          opacity: 0.20;
        }

        .silk-blob-2 {
          width: 900px;
          height: 900px;
          background: var(--blush);
          bottom: -20%;
          right: -10%;
          opacity: 0.25;
        }

        .silk-blob-3 {
          width: 650px;
          height: 650px;
          background: var(--sage);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.20;
        }

        .silk-blob-4 {
          width: 550px;
          height: 550px;
          background: var(--gold-light);
          top: 10%;
          right: 20%;
          opacity: 0.25;
        }

        .silk-blob-5 {
          width: 450px;
          height: 450px;
          background: var(--dark);
          bottom: 10%;
          left: 20%;
          opacity: 0.08;
        }

        .silk-noise {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.45;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* ===== ARTWORK ICONS (LUCIDE REACT VECTOR SVGs) ===== */
        .artwork-icons {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .artwork-icons .icon-float {
          position: absolute;
          will-change: transform;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.35;
        }

        .artwork-icons .icon-float.gold {
          color: #D4AF37;
          filter: drop-shadow(0 3px 10px rgba(212, 175, 55, 0.22)) blur(0.3px);
        }

        .artwork-icons .icon-float.dark {
          color: #1A1C23;
          filter: drop-shadow(0 3px 10px rgba(26, 28, 35, 0.16)) blur(0.3px);
        }

        .artwork-icons .icon-float.gold-light {
          color: #E8D5A3;
          filter: drop-shadow(0 3px 10px rgba(212, 175, 55, 0.18)) blur(0.3px);
        }

        /* Sizes - refined, smaller & softer */
        .artwork-icons .icon-float.sm svg { width: 18px; height: 18px; stroke-width: 1.5; }
        .artwork-icons .icon-float.md svg { width: 26px; height: 26px; stroke-width: 1.5; }
        .artwork-icons .icon-float.lg svg { width: 36px; height: 36px; stroke-width: 1.5; }
        .artwork-icons .icon-float.xl svg { width: 48px; height: 48px; stroke-width: 1.5; }

        /* Icon positions across the screen */
        .icon-1 { top: 6%; left: 5%; }
        .icon-2 { top: 10%; right: 8%; }
        .icon-3 { top: 32%; left: 3%; }
        .icon-4 { top: 52%; right: 4%; }
        .icon-5 { bottom: 18%; left: 6%; }
        .icon-6 { bottom: 8%; right: 10%; }
        .icon-7 { top: 22%; right: 25%; }
        .icon-8 { top: 62%; left: 16%; }
        .icon-9 { bottom: 30%; right: 30%; }
        .icon-10 { top: 8%; left: 42%; }
        .icon-11 { top: 42%; left: 58%; }
        .icon-12 { bottom: 40%; left: 4%; }
        .icon-13 { top: 72%; right: 7%; }
        .icon-14 { top: 4%; right: 38%; }
        .icon-15 { bottom: 12%; left: 32%; }
        .icon-16 { top: 48%; left: 10%; }
        .icon-17 { top: 28%; right: 16%; }
        .icon-18 { bottom: 55%; right: 3%; }
        .icon-19 { top: 68%; left: 42%; }
        .icon-20 { top: 16%; left: 20%; }
        .icon-21 { top: 82%; left: 22%; }
        .icon-22 { top: 85%; right: 25%; }

        /* ===== CENTERED HERO CONTENT ===== */
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-content .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 24px;
          border-radius: 50px;
          color: var(--dark);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 26px;
          box-shadow: 0 6px 24px rgba(212, 175, 55, 0.12);
        }

        .h-eyebrow-dot-wrap {
          position: relative;
          width: 9px;
          height: 9px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .h-eyebrow-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 12px var(--gold);
        }

        .hero-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 6vw, 4.8rem);
          font-weight: 800;
          line-height: 1.12;
          margin-bottom: 22px;
          letter-spacing: -0.5px;
          color: var(--dark);
        }

        .hero-content h1 .highlight {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          background: linear-gradient(145deg, var(--gold), #b8962a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-content .h-subcopy {
          font-size: 1.15rem;
          color: var(--gray);
          max-width: 650px;
          margin: 0 auto 36px;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0.2px;
        }

        /* ===== AUDIENCE STRIP ===== */
        .h-audience-wrapper {
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .h-audience-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gray);
          margin-bottom: 14px;
        }
        .h-audience-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .h-audience-chip {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .h-audience-chip:hover {
          border-color: var(--gold);
          background: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.25);
        }
        .h-audience-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--gold-soft);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .h-audience-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          text-align: left;
        }
        .h-audience-role {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--dark);
        }
        .h-audience-sub {
          font-size: 10.5px;
          color: var(--gray);
          font-weight: 500;
        }

        /* ===== BUTTONS ROW ===== */
        .h-buttons-row {
          display: flex;
          gap: 18px;
          margin-bottom: 44px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .h-btn-primary,
        .h-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 38px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.35s ease;
        }
        .h-btn-primary {
          background: linear-gradient(145deg, var(--gold), #b8962a);
          color: var(--white);
          border: 2px solid transparent;
          box-shadow: 0 8px 28px rgba(212, 175, 55, 0.30);
        }
        .h-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.45);
          color: var(--white);
        }
        .h-btn-secondary {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          color: var(--dark);
          border: 2px solid rgba(26, 28, 35, 0.18);
        }
        .h-btn-secondary:hover {
          border-color: var(--gold);
          color: var(--gold);
          transform: translateY(-3px);
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.20);
        }

        /* ===== STATS CARD ===== */
        .h-stats-card {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.90);
          box-shadow: 0 16px 50px rgba(26, 28, 35, 0.06);
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .silk-blob-1 { width: 550px; height: 550px; }
          .silk-blob-2 { width: 650px; height: 650px; }
        }

        @media (max-width: 768px) {
          .hero-silk {
            padding: 120px 0 70px;
          }
          .h-stats-card {
            flex-direction: column;
            gap: 20px;
            padding: 24px 20px;
          }
          .artwork-icons .icon-float.lg svg { width: 26px; height: 26px; }
          .artwork-icons .icon-float.xl svg { width: 34px; height: 34px; }
          .silk-blob-1 { width: 350px; height: 350px; filter: blur(60px); }
          .silk-blob-2 { width: 450px; height: 450px; filter: blur(60px); }
          .silk-blob-3 { width: 350px; height: 350px; filter: blur(60px); }
          .silk-blob-4 { width: 300px; height: 300px; filter: blur(60px); }
        }

        @media (max-width: 480px) {
          .hero-content .badge {
            font-size: 0.68rem;
            padding: 6px 18px;
          }
        }
      `}</style>

      <section className="hero-silk" id="hero">
        {/* SILK BACKGROUND */}
        <div className="silk-container">
          <div className="silk-blob silk-blob-1"></div>
          <div className="silk-blob silk-blob-2"></div>
          <div className="silk-blob silk-blob-3"></div>
          <div className="silk-blob silk-blob-4"></div>
          <div className="silk-blob silk-blob-5"></div>
          <div className="silk-noise"></div>
        </div>

        {/* 100% RELIABLE LUCIDE REACT REAL ESTATE VECTOR ICONS */}
        <div className="artwork-icons">
          {/* Homes & Residential */}
          <div className="icon-float icon-1 gold xl"><Home /></div>
          <div className="icon-float icon-2 dark lg"><Building2 /></div>
          <div className="icon-float icon-3 gold-light lg"><Landmark /></div>

          {/* Buildings & Highrises */}
          <div className="icon-float icon-4 dark xl"><Building /></div>
          <div className="icon-float icon-5 gold xl"><Castle /></div>
          <div className="icon-float icon-6 dark lg"><Warehouse /></div>

          {/* Keys & Access */}
          <div className="icon-float icon-7 gold lg"><Key /></div>
          <div className="icon-float icon-8 dark xl"><DoorOpen /></div>
          <div className="icon-float icon-9 gold-light md"><Key /></div>

          {/* Deals & Contracts */}
          <div className="icon-float icon-10 dark xl"><Handshake /></div>
          <div className="icon-float icon-11 gold xl"><FileText /></div>

          {/* Locations & Maps */}
          <div className="icon-float icon-12 gold lg"><MapPin /></div>
          <div className="icon-float icon-13 dark xl"><Compass /></div>
          <div className="icon-float icon-14 gold-light md"><MapPin /></div>

          {/* Hospitality & Interiors */}
          <div className="icon-float icon-15 dark xl"><Hotel /></div>
          <div className="icon-float icon-16 gold lg"><Bed /></div>
          <div className="icon-float icon-17 dark xl"><Sofa /></div>
          <div className="icon-float icon-18 gold xl"><Bath /></div>

          {/* Commercial & Property Assets */}
          <div className="icon-float icon-19 dark lg"><Store /></div>
          <div className="icon-float icon-20 gold lg"><ShieldCheck /></div>
          <div className="icon-float icon-21 dark xl"><Tag /></div>
          <div className="icon-float icon-22 gold xl"><Layers /></div>
        </div>

        {/* CENTERED HERO CONTENT */}
        <div className="container">
          <div className="hero-content">
            {/* EYEBROW BADGE */}
            <div className="badge">
              <span className="h-eyebrow-dot-wrap">
                <span className="h-eyebrow-dot"></span>
              </span>
              The 10th Homes & Apartments
            </div>

            {/* HEADLINE */}
            <h1>
              Enhancing Your <br />
              <span className="highlight">Living Experience</span>
            </h1>

            {/* SUBCOPY */}
            <p className="h-subcopy">
              Nigeria&apos;s premier real estate platform connecting discerning buyers, top realtors, and luxury hospitality spaces seamlessly.
            </p>

            {/* AUDIENCE CHIPS */}
            <div className="h-audience-wrapper">
              <span className="h-audience-label">One platform, three ways in</span>
              <div className="h-audience-row">
                {audiences.map((a) => (
                  <Link key={a.role} href={`/signup?role=${a.role}`} className="h-audience-chip">
                    <span className="h-audience-icon">{a.icon}</span>
                    <span className="h-audience-text">
                      <span className="h-audience-role">{a.label}</span>
                      <span className="h-audience-sub">{a.sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="h-buttons-row">
              <Link href="/about" className="h-btn-primary">
                Explore Properties
              </Link>
              <Link href="/contact" className="h-btn-secondary">
                Contact Us
              </Link>
            </div>

            {/* STATS CARD */}
            <div className="h-stats-card">
              {stats.map((stat, i) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                  <StatItem {...stat} />
                  {i < stats.length - 1 && isDesktop && (
                    <div
                      style={{
                        width: "1px",
                        height: "44px",
                        background: "rgba(26, 28, 35, 0.12)",
                        margin: "0 28px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}