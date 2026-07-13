"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

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
    <section id="contact" style={{ width: "100%", background: "white", padding: "80px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#1A1A1A", marginBottom: "12px", fontFamily: "var(--font-montserrat), sans-serif" }}>
            Get In Touch
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "clamp(14px, 1.5vw, 16px)", maxWidth: "600px", margin: "0 auto" }}>
            Ready to find your dream property? Reach out to us and our team will get back to you as soon as possible.
          </p>
        </div>

        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr", // default to 1 column on mobile
          gap: "32px",
          alignItems: "start",
        }} className="contact-grid">
          {/* Left Column - Info */}
          <div>
            <h3 style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700, color: "#1A1A1A", marginBottom: "24px" }}>
              Contact Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={20} color="#D4A017" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Phone / WhatsApp
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>08168426592</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={20} color="#D4A017" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Email
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>tharel2024@gmail.com</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={20} color="#D4A017" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Location
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Lagos & Abeokuta, Nigeria</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "32px", borderRadius: "16px", overflow: "hidden", height: "200px", boxShadow: "0 2px 14px rgba(15,23,42,0.06)", border: "1px solid #F1F5F9" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932806483!2d3.1190543!3d6.5480557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng"
                style={{ width: "100%", height: "200px", border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column - Form */}
          <div style={{
            background: "#F8FAFC",
            padding: "clamp(24px, 4vw, 40px)",
            borderRadius: "16px",
            boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
          }}>
            <h3 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, color: "#1A1A1A", marginBottom: "24px" }}>
              Send Us a Message
            </h3>

            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 0", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Send size={28} color="#D4A017" />
                </div>
                <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1A1A1A" }}>Message Sent!</p>
                <p style={{ color: "#94A3B8", fontSize: "14px", textAlign: "center" }}>
                  Opening WhatsApp to connect you with our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="form-row">
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#D4A017"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#D4A017"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="080XXXXXXXX"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#D4A017"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Interested In</label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#D4A017"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
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
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what you're looking for..."
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "white", fontSize: "14px", outline: "none", resize: "vertical", transition: "border-color 0.3s" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#D4A017"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "#D4A017", color: "white", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", transition: "all 0.3s", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#B8920F"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#D4A017"}
                >
                  <Send size={16} />
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CSS for responsive breakpoints */}
        <style>{`
          @media (min-width: 640px) {
            .contact-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 48px !important;
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