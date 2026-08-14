"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Sparkles, Share, PlusSquare } from "lucide-react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Don't show if already running in standalone PWA mode
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://"));

    if (isStandalone) return;

    // 2. Check if user dismissed prompt recently
    const dismissedTime = localStorage.getItem("tharel_pwa_dismissed");
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
      // Delay prompt slightly for smooth page entrance
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }

    // 4. Standard PWA Event for Android/Chrome/Edge/Desktop
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted PWA installation");
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("tharel_pwa_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translate3d(-50%, 40px, 0); }
          to { opacity: 1; transform: translate3d(-50%, 0, 0); }
        }

        @keyframes pwaGlow {
          0%, 100% { box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 160, 23, 0.25); }
          50% { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(212, 160, 23, 0.45); }
        }

        .pwa-modal-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 460px;
          background: linear-gradient(145deg, #0F172A 0%, #1E293B 100%);
          border-radius: 22px;
          border: 1px solid rgba(212, 160, 23, 0.35);
          padding: 20px 22px;
          color: #ffffff;
          z-index: 999999;
          font-family: 'Inter', sans-serif;
          animation: pwaSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, pwaGlow 4s ease-in-out infinite;
          backdrop-filter: blur(20px);
        }

        .pwa-install-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
          color: #0F172A;
          font-weight: 800;
          font-size: 13.5px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(212, 160, 23, 0.35);
        }

        .pwa-install-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(212, 160, 23, 0.5);
        }

        .pwa-dismiss-btn {
          padding: 11px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .pwa-dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }
      `}</style>

      <div className="pwa-modal-banner" role="dialog" aria-label="Install App Prompt">
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.5)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#0F172A",
              border: "1px solid rgba(212, 160, 23, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/logos/logo.png"
              alt="Tharel Homes Logo"
              width={38}
              height={38}
              style={{ objectFit: "contain" }}
              onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <Sparkles size={13} color="#D4A017" />
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#D4A017", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Official App
              </span>
            </div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
              Install The 10th Homes App
            </h4>
            <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.7)", margin: "4px 0 0", lineHeight: 1.45 }}>
              Install on your home screen for quick estate browsing and instant property updates.
            </p>
          </div>
        </div>

        {isIOS ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(212, 160, 23, 0.12)",
              border: "1px solid rgba(212, 160, 23, 0.3)",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Share size={18} color="#D4A017" />
            <span>
              Tap <strong style={{ color: "#D4A017" }}>Share</strong> in Safari & choose <strong style={{ color: "#D4A017" }}>Add to Home Screen</strong> <PlusSquare size={14} style={{ verticalAlign: "middle" }} />
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" className="pwa-dismiss-btn" onClick={handleDismiss}>
              Not Now
            </button>
            <button type="button" className="pwa-install-btn" onClick={handleInstallClick}>
              <Download size={16} />
              <span>Install App</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
