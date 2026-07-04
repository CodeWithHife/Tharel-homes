"use client";
import { useEffect, useRef } from "react";
import { Home, Building, Landmark, Ruler, Users, MapPin, CheckCircle } from "lucide-react";

const services = [
  {
    icon: <Home size={32} />,
    title: "Property Sales",
    description: "We help you buy and sell residential and commercial properties with ease.",
  },
  {
    icon: <Building size={32} />,
    title: "Property Rentals",
    description: "Find the perfect rental home or apartment with flexible terms.",
  },
  {
    icon: <Landmark size={32} />,
    title: "Land Acquisition",
    description: "Secure verified land in prime locations across Nigeria.",
  },
  {
    icon: <Ruler size={32} />,
    title: "Real Estate Consulting",
    description: "Expert advice to guide your property investment decisions.",
  },
  {
    icon: <Users size={32} />,
    title: "Property Management",
    description: "We manage your properties so you can enjoy passive income.",
  },
  {
    icon: <MapPin size={32} />,
    title: "Interior Design",
    description: "Transform your space with our premium interior design services.",
  },
];

export default function ServicesPage() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".service-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main
      style={{
        padding: "140px 20px 60px",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <style>{`
        .service-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        /* ── Responsive overrides ── */
        @media (max-width: 768px) {
          .services-hero {
            height: 200px !important;
            border-radius: 12px !important;
            margin-bottom: 32px !important;
          }
          .services-hero-content {
            bottom: 20px !important;
            left: 20px !important;
          }
          .services-hero-content h1 {
            font-size: 28px !important;
          }
          .services-hero-content p {
            font-size: 14px !important;
            max-width: 100% !important;
          }
          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .service-card {
            padding: 28px 20px !important;
          }
          .service-card h3 {
            font-size: 17px !important;
          }
          .service-card p {
            font-size: 13px !important;
          }
          .services-cta {
            padding: 32px 20px !important;
            margin-top: 32px !important;
          }
          .services-cta h3 {
            font-size: 20px !important;
          }
          .services-cta p {
            font-size: 14px !important;
          }
          .services-cta a {
            padding: 14px 28px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 480px) {
          .services-hero {
            height: 160px !important;
          }
          .services-hero-content h1 {
            font-size: 24px !important;
          }
          .services-hero-content p {
            font-size: 13px !important;
          }
          .service-card {
            padding: 24px 16px !important;
          }
          .service-card .icon-wrap svg {
            width: 28px !important;
            height: 28px !important;
          }
          .service-card .big-number {
            font-size: 60px !important;
          }
          .services-cta {
            padding: 24px 16px !important;
          }
          .services-cta h3 {
            font-size: 18px !important;
          }
          .services-cta a {
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ─── HERO ─── */}
        <div
          className="services-hero"
          style={{
            position: "relative",
            width: "100%",
            height: "280px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "48px",
            backgroundColor: "#1e293b",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
            alt="Our Services"
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
                "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)",
            }}
          />
          <div
            className="services-hero-content"
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
              Our Services
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "16px",
                maxWidth: "500px",
              }}
            >
              Comprehensive solutions for all your real estate needs.
            </p>
          </div>
        </div>

        {/* ─── SERVICES GRID ─── */}
        <div
          ref={sectionRef}
          className="services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              style={{
                background: "white",
                padding: "32px 24px",
                borderRadius: "16px",
                boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
                textAlign: "center",
                transition: "all 0.3s",
                border: "1px solid rgba(0,0,0,0.04)",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,23,42,0.12)";
                e.currentTarget.style.borderColor = "#D4A017";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 14px rgba(15,23,42,0.06)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.04)";
              }}
            >
              <div
                className="big-number"
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  fontSize: "80px",
                  opacity: "0.04",
                  color: "#D4A017",
                  fontWeight: 900,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                className="icon-wrap"
                style={{
                  color: "#D4A017",
                  marginBottom: "16px",
                  transform: "scale(1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {service.icon}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: "8px",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {service.description}
              </p>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={16} color="#D4A017" />
              </div>
            </div>
          ))}
        </div>

        {/* ─── CALL TO ACTION ─── */}
        <div
          className="services-cta"
          style={{
            marginTop: "48px",
            background: "#0F172A",
            padding: "40px",
            borderRadius: "16px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat), sans-serif",
              marginBottom: "12px",
            }}
          >
            Ready to get started?
          </h3>
          <p
            style={{
              color: "#94A3B8",
              marginBottom: "20px",
            }}
          >
            Let us help you find the perfect property or service.
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "#D4A017",
              color: "#0F172A",
              borderRadius: "8px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b8860c";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#D4A017";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}