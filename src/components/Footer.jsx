"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#0F172A", color: "white", padding: "64px 20px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}>
          
          {/* Column 1 - Logo & Social */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={42}
                height={42}
                style={{ objectFit: "contain" }}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  The 10th Homes
                </p>
                <p style={{ fontSize: "10px", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  & Apartments Ltd
                </p>
              </div>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "24px" }}>
              Nigeria's trusted real estate platform connecting buyers, investors, and realtors to verified properties across Lagos, Abuja, and beyond.
            </p>
            
            {/* Social Icons with inline SVG */}
            <div style={{ display: "flex", gap: "12px" }}>
              {/* Facebook */}
              <a
                href="https://facebook.com/tharelhomes"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  color: "#94A3B8",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/tharelhomes"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  color: "#94A3B8",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com/tharelhomes"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  color: "#94A3B8",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/tharelhomes"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  color: "#94A3B8",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links (no Realtors) */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Home", "About", "Properties", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    style={{ color: "#94A3B8", fontSize: "13.5px", textDecoration: "none", transition: "color 0.3s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Property Types */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Property Types
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Residential Land", "Commercial Land", "Luxury Duplexes", "Apartments", "Farmland", "Off-plan Developments"].map((item) => (
                <li key={item}>
                  <Link
                    href="/properties"
                    style={{ color: "#94A3B8", fontSize: "13.5px", textDecoration: "none", transition: "color 0.3s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Phone size={16} color="#D4A017" />
                <div>
                  <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "2px" }}>Phone / WhatsApp</p>
                  <a href="tel:08168426592" style={{ color: "#CBD5E1", fontSize: "13.5px", textDecoration: "none" }}>
                    08168426592
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Mail size={16} color="#D4A017" />
                <div>
                  <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "2px" }}>Email</p>
                  <a href="mailto:tharel2024@gmail.com" style={{ color: "#CBD5E1", fontSize: "13.5px", textDecoration: "none" }}>
                    tharel2024@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MapPin size={16} color="#D4A017" />
                <div>
                  <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "2px" }}>Location</p>
                  <p style={{ color: "#CBD5E1", fontSize: "13.5px" }}>Lagos & Abeokuta, Nigeria</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/2348168426592"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#D4A017",
                color: "#1A1A1A",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                marginTop: "24px",
                transition: "all 0.3s ease",
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
              <Phone size={14} />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ color: "#64748B", fontSize: "13px" }}>
            © {new Date().getFullYear()} The 10th Homes & Apartments Real Estate Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#" style={{ color: "#64748B", fontSize: "12.5px", textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: "#64748B", fontSize: "12.5px", textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}