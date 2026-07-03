"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I purchase a property listed on The 10th Homes?",
    answer: "Simply click the Enquire button on any property card or contact us directly via WhatsApp on 08168426592. Our team will guide you through the entire process — from documentation and payment plans to site inspection and allocation. We handle all the paperwork, including title verification, so you can purchase with confidence.",
  },
  {
    question: "Do you offer flexible payment plans?",
    answer: "Yes. Most of our listed properties come with flexible instalment plans ranging from 3 months to 24 months depending on the estate and developer. Initial deposits start as low as ₦500,000 on select properties, making it easier for first-time buyers and investors to get started. We also offer options for diaspora investors.",
  },
  {
    question: "Are the properties verified and legally documented?",
    answer: "Absolutely. Every property on our platform carries a verifiable title document — Certificate of Occupancy (C of O), Governor's Consent, FCDA Right of Occupancy, or Government Allocation. We conduct thorough due diligence on every listing before it appears on our platform. We do not list properties without proper documentation.",
  },
  {
    question: "Can I do a site inspection before buying?",
    answer: "Yes, site inspections are available for all our properties. We strongly encourage all buyers to visit the site before making any payment. Reach out to us on 08168426592 to schedule a free inspection visit at a time that is convenient for you. For diaspora investors, we can arrange video tours with our on-ground team.",
  },
  {
    question: "Do you work with realtors and agents?",
    answer: "Yes. We have a structured realtor and agent programme with competitive commission structures. Register on our platform to gain access to our full property catalogue, marketing materials, commission dashboard, and dedicated realtor support. We have active realtors across Lagos, Abuja, Ibadan, and in the diaspora.",
  },
  {
    question: "What locations do you cover?",
    answer: "We cover properties across Lagos (Lekki, Ajah, Ibeju-Lekki, Ikorodu, Sangotedo, Maryland), Abuja (Kabusa, Apo, Kuje), Ogun State (Mowe, Abeokuta, Odeda), Oyo State (Ibadan), and Enugu. Our portfolio spans residential land, commercial plots, luxury duplexes, apartments, and farmland investments.",
  },
  {
    question: "Is my investment safe with The 10th Homes?",
    answer: "We only partner with reputable developers and estates that have proper title documents and a proven track record. We also encourage all buyers to conduct independent legal due diligence before completing any transaction. Our team is available to answer any questions and provide all necessary documentation for verification.",
  },
  {
    question: "What is the difference between C of O and Governor's Consent?",
    answer: "A Certificate of Occupancy (C of O) is issued by the government to confirm ownership of a piece of land. Governor's Consent is given when a property that already has a C of O is transferred to a new owner. Both are legally valid and strong title documents. Our team can explain what document applies to any specific property you are interested in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" style={{ width: "100%", background: "#F8FAFC", padding: "80px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#1A1A1A", marginBottom: "12px", fontFamily: "var(--font-montserrat), sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "15px", maxWidth: "600px", margin: "0 auto" }}>
            Everything you need to know before making your property investment.
          </p>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                  border: isOpen ? "2px solid #D4A017" : "1px solid transparent",
                  transition: "all 0.3s",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", flex: 1 }}>
                    {faq.question}
                  </span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isOpen ? "#D4A017" : "#F1F5F9", color: isOpen ? "white" : "#64748B", flexShrink: 0, transition: "all 0.3s" }}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div style={{ overflow: "hidden", maxHeight: isOpen ? "300px" : "0", transition: "max-height 0.3s ease" }}>
                  <div style={{ padding: "0 24px 20px", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                    <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.8 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}