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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          color: "#0F172A",
          fontSize: "28px",
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: "var(--font-montserrat), sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {count}
        {suffix}
      </span>
      <span
        style={{
          color: "#94a3b8",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: "7px",
          fontWeight: 600,
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

        .h-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #0F172A;
          color: #ffffff;
          padding: 15px 34px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 28px rgba(15,23,42,0.25);
          transition: all 0.35s ease;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: #0F172A;
          padding: 15px 34px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          border: 2px solid rgba(15,23,42,0.2);
          transition: all 0.35s ease;
        }
        .h-btn-secondary:hover {
          border-color: #D4AF37;
          color: #D4AF37;
          transform: translateY(-3px);
        }

        @media (max-width: 1024px) {
          .h-image-wrap {
            aspect-ratio: 16/10;
            max-width: 100%;
          }
        }
        @media (max-width: 768px) {
          .h-image-wrap {
            aspect-ratio: 16/12;
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
        {/* Decorative blobs */}
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
          }}
        />

        <div style={{ height: "80px" }} />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: isDesktop ? "0 64px" : "0 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: "center",
              minHeight: "calc(100vh - 80px)",
              gap: isDesktop ? "60px" : "40px",
              paddingTop: isDesktop ? "0" : "32px",
              paddingBottom: isDesktop ? "0" : "64px",
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
              <div className="h-anim-1" style={{ marginBottom: "24px" }}>
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
                  marginBottom: "22px",
                  fontSize: isDesktop ? "clamp(44px, 4vw, 66px)" : "40px",
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
                  fontSize: "15.5px",
                  lineHeight: 1.8,
                  marginBottom: "40px",
                  maxWidth: "420px",
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
                  marginBottom: "52px",
                }}
              >
                <Link href="/properties" className="h-btn-primary">
                  Explore Properties
                </Link>
                {/* ✅ Updated: Contact Us now navigates to the contact page */}
                <Link href="/contact" className="h-btn-secondary">
                  Contact Us
                </Link>
              </div>

              <div ref={statsRef} className="h-anim-5">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "24px 32px",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(18px)",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 32px rgba(15,23,42,0.07)",
                    gap: "0",
                  }}
                >
                  {stats.map((stat, i) => (
                    <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                      <StatItem {...stat} animate={statsVisible} />
                      {i < stats.length - 1 && (
                        <div
                          style={{
                            width: "1px",
                            height: "48px",
                            background: "rgba(15,23,42,0.1)",
                            margin: "0 28px",
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
                maxWidth: isDesktop ? "none" : "560px",
                display: "flex",
                alignItems: "center",
                justifyContent: isDesktop ? "flex-end" : "center",
              }}
            >
              <div
                className="h-float"
                style={{
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* Subtle glow */}
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