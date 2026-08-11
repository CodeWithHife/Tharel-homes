"use client";
import { useState, useRef, useEffect } from "react";
import { Star, Quote, CheckCircle2, MapPin, HeartHandshake, Sparkles, ThumbsUp, Building2, Globe } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const allTestimonials = [
  {
    name: "Adebayo Okafor",
    role: "Property Investor",
    location: "Lekki Phase 1, Lagos",
    text: "The 10th Homes made my property investment journey seamless. I secured 2 plots in Lekki with a flexible payment plan. The title verification was 100% transparent.",
    rating: 5,
    category: "investor",
    badge: "Verified Investor",
    avatarBg: "linear-gradient(135deg, #0F172A, #334155)",
    initials: "AO",
  },
  {
    name: "Chidinma Eze",
    role: "First-time Homeowner",
    location: "Maitama, Abuja",
    text: "I was skeptical about buying land remotely, but The 10th Homes team conducted virtual live video tours and guided me through every documentation stage with clarity.",
    rating: 5,
    category: "buyer",
    badge: "Land Owner",
    avatarBg: "linear-gradient(135deg, #D4A017, #996515)",
    initials: "CE",
  },
  {
    name: "Emeka Nwosu",
    role: "Senior Realtor",
    location: "GRA Phase 2, Port Harcourt",
    text: "As a real estate consultant, referring clients to The 10th Homes is always stress-free. Their property catalogue is authentic and commissions are paid promptly.",
    rating: 5,
    category: "investor",
    badge: "Certified Partner",
    avatarBg: "linear-gradient(135deg, #1E293B, #0F172A)",
    initials: "EN",
  },
  {
    name: "Dr. Folake Alabi",
    role: "Medical Director",
    location: "Victoria Island, Lagos",
    text: "Purchased a luxury duplex through their concierge service. The privacy, speed of paperwork, and post-purchase property management have exceeded all my expectations.",
    rating: 5,
    category: "buyer",
    badge: "Luxury Buyer",
    avatarBg: "linear-gradient(135deg, #B8860B, #D4A017)",
    initials: "FA",
  },
  {
    name: "Tunde Bakare",
    role: "Tech Founder",
    location: "Eko Atlantic City, Lagos",
    text: "Top-tier real estate experience! The modern platform made tracking my land documentation and physical allocation progress effortless.",
    rating: 5,
    category: "investor",
    badge: "Verified Buyer",
    avatarBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    initials: "TB",
  },
  {
    name: "Grace & David Utomi",
    role: "Commercial Investors",
    location: "Ibeju-Lekki, Lagos",
    text: "We acquired 5 commercial plots near the Free Trade Zone. The capital appreciation over 18 months has been astonishing. Highly recommended team!",
    rating: 5,
    category: "investor",
    badge: "Commercial Investor",
    avatarBg: "linear-gradient(135deg, #D4A017, #B8860B)",
    initials: "DU",
  },
  {
    name: "Engr. Ibrahim Musa",
    role: "Infrastructure Consultant",
    location: "Guzape, Abuja",
    text: "Their due diligence on titles and land topography is unmatched in Nigeria. Zero hassle with community issues or title disputes.",
    rating: 5,
    category: "buyer",
    badge: "Verified Landlord",
    avatarBg: "linear-gradient(135deg, #1E293B, #334155)",
    initials: "IM",
  },
  {
    name: "Kemi Balogun",
    role: "Diaspora Investor",
    location: "London, UK / Ikeja, Lagos",
    text: "Living in the UK, finding trustworthy real estate partners in Nigeria is tough. The 10th Homes kept me updated with weekly video reports until key handover.",
    rating: 5,
    category: "diaspora",
    badge: "Diaspora Buyer",
    avatarBg: "linear-gradient(135deg, #0F172A, #D4A017)",
    initials: "KB",
  },
  {
    name: "Victor Oladipo",
    role: "Apartment Developer",
    location: "Calabar, Cross River",
    text: "Partnered with them for short-let apartment land acquisition. Fantastic ROI, excellent legal advisory, and top-class customer support.",
    rating: 5,
    category: "investor",
    badge: "Hotelier / Partner",
    avatarBg: "linear-gradient(135deg, #334155, #0F172A)",
    initials: "VO",
  },
  {
    name: "Blessing & Mark Nnamdi",
    role: "Residential Buyers",
    location: "Asokoro, Abuja",
    text: "Smooth payment process and seamless physical land allocation. The entire team was professional, warm, and diligent.",
    rating: 5,
    category: "diaspora",
    badge: "Home Owner",
    avatarBg: "linear-gradient(135deg, #D4A017, #996515)",
    initials: "BN",
  },
];

const track1 = allTestimonials.slice(0, 5);
const track2 = allTestimonials.slice(5, 10);

export default function Testimonials() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
        padding: "100px 0 110px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        /* Opposing Marquee Animations */
        @keyframes tmMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes tmMarqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        @keyframes tmShimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        @keyframes tmBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.8); }
        }

        .tm-header {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tm-header.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .tm-marquee-container {
          display: flex;
          overflow: hidden;
          position: relative;
          width: 100%;
          padding: 10px 0;
          user-select: none;
        }

        /* Dual Side Gradient Fade Mask */
        .tm-marquee-container::before,
        .tm-marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 140px;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .tm-marquee-container::before {
          left: 0;
          background: linear-gradient(to right, #F8FAFC 0%, rgba(248, 250, 252, 0) 100%);
        }

        .tm-marquee-container::after {
          right: 0;
          background: linear-gradient(to left, #F8FAFC 0%, rgba(248, 250, 252, 0) 100%);
        }

        .tm-track-left {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: ${reducedMotion ? "none" : "tmMarqueeLeft 36s linear infinite"};
          will-change: transform;
        }

        .tm-track-right {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: ${reducedMotion ? "none" : "tmMarqueeRight 36s linear infinite"};
          will-change: transform;
        }

        .tm-marquee-container:hover .tm-track-left,
        .tm-marquee-container:hover .tm-track-right {
          animation-play-state: paused;
        }

        /* Testimonial Card Styling */
        .tm-card {
          width: 380px;
          flex-shrink: 0;
          background: #ffffff;
          border-radius: 20px;
          padding: 26px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .tm-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.08), transparent);
          transform: translateX(-100%) skewX(-15deg);
          pointer-events: none;
        }

        .tm-card:hover::after {
          animation: tmShimmer 0.85s ease-in-out;
        }

        .tm-card:hover {
          transform: translate3d(0, -6px, 0);
          border-color: rgba(212, 160, 23, 0.4);
          box-shadow: 0 18px 40px -10px rgba(15, 23, 42, 0.12), 0 0 25px rgba(212, 160, 23, 0.15);
        }

        .tm-card-quote {
          position: absolute;
          top: 20px;
          right: 22px;
          opacity: 0.12;
          color: #0F172A;
          transition: all 0.35s ease;
        }

        .tm-card:hover .tm-card-quote {
          opacity: 0.28;
          color: #D4A017;
          transform: scale(1.15) rotate(8deg);
        }

        .tm-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          transition: transform 0.3s ease;
        }

        .tm-card:hover .tm-avatar {
          transform: scale(1.08);
        }

        .tm-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(212, 160, 23, 0.1);
          color: #B8860B;
          border: 1px solid rgba(212, 160, 23, 0.22);
          transition: all 0.3s ease;
        }

        .tm-card:hover .tm-badge {
          background: #D4A017;
          color: #0F172A;
        }

        .tm-card:hover .tm-badge svg {
          stroke: #0F172A !important;
        }

        .tm-filter-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          background: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tm-filter-btn:hover {
          color: #0F172A;
          border-color: rgba(212, 160, 23, 0.4);
          transform: translateY(-1.5px);
        }

        .tm-filter-btn.active {
          background: #0F172A;
          color: #D4A017;
          border-color: #0F172A;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div className={`tm-header ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "44px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(212, 160, 23, 0.08)",
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
                animation: "tmBadgePulse 2s infinite ease-in-out",
              }}
            />
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#B8860B",
              }}
            >
              Trusted By Over 2,500+ Verified Clients
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "#0F172A",
              fontSize: "clamp(30px, 3.2vw, 44px)",
              letterSpacing: "-0.02em",
              marginBottom: "14px",
              lineHeight: 1.18,
            }}
          >
            What Our <span style={{ color: "#D4A017" }}>Clients Say</span>
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "15.5px",
              lineHeight: 1.65,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Real stories from verified property owners, diaspora buyers, and top investors across Nigeria and worldwide.
          </p>
        </div>
      </div>

      {/* Render Marquee Tracks when Reduced Motion is false */}
      {!reducedMotion ? (
        <>
          {/* Track 1: Moving Left */}
          <div className="tm-marquee-container" style={{ marginBottom: "20px" }}>
            <div className="tm-track-left">
              {[...track1, ...track1].map((item, idx) => (
                <div key={`t1-${idx}`} className="tm-card">
                  <Quote size={36} className="tm-card-quote" />

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                      <div className="tm-badge">
                        <CheckCircle2 size={12} color="#D4A017" />
                        <span>{item.badge}</span>
                      </div>
                      <div style={{ display: "flex", gap: "2px", marginLeft: "auto" }}>
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} color="#D4A017" fill="#D4A017" />
                        ))}
                      </div>
                    </div>

                    <p
                      style={{
                        color: "#334155",
                        fontSize: "14px",
                        lineHeight: 1.68,
                        marginBottom: "20px",
                        fontWeight: 400,
                      }}
                    >
                      "{item.text}"
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div className="tm-avatar" style={{ background: item.avatarBg }}>
                      {item.initials}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A", margin: 0 }}>
                        {item.name}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>{item.role}</span>
                        <span style={{ color: "#CBD5E1" }}>•</span>
                        <span style={{ fontSize: "11.5px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          <MapPin size={10} color="#D4A017" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Moving Right (Opposing Direction) */}
          <div className="tm-marquee-container">
            <div className="tm-track-right">
              {[...track2, ...track2].map((item, idx) => (
                <div key={`t2-${idx}`} className="tm-card">
                  <Quote size={36} className="tm-card-quote" />

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                      <div className="tm-badge">
                        <CheckCircle2 size={12} color="#D4A017" />
                        <span>{item.badge}</span>
                      </div>
                      <div style={{ display: "flex", gap: "2px", marginLeft: "auto" }}>
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} color="#D4A017" fill="#D4A017" />
                        ))}
                      </div>
                    </div>

                    <p
                      style={{
                        color: "#334155",
                        fontSize: "14px",
                        lineHeight: 1.68,
                        marginBottom: "20px",
                        fontWeight: 400,
                      }}
                    >
                      "{item.text}"
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div className="tm-avatar" style={{ background: item.avatarBg }}>
                      {item.initials}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A", margin: 0 }}>
                        {item.name}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>{item.role}</span>
                        <span style={{ color: "#CBD5E1" }}>•</span>
                        <span style={{ fontSize: "11.5px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          <MapPin size={10} color="#D4A017" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Filtered Grid or Reduced Motion View */
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {allTestimonials.map((item, idx) => (
              <div key={`grid-${idx}`} className="tm-card" style={{ width: "100%" }}>
                <Quote size={36} className="tm-card-quote" />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div className="tm-badge">
                      <CheckCircle2 size={12} color="#D4A017" />
                      <span>{item.badge}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", marginLeft: "auto" }}>
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} color="#D4A017" fill="#D4A017" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "#334155", fontSize: "14px", lineHeight: 1.68, marginBottom: "20px" }}>
                    "{item.text}"
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div className="tm-avatar" style={{ background: item.avatarBg }}>
                    {item.initials}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A", margin: 0 }}>
                      {item.name}
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>{item.role}</span>
                      <span style={{ color: "#CBD5E1" }}>•</span>
                      <span style={{ fontSize: "11.5px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        <MapPin size={10} color="#D4A017" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
