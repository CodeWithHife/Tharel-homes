"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signupWithBackend } from "@/lib/auth";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Building2, CheckCircle2, UserCheck, KeyRound } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2)
      e.firstName = "First name must be at least 2 characters.";
    if (!form.lastName.trim() || form.lastName.trim().length < 2)
      e.lastName = "Last name must be at least 2 characters.";
    if (!form.email || !form.email.includes("@"))
      e.email = "Enter a valid email address.";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!agreeTerms) setTermsError("You must agree to the Terms of Service.");
    else setTermsError("");
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms of Service.");
      return;
    }
    setLoading(true);

    try {
      await signupWithBackend({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      router.push("/onboarding");
    } catch (err) {
      setErrors({ email: err.message || "Unable to create your account." });
    } finally {
      setLoading(false);
    }
  };

  let strength = 0;
  if (form.password.length >= 8) strength++;
  if (/[A-Z]/.test(form.password)) strength++;
  if (/[0-9]/.test(form.password)) strength++;
  if (/[^A-Za-z0-9]/.test(form.password)) strength++;
  const strengthColors = ["#E2E8F0", "#EF4444", "#F59E0B", "#3B82F6", "#22C55E"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

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

        .auth-testimonial-card {
          animation: authFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .auth-testimonial-card:hover {
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
          max-width: 460px;
          animation: authFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }

        .auth-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
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

        .auth-input-box.has-error {
          border-color: #EF4444;
        }

        .auth-input-box input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #0F172A;
        }

        .role-chip {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          color: #64748B;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .role-chip:hover {
          border-color: rgba(212, 160, 23, 0.5);
          color: #0F172A;
          transform: translateY(-2px);
        }

        .role-chip.active {
          border-color: #D4A017;
          background: #0F172A;
          color: #D4A017;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.18);
          transform: translateY(-2px);
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
              <span>Join The 10th Network</span>
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
              Start Your <br />
              <span style={{ color: "#D4A017" }}>Property Journey.</span>
            </h1>

            <p className="auth-left-copy" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px", marginBottom: "36px" }}>
              Join thousands of discerning property buyers, realtors, and hotel managers accessing Nigeria's premier estate platform.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
              <div className="auth-left-feature" style={{ animationDelay: "0.25s" }}>
                <ShieldCheck size={18} color="#D4A017" />
                <span>Instant Property Verification & Legal Transparency</span>
              </div>
              <div className="auth-left-feature" style={{ animationDelay: "0.35s" }}>
                <Building2 size={18} color="#D4A017" />
                <span>Seamless Account Dashboard & Real-Time Tracking</span>
              </div>
              <div className="auth-left-feature" style={{ animationDelay: "0.45s" }}>
                <CheckCircle2 size={18} color="#D4A017" />
                <span>Dedicated 24/7 Client Advisory Support</span>
              </div>
            </div>
          </div>

          <div
            className="auth-testimonial-card"
            style={{
              padding: "20px 24px",
              borderRadius: "18px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              maxWidth: "420px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.85)", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
              "The registration process was seamless. Within minutes, I had access to verified title documents for my Lekki investment."
            </p>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#D4A017", margin: "10px 0 0" }}>
              — Chief O. Adebayo, Verified Buyer
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-form-card">
            {/* Top Navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
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
                Create Account
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "28px",
                fontWeight: 900,
                color: "#0F172A",
                marginBottom: "6px",
                letterSpacing: "-0.02em",
              }}
            >
              Create Account
            </h2>

            <p style={{ color: "#64748B", fontSize: "14.5px", marginBottom: "24px" }}>
              Join Tharel Homes to unlock premium listings and personalized dashboards.
            </p>

            {errors.email && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#991B1B",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  marginBottom: "20px",
                  animation: "authFadeUp 0.3s ease",
                }}
              >
                {errors.email}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection Chips */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  I AM A
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className={`role-chip ${form.role === "buyer" ? "active" : ""}`}
                    onClick={() => setForm({ ...form, role: "buyer" })}
                  >
                    <UserCheck size={16} />
                    <span>Buyer</span>
                  </button>
                  <button
                    type="button"
                    className={`role-chip ${form.role === "realtor" ? "active" : ""}`}
                    onClick={() => setForm({ ...form, role: "realtor" })}
                  >
                    <Building2 size={16} />
                    <span>Realtor</span>
                  </button>
                  <button
                    type="button"
                    className={`role-chip ${form.role === "hotel" ? "active" : ""}`}
                    onClick={() => setForm({ ...form, role: "hotel" })}
                  >
                    <KeyRound size={16} />
                    <span>Hotel</span>
                  </button>
                </div>
              </div>

              {/* First & Last Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    FIRST NAME
                  </label>
                  <div className={`auth-input-box ${focused === "firstName" ? "focused" : ""} ${errors.firstName ? "has-error" : ""}`}>
                    <User size={16} color={focused === "firstName" ? "#D4A017" : "#94A3B8"} />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocused("firstName")}
                      onBlur={() => setFocused("")}
                      placeholder="e.g. John"
                      required
                    />
                  </div>
                  {errors.firstName && <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>{errors.firstName}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    LAST NAME
                  </label>
                  <div className={`auth-input-box ${focused === "lastName" ? "focused" : ""} ${errors.lastName ? "has-error" : ""}`}>
                    <User size={16} color={focused === "lastName" ? "#D4A017" : "#94A3B8"} />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocused("lastName")}
                      onBlur={() => setFocused("")}
                      placeholder="e.g. Adebayo"
                      required
                    />
                  </div>
                  {errors.lastName && <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>{errors.lastName}</p>}
                </div>
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  EMAIL ADDRESS
                </label>
                <div className={`auth-input-box ${focused === "email" ? "focused" : ""} ${errors.email ? "has-error" : ""}`}>
                  <Mail size={16} color={focused === "email" ? "#D4A017" : "#94A3B8"} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    placeholder="e.g. john@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  PASSWORD
                </label>
                <div className={`auth-input-box ${focused === "password" ? "focused" : ""} ${errors.password ? "has-error" : ""}`}>
                  <Lock size={16} color={focused === "password" ? "#D4A017" : "#94A3B8"} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    placeholder="Min 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {form.password.length > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "999px",
                            background: strength >= n ? strengthColors[strength] : "#E2E8F0",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                      Password Strength: <span style={{ fontWeight: 700, color: "#0F172A" }}>{strengthLabels[strength]}</span>
                    </p>
                  </div>
                )}
                {errors.password && <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  CONFIRM PASSWORD
                </label>
                <div className={`auth-input-box ${focused === "confirmPassword" ? "focused" : ""} ${errors.confirmPassword ? "has-error" : ""}`}>
                  <Lock size={16} color={focused === "confirmPassword" ? "#D4A017" : "#94A3B8"} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocused("confirmPassword")}
                    onBlur={() => setFocused("")}
                    placeholder="Repeat your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 0 }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    setTermsError("");
                  }}
                  style={{ width: "16px", height: "16px", accentColor: "#D4A017", marginTop: "3px", cursor: "pointer" }}
                />
                <label htmlFor="terms" style={{ fontSize: "13px", color: "#64748B", cursor: "pointer", lineHeight: 1.5 }}>
                  I agree to the{" "}
                  <Link href="/terms" style={{ fontWeight: 700, color: "#D4A017", textDecoration: "none" }}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" style={{ fontWeight: 700, color: "#D4A017", textDecoration: "none" }}>
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {termsError && <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "-12px", marginBottom: "16px" }}>{termsError}</p>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={18} className="auth-btn-arrow" />
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", marginTop: "28px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ fontWeight: 800, color: "#D4A017", textDecoration: "none" }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}