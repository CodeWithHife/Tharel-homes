"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stats = [
  { value: 200, suffix: "+", label: "Properties Listed" },
  { value: 1500, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
];

function StatItem({ value, suffix, label }) {
  const numRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gsap) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        if (numRef.current) numRef.current.innerText = value;
        return;
      }

      const obj = { val: 0 };
      gsap.fromTo(obj,
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
    });

    return () => ctx.revert();
  }, [value, reducedMotion]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span
        style={{
          color: "#0F172A",
          fontSize: "clamp(22px, 4vw, 28px)",
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: "var(--font-montserrat), sans-serif",
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
          color: "#94a3b8",
          fontSize: "clamp(9px, 1.5vw, 10px)",
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

const heroImages = [
  {
    src: "/images/hero/hero.png",
    alt: "Premium property",
    isLocal: true,
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    alt: "Luxury modern home with pool",
    isLocal: false,
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    alt: "Contemporary glass house",
    isLocal: false,
  },
];

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subcopyRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapRef = useRef(null);
  const searchRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.gsap) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([eyebrowRef.current, headlineRef.current, subcopyRef.current, buttonsRef.current, statsRef.current, searchRef.current], { opacity: 1, y: 0 });
        gsap.set(imageWrapRef.current, { opacity: 1 });
        gsap.set(imageRef.current, { scale: 1, y: 0 });
        return;
      }

      // Page load animations for text column
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.1);
      tl.fromTo(headlineRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.18);
      tl.fromTo(subcopyRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.26);
      tl.fromTo(buttonsRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.34);
      tl.fromTo(statsRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.42);
      tl.fromTo(searchRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.5);

      // Hero image load animations
      gsap.fromTo(imageWrapRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
      gsap.fromTo(imageRef.current, { scale: 1.05 }, { scale: 1, duration: 1.2, ease: "power3.out" });

      // Parallax scroll effect
      const isMobile = window.innerWidth < 768;
      if (!isMobile && window.ScrollTrigger) {
        gsap.to(imageRef.current, {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const currentImage = heroImages[currentImageIndex];

  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.02); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes imageFade {
          0% { opacity: 0.5; transform: scale(1.02); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.5; transform: scale(1.02); }
        }

        .h-anim-1 { opacity: 0; }
        .h-anim-2 { opacity: 0; }
        .h-anim-3 { opacity: 0; }
        .h-anim-4 { opacity: 0; }
        .h-anim-5 { opacity: 0; }
        .h-anim-6 { opacity: 0; }
        .h-anim-img { opacity: 0; }

        .h-float {
          animation: floatY 6s ease-in-out infinite;
        }

        .h-image-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(15,23,42,0.12);
          transition: box-shadow 0.5s ease;
          aspect-ratio: 4/3;
          width: 100%;
          background: #E2E8F0;
        }

        .h-image-wrap:hover {
          box-shadow: 0 30px 80px rgba(15,23,42,0.18);
        }

        .h-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
          animation: imageFade 4s ease-in-out infinite;
        }

        .h-image-wrap:hover img {
          transform: scale(1.03);
        }

        .h-btn-primary, .h-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 34px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.35s ease;
          width: auto;
        }

        .h-btn-primary {
          background: #0F172A;
          color: #ffffff;
          box-shadow: 0 8px 28px rgba(15,23,42,0.25);
          border: 2px solid #0F172A;
        }
        .h-btn-primary:hover {
          background: #D4AF37;
          color: #0F172A;
          border-color: #D4AF37;
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(212,175,55,0.3);
        }

        .h-btn-secondary {
          background: transparent;
          color: #0F172A;
          border: 2px solid rgba(15,23,42,0.2);
        }
        .h-btn-secondary:hover {
          border-color: #D4AF37;
          color: #D4AF37;
          transform: translateY(-3px);
        }

        /* ── Floating search card ── */
        .h-search-outer { position: relative; z-index: 3; width: 100%; animation: floatCard 7s ease-in-out infinite; }
        .h-search-card {
          display: flex;
          align-items: stretch;
          background: #f9f5ee;
          border: 1px solid rgba(15,23,42,0.06);
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(15,23,42,0.1);
          padding: 12px 16px;
          gap: 8px;
        }
        .h-search-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex: 1;
          padding: 10px 16px;
          min-width: 0;
        }
        .h-search-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .h-search-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        .h-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 600;
          color: #0F172A;
          font-family: var(--font-inter), sans-serif;
          padding: 0;
          width: 100%;
        }
        .h-search-input::placeholder { color: #94a3b8; font-weight: 400; }
        .h-search-icon { flex-shrink: 0; color: #94a3b8; }
        .h-search-divider { width: 1px; background: rgba(15,23,42,0.1); margin: 8px 0; flex-shrink: 0; }
        .h-search-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13.5px;
          border: none;
          cursor: pointer;
          background: #0F172A;
          color: #ffffff;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .h-search-btn:hover { background: #D4AF37; color: #0F172A; }

        /* ── Mobile overrides ── */
        @media (max-width: 1024px) {
          .h-image-wrap {
            aspect-ratio: 16/10;
          }
        }

        @media (max-width: 900px) {
          .h-search-card { flex-direction: column; border-radius: 16px; padding: 16px; gap: 4px; }
          .h-search-field { padding: 10px 4px; }
          .h-search-divider { width: 100%; height: 1px; margin: 0; }
          .h-search-btn { width: 100%; padding: 14px; border-radius: 10px; margin-top: 8px; }
          .h-search-outer { animation: none; }
        }

        @media (max-width: 768px) {
          .h-image-wrap {
            aspect-ratio: 16/12;
          }
          .h-btn-primary, .h-btn-secondary {
            width: 100% !important;
            font-size: 13px !important;
            padding: 14px 20px !important;
          }
          .h-anim-4 {
            width: 100% !important;
            flex-direction: column !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .h-anim-2 {
            font-size: 32px !important;
          }
          .h-anim-3 {
            font-size: 14px !important;
            max-width: 100% !important;
          }
          .h-anim-1 {
            font-size: 10px !important;
          }
          .h-anim-1 span {
            width: 24px !important;
          }
          .h-image-wrap {
            aspect-ratio: 16/10;
          }
          .h-float {
            animation: none;
          }
        }

        @media (max-width: 380px) {
          .h-anim-2 {
            font-size: 28px !important;
          }
          .h-btn-primary, .h-btn-secondary {
            font-size: 12px !important;
            padding: 12px 16px !important;
          }
        }
      `}</style>


      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
          background: "linear-gradient(125deg, #f5efe6 0%, #ede8de 28%, #dce5f3 62%, #cdd5ec 100%)",
          fontFamily: "var(--font-inter), sans-serif",
          paddingTop: "100px", // space for navbar
        }}
      >
        {/* Decorative blobs – hidden on small screens for performance */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 68%)",
            borderRadius: "50%",
            pointerEvents: "none",
            display: isDesktop ? "block" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(15,23,42,0.05) 0%, transparent 68%)",
            borderRadius: "50%",
            pointerEvents: "none",
            display: isDesktop ? "block" : "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: isDesktop ? "0 64px" : "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: "center",
              minHeight: isDesktop ? "calc(100vh - 280px)" : "auto",
              gap: isDesktop ? "60px" : "30px",
              paddingTop: isDesktop ? "10px" : "20px",
              paddingBottom: isDesktop ? "0" : "20px",
            }}
          >
            {/* LEFT COLUMN */}
            <div
              style={{
                width: isDesktop ? "48%" : "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "0",
              }}
            >
              <div ref={eyebrowRef} className="h-anim-1" style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "2px",
                      background: "#D4AF37",
                      borderRadius: "999px",
                      flexShrink: 0,
                    }}
                  />
                  Lifetime Realty Partner
                </span>
              </div>

              <h1
                ref={headlineRef}
                className="h-anim-2"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.06,
                  marginBottom: "16px",
                  fontSize: isDesktop ? "clamp(44px, 4vw, 66px)" : "clamp(36px, 6vw, 44px)",
                  letterSpacing: "-0.025em",
                }}
              >
                Enhancing Your<br />
                <span style={{ color: "#0F172A" }}>Living Experience</span>
              </h1>

              <p
                ref={subcopyRef}
                className="h-anim-3"
                style={{
                  color: "#64748b",
                  fontSize: isDesktop ? "15.5px" : "clamp(14px, 2.5vw, 15px)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                  maxWidth: isDesktop ? "420px" : "100%",
                }}
              >
                Discover premium homes, apartments, and investment opportunities in
                carefully selected locations. We help families and investors find
                properties that combine comfort, security, and lasting value.
              </p>

              <div
                ref={buttonsRef}
                className="h-anim-4"
                style={{
                  display: "flex",
                  flexDirection: isDesktop ? "row" : "column",
                  gap: "14px",
                  width: isDesktop ? "auto" : "100%",
                  marginBottom: isDesktop ? "52px" : "32px",
                }}
              >
                <Link href="/properties" className="h-btn-primary">
                  Explore Properties
                </Link>
                <Link href="/contact" className="h-btn-secondary">
                  Contact Us
                </Link>
              </div>

              {/* ─── STATS ─── */}
              <div ref={statsRef} className="h-anim-5" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: isDesktop ? "24px 32px" : "18px 16px",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(18px)",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 32px rgba(15,23,42,0.07)",
                    gap: isDesktop ? "0" : "16px",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: isDesktop ? "row" : "column",
                        width: isDesktop ? "auto" : "100%",
                        justifyContent: "center",
                      }}
                    >
                      <StatItem {...stat} />
                      {i < stats.length - 1 && (
                        <div
                          style={{
                            width: isDesktop ? "1px" : "80%",
                            height: isDesktop ? "48px" : "1px",
                            background: "rgba(15,23,42,0.1)",
                            margin: isDesktop ? "0 28px" : "12px 0",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – SLIDESHOW */}
            <div
              ref={imageWrapRef}
              className="h-anim-img"
              style={{
                width: isDesktop ? "48%" : "100%",
                maxWidth: isDesktop ? "none" : "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: isDesktop ? "flex-end" : "center",
                margin: isDesktop ? "0" : "0 auto",
              }}
            >
              <div
                className="h-float"
                style={{
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "5%",
                    background: "radial-gradient(ellipse, rgba(212,175,55,0.10) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    borderRadius: "50%",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                <div className="h-image-wrap" style={{ overflow: "hidden" }}>
                  <div ref={imageRef} style={{ width: "100%", height: "110%", position: "relative", top: "-10px" }}>
                    {currentImage.isLocal ? (
                      <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        width={800}
                        height={600}
                        priority
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
                        }}
                      />
                    ) : (
                      <img
                        key={currentImageIndex}
                        src={currentImage.src}
                        alt={currentImage.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── FLOATING SEARCH BAR ─── */}
          <div ref={searchRef} className="h-anim-6 h-search-outer">
            <div className="h-search-card">
              <div className="h-search-field">
                <div className="h-search-text">
                  <span className="h-search-label">Location</span>
                  <input type="text" className="h-search-input" placeholder="Enter a city or area" />
                </div>
                <svg className="h-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div className="h-search-divider" />
              <div className="h-search-field">
                <div className="h-search-text">
                  <span className="h-search-label">Type</span>
                  <input type="text" className="h-search-input" placeholder="e.g. Apartment, Duplex" />
                </div>
                <svg className="h-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 11.5 12 4l9 7.5" />
                  <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
                </svg>
              </div>
              <div className="h-search-divider" />
              <div className="h-search-field">
                <div className="h-search-text">
                  <span className="h-search-label">Price Range</span>
                  <input type="text" className="h-search-input" placeholder="Any price" />
                </div>
                <svg className="h-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <button type="button" className="h-search-btn">Search</button>
            </div>
          </div>

        </div>

        <div style={{ height: isDesktop ? "60px" : "40px" }} />
      </section>
    </>
  );
}
