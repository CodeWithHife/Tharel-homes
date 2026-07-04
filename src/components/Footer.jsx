"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "#0F172A",
      color: "white",
      padding: "32px 20px 24px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "24px",
          marginBottom: "24px",
        }}>
          {/* Column 1 – Logo + Social */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              />
              <div>
                <p style={{ fontSize: "12px", fontWeight: 800, color: "white", letterSpacing: "0.04em" }}>
                  The 10th Homes
                </p>
                <p style={{ fontSize: "9px", color: "#D4A017", letterSpacing: "0.08em" }}>
                  & Apartments Ltd
                </p>
              </div>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "12px", lineHeight: 1.5, marginBottom: "12px" }}>
              Nigeria's trusted real estate platform.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["facebook", "instagram", "twitter", "youtube"].map((platform) => {
                const href = `https://${platform}.com/tharelhomes`;
                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                      color: "#94A3B8",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#D4A017";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "#94A3B8";
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {platform === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                      {platform === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>}
                      {platform === "twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                      {platform === "youtube" && <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" /></>}
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 – Quick Links (now using dedicated pages) */}
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#D4A017" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              {["Home", "About", "Services", "Properties", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    style={{
                      color: "#94A3B8",
                      fontSize: "12px",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Contact */}
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#D4A017" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={14} color="#D4A017" />
                <a href="tel:08168426592" style={{ color: "#CBD5E1", fontSize: "12px", textDecoration: "none" }}>
                  08168426592
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={14} color="#D4A017" />
                <a href="mailto:tharel2024@gmail.com" style={{ color: "#CBD5E1", fontSize: "12px", textDecoration: "none" }}>
                  tharel2024@gmail.com
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={14} color="#D4A017" />
                <span style={{ color: "#CBD5E1", fontSize: "12px" }}>Lagos & Abeokuta</span>
              </div>
            </div>
            <a
              href="https://wa.me/2348168426592"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#D4A017",
                color: "#0F172A",
                padding: "6px 14px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "11px",
                textDecoration: "none",
                marginTop: "12px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#b8860c";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4A017";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Phone size={12} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ color: "#64748B", fontSize: "11px" }}>
            © {new Date().getFullYear()} The 10th Homes & Apartments Ltd.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "#64748B", fontSize: "11px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#D4A017"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Privacy
            </a>
            <a href="#" style={{ color: "#64748B", fontSize: "11px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#D4A017"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}