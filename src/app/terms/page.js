"use client";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Lock, Building, Scale, Clock } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "August 11, 2026";

  return (
    <>
      <style>{`
        .legal-page {
          min-height: 100vh;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
          color: #0F172A;
          padding: 120px 24px 80px;
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          padding: 56px 48px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.04);
        }

        .legal-header {
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 32px;
          margin-bottom: 40px;
        }

        .legal-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(212, 160, 23, 0.1);
          border: 1px solid rgba(212, 160, 23, 0.25);
          color: #B8860B;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .legal-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .legal-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #64748B;
          font-size: 13.5px;
        }

        .legal-section {
          margin-bottom: 36px;
        }

        .legal-section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .legal-paragraph {
          font-size: 15px;
          line-height: 1.75;
          color: #475569;
          margin-bottom: 14px;
        }

        .legal-list {
          padding-left: 24px;
          margin-bottom: 16px;
        }

        .legal-list li {
          font-size: 14.5px;
          line-height: 1.7;
          color: #475569;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .legal-page { padding: 90px 16px 40px; }
          .legal-container { padding: 32px 24px; border-radius: 16px; }
        }
      `}</style>

      <main className="legal-page">
        <div className="legal-container">
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
              marginBottom: "28px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="legal-header">
            <div className="legal-badge">
              <Scale size={13} />
              <span>Legal Documentation</span>
            </div>
            <h1 className="legal-title">Terms of Service</h1>
            <div className="legal-meta">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Clock size={14} color="#D4A017" /> Last Updated: {lastUpdated}
              </span>
              <span>•</span>
              <span>The 10th Homes & Apartments Real Estate Ltd</span>
            </div>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <FileText size={20} color="#D4A017" />
              1. Acceptance of Terms
            </h2>
            <p className="legal-paragraph">
              By accessing, browsing, or using the digital platforms, mobile applications, or property services provided by <strong>The 10th Homes & Apartments Real Estate Ltd</strong> ("Company", "We", "Our", or "Us"), you confirm your agreement to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue the use of our services immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Building size={20} color="#D4A017" />
              2. Real Estate Listings & Title Verification
            </h2>
            <p className="legal-paragraph">
              All properties, apartments, short-let units, and land allocations listed on our platform are verified through official state land registries in Nigeria (including Lagos State Lands Bureau, Federal Capital Territory Administration, and relevant State Urban Development Authorities).
            </p>
            <ul className="legal-list">
              <li>Title documents including Certificates of Occupancy (C of O), Governor's Consents, Gazettes, and Excision approvals are verified prior to public listing.</li>
              <li>Property prices, payment plans, and availability are accurate at the time of publication but are subject to revision without prior notice.</li>
              <li>Physical inspection is strongly encouraged prior to final contract execution.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Shield size={20} color="#D4A017" />
              3. Payments, Instalments & Allocations
            </h2>
            <p className="legal-paragraph">
              All financial transactions, subscriptions, and instalment payments must be deposited directly into official designated bank accounts of <strong>The 10th Homes & Apartments Real Estate Ltd</strong>.
            </p>
            <ul className="legal-list">
              <li>Outright purchases entitle clients to immediate physical allocation upon document verification.</li>
              <li>Instalment payment schedules must be strictly adhered to as outlined in your Contract of Sale.</li>
              <li>Defaulting on scheduled payments for over 60 consecutive days without prior written consent may trigger default clauses as stipulated in your buyer agreement.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Lock size={20} color="#D4A017" />
              4. Realtor & Hotel Operator Guidelines
            </h2>
            <p className="legal-paragraph">
              Realtors and hospitality operators registered on our network agree to operate with maximum professional integrity, maintaining truthful representation of properties and respecting client confidentiality.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Scale size={20} color="#D4A017" />
              5. Governing Law & Dispute Resolution
            </h2>
            <p className="legal-paragraph">
              These Terms of Service are governed by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>. Any dispute arising out of or in connection with these terms shall first be resolved through amicable mediation before recourse to courts of competent jurisdiction in Lagos State, Nigeria.
            </p>
          </div>

          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Questions regarding our Terms of Service? Contact our legal team at{" "}
              <a href="mailto:tharel2024@gmail.com" style={{ color: "#D4A017", fontWeight: 700, textDecoration: "none" }}>
                tharel2024@gmail.com
              </a>{" "}
              or call <strong style={{ color: "#0F172A" }}>08168426592</strong>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
