"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.interest ? `Interested In: ${form.interest}` : "General Inquiry",
          message: form.message,
        }),
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }

    const msg =
      "Hello, I'm reaching out from your website.\n\n" +
      "Name: " + form.name + "\n" +
      "Email: " + form.email + "\n" +
      "Phone: " + form.phone + "\n" +
      "Interested In: " + form.interest + "\n\n" +
      "Message:\n" + form.message;
    const whatsappLink = "https://wa.me/2348168426592?text=" + encodeURIComponent(msg);
    window.open(whatsappLink, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", interest: "", message: "" });
    }, 5000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        width: "100%",
        background: "linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
        padding: "100px 0 90px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes contactGlowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.1); }
        }

        @keyframes contactShimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        .contact-header {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contact-header.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .contact-card-box {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
          padding: clamp(24px, 3vw, 36px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translate3d(0, 30px, 0);
        }

        .contact-card-box.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .contact-card-box:hover {
          border-color: rgba(212, 160, 23, 0.3);
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 0 20px rgba(212, 160, 23, 0.1);
        }

        .contact-info-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          background: #F8FAFC;
          border: 1px solid rgba(15, 23, 42, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contact-info-item:hover {
          background: rgba(212, 160, 23, 0.08);
          border-color: rgba(212, 160, 23, 0.3);
          transform: translate3d(0, -3px, 0);
        }

        .contact-info-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4A017;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .contact-info-item:hover .contact-info-icon {
          background: #D4A017;
          color: #0F172A;
          transform: scale(1.08) rotate(-4deg);
          box-shadow: 0 6px 16px rgba(212, 160, 23, 0.3);
        }

        .contact-input-field {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          font-size: 14px;
          outline: none;
          color: #0F172A;
          transition: all 0.3s ease;
        }

        .contact-input-field:focus {
          border-color: #D4A017;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.16);
          background: #ffffff;
        }

        .contact-submit-btn {
          position: relative;
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid rgba(212, 160, 23, 0.3);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);
        }

        .contact-submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }

        .contact-submit-btn:hover::before {
          animation: contactShimmer 0.9s ease-in-out;
        }

        .contact-submit-btn:hover {
          background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
          color: #0F172A;
          border-color: #D4A017;
          transform: translate3d(0, -3px, 0);
          box-shadow: 0 10px 28px rgba(212, 160, 23, 0.35);
        }

        .contact-submit-btn:active {
          transform: translate3d(0, 0, 0) scale(0.98);
        }
      `}</style>

      {/* Ambient Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "5%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 160, 23, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "contactGlowPulse 9s ease-in-out infinite",
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div className={`contact-header ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
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
            <span>Start Your Real Estate Journey</span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "#0F172A",
              fontSize: "clamp(30px, 3.5vw, 46px)",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Get In Touch With <span style={{ color: "#D4A017" }}>Our Experts</span>
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Ready to inspect, invest, or inquire? Reach out to our dedicated concierge team and receive prompt guidance within minutes.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            alignItems: "stretch",
          }}
        >
          {/* Column 1: Info & Map */}
          <div className={`contact-card-box ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "20px",
              }}
            >
              Contact Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              {[
                {
                  icon: <Phone size={20} />,
                  label: "Phone / WhatsApp",
                  value: "+234 816 842 6592",
                  href: "https://wa.me/2348168426592",
                },
                {
                  icon: <Mail size={20} />,
                  label: "Email Address",
                  value: "tharel2024@gmail.com",
                  href: "mailto:tharel2024@gmail.com",
                },
                {
                  icon: <MapPin size={20} />,
                  label: "Head Offices",
                  value: "Lagos & Abeokuta, Nigeria",
                },
              ].map((item, index) => (
                <div key={index} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94A3B8",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "2px",
                      }}
                    >
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#0F172A",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#0F172A")}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Embedded Google Map */}
            <div
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                height: "200px",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932806483!2d3.1190543!3d6.5480557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng"
                style={{ width: "100%", height: "200px", border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Office Location Map"
              />
            </div>
          </div>

          {/* Column 2: Form */}
          <div className={`contact-card-box ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "20px",
              }}
            >
              Send Us a Direct Message
            </h3>

            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "56px 20px",
                  textAlign: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(212, 160, 23, 0.15)",
                    border: "2px solid #D4A017",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(212, 160, 23, 0.4)",
                  }}
                >
                  <CheckCircle2 size={36} color="#D4A017" />
                </div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ color: "#64748B", fontSize: "14.5px", lineHeight: 1.6, maxWidth: "340px" }}>
                  Opening WhatsApp to connect you directly with our team...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Adebayo Alabi"
                      className="contact-input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="080XXXXXXXX"
                      className="contact-input-field"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@email.com"
                      className="contact-input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      Interested In
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="contact-input-field"
                    >
                      <option value="">Select Property Type...</option>
                      <option value="Residential Land">Residential Land</option>
                      <option value="Luxury Duplex">Luxury Duplex</option>
                      <option value="Apartment">Apartment / Short-let</option>
                      <option value="Commercial Land">Commercial Land</option>
                      <option value="Farmland">Farmland Investment</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us your budget, preferred location, or specific requirements..."
                    className="contact-input-field"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send size={18} />
                  <span>Send via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}