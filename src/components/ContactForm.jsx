"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
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

  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gsap) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const items = sectionRef.current.querySelectorAll(".contact-info-item");
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          onComplete: () => {
            gsap.set(items, { clearProps: "y,opacity" });
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save to backend database
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
      console.error("Error submitting contact form to backend:", error);
    }

    // Open WhatsApp
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
    }, 4000);
  };

  return (
    <section ref={sectionRef} id="contact" style={{ width: "100%", background: "linear-gradient(135deg, #fffdf8 0%, #f8fafc 100%)", padding: "80px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", background: "rgba(212, 160, 23, 0.12)", color: "#b8860c", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Let’s Talk
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#0f172a", marginBottom: "12px", fontFamily: "var(--font-montserrat), sans-serif" }}>
            Get In Touch
          </h2>
          <p style={{ color: "#64748b", fontSize: "clamp(14px, 1.5vw, 16px)", maxWidth: "640px", margin: "0 auto", lineHeight: 1.7 }}>
            Ready to find your dream property? Reach out to us and our team will get back to you as soon as possible.
          </p>
        </div>

        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "32px",
          alignItems: "stretch",
        }} className="contact-grid">
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            padding: "clamp(24px, 3vw, 32px)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
          }}>
            <h3 style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
              Contact Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: <Phone size={18} />, label: "Phone / WhatsApp", value: "08168426592", href: "tel:08168426592" },
                { icon: <Mail size={18} />, label: "Email", value: "tharel2024@gmail.com", href: "mailto:tharel2024@gmail.com" },
                { icon: <MapPin size={18} />, label: "Location", value: "Lagos & Abeokuta, Nigeria" },
              ].map((item, index) => (
                <div key={index} className="contact-info-item" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px", background: "#f8fafc", opacity: reducedMotion ? 1 : 0 }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(212,160,23,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4a017", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>{item.value}</a>
                    ) : (
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", borderRadius: "18px", overflow: "hidden", height: "220px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932806483!2d3.1190543!3d6.5480557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng"
                style={{ width: "100%", height: "220px", border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            padding: "clamp(24px, 3vw, 36px)",
            borderRadius: "24px",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
              Send Us a Message
            </h3>

            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 0", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(212,160,23,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Send size={28} color="#D4A017" />
                </div>
                <p style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>Message Sent!</p>
                <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", lineHeight: 1.6 }}>
                  Opening WhatsApp to connect you with our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="form-row">
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4a017";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212, 160, 23, 0.14)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4a017";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212, 160, 23, 0.14)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="080XXXXXXXX"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4a017";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212, 160, 23, 0.14)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Interested In</label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4a017";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212, 160, 23, 0.14)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <option value="">Select type...</option>
                      <option value="Land">Land</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Farmland">Farmland</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what you're looking for..."
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "14px", outline: "none", resize: "vertical", transition: "border-color 0.3s, box-shadow 0.3s" }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#d4a017";
                      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212, 160, 23, 0.14)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#d4a017",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#b8920f";
                    if (!reducedMotion) {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 10px 24px rgba(212, 160, 23, 0.24)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#d4a017";
                    if (!reducedMotion) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <Send size={16} />
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>

        <style>{`
          @media (min-width: 640px) {
            .contact-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 32px !important;
            }
            .form-row {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}