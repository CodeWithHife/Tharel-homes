"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Sparkles, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkPWA = () => {
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone === true ||
          document.referrer.includes("android-app://");
        setIsPWA(isStandalone);
      };

      checkPWA();

      const mediaQuery = window.matchMedia("(display-mode: standalone)");
      const handler = (e) => setIsPWA(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
      }
    }
  }, []);

  // Hide bottom nav if not in PWA mode or on dashboard pages
  if (!isPWA || pathname.startsWith("/dashboard") || pathname.startsWith("/properties")) return null;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        .bottom-nav-bar {
          display: none;
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 24px);
          max-width: 480px;
          height: 64px;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 999px;
          border: 1px solid rgba(212, 160, 23, 0.3);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 160, 23, 0.15);
          z-index: 10000;
          align-items: center;
          justify-content: space-around;
          padding: 0 10px;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 10.5px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .bottom-nav-item:hover, .bottom-nav-item.active {
          color: #D4A017;
        }

        .bottom-nav-item.active {
          background: rgba(212, 160, 23, 0.15);
          transform: translateY(-2px);
        }

        .bottom-nav-dot {
          position: absolute;
          top: 4px;
          right: 12px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D4A017;
          box-shadow: 0 0 8px rgba(212, 160, 23, 0.9);
        }

        @media all and (display-mode: standalone) {
          .bottom-nav-bar {
            display: flex !important;
          }
          body {
            padding-bottom: 76px !important;
          }
        }
      `}</style>

      <nav className="bottom-nav-bar" aria-label="Mobile PWA Bottom Navigation">
        <Link href="/" className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}>
          {isActive("/") && <span className="bottom-nav-dot" />}
          <Home size={19} color={isActive("/") ? "#D4A017" : "rgba(255, 255, 255, 0.65)"} />
          <span>Home</span>
        </Link>

        <Link href="/properties" className={`bottom-nav-item ${isActive("/properties") ? "active" : ""}`}>
          {isActive("/properties") && <span className="bottom-nav-dot" />}
          <Building2 size={19} color={isActive("/properties") ? "#D4A017" : "rgba(255, 255, 255, 0.65)"} />
          <span>Estates</span>
        </Link>

        <Link href="/services" className={`bottom-nav-item ${isActive("/services") ? "active" : ""}`}>
          {isActive("/services") && <span className="bottom-nav-dot" />}
          <Sparkles size={19} color={isActive("/services") ? "#D4A017" : "rgba(255, 255, 255, 0.65)"} />
          <span>Services</span>
        </Link>

        <a
          href="https://wa.me/2348168426592"
          target="_blank"
          rel="noopener noreferrer"
          className="bottom-nav-item"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#D4A017">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span style={{ color: "#D4A017", fontWeight: 700 }}>WhatsApp</span>
        </a>

        <Link href="/login" className={`bottom-nav-item ${isActive("/login") || isActive("/signup") ? "active" : ""}`}>
          {(isActive("/login") || isActive("/signup")) && <span className="bottom-nav-dot" />}
          <User size={19} color={isActive("/login") || isActive("/signup") ? "#D4A017" : "rgba(255, 255, 255, 0.65)"} />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
}
