"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, KeyRound, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email Request, 2: Reset Form, 3: Success
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState("");

  const handleRequestReset = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setMessage(`A 6-digit verification code has been sent to ${email}`);
    }, 1200);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");

    if (!resetCode || resetCode.length < 4) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1400);
  };

  return (
    <>
      <style>{`
        @keyframes authFadeUp {
          from { opacity: 0; transform: translate3d(0, 24px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes authGlowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.15); }
        }

        @keyframes authBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.9); }
        }

        @keyframes authShimmerSweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
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
          transition: all 0.35s ease;
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
          animation: authFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          transition: all 0.3s ease;
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
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(212, 160, 23, 0.42);
        }

        .auth-mobile-header {
          display: none;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 20px 24px;
          background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
          position: relative;
          color: #ffffff;
        }

        @media (max-width: 960px) {
          .auth-container { grid-template-columns: 1fr; background: #0F172A; }
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
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          }
        }
      `}</style>

      <div className="auth-container">
        {/* Mobile Header Banner */}
        <div className="auth-mobile-header">
          <Image
            src="/images/logos/logo.png"
            alt="The 10th Homes"
            width={48}
            height={48}
            style={{ objectFit: "contain", marginBottom: "10px" }}
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
              <span>Secure Recovery Portal</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px", marginBottom: "36px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={54}
                height={54}
                style={{ objectFit: "contain" }}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              />
              <div>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  The 10th Homes & Apartments
                </h2>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#D4A017", letterSpacing: "0.12em", textTransform: "uppercase", margin: "2px 0 0" }}>
                  REAL ESTATE LTD
                </p>
              </div>
            </div>

            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(32px, 3vw, 44px)",
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              Account <br />
              <span style={{ color: "#D4A017" }}>Password Recovery.</span>
            </h1>

            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px", marginBottom: "36px" }}>
              Enter your registered email address to receive an instant verification code and regain access to your property portal.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
              <div className="auth-left-feature">
                <ShieldCheck size={18} color="#D4A017" />
                <span>Encrypted Security Verification Protocol</span>
              </div>
              <div className="auth-left-feature">
                <KeyRound size={18} color="#D4A017" />
                <span>Instant OTP Code Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-form-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#64748B",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
              >
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </Link>
            </div>

            {step === 1 && (
              <>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "28px", fontWeight: 900, color: "#0F172A", marginBottom: "8px" }}>
                  Reset Password
                </h2>
                <p style={{ color: "#64748B", fontSize: "14.5px", marginBottom: "32px" }}>
                  Enter the email address associated with your account.
                </p>

                {error && (
                  <div style={{ padding: "14px", borderRadius: "12px", background: "#FEF2F2", color: "#991B1B", fontSize: "13.5px", fontWeight: 600, marginBottom: "20px" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleRequestReset}>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      REGISTERED EMAIL
                    </label>
                    <div className={`auth-input-box ${focused === "email" ? "focused" : ""}`}>
                      <Mail size={18} color={focused === "email" ? "#D4A017" : "#94A3B8"} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                        placeholder="e.g. name@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? <span>Sending Code...</span> : <><span>Send Recovery Code</span> <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "28px", fontWeight: 900, color: "#0F172A", marginBottom: "8px" }}>
                  Enter Verification Code
                </h2>
                <p style={{ color: "#64748B", fontSize: "14.5px", marginBottom: "24px" }}>
                  {message}
                </p>

                {error && (
                  <div style={{ padding: "14px", borderRadius: "12px", background: "#FEF2F2", color: "#991B1B", fontSize: "13.5px", fontWeight: 600, marginBottom: "20px" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      VERIFICATION CODE
                    </label>
                    <div className={`auth-input-box ${focused === "code" ? "focused" : ""}`}>
                      <KeyRound size={18} color={focused === "code" ? "#D4A017" : "#94A3B8"} />
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        onFocus={() => setFocused("code")}
                        onBlur={() => setFocused("")}
                        placeholder="Enter code (e.g. 784920)"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      NEW PASSWORD
                    </label>
                    <div className={`auth-input-box ${focused === "newPassword" ? "focused" : ""}`}>
                      <Lock size={18} color={focused === "newPassword" ? "#D4A017" : "#94A3B8"} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setFocused("newPassword")}
                        onBlur={() => setFocused("")}
                        placeholder="Min 8 characters"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                      CONFIRM NEW PASSWORD
                    </label>
                    <div className={`auth-input-box ${focused === "confirmPassword" ? "focused" : ""}`}>
                      <Lock size={18} color={focused === "confirmPassword" ? "#D4A017" : "#94A3B8"} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocused("confirmPassword")}
                        onBlur={() => setFocused("")}
                        placeholder="Repeat new password"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? <span>Updating Password...</span> : <><span>Reset Password</span> <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            )}

            {step === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <CheckCircle2 size={36} color="#22C55E" />
                </div>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "26px", fontWeight: 900, color: "#0F172A", marginBottom: "12px" }}>
                  Password Reset Successful!
                </h2>
                <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
                  Your password has been updated successfully. You can now sign in with your new credentials.
                </p>

                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={() => router.push("/login")}
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
