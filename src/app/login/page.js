"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithBackend } from "@/lib/auth";

export default function LoginPage() {
  var router = useRouter();
  var [form, setForm] = useState({ email: "", password: "" });
  var [showPassword, setShowPassword] = useState(false);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [focused, setFocused] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
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
        throw new Error("No account information was returned.");
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
      setError(err.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #F4EFE6; font-family: 'Inter', sans-serif; }

        .auth-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #F6F1E7 0%, #EDEEF3 55%, #E7EBF4 100%);
        }

        .auth-shell {
          width: 100%;
          max-width: 1220px;
          display: grid;
          grid-template-columns: minmax(360px, 0.95fr) minmax(440px, 1.05fr);
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 32px 90px rgba(18,23,43,0.12);
          border: 1px solid rgba(18,23,43,0.06);
        }

        /* ===== HERO / LIGHT PANEL ===== */
        .auth-hero-panel {
          position: relative;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(160deg, #F6F1E7 0%, #EEF0F5 55%, #E7EBF6 100%);
          color: #12172B;
          min-height: 640px;
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

        .auth-feature-list { display: grid; gap: 14px; margin-top: 32px; }
        .auth-feature-item { display: flex; align-items: center; gap: 12px; color: #383e4d; font-size: 13.5px; letter-spacing: 0.01em; font-weight: 500; }
        .auth-feature-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #D4A017; flex-shrink: 0;
        }

        .auth-hero-footer {
          display: flex; gap: 28px; margin-top: 36px;
          background: #ffffff;
          border-radius: 16px;
          padding: 20px 26px;
          box-shadow: 0 14px 40px rgba(18,23,43,0.08);
          width: fit-content;
        }
        .auth-stat-num { font-size: 21px; font-weight: 800; color: #12172B; letter-spacing: -0.01em; }
        .auth-stat-label { font-size: 10px; color: #8b8f9a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 3px; font-weight: 600; }

        /* ===== FORM SIDE ===== */
        .auth-side {
          padding: 56px 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }
        .auth-card { width: 100%; max-width: 420px; }

        .auth-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 32px; }
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

        .auth-card-title { font-size: 30px; font-weight: 800; color: #12172B; margin-bottom: 8px; letter-spacing: -0.01em; }
        .auth-card-copy { font-size: 14px; color: #6B7280; margin-bottom: 32px; line-height: 1.6; }

        .auth-error {
          background: #fdf2f2; border-left: 2px solid #c0392b; color: #a4302a;
          font-size: 13px; padding: 12px 14px; margin-bottom: 20px; letter-spacing: 0.01em; border-radius: 8px;
        }

        .form-group { margin-bottom: 20px; }
        .form-label {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 11.5px; font-weight: 700; color: #12172B;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .form-label a { font-size: 11.5px; color: #D4A017; font-weight: 600; text-decoration: none; text-transform: none; letter-spacing: 0; }
        .form-label a:hover { text-decoration: underline; }

        .form-input-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 15px;
          border-radius: 12px;
          border: 1.5px solid #e7e2d6;
          background: #FBFAF6;
          transition: border-color .25s, background .25s;
        }
        .form-input-wrap.focused { border-color: #D4A017; background: #ffffff; box-shadow: 0 0 0 4px rgba(212,160,23,0.1); }
        .form-input-wrap svg { width: 17px; height: 17px; stroke: #a39c8a; fill: none; stroke-width: 1.8; flex-shrink: 0; transition: stroke .2s; }
        .form-input-wrap.focused svg { stroke: #D4A017; }
        .form-input-wrap input { flex: 1; border: none; outline: none; font-size: 14.5px; color: #12172B; background: transparent; font-family: 'Inter', sans-serif; min-width: 0; }
        .form-input-wrap input::placeholder { color: #b3ac9a; }

        .toggle-pw { background: none; border: none; cursor: pointer; padding: 0; display: flex; flex-shrink: 0; }
        .toggle-pw svg { width: 17px; height: 17px; stroke: #a39c8a; fill: none; stroke-width: 1.8; }
        .toggle-pw:hover svg { stroke: #D4A017; }

        .remember-me { display: flex; align-items: center; gap: 10px; margin: 22px 0 26px; }
        .remember-me input { width: 15px; height: 15px; accent-color: #D4A017; cursor: pointer; }
        .remember-me label { font-size: 13.5px; color: #6B7280; cursor: pointer; }

        .auth-btn {
          width: 100%; height: 52px;
          border: none;
          border-radius: 999px;
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

        .auth-footer { text-align: center; font-size: 13.5px; color: #6B7280; margin-top: 28px; }
        .auth-footer a { color: #D4A017; font-weight: 700; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 980px) {
          .auth-page { padding: 28px 20px; }
          .auth-shell {
            grid-template-columns: 1fr;
            max-width: 520px;
            margin: 0 auto;
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
          .auth-feature-list { display: none; }
          .auth-hero-footer { margin: 26px auto 0; }
          .auth-side { padding: 40px 32px; }
        }

        @media (max-width: 520px) {
          .auth-page { padding: 0; align-items: center; }
          .auth-shell {
            border-radius: 0;
            max-width: 100%;
            min-height: 100vh;
            box-shadow: none;
            border: none;
          }
          .auth-hero-panel { padding: 36px 24px 28px; }
          .auth-hero-panel::before { font-size: 200px; bottom: -70px; }
          .auth-hero-title { font-size: 24px; }
          .auth-hero-footer { flex-wrap: wrap; justify-content: center; gap: 16px; padding: 18px 20px; }
          .auth-side {
            padding: 36px 24px 44px;
            display: flex;
            justify-content: center;
          }
          .auth-card { max-width: 100%; }
          .auth-card-title { font-size: 25px; text-align: left; }
          .auth-btn { height: 50px; }
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
              <h3 className="auth-hero-title">Enhancing your living experience.</h3>
              <p className="auth-hero-copy">Access verified homes, manage favourites, and move closer to your ideal property with a seamless experience.</p>
              <div className="auth-feature-list">
                <div className="auth-feature-item"><span className="auth-feature-dot" />Verified listings and trusted agents</div>
                <div className="auth-feature-item"><span className="auth-feature-dot" />Saved homes ready whenever you are</div>
                <div className="auth-feature-item"><span className="auth-feature-dot" />Fast support for every step</div>
              </div>
            </div>
            <div className="auth-hero-footer">
              <div>
                <div className="auth-stat-num">200+</div>
                <div className="auth-stat-label">Properties</div>
              </div>
              <div>
                <div className="auth-stat-num">1500+</div>
                <div className="auth-stat-label">Clients</div>
              </div>
              <div>
                <div className="auth-stat-num">10+</div>
                <div className="auth-stat-label">Years</div>
              </div>
            </div>
          </div>

          <div className="auth-side">
            <div className="auth-card">
              <div className="auth-topbar">
                <Link href="/" className="auth-home-link">
                  <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-3v-6h-9v6h-3A1.5 1.5 0 0 1 3 19.5z"/></svg>
                  Back to home
                </Link>
                <div className="auth-top-pill">Secure Access</div>
              </div>

              <h2 className="auth-card-title">Welcome back</h2>
              <p className="auth-card-copy">Sign in to continue your property journey.</p>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className={"form-input-wrap " + (focused === "email" ? "focused" : "")}>
                    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={function(){setFocused("email")}} onBlur={function(){setFocused("")}} placeholder="john@email.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Password
                    <Link href="/forgot-password">Forgot password?</Link>
                  </label>
                  <div className={"form-input-wrap " + (focused === "password" ? "focused" : "")}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} onFocus={function(){setFocused("password")}} onBlur={function(){setFocused("")}} placeholder="Enter your password" />
                    <button type="button" className="toggle-pw" onClick={function(){setShowPassword(!showPassword)}}>
                      {showPassword
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <div className="auth-spinner" /> : <>Sign In <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>}
                </button>
              </form>

              <p className="auth-footer">
                Don't have an account? <Link href="/signup">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}