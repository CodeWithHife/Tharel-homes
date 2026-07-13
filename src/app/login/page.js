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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-page { 
          min-height: 100vh; 
          display: flex; 
          font-family: Inter, sans-serif;
          padding-top: 80px;
        }
        .auth-left {
          display: none; width: 50%; position: relative; overflow: hidden;
          flex-direction: column; justify-content: space-between; padding: 48px;
        }
        @media(min-width:1024px){ .auth-left { display: flex; } }
        .auth-left-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .auth-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,23,42,0.93) 0%, rgba(15,23,42,0.72) 55%, rgba(212,160,23,0.32) 100%);
        }
        .auth-left-content { position: relative; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .auth-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .auth-logo-icon { width: 42px; height: 42px; border-radius: 12px; background: #D4A017; display: flex; align-items: center; justify-content: center; }
        .auth-logo-icon svg { width: 22px; height: 22px; color: #fff; fill: none; stroke: #fff; stroke-width: 2; }
        .auth-logo-name { font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: .05em; }
        .auth-logo-sub { font-size: 10px; color: #D4A017; text-transform: uppercase; letter-spacing: .1em; }
        .auth-headline { font-size: 44px; font-weight: 900; color: #fff; line-height: 1.13; margin-bottom: 16px; }
        .auth-headline span { color: #D4A017; }
        .auth-sub { color: #94a3b8; font-size: 15px; line-height: 1.7; max-width: 340px; }
        .auth-stats { display: flex; gap: 28px; margin-top: 40px; }
        .auth-stat-num { font-size: 26px; font-weight: 900; color: #fff; }
        .auth-stat-lbl { font-size: 12px; color: #64748b; margin-top: 2px; }
        .auth-stat-divider { width: 1px; background: rgba(255,255,255,0.12); }
        .auth-copy { font-size: 12.5px; color: #475569; }
        .auth-right { width: 100%; display: flex; align-items: center; justify-content: center; padding: 60px 24px; background: #fff; }
        @media(min-width:1024px){ .auth-right { width: 50%; } }
        .auth-form-wrap { width: 100%; max-width: 420px; }
        .auth-mobile-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
        @media(min-width:1024px){ .auth-mobile-logo { display: none; } }
        .auth-mobile-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: #D4A017; display: flex; align-items: center; justify-content: center; }
        .auth-mobile-logo-icon svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; }
        .auth-title { font-size: 30px; font-weight: 900; color: #1A1A1A; margin-bottom: 6px; }
        .auth-desc { font-size: 14px; color: #64748b; margin-bottom: 32px; }
        .auth-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13.5px; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: #1A1A1A; margin-bottom: 8px; }
        .form-label a { font-size: 12.5px; color: #D4A017; font-weight: 600; text-decoration: none; }
        .form-label a:hover { text-decoration: underline; }
        .form-input-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px; border-radius: 12px; border: 2px solid #e2e8f0;
          background: #fff; transition: border-color .2s, box-shadow .2s;
        }
        .form-input-wrap.focused { border-color: #D4A017; box-shadow: 0 0 0 4px rgba(212,160,23,.1); }
        .form-input-wrap svg { width: 18px; height: 18px; stroke: #94a3b8; fill: none; stroke-width: 2; flex-shrink: 0; transition: stroke .2s; }
        .form-input-wrap.focused svg { stroke: #D4A017; }
        .form-input-wrap input { flex: 1; border: none; outline: none; font-size: 14px; color: #1A1A1A; background: transparent; }
        .form-input-wrap input::placeholder { color: #94a3b8; }
        .toggle-pw { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
        .toggle-pw svg { width: 18px; height: 18px; stroke: #94a3b8; fill: none; stroke-width: 2; }
        .toggle-pw:hover svg { stroke: #D4A017; }
        .remember-me { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .remember-me input { width: 18px; height: 18px; accent-color: #D4A017; cursor: pointer; }
        .remember-me label { font-size: 14px; color: #64748B; cursor: pointer; }
        .auth-btn {
          width: 100%; height: 50px; border-radius: 12px; border: none;
          background: #D4A017; color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: background .2s; margin-top: 8px;
        }
        .auth-btn:hover { background: #b8860c; }
        .auth-btn:disabled { opacity: .65; cursor: not-allowed; }
        .auth-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2.5; }
        .auth-spinner {
          width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,.4);
          border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; }
        .auth-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .auth-divider span { font-size: 12.5px; color: #94a3b8; }
        .auth-google-btn {
          width: 100%; height: 50px; border-radius: 12px;
          border: 2px solid #e2e8f0; background: #fff; color: #1A1A1A;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color .2s, background .2s;
        }
        .auth-google-btn:hover { border-color: #D4A017; background: #fffbeb; }
        .auth-footer { text-align: center; font-size: 13.5px; color: #64748b; margin-top: 28px; }
        .auth-footer a { color: #D4A017; font-weight: 700; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }

        /* ===== MOBILE RESPONSIVE ===== */
        @media (max-width: 768px) {
          .auth-right { padding: 40px 20px; }
          .auth-title { font-size: 28px; }
          .auth-desc { font-size: 13px; margin-bottom: 24px; }
          .auth-mobile-logo { margin-bottom: 28px; }
          .auth-error { font-size: 12.5px; padding: 10px 14px; }
          .form-input-wrap { padding: 12px 14px; }
          .form-input-wrap input { font-size: 15px; } /* prevent zoom on iOS */
          .auth-btn { height: 46px; font-size: 14px; }
          .auth-google-btn { height: 46px; font-size: 13px; }
        }

        @media (max-width: 480px) {
          .auth-right { padding: 28px 16px; }
          .auth-title { font-size: 24px; }
          .auth-desc { font-size: 12.5px; margin-bottom: 20px; }
          .auth-mobile-logo { margin-bottom: 20px; }
          .auth-mobile-logo-icon { width: 32px; height: 32px; }
          .auth-mobile-logo-icon svg { width: 16px; height: 16px; }
          .auth-error { font-size: 12px; padding: 8px 12px; }
          .form-group { margin-bottom: 16px; }
          .form-label { font-size: 12px; }
          .form-label a { font-size: 11.5px; }
          .form-input-wrap { padding: 10px 12px; border-radius: 10px; gap: 8px; }
          .form-input-wrap input { font-size: 16px; } /* prevent zoom */
          .toggle-pw svg { width: 16px; height: 16px; }
          .remember-me { margin-bottom: 12px; }
          .remember-me input { width: 16px; height: 16px; }
          .remember-me label { font-size: 13px; }
          .auth-btn { height: 44px; font-size: 13px; }
          .auth-google-btn { height: 44px; font-size: 12.5px; gap: 8px; }
          .auth-divider { margin: 16px 0; }
          .auth-divider span { font-size: 11px; }
          .auth-footer { font-size: 12.5px; margin-top: 20px; }
        }

        @media (max-width: 380px) {
          .auth-right { padding: 20px 12px; }
          .auth-title { font-size: 22px; }
          .auth-desc { font-size: 12px; }
          .auth-btn { height: 40px; font-size: 12px; }
          .auth-google-btn { height: 40px; font-size: 12px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-left">
          <img className="auth-left-bg" src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" alt="" />
          <div className="auth-left-overlay" />
          <div className="auth-left-content">
            <Link href="/" className="auth-logo">
              <div className="auth-logo-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div className="auth-logo-name">The 10th Homes</div>
                <div className="auth-logo-sub">& Apartments Ltd</div>
              </div>
            </Link>
            <div>
              <h2 className="auth-headline">Find Your<br /><span>Dream Home</span><br />In Nigeria</h2>
              <p className="auth-sub">Access verified properties across Lagos, Abuja, and beyond. Trusted by thousands of Nigerian investors.</p>
              <div className="auth-stats">
                <div><div className="auth-stat-num">26+</div><div className="auth-stat-lbl">Properties</div></div>
                <div className="auth-stat-divider" />
                <div><div className="auth-stat-num">500+</div><div className="auth-stat-lbl">Clients</div></div>
                <div className="auth-stat-divider" />
                <div><div className="auth-stat-num">10+</div><div className="auth-stat-lbl">States</div></div>
              </div>
            </div>
            <p className="auth-copy">&copy; {new Date().getFullYear()} The 10th Homes & Apartments Ltd</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-mobile-logo">
              <div className="auth-mobile-logo-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div style={{fontSize:"13px",fontWeight:800,color:"#1A1A1A",textTransform:"uppercase"}}>The 10th Homes</div>
                <div style={{fontSize:"10px",color:"#D4A017",textTransform:"uppercase",letterSpacing:".1em"}}>& Apartments Ltd</div>
              </div>
            </div>

            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-desc">Sign in to your account to continue</p>

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

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span>OR</span>
              <div className="auth-divider-line" />
            </div>

            <button className="auth-google-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="auth-footer">
              Don't have an account? <Link href="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}