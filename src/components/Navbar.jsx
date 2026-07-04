"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ← import for current path

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // ← current URL path

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

  // Helper to check if a link is active
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
          color: #64748b;
          padding-bottom: 4px;
          transition: color 0.3s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .nv-link:hover { color: #0F172A; }
        .nv-link.active { color: #0F172A; }
        .nv-link::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2.5px;
          background: #D4A017;
          border-radius: 999px;
          transition: width 0.3s ease;
        }
        .nv-link:hover::after,
        .nv-link.active::after { width: 100%; }
        .nv-btn-login {
          font-size: 12.5px;
          font-weight: 600;
          color: #0F172A;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #0F172A;
          transition: all 0.3s ease;
          background: transparent;
          white-space: nowrap;
        }
        .nv-btn-login:hover { background: #0F172A; color: #ffffff; }
        .nv-btn-register {
          font-size: 12.5px;
          font-weight: 700;
          color: #0F172A;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          background: #D4A017;
          border: 1.5px solid #D4A017;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .nv-btn-register:hover { background: #0F172A; color: #D4A017; border-color: #0F172A; }
        .nv-mobile-link {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          transition: color 0.3s ease;
        }
        .nv-mobile-link:hover, .nv-mobile-link.active { color: #0F172A; }
        .brand-name {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-family: var(--font-montserrat), sans-serif;
          white-space: nowrap;
        }
        .brand-short {
          font-size: 10px;
          font-weight: 600;
          color: #D4A017;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 1px;
        }
        @media (max-width: 480px) {
          .brand-name {
            font-size: 9px;
            white-space: normal;
            line-height: 1.2;
          }
          .brand-short {
            font-size: 8px;
          }
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
          backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px)",
          boxShadow: scrolled ? "0 4px 28px rgba(15,23,42,0.10)" : "0 1px 16px rgba(15,23,42,0.05)",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
          transition: "all 0.4s ease",
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
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/logos/logo.png"
              alt="The 10th Homes"
              width={isMobile ? 40 : 56}
              height={isMobile ? 40 : 56}
              priority
              style={{ objectFit: "contain" }}
              onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
            />
            <div style={{ lineHeight: 1.15, maxWidth: isMobile ? "160px" : "none" }}>
              <div className="brand-name">
                The 10th Homes & Apartments Real Estate Ltd
              </div>
              <div className="brand-short">
                T.H.A.R.E.L
              </div>
            </div>
          </Link>

          {!isMobile && (
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                listStyle: "none",
                margin: 0,
                padding: 0,
                flex: 1,
                justifyContent: "center",
              }}
            >
              {navLinks.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={"nv-link " + (active ? "active" : "")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <Link href="/login" className="nv-btn-login">
                Login
              </Link>
              <Link href="/signup" className="nv-btn-register">
                Register
              </Link>
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginLeft: "auto",
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
                }}
              />
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
            backgroundColor: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(24px)",
            maxHeight: menuOpen ? "600px" : "0",
            overflow: "hidden",
            transition: "max-height 0.45s ease",
            boxShadow: "0 12px 40px rgba(15,23,42,0.1)",
          }}
        >
          <div style={{ padding: "20px 28px 32px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={"nv-mobile-link " + (active ? "active" : "")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
              <Link href="/login" className="nv-btn-login" style={{ textAlign: "center", display: "block" }}>
                Login
              </Link>
              <Link href="/signup" className="nv-btn-register" style={{ textAlign: "center", display: "block" }}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}