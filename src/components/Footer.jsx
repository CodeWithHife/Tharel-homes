"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #080D1A 100%)",
        color: "#ffffff",
        padding: "70px 0 30px",
        borderTop: "1px solid rgba(212, 160, 23, 0.2)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes footerPulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.1); }
        }

        .footer-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer-social-btn:hover {
          background: #D4A017;
          border-color: #D4A017;
          color: #0F172A;
          transform: translate3d(0, -4px, 0) rotate(6deg);
          box-shadow: 0 6px 18px rgba(212, 160, 23, 0.4);
        }

        .footer-link-item {
          color: #94A3B8;
          font-size: 13.5px;
          text-decoration: none;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer-link-item:hover {
          color: #D4A017;
          transform: translateX(4px);
        }

        .footer-scroll-top {
          position: absolute;
          top: -22px;
          right: 40px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #D4A017;
          color: #0F172A;
          border: 3px solid #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          z-index: 10;
        }

        .footer-scroll-top:hover {
          background: #ffffff;
          color: #D4A017;
          transform: translate3d(0, -4px, 0) scale(1.1);
        }
      `}</style>

      {/* Back To Top Floating Button */}
      <button onClick={scrollToTop} className="footer-scroll-top" aria-label="Scroll Back to Top">
        <ArrowUp size={20} strokeWidth={3} />
      </button>

      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(circle, rgba(212, 160, 23, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "footerPulseGlow 8s ease-in-out infinite",
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* 4 Footer Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "56px",
          }}
        >
          {/* Col 1: Brand Logo & Info */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={44}
                height={44}
                style={{ objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.02em", fontFamily: "'Montserrat', sans-serif" }}>
                  The 10th Homes
                </p>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#D4A017", letterSpacing: "0.08em" }}>
                  & APARTMENTS REAL ESTATE LTD
                </p>
              </div>
            </Link>

            <p style={{ color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "20px" }}>
              Nigeria's premier real estate platform. Transparent property acquisitions, legal title verification, and flexible investment structures.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/share/1D32ewJt3c/",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/tharelhomesandproperties?igsh=dWJ5YnMzdmd4ZWY2",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  name: "YouTube",
                  href: "https://www.youtube.com/@tharelhomesandproperties",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: "TikTok",
                  href: "https://vm.tiktok.com/ZS9NqjKBahcQC-xwDvK/",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.57a6.34 6.34 0 0 0 10.86 4.47v-8.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.07z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A017", marginBottom: "18px" }}>
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Contact Us", href: "/contact" },
                { label: "Account Login", href: "/login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link-item">
                    <span>›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Locations */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A017", marginBottom: "18px" }}>
              Prime Locations
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Lekki & Ajah, Lagos",
                "Ibeju-Lekki & Epe",
                "Maitama & Guzape, Abuja",
                "GRA Phase 2, Port Harcourt",
                "Mowe & Abeokuta, Ogun",
              ].map((loc) => (
                <li key={loc}>
                  <span className="footer-link-item" style={{ cursor: "default" }}>
                    <span>›</span>
                    <span>{loc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Concierge */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A017", marginBottom: "18px" }}>
              Concierge Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
              <a href="tel:08168426592" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#CBD5E1", fontSize: "13.5px", textDecoration: "none" }}>
                <Phone size={16} color="#D4A017" />
                <span>08168426592</span>
              </a>
              <a href="mailto:tharel2024@gmail.com" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#CBD5E1", fontSize: "13.5px", textDecoration: "none" }}>
                <Mail size={16} color="#D4A017" />
                <span>tharel2024@gmail.com</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#CBD5E1", fontSize: "13.5px" }}>
                <MapPin size={16} color="#D4A017" />
                <span>Lagos & Abeokuta, Nigeria</span>
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
                padding: "10px 18px",
                borderRadius: "10px",
                background: "#D4A017",
                color: "#0F172A",
                fontWeight: 700,
                fontSize: "12.5px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(212, 160, 23, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <Phone size={14} />
              <span>Instant WhatsApp Help</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ color: "#64748B", fontSize: "12px", margin: 0 }}>
            © {new Date().getFullYear()} The 10th Homes & Apartments Real Estate Ltd. All rights reserved.
          </p>

          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#" style={{ color: "#64748B", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#D4A017"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: "#64748B", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#D4A017"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Terms of Service
            </a>
            <a href="#" style={{ color: "#64748B", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#D4A017"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Title Verification
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}