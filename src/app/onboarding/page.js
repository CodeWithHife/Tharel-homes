"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateCurrentUser } from "@/lib/storage";
import { Home, User, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

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
  { 
    id: "hotelName", 
    question: "What is your hotel/property name?",
    type: "text",
    placeholder: "e.g. Grand Oak Hotel"
  },
  { 
    id: "location", 
    question: "Where is your hotel located?", 
    options: ["Lagos Island", "Lagos Mainland", "Abuja", "Ogun State", "Ibadan", "Other State"] 
  },
  { 
    id: "roomType", 
    question: "What type of rooms do you offer?", 
    options: ["Standard Rooms", "Deluxe Rooms", "Suites", "Executive Rooms", "All Types"] 
  },
  { 
    id: "capacity", 
    question: "How many guests can you accommodate?", 
    options: ["1 - 10 guests", "11 - 25 guests", "26 - 50 guests", "51 - 100 guests", "100+ guests"] 
  },
  { 
    id: "reservationGoal", 
    question: "What's your main goal for reservations?", 
    options: ["Increase bookings", "List my hotel", "Find corporate guests", "Build reputation", "All of the above"] 
  },
];

export default function OnboardingPage() {
  var router = useRouter();
  var [user, setUser] = useState(null);
  var [step, setStep] = useState(0);
  var [answers, setAnswers] = useState({});
  var [selected, setSelected] = useState("");
  var [textValue, setTextValue] = useState("");
  var [saving, setSaving] = useState(false);

  // ===== FIRST EFFECT: fetch user =====
  useEffect(function () {
    var current = getCurrentUser();
    if (!current) { 
      router.push("/login"); 
      return; 
    }
    if (current.onboardingDone) {
      if (current.role === "realtor") {
        router.push("/dashboard/realtor");
      } else if (current.role === "hotel") {
        router.push("/dashboard/hotel");
      } else {
        router.push("/dashboard/buyer");
      }
      return;
    }
    setUser(current);
  }, []);

  // ===== SECOND EFFECT: sync selected/textValue with current step =====
  // This effect must be called unconditionally; we guard inside.
  useEffect(() => {
    if (!user) return; // no user yet → skip
    var questions = user.role === "realtor" ? realtorQuestions : user.role === "hotel" ? hotelQuestions : buyerQuestions;
    var current = questions[step];
    if (!current) return;
    if (current.type === "text") {
      setTextValue(answers[current.id] || "");
      setSelected("");
    } else {
      setSelected(answers[current.id] || "");
      setTextValue("");
    }
  }, [step, user, answers]); // include user in deps

  // If user is null or not loaded, we still have to render something,
  // but we can't call hooks after a return. So we keep all hooks above,
  // then we can return early after all hooks have been declared.
  if (!user) return null;

  // Now it's safe to define derived data
  var questions = user.role === "realtor" ? realtorQuestions : user.role === "hotel" ? hotelQuestions : buyerQuestions;
  var current = questions[step];
  var total = questions.length;
  var progress = ((step + 1) / total) * 100;

  function handleSelect(option) {
    setSelected(option);
  }

  function handleTextChange(e) {
    setTextValue(e.target.value);
  }

  function handleNext() {
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
      setSaving(true);
      setTimeout(function () {
        updateCurrentUser({ onboardingDone: true, onboardingAnswers: newAnswers });
        if (user.role === "realtor") {
          router.push("/dashboard/realtor");
        } else if (user.role === "hotel") {
          router.push("/dashboard/hotel");
        } else {
          router.push("/dashboard/buyer");
        }
      }, 800);
    }
  }

  function handleBack() {
    if (step > 0) { 
      setStep(step - 1);
      var prev = questions[step - 1];
      if (prev.type === "text") {
        setTextValue(answers[prev.id] || "");
        setSelected("");
      } else {
        setSelected(answers[prev.id] || "");
        setTextValue("");
      }
    }
  }

  var isNextDisabled = saving || (current.type === "text" ? !textValue.trim() : !selected);

  return (
    <>
      <style>{`
        .ob-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 40px;
          font-family: "Inter", sans-serif;
        }
        .ob-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(15,23,42,0.12);
          padding: 48px 40px;
          width: 100%;
          max-width: 560px;
          position: relative;
          overflow: hidden;
        }
        .ob-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #D4A017, #b8860c);
        }
        @media (max-width: 600px) {
          .ob-card { padding: 32px 20px; }
        }
        .ob-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .ob-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #D4A017;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ob-logo-icon svg {
          width: 20px;
          height: 20px;
          stroke: #fff;
          fill: none;
          stroke-width: 2.5;
        }
        .ob-logo-name {
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .ob-logo-sub {
          font-size: 9px;
          color: #D4A017;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .ob-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(212,160,23,0.1);
          color: #D4A017;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 20px;
          text-transform: capitalize;
        }
        .ob-progress-wrap {
          margin-bottom: 32px;
        }
        .ob-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .ob-step-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .ob-step-count {
          font-size: 13px;
          color: #D4A017;
          font-weight: 700;
        }
        .ob-progress-bar {
          height: 6px;
          background: #E2E8F0;
          border-radius: 999px;
          overflow: hidden;
        }
        .ob-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4A017, #b8860c);
          border-radius: 999px;
          transition: width 0.5s ease;
        }
        .ob-question {
          font-size: clamp(20px, 2.5vw, 24px);
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 24px;
          line-height: 1.3;
        }
        .ob-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 32px;
        }
        .ob-option {
          padding: 15px 18px;
          border-radius: 12px;
          border: 2px solid #E2E8F0;
          background: #fff;
          font-size: 14.5px;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ob-option:hover {
          border-color: #D4A017;
          background: rgba(212,160,23,0.04);
          color: #0F172A;
          transform: translateX(4px);
        }
        .ob-option.selected {
          border-color: #D4A017;
          background: rgba(212,160,23,0.08);
          color: #D4A017;
          font-weight: 700;
        }
        .ob-option .check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .ob-option.selected .check {
          border-color: #D4A017;
          background: #D4A017;
        }
        .ob-option.selected .check svg {
          stroke: #fff;
        }
        .ob-text-input {
          width: 100%;
          padding: 15px 18px;
          border-radius: 12px;
          border: 2px solid #E2E8F0;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
          background: #fff;
          margin-bottom: 32px;
        }
        .ob-text-input:focus {
          border-color: #D4A017;
        }
        .ob-text-input::placeholder {
          color: #94A3B8;
        }
        .ob-actions {
          display: flex;
          gap: 12px;
        }
        .ob-back-btn {
          padding: 0 24px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid #E2E8F0;
          background: #fff;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .ob-back-btn:hover {
          border-color: #94a3b8;
          color: #0F172A;
        }
        .ob-next-btn {
          flex: 1;
          height: 50px;
          border-radius: 12px;
          border: none;
          background: #D4A017;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ob-next-btn:hover:not(:disabled) {
          background: #b8860c;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212,160,23,0.3);
        }
        .ob-next-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        .ob-spinner {
          width: 22px;
          height: 22px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .ob-actions { 
            flex-direction: column-reverse; 
            gap: 8px;
          }
          .ob-back-btn { 
            justify-content: center; 
            width: 100%;
          }
          .ob-next-btn {
            width: 100%;
            flex: none;
          }
          .ob-text-input {
            font-size: 16px;
          }
        }
        @media (max-width: 380px) {
          .ob-card { padding: 24px 16px; }
        }
      `}</style>

      <div className="ob-page">
        <div className="ob-card">
          <div className="ob-logo">
            <div className="ob-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <div className="ob-logo-name">The 10th Homes</div>
              <div className="ob-logo-sub">& Apartments Ltd</div>
            </div>
          </div>

          <div className="ob-role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {user.role}
          </div>

          <div className="ob-progress-wrap">
            <div className="ob-progress-top">
              <span className="ob-step-label">Question {step + 1} of {total}</span>
              <span className="ob-step-count">{Math.round(progress)}% complete</span>
            </div>
            <div className="ob-progress-bar">
              <div className="ob-progress-fill" style={{ width: progress + "%" }} />
            </div>
          </div>

          <h2 className="ob-question">{current.question}</h2>

          {current.type === "text" ? (
            <input
              className="ob-text-input"
              type="text"
              value={textValue}
              onChange={handleTextChange}
              placeholder={current.placeholder || "Enter your answer..."}
              autoFocus
            />
          ) : (
            <div className="ob-options">
              {current.options.map(function (opt) {
                return (
                  <button key={opt} className={"ob-option " + (selected === opt ? "selected" : "")} onClick={function () { handleSelect(opt); }}>
                    <div className="check">
                      {selected === opt && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          <div className="ob-actions">
            {step > 0 && (
              <button className="ob-back-btn" onClick={handleBack}>
                <ArrowLeft size={18} /> Back
              </button>
            )}
            <button className="ob-next-btn" onClick={handleNext} disabled={isNextDisabled}>
              {saving ? (
                <div className="ob-spinner" />
              ) : step === total - 1 ? (
                <>Complete <CheckCircle2 size={18} /></>
              ) : (
                <>Next <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}