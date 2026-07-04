"use client";
import { useEffect, useRef } from "react";
import { Users, Award, Home, Heart, Target, Briefcase } from "lucide-react";

export default function AboutPage() {
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = document.querySelectorAll(".about-card");
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ padding: "140px 20px 60px", backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        .about-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .about-card:nth-child(1) { transition-delay: 0.05s; }
        .about-card:nth-child(2) { transition-delay: 0.1s; }
        .about-card:nth-child(3) { transition-delay: 0.15s; }
        .about-card:nth-child(4) { transition-delay: 0.2s; }

        /* ── Responsive tweaks ── */
        @media (max-width: 768px) {
          .about-hero {
            height: 200px !important;
          }
          .about-hero-content {
            bottom: 20px !important;
            left: 20px !important;
          }
          .about-hero-content h1 {
            font-size: 28px !important;
          }
          .about-hero-content p {
            font-size: 14px !important;
            max-width: 100% !important;
          }
          .about-story-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .about-story-image {
            height: 200px !important;
          }
          .about-values-grid {
            grid-template-columns: 1fr !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .about-stats-grid .stat-card {
            padding: 16px !important;
          }
          .about-stats-grid .stat-card .stat-value {
            font-size: 22px !important;
          }
          .about-values-wrap {
            padding: 32px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            height: 170px !important;
            border-radius: 12px !important;
          }
          .about-hero-content {
            bottom: 14px !important;
            left: 16px !important;
          }
          .about-hero-content h1 {
            font-size: 24px !important;
          }
          .about-hero-content p {
            font-size: 13px !important;
          }
          .about-stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .about-stats-grid .stat-card {
            padding: 14px !important;
          }
          .about-stats-grid .stat-card .stat-value {
            font-size: 20px !important;
          }
          .about-story-image {
            height: 170px !important;
          }
          .about-values-wrap {
            padding: 24px 16px !important;
          }
          .about-values-wrap h2 {
            font-size: 18px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .about-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .about-values-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ─── HERO ─── */}
        <div
          className="about-hero"
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "48px",
            backgroundColor: "#1e293b",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
            alt="About The 10th Homes"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)",
            }}
          />
          <div
            className="about-hero-content"
            style={{
              position: "absolute",
              bottom: "32px",
              left: "32px",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 900,
                color: "white",
                fontFamily: "var(--font-montserrat), sans-serif",
                marginBottom: "8px",
              }}
            >
              About Us
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "16px",
                maxWidth: "500px",
              }}
            >
              Your trusted partner in Nigerian real estate.
            </p>
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div
          className="about-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {[
            { icon: <Home size={28} />, value: "26+", label: "Properties" },
            { icon: <Users size={28} />, value: "500+", label: "Happy Clients" },
            { icon: <Award size={28} />, value: "10+", label: "Years Experience" },
            { icon: <Target size={28} />, value: "100%", label: "Satisfaction" },
          ].map((item, i) => (
            <div
              key={i}
              className="about-card stat-card"
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "14px",
                boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
                textAlign: "center",
                transition: "all 0.3s",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 14px rgba(15,23,42,0.06)";
              }}
            >
              <div style={{ color: "#D4A017", marginBottom: "8px" }}>{item.icon}</div>
              <div
                className="stat-value"
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#0F172A",
                }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* ─── STORY ─── */}
        <div
          className="about-story-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "16px",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              Our Story
            </h2>
            <p
              style={{
                color: "#334155",
                lineHeight: 1.8,
                marginBottom: "16px",
              }}
            >
              The 10th Homes & Apartments Ltd was founded with a simple mission:
              to make real estate transactions transparent, accessible, and
              rewarding for everyone. Over the past decade, we've helped
              hundreds of Nigerians find their dream homes, secure investment
              properties, and build generational wealth.
            </p>
            <p style={{ color: "#334155", lineHeight: 1.8 }}>
              From land acquisition to luxury duplexes, we bring integrity,
              expertise, and a personal touch to every deal. Our team of
              dedicated professionals works tirelessly to ensure your property
              journey is smooth and successful.
            </p>
          </div>
          <div
            className="about-story-image"
            style={{
              position: "relative",
              height: "250px",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#e2e8f0",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"
              alt="Our team"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* ─── VALUES ─── */}
        <div
          className="about-values-wrap"
          style={{
            background: "white",
            padding: "48px 40px",
            borderRadius: "16px",
            boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: "24px",
              textAlign: "center",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            Our Core Values
          </h2>
          <div
            className="about-values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: <Heart size={24} />,
                title: "Integrity",
                desc: "We operate with honesty and transparency in every transaction.",
              },
              {
                icon: <Target size={24} />,
                title: "Excellence",
                desc: "We strive for the highest quality in service and results.",
              },
              {
                icon: <Briefcase size={24} />,
                title: "Professionalism",
                desc: "Our team is dedicated, knowledgeable, and client-focused.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="about-card"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "12px",
                  background: "#F8FAFC",
                  transition: "all 0.3s",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4A017";
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ color: "#D4A017", marginBottom: "8px" }}>
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#0F172A",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748B",
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}