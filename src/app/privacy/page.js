"use client";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Server, UserCheck, Clock } from "lucide-react";

export default function PrivacyPage() {
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
              <Shield size={13} />
              <span>Data Protection Compliance</span>
            </div>
            <h1 className="legal-title">Privacy Policy</h1>
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
              <Eye size={20} color="#D4A017" />
              1. Information We Collect
            </h2>
            <p className="legal-paragraph">
              <strong>The 10th Homes & Apartments Real Estate Ltd</strong> values your privacy. We collect personal information to provide seamless real estate services, title documentation, and account management.
            </p>
            <ul className="legal-list">
              <li><strong>Personal Identification:</strong> Full name, phone number, email address, national identity numbers (where required for land title registration).</li>
              <li><strong>KYC & Documentation:</strong> Proof of identity and address for contract execution and land allocation.</li>
              <li><strong>Financial Information:</strong> Payment references, instalment records, and transaction receipts. We do not store full credit/debit card PINs on our servers.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Server size={20} color="#D4A017" />
              2. How We Use Your Data
            </h2>
            <p className="legal-paragraph">
              Your personal data is strictly processed for legitimate real estate operations including:
            </p>
            <ul className="legal-list">
              <li>Processing legal property allocations, Contracts of Sale, and Deeds of Assignment.</li>
              <li>Fulfilling requests for physical inspections and luxury short-let apartment bookings.</li>
              <li>Sending transaction updates, payment receipts, and property development progress reports.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <Lock size={20} color="#D4A017" />
              3. Data Protection & Compliance (NDPR)
            </h2>
            <p className="legal-paragraph">
              We adhere strictly to the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and international data security standards. All sensitive user data is encrypted in transit and at rest using modern AES-256 standards.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">
              <UserCheck size={20} color="#D4A017" />
              4. Data Sharing & Third Parties
            </h2>
            <p className="legal-paragraph">
              We <strong>never sell, rent, or trade</strong> your personal information to third-party advertisers. Information is shared only with authorized partners strictly necessary to complete your real estate transaction (such as government land registries, legal counsel, and banking institutions).
            </p>
          </div>

          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              To request data modification, deletion, or privacy assistance, please email our Data Protection Officer at{" "}
              <a href="mailto:tharel2024@gmail.com" style={{ color: "#D4A017", fontWeight: 700, textDecoration: "none" }}>
                tharel2024@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
