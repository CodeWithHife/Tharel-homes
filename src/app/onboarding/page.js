"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthUser, completeOnboardingWithBackend, logoutAuth } from "@/lib/auth";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

// ===== BUYER QUESTIONS =====
var buyerQuestions = [
  { id: "budget", question: "What is your budget range?", options: ["Under ₦5M", "₦5M - ₦20M", "₦20M - ₦50M", "₦50M - ₦100M", "Above ₦100M"] },
  { id: "propertyType", question: "What type of property are you looking for?", options: ["Residential Land", "Commercial Land", "Duplex / House", "Apartment", "Farmland"] },
  { id: "location", question: "Which location do you prefer?", options: ["Lagos Island / Lekki", "Lagos Mainland", "Abuja", "Ogun State", "Other States"] },
  { id: "timeline", question: "When are you looking to buy?", options: ["Immediately", "Within 3 months", "Within 6 months", "Within a year", "Just exploring"] },
  { id: "paymentPlan", question: "How do you plan to pay?", options: ["Outright payment", "3-6 month plan", "12 month plan", "24 month plan", "Open to options"] },
];

// ===== REALTOR QUESTIONS =====
var realtorQuestions = [
  { id: "experience", question: "How long have you been a realtor?", options: ["Less than 1 year", "1 - 3 years", "3 - 5 years", "5 - 10 years", "10+ years"] },
  { id: "focus", question: "What type of properties do you focus on?", options: ["Residential Land", "Commercial Properties", "Luxury Homes", "Affordable Housing", "All Types"] },
  { id: "location", question: "Which areas do you operate in?", options: ["Lagos", "Abuja", "Ogun State", "Oyo State / Ibadan", "Multiple States"] },
  { id: "listings", question: "How many properties do you list monthly?", options: ["1 - 3", "4 - 10", "10 - 20", "20+", "Just starting"] },
  { id: "goal", question: "What is your main goal on this platform?", options: ["List and sell properties", "Find buyers for clients", "Build my brand", "Earn commissions", "All of the above"] },
];

// ===== HOTEL QUESTIONS =====
var hotelQuestions = [
  { id: "hotelName", question: "What is your hotel/property name?", type: "text", placeholder: "e.g. Grand Oak Hotel" },
  { id: "location", question: "Where is your hotel located?", options: ["Lagos Island", "Lagos Mainland", "Abuja", "Ogun State", "Ibadan", "Other State"] },
  { id: "roomType", question: "What type of rooms do you offer?", options: ["Standard Rooms", "Deluxe Rooms", "Suites", "Executive Rooms", "All Types"] },
  { id: "capacity", question: "How many guests can you accommodate?", options: ["1 - 10 guests", "11 - 25 guests", "26 - 50 guests", "51 - 100 guests", "100+ guests"] },
  { id: "reservationGoal", question: "What's your main goal for reservations?", options: ["Increase bookings", "List my hotel", "Find corporate guests", "Build reputation", "All of the above"] },
];

export default function OnboardingPage() {
  var router = useRouter();
  var [user, setUser] = useState(null);
  var [step, setStep] = useState(0);
  var [answers, setAnswers] = useState({});
  var [selected, setSelected] = useState("");
  var [textValue, setTextValue] = useState("");
  var [saving, setSaving] = useState(false);
  var [error, setError] = useState("");

  // Load user from localStorage (set by auth.js after login/signup)
  useEffect(function () {
    var current = getStoredAuthUser();
    if (!current) {
      router.push("/login");
      return;
    }
    const role = current.role?.toLowerCase();
    if (current.onboardingDone) {
      if (role === "realtor") router.push("/dashboard/realtor");
      else if (role === "hotel") router.push("/dashboard/hotel");
      else if (role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/buyer");
      return;
    }
    setUser(current);
  }, []);

  // Sync inputs when step changes
  useEffect(() => {
    if (!user) return;
    var role = user.role?.toLowerCase();
    var questions = role === "realtor" ? realtorQuestions : role === "hotel" ? hotelQuestions : buyerQuestions;
    var current = questions[step];
    if (!current) return;
    if (current.type === "text") {
      setTextValue(answers[current.id] || "");
      setSelected("");
    } else {
      setSelected(answers[current.id] || "");
      setTextValue("");
    }
  }, [step, user]);

  if (!user) return null;

  var role = user.role?.toLowerCase();
  var questions = role === "realtor" ? realtorQuestions : role === "hotel" ? hotelQuestions : buyerQuestions;
  var current = questions[step];
  var total = questions.length;
  var progress = ((step + 1) / total) * 100;

  function handleSelect(option) { setSelected(option); }
  function handleTextChange(e) { setTextValue(e.target.value); }

  async function handleNext() {
    var value;
    if (current.type === "text") {
      if (!textValue.trim()) return;
      value = textValue.trim();
    } else {
      if (!selected) return;
      value = selected;
    }

    var newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    setSelected("");
    setTextValue("");

    if (step < total - 1) {
      setStep(step + 1);
    } else {
      // Last step — save to backend
      setSaving(true);
      setError("");
      try {
        await completeOnboardingWithBackend(newAnswers);
        if (role === "realtor") router.push("/dashboard/realtor");
        else if (role === "hotel") router.push("/dashboard/hotel");
        else router.push("/dashboard/buyer");
      } catch (err) {
        setError(err.message || "Could not save your answers. Please try again.");
        setSaving(false);
      }
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      var prev = questions[step - 1];
      if (prev.type === "text") { setTextValue(answers[prev.id] || ""); setSelected(""); }
      else { setSelected(answers[prev.id] || ""); setTextValue(""); }
    }
  }

  var isNextDisabled = saving || (current.type === "text" ? !textValue.trim() : !selected);

  return (
    <>
      <style>{`
        @keyframes obFadeUp {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes obGlowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.15); }
        }

        @keyframes obBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.9); }
        }

        .ob-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(145deg, #0F172A 0%, #080D1A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: "Inter", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ob-glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 160, 23, 0.2) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: obGlowPulse 7s ease-in-out infinite;
        }

        .ob-glow-bottom {
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

        .ob-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 25px rgba(212, 160, 23, 0.15);
          border: 1px solid rgba(212, 160, 23, 0.35);
          padding: 48px 40px;
          width: 100%;
          max-width: 580px;
          position: relative;
          z-index: 2;
          animation: obFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 600px) {
          .ob-card { padding: 32px 20px; border-radius: 20px; }
        }

        .ob-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.3);
          color: #B8860B;
          font-size: 11.5px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 999px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .ob-progress-bar {
          height: 8px;
          background: #E2E8F0;
          border-radius: 999px;
          overflow: hidden;
        }

        .ob-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4A017 0%, #B8860B 100%);
          border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ob-question {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(20px, 2.5vw, 24px);
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 24px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .ob-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .ob-option {
          padding: 16px 20px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          font-size: 14.5px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ob-option:hover {
          border-color: #D4A017;
          background: rgba(212, 160, 23, 0.05);
          color: #0F172A;
          transform: translate3d(4px, -1px, 0);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .ob-option.selected {
          border-color: #D4A017;
          background: rgba(212, 160, 23, 0.12);
          color: #0F172A;
          font-weight: 800;
          box-shadow: 0 4px 16px rgba(212, 160, 23, 0.2);
          transform: translate3d(4px, -1px, 0);
        }

        .ob-input-field {
          width: 100%;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          font-size: 15px;
          outline: none;
          color: #0F172A;
          transition: all 0.3s ease;
        }

        .ob-input-field:focus {
          border-color: #D4A017;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.16);
        }

        .ob-btn-primary {
          padding: 16px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 14.5px;
          border: 1px solid rgba(212, 160, 23, 0.3);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
        }

        .ob-btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
          color: #0F172A;
          border-color: #D4A017;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(212, 160, 23, 0.4);
        }

        .ob-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <main className="ob-page">
        <div className="ob-glow" />
        <div className="ob-glow-bottom" />

        <div className="ob-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#0F172A", border: "1px solid rgba(212, 160, 23, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "18px", color: "#D4A017", fontWeight: 900 }}>10</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  The 10th Homes
                </h3>
                <p style={{ fontSize: "10px", fontWeight: 800, color: "#D4A017", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Profile Personalization
                </p>
              </div>
            </div>

            <div className="ob-role-badge">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A017", animation: "obBadgePulse 2s infinite" }} />
              <span>{role} Setup</span>
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>Question {step + 1} of {total}</span>
              <span style={{ fontSize: "12.5px", color: "#D4A017", fontWeight: 800 }}>{Math.round(progress)}% Completed</span>
            </div>
            <div className="ob-progress-bar">
              <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h2 className="ob-question">{current.question}</h2>

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#FEF2F2", color: "#991B1B", fontSize: "13.5px", fontWeight: 600, marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {current.type === "text" ? (
            <div style={{ marginBottom: "32px" }}>
              <input
                type="text"
                value={textValue}
                onChange={handleTextChange}
                placeholder={current.placeholder}
                className="ob-input-field"
                autoFocus
              />
            </div>
          ) : (
            <div className="ob-options">
              {current.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`ob-option ${selected === option ? "selected" : ""}`}
                  onClick={() => handleSelect(option)}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: selected === option ? "6px solid #D4A017" : "2px solid #CBD5E1",
                      background: "#fff",
                      display: "inline-block",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  />
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "none",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#64748B",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
            ) : <div />}

            <button
              type="button"
              className="ob-btn-primary"
              disabled={isNextDisabled}
              onClick={handleNext}
            >
              {saving ? (
                <span>Completing Setup...</span>
              ) : step === total - 1 ? (
                <>
                  <span>Enter My Dashboard</span>
                  <CheckCircle2 size={18} />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}