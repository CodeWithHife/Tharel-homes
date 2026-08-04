"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithBackend } from "@/lib/auth";

export default function SignupPage() {
  var router = useRouter();
  var [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  var [showPassword, setShowPassword] = useState(false);
  var [showConfirm, setShowConfirm] = useState(false);
  var [loading, setLoading] = useState(false);
  var [errors, setErrors] = useState({});
  var [focused, setFocused] = useState("");
  var [agreeTerms, setAgreeTerms] = useState(false);
  var [termsError, setTermsError] = useState("");

  function validate() {
    var e = {};
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
    if (!agreeTerms) setTermsError("You must agree to the Terms of Service");
    else setTermsError("");
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    var errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms of Service");
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
  }

  var strength = 0;
  if (form.password.length >= 8) strength++;
  if (/[A-Z]/.test(form.password)) strength++;
  if (/[0-9]/.test(form.password)) strength++;
  if (/[^A-Za-z0-9]/.test(form.password)) strength++;
  var strengthColors = ["#e2e8f0", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
  var strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #F4EFE6; font-family: 'Inter', sans-serif; }

        .auth-page {
          min-height: 100vh;
          width: 100%;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #F6F1E7 0%, #EDEEF3 55%, #E7EBF4 100%);
        }

        .auth-shell {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: minmax(360px, 0.95fr) minmax(440px, 1.05fr);
        }

        .auth-hero-panel {
          position: relative;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #12172B;
          overflow: hidden;
        }

        .auth-hero-panel::before {
          content: "10";
          position: absolute;
          font-weight: 900;
          font-size: 520px;
          line-height: 1;
          color: rgba(18,23,43,0.04);
          right: -70px;
          bottom: -110px;
          pointer-events: none;
          user-select: none;
        }

        .auth-hero-panel::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(100deg, transparent 30%, rgba(212,160,23,0.14) 47%, transparent 62%);
          animation: sweep 9s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sweep {
          0%   { transform: translateX(-25%); }
          50%  { transform: translateX(15%); }
          100% { transform: translateX(-25%); }
        }

        .auth-hero-panel > * { position: relative; z-index: 1; }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6B7280;
        }
        .auth-badge::before {
          content: "";
          width: 20px;
          height: 2px;
          background: #D4A017;
          display: inline-block;
        }

        .auth-brand-row { display: flex; align-items: center; gap: 14px; margin-top: 28px; }
        .auth-brand-icon {
          width: 46px; height: 46px;
          border-radius: 14px;
          background: #12172B;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-brand-icon svg { width: 20px; height: 20px; stroke: #D4A017; fill: none; stroke-width: 1.8; }
        .auth-brand-name { font-size: 15.5px; font-weight: 800; letter-spacing: 0.01em; line-height: 1.3; }
        .auth-brand-sub { font-size: 10.5px; color: #8b8f9a; margin-top: 3px; letter-spacing: 0.16em; text-transform: uppercase; }

        .auth-hero-title {
          font-size: clamp(30px, 3vw, 44px);
          line-height: 1.14;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 30px 0 14px;
          max-width: 440px;
          color: #12172B;
        }
        .auth-hero-copy { font-size: 14.5px; color: #5b6270; line-height: 1.8; max-width: 400px; font-weight: 400; }

        .auth-side {
          padding: 56px 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-card { width: 100%; max-width: 420px; }

        .auth-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
        .auth-home-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 600; color: #6B7280;
          text-decoration: none; letter-spacing: 0.02em;
        }
        .auth-home-link:hover { color: #D4A017; }
        .auth-home-link svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; }
        .auth-top-pill {
          padding: 6px 12px;
          border-radius: 999px;
          background: #F4EFE6;
          color: #9a8146;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }

        .auth-card-title { font-size: 26px; font-weight: 800; color: #12172B; margin-bottom: 6px; letter-spacing: -0.01em; }
        .auth-card-copy { font-size: 14px; color: #6B7280; margin-bottom: 20px; line-height: 1.6; }

        .auth-error-box { background: #fdf2f2; border-left: 2px solid #c0392b; color: #a4302a; font-size: 13px; padding: 12px 14px; margin-bottom: 20px; letter-spacing: 0.01em; border-radius: 8px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { margin-bottom: 14px; }
        .form-label { display: block; font-size: 11.5px; font-weight: 700; color: #12172B; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; }
        .form-field-error { font-size: 12px; color: #ef4444; margin-top: 5px; }
        .form-input-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 15px;
          border-radius: 12px;
          border: 1.5px solid #e7e2d6;
          background: #FBFAF6;
          transition: border-color .25s, background .25s;
        }
        .form-input-wrap.focused { border-color: #D4A017; background: #ffffff; box-shadow: 0 0 0 4px rgba(212,160,23,0.1); }
        .form-input-wrap.has-error { border-color: #ef4444; }
        .form-input-wrap svg { width: 17px; height: 17px; stroke: #a39c8a; fill: none; stroke-width: 1.8; flex-shrink: 0; transition: stroke .2s; }
        .form-input-wrap.focused svg { stroke: #D4A017; }
        .form-input-wrap input { flex: 1; border: none; outline: none; font-size: 14.5px; color: #12172B; background: transparent; font-family: 'Inter', sans-serif; min-width: 0; }
        .form-input-wrap input::placeholder { color: #b3ac9a; }

        .toggle-pw { background: none; border: none; cursor: pointer; padding: 0; display: flex; flex-shrink: 0; }
        .toggle-pw svg { width: 17px; height: 17px; stroke: #a39c8a; fill: none; stroke-width: 1.8; }
        .toggle-pw:hover svg { stroke: #D4A017; }

        .role-selector { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .role-btn { padding: 11px; border-radius: 10px; border: 1.5px solid #e7e2d6; background: #fff; font-size: 13.5px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all .2s ease; text-transform: capitalize; }
        .role-btn.active { border-color: #D4A017; background: rgba(212,160,23,0.1); color: #D4A017; }
        .role-btn:hover:not(.active) { border-color: #d9d3c6; }

        .strength-bars { display: flex; gap: 4px; margin-top: 8px; }
        .strength-bar { flex: 1; height: 5px; border-radius: 999px; background: #e7e2d6; transition: background .3s; }
        .strength-label { font-size: 12px; color: #6B7280; margin-top: 5px; }
        .strength-label span { font-weight: 600; color: #12172B; }

        .terms-check { display: flex; align-items: flex-start; gap: 10px; margin-top: 6px; margin-bottom: 16px; }
        .terms-check input { width: 18px; height: 18px; accent-color: #D4A017; margin-top: 2px; cursor: pointer; flex-shrink: 0; }
        .terms-check label { font-size: 13px; color: #6B7280; cursor: pointer; line-height: 1.5; }
        .terms-check a { color: #D4A017; font-weight: 700; text-decoration: none; }
        .terms-check a:hover { text-decoration: underline; }
        .terms-error { font-size: 12px; color: #ef4444; margin-top: 4px; }

        .auth-btn {
          width: 100%; height: 50px;
          border: none;
          border-radius: 10px;
          background: #12172B;
          color: #F7F4EC;
          font-size: 14px; font-weight: 700; letter-spacing: 0.02em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background .25s, transform .2s, box-shadow .2s;
          box-shadow: 0 14px 30px rgba(18,23,43,0.2);
        }
        .auth-btn:hover { background: #1c2340; transform: translateY(-2px); box-shadow: 0 18px 36px rgba(18,23,43,0.26); }
        .auth-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .auth-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }

        .auth-spinner {
          width: 18px; height: 18px; border: 2px solid rgba(247,244,236,.35); border-top-color: #F7F4EC; border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer { text-align: center; font-size: 13.5px; color: #6B7280; margin-top: 20px; }
        .auth-footer a { color: #D4A017; font-weight: 700; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }

        @media (max-width: 980px) {
          .auth-shell {
            grid-template-columns: 1fr;
          }
          .auth-hero-panel {
            min-height: unset;
            padding: 40px 32px;
            align-items: center;
            text-align: center;
          }
          .auth-hero-panel::before { font-size: 280px; right: 50%; transform: translateX(50%); bottom: -90px; }
          .auth-badge { justify-content: center; }
          .auth-brand-row { flex-direction: column; gap: 10px; margin-top: 22px; }
          .auth-hero-title { font-size: 27px; margin: 18px 0 12px; max-width: 100%; }
          .auth-hero-copy { font-size: 13.5px; max-width: 360px; }
          .auth-side { padding: 40px 32px; }
        }

        @media (max-width: 520px) {
          .auth-page { padding: 0; }
          .auth-shell {
            min-height: 100vh;
            grid-template-columns: 1fr;
          }
          .auth-hero-panel {
            display: none;
          }
          .auth-side { padding: 24px 20px 36px; }
          .auth-card { max-width: 100%; }
          .auth-card-title { font-size: 22px; }
          .auth-btn { height: 48px; }
          .form-row { grid-template-columns: 1fr; }
          .role-selector { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-shell">
          <div className="auth-hero-panel">
            <div>
              <div className="auth-badge">Lifetime Realty Partner</div>
              <div className="auth-brand-row">
                <div className="auth-brand-icon">
                  <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div className="auth-brand-name">The 10th Homes & Apartments</div>
                  <div className="auth-brand-sub">Real Estate Ltd</div>
                </div>
              </div>
              <h3 className="auth-hero-title">Create your account and step into a smarter property journey.</h3>
              <p className="auth-hero-copy">Join buyers, investors, and realtors using a trusted platform to discover premium listings and modern property experiences.</p>
            </div>
          </div>

          <div className="auth-side">
            <div className="auth-card">
              <div className="auth-topbar">
                <Link href="/" className="auth-home-link">
                  <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-3v-6h-9v6h-3A1.5 1.5 0 0 1 3 19.5z"/></svg>
                  Back to home
                </Link>
                <div className="auth-top-pill">Create account</div>
              </div>

              <h2 className="auth-card-title">Create your account</h2>
              <p className="auth-card-copy">Join Tharel Homes and start exploring premium properties.</p>

              {errors.email && <div className="auth-error-box">{errors.email}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <div className={"form-input-wrap " + (focused === "firstName" ? "focused" : "") + (errors.firstName ? " has-error" : "")}>
                      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input type="text" name="firstName" value={form.firstName} onChange={handleChange} onFocus={function(){setFocused("firstName")}} onBlur={function(){setFocused("")}} placeholder="John" />
                    </div>
                    {errors.firstName && <p className="form-field-error">{errors.firstName}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <div className={"form-input-wrap " + (focused === "lastName" ? "focused" : "") + (errors.lastName ? " has-error" : "")}>
                      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input type="text" name="lastName" value={form.lastName} onChange={handleChange} onFocus={function(){setFocused("lastName")}} onBlur={function(){setFocused("")}} placeholder="Adebayo" />
                    </div>
                    {errors.lastName && <p className="form-field-error">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className={"form-input-wrap " + (focused === "email" ? "focused" : "") + (errors.email ? " has-error" : "")}>
                    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={function(){setFocused("email")}} onBlur={function(){setFocused("")}} placeholder="john@email.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <div className="role-selector">
                    <button type="button" className={"role-btn " + (form.role === "buyer" ? "active" : "")} onClick={function(){setForm({...form, role: "buyer"})}}>Buyer</button>
                    <button type="button" className={"role-btn " + (form.role === "realtor" ? "active" : "")} onClick={function(){setForm({...form, role: "realtor"})}}>Realtor</button>
                    <button type="button" className={"role-btn " + (form.role === "hotel" ? "active" : "")} onClick={function(){setForm({...form, role: "hotel"})}}>Hotel</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className={"form-input-wrap " + (focused === "password" ? "focused" : "") + (errors.password ? " has-error" : "")}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} onFocus={function(){setFocused("password")}} onBlur={function(){setFocused("")}} placeholder="Min 8 characters" />
                    <button type="button" className="toggle-pw" onClick={function(){setShowPassword(!showPassword)}}>
                      {showPassword
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div>
                      <div className="strength-bars">
                        {[1,2,3,4].map(function(n){
                          return <div key={n} className="strength-bar" style={{background: strength >= n ? strengthColors[strength] : "#e7e2d6"}} />;
                        })}
                      </div>
                      <p className="strength-label">Strength: <span>{strengthLabels[strength]}</span></p>
                    </div>
                  )}
                  {errors.password && <p className="form-field-error">{errors.password}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className={"form-input-wrap " + (focused === "confirmPassword" ? "focused" : "") + (errors.confirmPassword ? " has-error" : "")}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onFocus={function(){setFocused("confirmPassword")}} onBlur={function(){setFocused("")}} placeholder="Repeat your password" />
                    <button type="button" className="toggle-pw" onClick={function(){setShowConfirm(!showConfirm)}}>
                      {showConfirm
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="form-field-error">{errors.confirmPassword}</p>}
                </div>

                <div className="terms-check">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={function(e){setAgreeTerms(e.target.checked); setTermsError("");}}
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <Link href="/terms">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy">Privacy Policy</Link>
                  </label>
                </div>
                {termsError && <p className="terms-error">{termsError}</p>}

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <div className="auth-spinner" /> : <>Create Account <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>}
                </button>
              </form>

              <p className="auth-footer">
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}