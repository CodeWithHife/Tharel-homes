"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginWithBackend } from "@/lib/auth";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Star, Building2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    try {
      const result = await loginWithBackend({
        email: form.email,
        password: form.password,
      });

      const user = result.user;
      if (!user || !user.role) {
        throw new Error("No account information returned from server.");
      }

      const role = user.role.toLowerCase();
      if (!user.onboardingDone) {
        router.push("/onboarding");
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "realtor") {
        router.push("/dashboard/realtor");
      } else if (role === "hotel") {
        router.push("/dashboard/hotel");
      } else {
        router.push("/dashboard/buyer");
      }
    } catch (err) {
      setError(err.message || "Unable to sign in right now. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Staggered & Ambient Animations */
        @keyframes authFadeUp {
          from { opacity: 0; transform: translate3d(0, 24px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes authSlideRight {
          from { opacity: 0; transform: translate3d(-30px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes authGlowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1) translate(0, 0); }
          50% { opacity: 0.65; transform: scale(1.15) translate(-20px, 20px); }
        }

        @keyframes authBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.9); }
        }

        @keyframes authShimmerSweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        @keyframes authFloatLogo {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }

        .auth-container {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Left Hero Panel */
        .auth-left-panel {
          position: relative;
          background: linear-gradient(145deg, #0F172A 0%, #080D1A 100%);
          padding: 64px 56px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
          overflow: hidden;
        }

        .auth-left-glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 160, 23, 0.22) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: authGlowPulse 7s ease-in-out infinite;
        }

        .auth-left-glow-bottom {
          position: absolute;
          bottom: -150px;
          left: -100px;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30, 41, 59, 0.8) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .auth-left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.3);
          color: #D4A017;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-brand-logo {
          animation: authFloatLogo 6s ease-in-out infinite;
        }

        .auth-left-title {
          animation: authFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
        }

        .auth-left-copy {
          animation: authFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          opacity: 0;
        }

        .auth-left-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          animation: authSlideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-left-feature:hover {
          background: rgba(212, 160, 23, 0.12);
          border-color: rgba(212, 160, 23, 0.4);
          transform: translate3d(6px, -2px, 0);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .auth-stat-card {
          animation: authFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .auth-stat-card:hover {
          transform: translateY(-3px);
        }

        /* Right Form Side */
        .auth-right-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 36px;
          background: linear-gradient(160deg, #FFFFFF 0%, #F8FAFC 100%);
          position: relative;
        }

        .auth-form-card {
          width: 100%;
          max-width: 440px;
          animation: authFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }

        .auth-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        .auth-input-box:hover {
          border-color: rgba(212, 160, 23, 0.4);
          transform: translateY(-1px);
        }

        .auth-input-box.focused {
          border-color: #D4A017;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.16);
          transform: translateY(-2px);
        }

        .auth-input-box input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14.5px;
          color: #0F172A;
        }

        .auth-submit-btn {
          position: relative;
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid rgba(212, 160, 23, 0.3);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
        }

        .auth-submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }

        .auth-submit-btn:hover::before {
          animation: authShimmerSweep 0.9s ease-in-out;
        }

        .auth-submit-btn:hover {
          background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
          color: #0F172A;
          border-color: #D4A017;
          transform: translateY(-2.5px);
          box-shadow: 0 12px 32px rgba(212, 160, 23, 0.42);
        }

        .auth-submit-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .auth-btn-arrow {
          transition: transform 0.3s ease;
        }

        .auth-submit-btn:hover .auth-btn-arrow {
          transform: translateX(4px);
        }

        /* Mobile Header */
        .auth-mobile-header {
          display: none;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 20px 24px;
          background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
          position: relative;
          overflow: hidden;
          color: #ffffff;
        }

        .auth-mobile-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 160, 23, 0.25) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }

        @media (max-width: 960px) {
          .auth-container {
            grid-template-columns: 1fr;
            background: #0F172A;
          }
          .auth-left-panel { display: none; }
          .auth-mobile-header { display: flex; }
          .auth-right-panel {
            padding: 24px 16px 48px;
            background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
          }
          .auth-form-card {
            background: rgba(255, 255, 255, 0.98);
            border-radius: 24px;
            padding: 32px 24px;
            border: 1px solid rgba(212, 160, 23, 0.3);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 160, 23, 0.15);
          }
        }
      `}</style>

      <div className="auth-container">
        {/* Mobile Header Banner */}
        <div className="auth-mobile-header">
          <div className="auth-mobile-glow" />
          <Image
            src="/images/logos/logo.png"
            alt="The 10th Homes"
            width={48}
            height={48}
            style={{ objectFit: "contain", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))", marginBottom: "10px" }}
            onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
          />
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
            The 10th Homes & Apartments
          </h2>
          <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#D4A017", letterSpacing: "0.12em", textTransform: "uppercase", margin: "2px 0 0" }}>
            REAL ESTATE LTD
          </p>
        </div>

        {/* Left Hero Panel */}
        <div className="auth-left-panel">
          <div className="auth-left-glow" />
          <div className="auth-left-glow-bottom" />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="auth-left-badge">
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#D4A017",
                  animation: "authBadgePulse 2s infinite ease-in-out",
                }}
              />
              <Sparkles size={13} color="#D4A017" />
              <span>Lifetime Realty Partner</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px", marginBottom: "36px" }}>
              <div className="auth-brand-logo">
                <Image
                  src="/images/logos/logo.png"
                  alt="The 10th Homes"
                  width={54}
                  height={54}
                  style={{ objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                  The 10th Homes & Apartments
                </h2>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#D4A017", letterSpacing: "0.12em", textTransform: "uppercase", margin: "2px 0 0" }}>
                  REAL ESTATE LTD
                </p>
              </div>
            </div>

            <h1
              className="auth-left-title"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(32px, 3vw, 44px)",
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              Enhancing Your <br />
              <span style={{ color: "#D4A017" }}>Living Experience.</span>
            </h1>

            <p className="auth-left-copy" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px", marginBottom: "36px" }}>
              Access verified property listings, track title allocations, and manage your real estate journey seamlessly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "440px" }}>
              <div className="auth-left-feature" style={{ animationDelay: "0.25s" }}>
                <ShieldCheck size={20} color="#D4A017" />
                <span>100% Verifiable Legal Documentation & C of O</span>
              </div>
              <div className="auth-left-feature" style={{ animationDelay: "0.35s" }}>
                <Building2 size={20} color="#D4A017" />
                <span>Direct Access to Prime Estates in Lagos & Abuja</span>
              </div>
              <div className="auth-left-feature" style={{ animationDelay: "0.45s" }}>
                <CheckCircle2 size={20} color="#D4A017" />
                <span>Transparent Flexible Payment Instalments</span>
              </div>
            </div>
          </div>

          {/* Stat Footer Card */}
          <div
            className="auth-stat-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              padding: "24px 28px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              maxWidth: "440px",
              marginTop: "40px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "22px", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.1 }}>200+</p>
              <p style={{ fontSize: "11px", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: "4px 0 0" }}>Properties</p>
            </div>
            <div style={{ width: "1px", height: "36px", background: "rgba(255, 255, 255, 0.14)" }} />
            <div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "22px", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.1 }}>2,500+</p>
              <p style={{ fontSize: "11px", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: "4px 0 0" }}>Happy Buyers</p>
            </div>
            <div style={{ width: "1px", height: "36px", background: "rgba(255, 255, 255, 0.14)" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={16} color="#D4A017" fill="#D4A017" />
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff" }}>4.98</span>
              </div>
              <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Top Rated</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-form-card">
            {/* Top Navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#64748B",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#D4A017";
                  e.currentTarget.style.transform = "translateX(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#D4A017",
                  background: "rgba(212, 160, 23, 0.1)",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(212, 160, 23, 0.25)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Secure Portal
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "28px",
                fontWeight: 900,
                color: "#0F172A",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome Back
            </h2>

            <p style={{ color: "#64748B", fontSize: "14.5px", marginBottom: "32px" }}>
              Sign in to manage your saved listings, account, and property applications.
            </p>

            {error && (
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#991B1B",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  marginBottom: "24px",
                  animation: "authFadeUp 0.3s ease",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  EMAIL ADDRESS
                </label>
                <div className={`auth-input-box ${focused === "email" ? "focused" : ""}`}>
                  <Mail size={18} color={focused === "email" ? "#D4A017" : "#94A3B8"} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    placeholder="e.g. name@email.com"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>
                    PASSWORD
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{ fontSize: "12.5px", fontWeight: 700, color: "#D4A017", textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className={`auth-input-box ${focused === "password" ? "focused" : ""}`}>
                  <Lock size={18} color={focused === "password" ? "#D4A017" : "#94A3B8"} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: "12px" }}>
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight size={18} className="auth-btn-arrow" />
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", marginTop: "32px" }}>
              Don't have an account yet?{" "}
              <Link href="/signup" style={{ fontWeight: 800, color: "#D4A017", textDecoration: "none" }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

