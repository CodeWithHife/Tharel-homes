"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as storage from "@/lib/storage";   // ✅ fallback import

export default function SignupPage() {
  var router = useRouter();
  var [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "buyer" 
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
    if (!agreeTerms) 
      setTermsError("You must agree to the Terms of Service");
    else 
      setTermsError("");
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    var errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!agreeTerms) { setTermsError("You must agree to the Terms of Service"); return; }
    setLoading(true);
    setTimeout(function () {
      var result = storage.registerUser({ 
        firstName: form.firstName, 
        lastName: form.lastName, 
        email: form.email, 
        password: form.password, 
        role: form.role 
      });
      if (result.error) { 
        setErrors({ email: result.error }); 
        setLoading(false); 
        return; 
      }
      storage.loginUser(form.email, form.password);
      router.push("/onboarding");
    }, 800);
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-page { 
          min-height: 100vh; 
          display: flex; 
          font-family: Inter, sans-serif;
          padding-top: 80px;
        }
        .auth-left { display: none; width: 50%; position: relative; overflow: hidden; flex-direction: column; justify-content: space-between; padding: 48px; }
        @media(min-width:1024px){ .auth-left { display: flex; } }
        .auth-left-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .auth-left-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,23,42,0.93) 0%, rgba(15,23,42,0.72) 55%, rgba(212,160,23,0.32) 100%); }
        .auth-left-content { position: relative; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .auth-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .auth-logo-icon { width: 42px; height: 42px; border-radius: 12px; background: #D4A017; display: flex; align-items: center; justify-content: center; }
        .auth-logo-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; stroke-width: 2; }
        .auth-logo-name { font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: .05em; }
        .auth-logo-sub { font-size: 10px; color: #D4A017; text-transform: uppercase; letter-spacing: .1em; }
        .auth-headline { font-size: 42px; font-weight: 900; color: #fff; line-height: 1.13; margin-bottom: 16px; }
        .auth-headline span { color: #D4A017; }
        .auth-sub { color: #94a3b8; font-size: 15px; line-height: 1.7; max-width: 340px; margin-bottom: 32px; }
        .auth-checklist { display: flex; flex-direction: column; gap: 12px; }
        .auth-check-item { display: flex; align-items: center; gap: 10px; }
        .auth-check-icon { width: 22px; height: 22px; border-radius: 50%; background: #D4A017; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .auth-check-icon svg { width: 12px; height: 12px; stroke: #fff; fill: none; stroke-width: 3; }
        .auth-check-text { font-size: 14px; color: #94a3b8; }
        .auth-copy { font-size: 12.5px; color: #475569; }
        .auth-right { width: 100%; display: flex; align-items: flex-start; justify-content: center; padding: 60px 24px; background: #fff; overflow-y: auto; }
        @media(min-width:1024px){ .auth-right { width: 50%; align-items: center; } }
        .auth-form-wrap { width: 100%; max-width: 440px; }
        .auth-mobile-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
        @media(min-width:1024px){ .auth-mobile-logo { display: none; } }
        .auth-mobile-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: #D4A017; display: flex; align-items: center; justify-content: center; }
        .auth-mobile-logo-icon svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; }
        .auth-title { font-size: 28px; font-weight: 900; color: #1A1A1A; margin-bottom: 6px; }
        .auth-desc { font-size: 14px; color: #64748b; margin-bottom: 28px; }
        .auth-error-box { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13.5px; padding: 12px 16px; border-radius: 12px; margin-bottom: 18px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media(max-width:500px){ .form-row { grid-template-columns: 1fr; } }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #1A1A1A; margin-bottom: 7px; }
        .form-field-error { font-size: 12px; color: #ef4444; margin-top: 5px; }
        .form-input-wrap { display: flex; align-items: center; gap: 10px; padding: 13px 15px; border-radius: 12px; border: 2px solid #e2e8f0; background: #fff; transition: border-color .2s, box-shadow .2s; }
        .form-input-wrap.focused { border-color: #D4A017; box-shadow: 0 0 0 4px rgba(212,160,23,.1); }
        .form-input-wrap.has-error { border-color: #ef4444; }
        .form-input-wrap svg { width: 17px; height: 17px; stroke: #94a3b8; fill: none; stroke-width: 2; flex-shrink: 0; transition: stroke .2s; }
        .form-input-wrap.focused svg { stroke: #D4A017; }
        .form-input-wrap input { flex: 1; border: none; outline: none; font-size: 14px; color: #1A1A1A; background: transparent; }
        .form-input-wrap input::placeholder { color: #94a3b8; }
        .toggle-pw { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
        .toggle-pw svg { width: 17px; height: 17px; stroke: #94a3b8; fill: none; stroke-width: 2; }
        .toggle-pw:hover svg { stroke: #D4A017; }
        .role-selector { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .role-btn { padding: 11px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-size: 13.5px; font-weight: 600; color: #64748b; cursor: pointer; transition: all .2s; text-transform: capitalize; }
        .role-btn.active { border-color: #D4A017; background: rgba(212,160,23,.08); color: #D4A017; }
        .role-btn:hover:not(.active) { border-color: #cbd5e1; }
        .strength-bars { display: flex; gap: 4px; margin-top: 8px; }
        .strength-bar { flex: 1; height: 5px; border-radius: 999px; background: #e2e8f0; transition: background .3s; }
        .strength-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .strength-label span { font-weight: 600; color: #1A1A1A; }
        .terms-check { display: flex; align-items: flex-start; gap: 10px; margin-top: 6px; margin-bottom: 16px; }
        .terms-check input { width: 18px; height: 18px; accent-color: #D4A017; margin-top: 2px; cursor: pointer; flex-shrink: 0; }
        .terms-check label { font-size: 13px; color: #64748B; cursor: pointer; line-height: 1.5; }
        .terms-check a { color: #D4A017; font-weight: 600; text-decoration: none; }
        .terms-check a:hover { text-decoration: underline; }
        .terms-error { font-size: 12px; color: #ef4444; margin-top: 4px; }
        .auth-btn { width: 100%; height: 50px; border-radius: 12px; border: none; background: #D4A017; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .2s; margin-top: 6px; }
        .auth-btn:hover { background: #b8860c; }
        .auth-btn:disabled { opacity: .65; cursor: not-allowed; }
        .auth-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2.5; }
        .auth-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; }
        .auth-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .auth-divider span { font-size: 12px; color: #94a3b8; }
        .auth-google-btn { width: 100%; height: 50px; border-radius: 12px; border: 2px solid #e2e8f0; background: #fff; color: #1A1A1A; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: border-color .2s, background .2s; }
        .auth-google-btn:hover { border-color: #D4A017; background: #fffbeb; }
        .auth-footer { text-align: center; font-size: 13.5px; color: #64748b; margin-top: 24px; }
        .auth-footer a { color: #D4A017; font-weight: 700; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-left">
          <img className="auth-left-bg" src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80" alt="" />
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
              <h2 className="auth-headline">Start Your<br /><span>Real Estate</span><br />Journey Today</h2>
              <p className="auth-sub">Join thousands of Nigerians finding their dream properties with The 10th Homes.</p>
              <div className="auth-checklist">
                {["Access 26+ verified properties","Flexible payment plans","Free site inspection","Dedicated realtor support"].map(function(item,i){
                  return (
                    <div key={i} className="auth-check-item">
                      <div className="auth-check-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
                      <span className="auth-check-text">{item}</span>
                    </div>
                  );
                })}
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

            <h1 className="auth-title">Create Account</h1>
            <p className="auth-desc">Join The 10th Homes and start your property journey</p>

            {errors.email && <div className="auth-error-box">{errors.email}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className={"form-input-wrap " + (focused==="firstName"?"focused":"") + (errors.firstName?" has-error":"")}>
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange} onFocus={function(){setFocused("firstName")}} onBlur={function(){setFocused("")}} placeholder="John" />
                  </div>
                  {errors.firstName && <p className="form-field-error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className={"form-input-wrap " + (focused==="lastName"?"focused":"") + (errors.lastName?" has-error":"")}>
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} onFocus={function(){setFocused("lastName")}} onBlur={function(){setFocused("")}} placeholder="Adebayo" />
                  </div>
                  {errors.lastName && <p className="form-field-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className={"form-input-wrap " + (focused==="email"?"focused":"") + (errors.email?" has-error":"")}>
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={function(){setFocused("email")}} onBlur={function(){setFocused("")}} placeholder="john@email.com" />
                </div>
              </div>

              {/* ROLE SELECTOR – 3 options now */}
              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="role-selector">
                  <button type="button" className={"role-btn " + (form.role==="buyer"?"active":"")} onClick={function(){setForm({...form,role:"buyer"})}}>Buyer</button>
                  <button type="button" className={"role-btn " + (form.role==="realtor"?"active":"")} onClick={function(){setForm({...form,role:"realtor"})}}>Realtor</button>
                  <button type="button" className={"role-btn " + (form.role==="hotel"?"active":"")} onClick={function(){setForm({...form,role:"hotel"})}}>Hotel</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className={"form-input-wrap " + (focused==="password"?"focused":"") + (errors.password?" has-error":"")}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showPassword?"text":"password"} name="password" value={form.password} onChange={handleChange} onFocus={function(){setFocused("password")}} onBlur={function(){setFocused("")}} placeholder="Min 8 characters" />
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
                        return <div key={n} className="strength-bar" style={{background: strength>=n ? strengthColors[strength] : "#e2e8f0"}} />;
                      })}
                    </div>
                    <p className="strength-label">Strength: <span>{strengthLabels[strength]}</span></p>
                  </div>
                )}
                {errors.password && <p className="form-field-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className={"form-input-wrap " + (focused==="confirmPassword"?"focused":"") + (errors.confirmPassword?" has-error":"")}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showConfirm?"text":"password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onFocus={function(){setFocused("confirmPassword")}} onBlur={function(){setFocused("")}} placeholder="Repeat your password" />
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
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}