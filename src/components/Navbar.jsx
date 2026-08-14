"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => setIsMobile(window.innerWidth < 960);
    
    handleResize();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        /* Custom Navbar Keyframes & Animations */
        @keyframes nvLogoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(0.8deg); }
        }

        @keyframes nvShimmerSweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes nvPulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 6px rgba(212,160,23,0.6); }
          50% { opacity: 1; transform: scale(1.3); box-shadow: 0 0 12px rgba(212,160,23,0.9); }
        }

        @keyframes nvMobileSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes nvItemFadeIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Desktop Nav Link Styling */
        .nv-link {
          position: relative;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          color: #475569;
          padding: 8px 16px;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          letter-spacing: 0.01em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nv-link:hover {
          color: #0F172A;
          background: rgba(212, 160, 23, 0.08);
          transform: translateY(-1.5px);
        }

        .nv-link.active {
          color: #0F172A;
          font-weight: 700;
          background: rgba(212, 160, 23, 0.14);
          box-shadow: inset 0 0 0 1px rgba(212, 160, 23, 0.25);
        }

        /* Underline indicator animation */
        .nv-link-indicator {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg, #D4A017, #F59E0B);
          border-radius: 999px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nv-link:hover .nv-link-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        .nv-link.active .nv-link-indicator {
          transform: translateX(-50%) scaleX(1.4);
          height: 2.5px;
        }

        /* Active Glow Dot */
        .nv-active-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D4A017;
          animation: nvPulseGlow 2s infinite ease-in-out;
        }

        /* Login / Account Icon Button */
        .nv-icon-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(15, 23, 42, 0.12);
          color: #0F172A;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          overflow: hidden;
        }

        .nv-icon-btn:hover {
          border-color: #D4A017;
          color: #D4A017;
          background: #0F172A;
          transform: translateY(-2px) rotate(6deg);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.15);
        }

        .nv-icon-btn svg {
          transition: transform 0.3s ease;
        }

        .nv-icon-btn:hover svg {
          transform: scale(1.1);
        }

        /* Register CTA Button with Sweep Shimmer */
        .nv-btn-register {
          position: relative;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          border: 1px solid rgba(212, 160, 23, 0.3);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }

        .nv-btn-register::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }

        .nv-btn-register:hover::before {
          animation: nvShimmerSweep 1s ease-in-out infinite;
        }

        .nv-btn-register:hover {
          background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
          color: #0F172A;
          border-color: #D4A017;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 160, 23, 0.35);
        }

        .nv-btn-register:active {
          transform: translateY(0) scale(0.97);
        }

        .nv-btn-arrow {
          transition: transform 0.3s ease;
        }

        .nv-btn-register:hover .nv-btn-arrow {
          transform: translateX(4px);
        }

        /* Mobile Hamburger Animation */
        .nv-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.08);
          cursor: pointer;
          padding: 8px;
          transition: all 0.3s ease;
        }

        .nv-hamburger:hover {
          background: rgba(212, 160, 23, 0.12);
          border-color: rgba(212, 160, 23, 0.3);
        }

        .nv-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #0F172A;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
          transform-origin: center;
        }

        .nv-hamburger.open {
          background: #0F172A;
        }

        .nv-hamburger.open span {
          background: #D4A017;
        }

        .nv-hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .nv-hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .nv-hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Brand Styling */
        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .brand-container:hover {
          transform: scale(1.02);
        }

        .brand-logo-wrapper {
          position: relative;
          animation: nvLogoFloat 5s ease-in-out infinite;
        }

        .brand-name {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .brand-container:hover .brand-name {
          color: #B8860B;
        }

        /* Mobile Menu Stagger */
        .nv-mobile-item {
          opacity: 0;
          animation: nvItemFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .nv-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          padding: 14px 16px;
          border-radius: 10px;
          transition: all 0.25s ease;
          margin-bottom: 4px;
        }

        .nv-mobile-link:hover, .nv-mobile-link.active {
          color: #0F172A;
          background: rgba(212, 160, 23, 0.12);
          padding-left: 20px;
        }

        .nv-mobile-link.active {
          font-weight: 700;
          color: #B8860B;
        }

        @media (max-width: 480px) {
          .brand-name { font-size: 9.5px; white-space: normal; line-height: 1.2; }
        }
      `}</style>



      <header
        style={{
          position: "fixed",
          top: scrolled ? "10px" : "0px",
          left: "50%",
          transform: "translateX(-50%)",
          width: scrolled ? "calc(100% - 24px)" : "100%",
          maxWidth: scrolled ? "1280px" : "100%",
          zIndex: 1000,
          height: scrolled ? (isMobile ? "68px" : "72px") : "84px",
          display: "flex",
          alignItems: "center",
          background: scrolled
            ? "rgba(245, 239, 230, 0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          boxShadow: scrolled
            ? "0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 0 20px rgba(212, 160, 23, 0.12)"
            : "none",
          borderRadius: scrolled ? "16px" : "0px",
          border: scrolled
            ? "1px solid rgba(212, 160, 23, 0.22)"
            : "none",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "'Inter', sans-serif",
          padding: isMobile ? "0 16px" : "0 28px",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo Brand */}
          <Link href="/" className="brand-container">
            <div className="brand-logo-wrapper">
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={scrolled ? (isMobile ? 44 : 54) : isMobile ? 50 : 64}
                height={scrolled ? (isMobile ? 44 : 54) : isMobile ? 50 : 64}
                priority
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 10px rgba(15,23,42,0.12))",
                  transition: "all 0.3s ease",
                }}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              />
            </div>
            <div style={{ lineHeight: 1.15, maxWidth: isMobile ? "150px" : "none" }}>
              <div className="brand-name">The 10th Homes & Apartments</div>
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#B8860B", letterSpacing: "0.08em" }}>
                REAL ESTATE LTD
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                listStyle: "none",
                margin: 0,
                padding: "4px 8px",
                background: "rgba(15, 23, 42, 0.03)",
                borderRadius: "999px",
                border: "1px solid rgba(15, 23, 42, 0.04)",
                flex: 1,
                justifyContent: "center",
                maxWidth: "540px",
              }}
            >
              {navLinks.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={`nv-link ${active ? "active" : ""}`}>
                      {active && <span className="nv-active-dot" />}
                      <span>{item.label}</span>
                      <span className="nv-link-indicator" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Desktop Right Action Buttons */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <Link href="/login" className="nv-icon-btn" aria-label="Account Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4.5 20c1.6-3.6 5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" />
                </svg>
              </Link>
              <Link href="/signup" className="nv-btn-register">
                <span>Get Started</span>
                <svg className="nv-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`nv-hamburger ${menuOpen ? "open" : ""}`}
              aria-label="Toggle Navigation Menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Animated Dropdown Drawer */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: scrolled ? "82px" : "84px",
            left: 0,
            width: "100%",
            zIndex: 999,
            padding: "0 16px",
            pointerEvents: menuOpen ? "auto" : "none",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              background: "rgba(245, 239, 230, 0.96)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15), 0 0 15px rgba(212, 160, 23, 0.15)",
              border: "1px solid rgba(212, 160, 23, 0.25)",
              animation: menuOpen ? "nvMobileSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((item, index) => {
                const active = isActiveLink(item.href);
                return (
                  <li
                    key={item.label}
                    className="nv-mobile-item"
                    style={{ animationDelay: `${index * 0.05 + 0.05}s` }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`nv-mobile-link ${active ? "active" : ""}`}
                    >
                      <span>{item.label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="nv-mobile-item"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(15, 23, 42, 0.08)",
                animationDelay: `${navLinks.length * 0.05 + 0.05}s`,
              }}
            >
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0F172A",
                  background: "rgba(15, 23, 42, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  textAlign: "center",
                }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0F172A",
                  background: "linear-gradient(135deg, #D4A017 0%, #B8860B 100%)",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(212, 160, 23, 0.3)",
                  textAlign: "center",
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}