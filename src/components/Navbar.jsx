"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);

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
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Properties", href: "/properties" },
    // "Realtors" removed
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <style>{`
        .nv-link {
          position: relative;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: #64748b;
          padding-bottom: 6px;
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
          font-size: 13.5px;
          font-weight: 600;
          color: #0F172A;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 8px;
          border: 1.5px solid #0F172A;
          transition: all 0.3s ease;
          background: transparent;
          white-space: nowrap;
        }
        .nv-btn-login:hover { background: #0F172A; color: #ffffff; }
        .nv-btn-register {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 8px;
          background: #D4A017;
          border: 1.5px solid #D4A017;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .nv-btn-register:hover { background: #0F172A; color: #D4A017; border-color: #0F172A; }
        .nv-mobile-link {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
          text-decoration: none;
          padding: 13px 0;
          border-bottom: 1px solid #f1f5f9;
          transition: color 0.3s ease;
        }
        .nv-mobile-link:hover, .nv-mobile-link.active { color: #0F172A; }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: "90px", // increased slightly to fit bigger logo
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
            gap: "20px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px", // more gap for larger logo
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/logos/logo.png"
              alt="The 10th Homes"
              width={72} // increased from 56
              height={72}
              priority
              style={{ objectFit: "contain" }}
              onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: "20px", // slightly bigger to match logo
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                The 10th Homes
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#D4A017",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                T.H.A.R.E.l
              </div>
            </div>
          </Link>

          {!isMobile && (
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                listStyle: "none",
                margin: 0,
                padding: 0,
                flex: 1,
                justifyContent: "center",
              }}
            >
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveLink(item.label)}
                    className={"nv-link " + (activeLink === item.label ? "active" : "")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginLeft: "auto",
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  display: "block",
                  width: "25px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "25px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "25px",
                  height: "2px",
                  background: "#0F172A",
                  transition: "all 0.3s",
                  transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
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
            top: "90px", // match navbar height
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
          <div style={{ padding: "20px 36px 36px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setActiveLink(item.label);
                      setMenuOpen(false);
                    }}
                    className={"nv-mobile-link " + (activeLink === item.label ? "active" : "")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
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