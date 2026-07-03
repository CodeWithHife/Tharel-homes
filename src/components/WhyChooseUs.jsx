"use client";
import { CreditCard, Clock, MessageCircle, MapPin } from "lucide-react";

const reasons = [
  {
    icon: <CreditCard size={28} color="#D4AF37" />,
    title: "Easy Payment",
    desc: "Reliable 24-hour consulting service, offering expert guidance and support for your success around the clock.",
  },
  {
    icon: <Clock size={28} color="#D4AF37" />,
    title: "24 Hours Support",
    desc: "Count on us 24/7 for unwavering support, ensuring your needs are met anytime, anywhere.",
  },
  {
    icon: <MessageCircle size={28} color="#D4AF37" />,
    title: "Simple Contact",
    desc: "Streamlined contact for quick assistance. We make reaching us simple and hassle-free for you.",
  },
  {
    icon: <MapPin size={28} color="#D4AF37" />,
    title: "Strategic Location",
    desc: "Optimal location. Elevate accessibility and investment potential for lasting success and growth.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="services" style={{
      width: "100%",
      background: "linear-gradient(160deg, #0F172A 0%, #1e2d45 50%, #0F172A 100%)",
      padding: "100px 0 80px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-inter), sans-serif",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "14px" }}>
            Elevate Your Journey
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 900, color: "#ffffff", fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Why Choose Our Platform?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.75, maxWidth: "500px", margin: "0 auto" }}>
            We combine expertise, technology, and dedication to deliver a seamless real estate experience you can trust.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: "80px" }}>
          {reasons.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "36px 24px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.35s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,175,55,0.12)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(212,175,55,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: "62px", height: "62px", borderRadius: "18px", background: "rgba(212,175,55,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                {item.icon}
              </div>
              <h3 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700, fontSize: "15px", color: "#ffffff", marginBottom: "10px" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13.5px", lineHeight: 1.72 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}