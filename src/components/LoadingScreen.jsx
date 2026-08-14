"use client";

import Image from "next/image";

export default function LoadingScreen({ message = "The 10th Homes · Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        height: "100dvh",
        width: "100vw",
        background: "linear-gradient(160deg, #071521 0%, #0B2B3B 50%, #0F172A 100%)",
        padding: "24px 16px",
        boxSizing: "border-box",
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "48px",
          height: "48px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/images/logos/logo.png"
          alt="The 10th Homes"
          width={48}
          height={48}
          style={{ objectFit: "contain" }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>

      <div className="tharel-loader-spinner" />

      <p
        style={{
          marginTop: "20px",
          color: "#F5D061",
          fontSize: "clamp(12px, 3.6vw, 14.5px)",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "'Montserrat', sans-serif",
          textAlign: "center",
          maxWidth: "340px",
          width: "100%",
          lineHeight: 1.5,
          padding: "0 10px",
          boxSizing: "border-box",
        }}
      >
        {message}
      </p>

      <style>{`
        .tharel-loader-spinner {
          width: clamp(44px, 11vw, 56px);
          height: clamp(44px, 11vw, 56px);
          border: 3.5px solid rgba(212, 160, 23, 0.18);
          border-top: 3.5px solid #D4A017;
          border-right: 3.5px solid #F5D061;
          border-radius: 50%;
          animation: tharelSpin 0.75s linear infinite;
          box-shadow: 0 0 25px rgba(212, 160, 23, 0.35);
        }
        @keyframes tharelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
