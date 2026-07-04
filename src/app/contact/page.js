"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg =
      `Hello, I'm reaching out from your website.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`;
    const whatsappLink =
      `https://wa.me/2348168426592?text=${encodeURIComponent(msg)}`;
    window.open(whatsappLink, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <main
      style={{
        padding: "140px 20px 60px",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <style>{`
        /* ── Responsive overrides ── */
        @media (max-width: 768px) {
          .contact-hero {
            height: 200px !important;
            border-radius: 12px !important;
            margin-bottom: 32px !important;
          }
          .contact-hero-content {
            bottom: 20px !important;
            left: 20px !important;
          }
          .contact-hero-content h1 {
            font-size: 28px !important;
          }
          .contact-hero-content p {
            font-size: 14px !important;
            max-width: 100% !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .contact-info-panel,
          .contact-form-panel {
            padding: 28px 20px !important;
          }
          .contact-info-panel h2,
          .contact-form-panel h2 {
            font-size: 20px !important;
          }
          .contact-map {
            height: 160px !important;
          }
          .contact-btn {
            padding: 16px !important;
            font-size: 16px !important;
          }
          .contact-input {
            padding: 14px 16px !important;
            font-size: 16px !important; /* prevents zoom on iOS */
          }
          .contact-textarea {
            padding: 14px 16px !important;
            font-size: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            height: 160px !important;
          }
          .contact-hero-content h1 {
            font-size: 24px !important;
          }
          .contact-hero-content p {
            font-size: 13px !important;
          }
          .contact-info-panel,
          .contact-form-panel {
            padding: 20px 16px !important;
          }
          .contact-map {
            height: 140px !important;
          }
          .contact-info-item {
            padding: 10px 12px !important;
            gap: 12px !important;
          }
          .contact-info-item .info-label {
            font-size: 10px !important;
          }
          .contact-info-item .info-value {
            font-size: 13px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .contact-grid {
            gap: 32px !important;
          }
          .contact-info-panel,
          .contact-form-panel {
            padding: 32px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ─── HERO ─── */}
        <div
          className="contact-hero"
          style={{
            position: "relative",
            width: "100%",
            height: "280px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "48px",
            backgroundColor: "#1a1a2e",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
            alt="Contact Us"
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
                "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.30) 60%, transparent 100%)",
            }}
          />
          <div
            className="contact-hero-content"
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
              Contact Us
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "16px",
                maxWidth: "500px",
              }}
            >
              We'd love to hear from you – get in touch today.
            </p>
          </div>
        </div>

        {/* ─── GRID ─── */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* ── INFO PANEL ── */}
          <div
            className="contact-info-panel"
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "24px",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              Get in Touch
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {[
                {
                  icon: <Phone size={20} />,
                  label: "Phone / WhatsApp",
                  value: "08168426592",
                  href: "tel:08168426592",
                },
                {
                  icon: <Mail size={20} />,
                  label: "Email",
                  value: "tharel2024@gmail.com",
                  href: "mailto:tharel2024@gmail.com",
                },
                {
                  icon: <MapPin size={20} />,
                  label: "Location",
                  value: "Lagos & Abeokuta, Nigeria",
                  href: null,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="contact-info-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    transition: "all 0.2s",
                    cursor: item.href ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (item.href) {
                      e.currentTarget.style.background = "#f1f5f9";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.href) {
                      e.currentTarget.style.background = "#F8FAFC";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                  onClick={() => {
                    if (item.href) window.location.href = item.href;
                  }}
                >
                  <div style={{ color: "#D4A017" }}>{item.icon}</div>
                  <div>
                    <p
                      className="info-label"
                      style={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="info-value"
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1A1A1A",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div
              className="contact-map"
              style={{
                marginTop: "32px",
                borderRadius: "12px",
                overflow: "hidden",
                height: "200px",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932806483!2d3.1190543!3d6.5480557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
              />
            </div>
          </div>

          {/* ── FORM PANEL ── */}
          <div
            className="contact-form-panel"
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "24px",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              Send Us a Message
            </h2>

            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  gap: "12px",
                }}
              >
                <Send size={32} color="#D4A017" />
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>
                  Message Sent!
                </p>
                <p style={{ color: "#94A3B8", fontSize: "14px" }}>
                  Opening WhatsApp to connect you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#1A1A1A",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="contact-input"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#1A1A1A",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@email.com"
                    className="contact-input"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#1A1A1A",
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="080XXXXXXXX"
                    className="contact-input"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#1A1A1A",
                    }}
                  >
                    Message *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you're looking for..."
                    className="contact-textarea"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-btn"
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#D4A017",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
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
                  <Send size={16} /> Send via WhatsApp
                </button>

                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "#94A3B8",
                    textAlign: "center",
                  }}
                >
                  We'll respond via WhatsApp within minutes.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}