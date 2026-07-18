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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth < 960);
    handleResize();
    window.addEventListener("scroll", handleScroll);
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
    { label: "Properties", href: "/properties" },
    { label: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        .nv-link {
          position: relative;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          color: #475569;
          padding-bottom: 4px;
          transition: color 0.25s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .nv-link:hover { color: #0F172A; }
        .nv-link.active { color: #D4A017; }
        .nv-link::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #D4A017;
          border-radius: 999px;
          transition: width 0.25s ease;
        }
        .nv-link:hover::after,
        .nv-link.active::after { width: 100%; }
        .nv-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(15,23,42,0.15);
          color: #0F172A;
          background: transparent;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .nv-icon-btn:hover {
          border-color: #D4A017;
          color: #D4A017;
        }
        .nv-btn-register {
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 8px;
          background: #0F172A;
          border: 1.5px solid #0F172A;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .nv-btn-register:hover { background: #D4A017; color: #0F172A; border-color: #D4A017; }
        .nv-mobile-link {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid rgba(15,23,42,0.08);
          transition: color 0.25s ease;
        }
        .nv-mobile-link:hover, .nv-mobile-link.active { color: #D4A017; }
        .nv-mobile-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .nv-mobile-btn-login {
          border: 1.5px solid #D4A017;
          color: #D4A017;
          background: transparent;
        }
        .nv-mobile-btn-login:hover { background: #D4A017; color: #0F172A; }
        .nv-mobile-btn-register {
          background: #0F172A;
          color: #ffffff;
          border: 1.5px solid #0F172A;
        }
        .nv-mobile-btn-register:hover { background: #D4A017; color: #0F172A; border-color: #D4A017; }
        .nv-hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .nv-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #0F172A;
          transition: all 0.25s ease;
        }
        .nv-hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        .nv-hamburger.open span:nth-child(2) { opacity: 0; }
        .nv-hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }
        .brand-name {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-family: var(--font-montserrat), sans-serif;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .brand-name { font-size: 9px; white-space: normal; line-height: 1.2; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: "74px",
          display: "flex",
          alignItems: "center",
          background: "#f5efe6",
          boxShadow: scrolled ? "0 2px 16px rgba(15,23,42,0.06)" : "none",
          borderBottom: "1px solid rgba(15,23,42,0.05)",
          transition: "all 0.3s ease",
          fontFamily: "var(--font-inter), sans-serif",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
            <Image
              src="/images/logos/logo.png"
              alt="The 10th Homes"
              width={isMobile ? 40 : 52}
              height={isMobile ? 40 : 52}
              priority
              style={{ objectFit: "contain" }}
              onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
            />
            <div style={{ lineHeight: 1.15, maxWidth: isMobile ? "160px" : "none" }}>
              <div className="brand-name">The 10th Homes & Apartments Real Estate Ltd</div>
            </div>
          </Link>

          {!isMobile && (
            <ul style={{ display: "flex", alignItems: "center", gap: "28px", listStyle: "none", margin: 0, padding: 0, flex: 1, justifyContent: "center" }}>
              {navLinks.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={"nv-link " + (active ? "active" : "")}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <Link href="/login" className="nv-icon-btn" aria-label="Account">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4.5 20c1.6-3.6 5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" />
                </svg>
              </Link>
              <Link href="/signup" className="nv-btn-register">Sign up</Link>
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} className={"nv-hamburger " + (menuOpen ? "open" : "")} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          )}
        </div>
      </nav>

      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: "74px",
            left: 0,
            width: "100%",
            zIndex: 999,
            background: "#f5efe6",
            maxHeight: menuOpen ? "600px" : "0",
            overflow: "hidden",
            transition: "max-height 0.45s ease",
            boxShadow: "0 12px 40px rgba(15,23,42,0.1)",
            borderBottom: "1px solid rgba(15,23,42,0.06)",
          }}
        >
          <div style={{ padding: "20px 28px 32px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <li key={item.label}>
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className={"nv-mobile-link " + (active ? "active" : "")}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
              <Link href="/login" className="nv-mobile-btn nv-mobile-btn-login">Login</Link>
              <Link href="/signup" className="nv-mobile-btn nv-mobile-btn-register">Sign up</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}