"use client";
import { useRef, useEffect, useState } from "react";
import { CreditCard, Clock, MessageCircle, MapPin, ShieldCheck, Sparkles, Award, Headphones, ArrowUpRight } from "lucide-react";

const reasons = [
  {
    icon: <CreditCard size={26} color="#D4A017" />,
    title: "Flexible & Easy Payment",
    desc: "Seamless payment structures tailored for your convenience. Experience stress-free transactions with trusted encryption.",
    highlight: "Instant Receipt & Verification",
    badge: "0% Hidden Fees"
  },
  {
    icon: <Clock size={26} color="#D4A017" />,
    title: "24/7 Dedicated Support",
    desc: "Count on our expert concierge team 24 hours a day, 7 days a week, ensuring your inquiries are resolved promptly.",
    highlight: "Round-the-Clock Assistance",
    badge: "Fast Response"
  },
  {
    icon: <MessageCircle size={26} color="#D4A017" />,
    title: "Direct & Simple Contact",
    desc: "Connect directly with verified agents, private owners, and legal advisors with one-tap instant messaging.",
    highlight: "Zero Middleman Hassle",
    badge: "Verified Direct"
  },
  {
    icon: <MapPin size={26} color="#D4A017" />,
    title: "Prime Strategic Locations",
    desc: "High-value homes and luxury apartments located in prime growth corridors, guaranteeing high capital appreciation.",
    highlight: "Top Tier Neighborhoods",
    badge: "High ROI"
  },
];

const highlights = [
  { icon: <ShieldCheck size={18} color="#D4A017" />, text: "100% Verified Titles" },
  { icon: <Award size={18} color="#D4A017" />, text: "Luxury Standard Guarantee" },
  { icon: <Headphones size={18} color="#D4A017" />, text: "VIP Client Care" },
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      style={{
        width: "100%",
        background: "linear-gradient(160deg, #0B1120 0%, #0F172A 50%, #1E293B 100%)",
        padding: "100px 0 80px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        /* Smooth Hardware-Accelerated Keyframes */
        @keyframes wcuGlowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }

        @keyframes wcuBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.8); }
        }

        @keyframes wcuCardShimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        /* Entrance Transitions */
        .wcu-header {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wcu-header.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .wcu-card {
          opacity: 0;
          transform: translate3d(0, 30px, 0);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .wcu-card.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .wcu-card-inner {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          padding: 32px 26px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .wcu-card-inner::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          transform: translateX(-100%) skewX(-15deg);
          pointer-events: none;
        }

        .wcu-card:hover .wcu-card-inner::after {
          animation: wcuCardShimmer 0.85s ease-in-out;
        }

        .wcu-card:hover .wcu-card-inner {
          background: rgba(212, 160, 23, 0.07);
          border-color: rgba(212, 160, 23, 0.4);
          transform: translate3d(0, -6px, 0);
          box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.4), 0 0 20px rgba(212, 160, 23, 0.12);
        }

        .wcu-icon-box {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: rgba(212, 160, 23, 0.1);
          border: 1px solid rgba(212, 160, 23, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wcu-card:hover .wcu-icon-box {
          background: #D4A017;
          border-color: #D4A017;
          transform: scale(1.08) rotate(-3deg);
          box-shadow: 0 8px 20px rgba(212, 160, 23, 0.35);
        }

        .wcu-card:hover .wcu-icon-box svg {
          stroke: #0F172A !important;
          color: #0F172A !important;
        }

        .wcu-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(212, 160, 23, 0.12);
          color: #D4A017;
          border: 1px solid rgba(212, 160, 23, 0.22);
          margin-left: auto;
          transition: all 0.3s ease;
        }

        .wcu-card:hover .wcu-badge {
          background: #D4A017;
          color: #0F172A;
        }

        .wcu-feature-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          width: 100%;
          transition: color 0.3s ease;
        }

        .wcu-card:hover .wcu-feature-tag {
          color: #D4A017;
        }

        .wcu-card-arrow {
          opacity: 0;
          transform: translate3d(-4px, 4px, 0);
          transition: all 0.3s ease;
          color: #D4A017;
          margin-left: auto;
        }

        .wcu-card:hover .wcu-card-arrow {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      `}</style>

      {/* Ambient Background Glows */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "10%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 160, 23, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "wcuGlowPulse 8s ease-in-out infinite",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Animated Header */}
        <div className={`wcu-header ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(212, 160, 23, 0.1)",
              border: "1px solid rgba(212, 160, 23, 0.25)",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#D4A017",
                animation: "wcuBadgePulse 2s infinite ease-in-out",
              }}
            />
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#D4A017",
              }}
            >
              Elevate Your Real Estate Journey
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "#ffffff",
              fontSize: "clamp(30px, 3.2vw, 44px)",
              letterSpacing: "-0.02em",
              marginBottom: "14px",
              lineHeight: 1.18,
            }}
          >
            Why Choose <span style={{ color: "#D4A017" }}>The 10th Homes</span>?
          </h2>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.65)",
              fontSize: "15px",
              lineHeight: 1.68,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            We combine premium property portfolios, transparent digital solutions, and personalized concierge care to deliver an unparalleled real estate experience.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "56px",
          }}
        >
          {reasons.map((item, index) => (
            <div
              key={item.title}
              className={`wcu-card ${isVisible ? "visible" : ""}`}
              style={{
                transitionDelay: `${index * 0.08}s`,
              }}
            >
              <div className="wcu-card-inner">
                <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <div className="wcu-icon-box">{item.icon}</div>
                  <span className="wcu-badge">{item.badge}</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "17px",
                    color: "#ffffff",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "13.5px",
                    lineHeight: 1.6,
                    flexGrow: 1,
                  }}
                >
                  {item.desc}
                </p>

                <div className="wcu-feature-tag">
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#D4A017" }} />
                  <span>{item.highlight}</span>
                  <ArrowUpRight size={14} className="wcu-card-arrow" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights Strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            padding: "20px 28px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.025)",
            border: "1px solid rgba(212, 160, 23, 0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: "600",
              }}
            >
              {h.icon}
              <span>{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}