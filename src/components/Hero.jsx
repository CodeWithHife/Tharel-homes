"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: 200, suffix: "+", label: "Properties Listed" },
  { value: 1500, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, animate }) {
  const count = useCountUp(value, 2000, animate);
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
        }}
      >
        {count}
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
  const [visible, setVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const statsRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const currentImage = heroImages[currentImageIndex];

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.02); }
        }
        @keyframes imageFade {
          0% { opacity: 0.5; transform: scale(1.02); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.5; transform: scale(1.02); }
        }

        .h-anim-1 { opacity: 0; animation: ${visible ? "fadeSlideUp 0.8s ease 0.1s forwards" : "none"}; }
        .h-anim-2 { opacity: 0; animation: ${visible ? "fadeSlideUp 0.8s ease 0.25s forwards" : "none"}; }
        .h-anim-3 { opacity: 0; animation: ${visible ? "fadeSlideUp 0.8s ease 0.4s forwards" : "none"}; }
        .h-anim-4 { opacity: 0; animation: ${visible ? "fadeSlideUp 0.8s ease 0.55s forwards" : "none"}; }
        .h-anim-5 { opacity: 0; animation: ${visible ? "fadeSlideUp 0.8s ease 0.7s forwards" : "none"}; }
        .h-anim-img { opacity: 0; animation: ${visible ? "fadeSlideRight 1s ease 0.35s forwards" : "none"}; }

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

        /* ── Mobile overrides ── */
        @media (max-width: 1024px) {
          .h-image-wrap {
            aspect-ratio: 16/10;
          }
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

        <div style={{ height: "80px" }} />

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
              minHeight: "calc(100vh - 80px)",
              gap: isDesktop ? "60px" : "30px",
              paddingTop: isDesktop ? "0" : "20px",
              paddingBottom: isDesktop ? "0" : "40px",
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
              <div className="h-anim-1" style={{ marginBottom: "20px" }}>
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
                      <StatItem {...stat} animate={statsVisible} />
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

                <div className="h-image-wrap">
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
      </section>
    </>
  );
}
;