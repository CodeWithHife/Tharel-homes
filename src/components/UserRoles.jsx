"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Building2, Hotel, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const roles = [
  {
    role: "buyer",
    title: "Property Buyers & Investors",
    subtitle: "Find your next home or investment plot with verified legal titles and flexible instalment plans.",
    icon: <Home size={28} />,
    href: "/signup?role=buyer",
    cta: "Start Buying",
    features: [
      "Verified C of O & Governor's Consent",
      "Flexible 3 to 24-month payment plans",
      "Free site inspection & allocation",
    ],
    bgGradient: "linear-gradient(135deg, rgba(212, 160, 23, 0.12) 0%, rgba(15, 23, 42, 0.04) 100%)",
    accentColor: "#D4A017",
  },
  {
    role: "realtor",
    title: "Realtors & Property Agents",
    subtitle: "List properties, manage clients, and earn competitive commissions with complete transparency.",
    icon: <Building2 size={28} />,
    href: "/signup?role=realtor",
    cta: "Join Realtor Network",
    features: [
      "Access full estate inventory catalogue",
      "Instant commission tracking dashboard",
      "Dedicated marketing asset library",
    ],
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.08) 0%, rgba(212, 160, 23, 0.08) 100%)",
    accentColor: "#0F172A",
  },
  {
    role: "hotel",
    title: "Hotel & Short-Let Operators",
    subtitle: "Manage hospitality bookings, guest reservations, and short-let apartment listings easily.",
    icon: <Hotel size={28} />,
    href: "/signup?role=hotel",
    cta: "Manage Bookings",
    features: [
      "Real-time calendar & room availability",
      "Direct guest booking engine",
      "Automated payout management",
    ],
    bgGradient: "linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(51, 65, 85, 0.06) 100%)",
    accentColor: "#D4A017",
  },
];

export default function UserRoles() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="user-roles"
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #FCFAF5 0%, #F8FAFC 100%)",
        padding: "90px 0 100px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .role-header {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .role-header.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .role-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 26px -6px rgba(15, 23, 42, 0.04);
          opacity: 0;
          transform: translate3d(0, 32px, 0);
          position: relative;
          overflow: hidden;
        }

        .role-card.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .role-card:hover {
          border-color: rgba(212, 160, 23, 0.4);
          transform: translate3d(0, -8px, 0);
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 0 25px rgba(212, 160, 23, 0.12);
        }

        .role-icon-box {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4A017;
          margin-bottom: 20px;
          transition: all 0.35s ease;
        }

        .role-card:hover .role-icon-box {
          background: #D4A017;
          color: #0F172A;
          transform: scale(1.08) rotate(-4deg);
          box-shadow: 0 6px 18px rgba(212, 160, 23, 0.35);
        }

        .role-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          background: #0F172A;
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.35s ease;
          border: 1px solid transparent;
        }

        .role-card:hover .role-cta-btn {
          background: #D4A017;
          color: #0F172A;
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.35);
        }
      `}</style>

      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div className={`role-header ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(212, 160, 23, 0.1)",
              border: "1px solid rgba(212, 160, 23, 0.25)",
              color: "#B8860B",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: "16px",
            }}
          >
            <Sparkles size={14} color="#D4A017" />
            <span>Tailored Solutions</span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "#0F172A",
              fontSize: "clamp(30px, 3.5vw, 44px)",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Designed For <span style={{ color: "#D4A017" }}>Every Role</span>
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
              lineHeight: 1.68,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Whether you are looking to buy property, list client inventory, or manage short-let bookings, our platform empowers your goals.
          </p>
        </div>

        {/* 3 Role Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
          }}
        >
          {roles.map((item, index) => (
            <div
              key={item.role}
              className={`role-card ${isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div>
                <div className="role-icon-box">{item.icon}</div>

                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#64748B",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {item.subtitle}
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {item.features.map((feat, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", color: "#334155", fontWeight: 500 }}>
                      <CheckCircle2 size={16} color="#D4A017" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={item.href} className="role-cta-btn">
                <span>{item.cta}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
