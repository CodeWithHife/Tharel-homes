"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Minus, MessageSquare, PhoneCall } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const faqs = [
  {
    id: "01",
    category: "buying",
    categoryLabel: "Buying & Payment",
    question: "How do I purchase a property listed on The 10th Homes?",
    answer: "Simply click the Enquire button on any property card or contact us directly via WhatsApp on 08168426592. Our team will guide you through the entire process — from documentation and payment plans to site inspection and allocation. We handle all paperwork, including title verification, so you can purchase with confidence.",
  },
  {
    id: "02",
    category: "buying",
    categoryLabel: "Buying & Payment",
    question: "Do you offer flexible payment plans?",
    answer: "Yes. Most of our listed properties come with flexible instalment plans ranging from 3 months to 24 months depending on the estate and developer. Initial deposits start as low as ₦500,000 on select properties, making it easier for first-time buyers and investors to get started. We also offer dedicated options for diaspora investors.",
  },
  {
    id: "03",
    category: "legal",
    categoryLabel: "Legal & Title",
    question: "Are the properties verified and legally documented?",
    answer: "Absolutely. Every property on our platform carries a verifiable title document — Certificate of Occupancy (C of O), Governor's Consent, FCDA Right of Occupancy, or Government Allocation. We conduct thorough due diligence on every listing before it appears on our platform. We do not list properties without proper documentation.",
  },
  {
    id: "04",
    category: "legal",
    categoryLabel: "Legal & Title",
    question: "What is the difference between C of O and Governor's Consent?",
    answer: "A Certificate of Occupancy (C of O) is issued by the government to confirm initial state ownership of a piece of land. Governor's Consent is required when a property with an existing C of O is legally transferred to a new owner. Both are legally valid, high-tier title documents.",
  },
  {
    id: "05",
    category: "inspection",
    categoryLabel: "Inspection & Process",
    question: "Can I do a site inspection before buying?",
    answer: "Yes, site inspections are available for all our properties. We strongly encourage all buyers to visit the site before making any payment. Reach out to us on 08168426592 to schedule a free inspection visit at your convenience. For diaspora investors, we can arrange live HD video tours with our on-ground team.",
  },
  {
    id: "06",
    category: "inspection",
    categoryLabel: "Inspection & Process",
    question: "What locations do you cover?",
    answer: "We cover properties across Lagos (Lekki, Ajah, Ibeju-Lekki, Ikorodu, Sangotedo, Maryland), Abuja (Kabusa, Apo, Kuje), Ogun State (Mowe, Abeokuta, Odeda), Oyo State (Ibadan), and Enugu. Our portfolio spans residential land, commercial plots, luxury duplexes, apartments, and farmland investments.",
  },
  {
    id: "07",
    category: "realtor",
    categoryLabel: "Realtors & Partners",
    question: "Do you work with realtors and agents?",
    answer: "Yes. We have a structured realtor and partner programme with competitive commission structures. Register on our platform to gain access to our full property catalogue, marketing materials, commission dashboard, and dedicated realtor support. We have active realtors across Lagos, Abuja, Ibadan, and in the diaspora.",
  },
  {
    id: "08",
    category: "legal",
    categoryLabel: "Legal & Title",
    question: "Is my investment safe with The 10th Homes?",
    answer: "We only partner with reputable developers and estates that have proper title documents and a proven track record. We also encourage all buyers to conduct independent legal due diligence before completing any transaction. Our team is available to answer any questions and provide all necessary documentation for verification.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState("01");
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #0F172A 0%, #0B1120 100%)",
        padding: "100px 0 110px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes faqGlowPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }

        @keyframes faqBadgeDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px rgba(212,160,23,0.8); }
        }

        .faq-header {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-header.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        /* Smooth CSS Accordion Grid */
        .faq-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .faq-card.open {
          background: rgba(212, 160, 23, 0.08);
          border-color: rgba(212, 160, 23, 0.4);
          box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.5), 0 0 25px rgba(212, 160, 23, 0.15);
        }

        .faq-card:hover {
          border-color: rgba(212, 160, 23, 0.3);
          transform: translate3d(0, -2px, 0);
        }

        .faq-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 28px;
          border: none;
          background: none;
          cursor: pointer;
          textAlign: left;
          gap: 16px;
        }

        .faq-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          flex-shrink: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-card.open .faq-icon-box {
          background: #D4A017;
          border-color: #D4A017;
          color: #0F172A;
          transform: rotate(180deg);
          box-shadow: 0 4px 14px rgba(212, 160, 23, 0.4);
        }

        .faq-content-grid {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-card.open .faq-content-grid {
          grid-template-rows: 1fr;
        }

        .faq-content-inner {
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.35s ease 0.05s;
        }

        .faq-card.open .faq-content-inner {
          opacity: 1;
        }

        .faq-filter-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .faq-filter-btn:hover {
          color: #ffffff;
          border-color: rgba(212, 160, 23, 0.4);
          background: rgba(212, 160, 23, 0.1);
        }

        .faq-filter-btn.active {
          background: #D4A017;
          color: #0F172A;
          font-weight: 700;
          border-color: #D4A017;
          box-shadow: 0 4px 14px rgba(212, 160, 23, 0.3);
        }
      `}</style>

      {/* Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 160, 23, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "faqGlowPulse 10s ease-in-out infinite",
        }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div className={`faq-header ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "52px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(212, 160, 23, 0.1)",
              border: "1px solid rgba(212, 160, 23, 0.25)",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#D4A017",
                animation: "faqBadgeDot 2s infinite ease-in-out",
              }}
            />
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#D4A017",
              }}
            >
              Have Questions? We Have Answers
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "#ffffff",
              fontSize: "clamp(30px, 3.5vw, 46px)",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Frequently Asked <span style={{ color: "#D4A017" }}>Questions</span>
          </h2>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.65)",
              fontSize: "16px",
              lineHeight: 1.68,
              maxWidth: "580px",
              margin: "0 auto",
            }}
          >
            Everything you need to know about property acquisition, documentation, flexible payment plans, and legal verification.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "64px" }}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`faq-card ${isOpen ? "open" : ""}`}>
                <button onClick={() => toggle(faq.id)} className="faq-btn">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: isOpen ? "#D4A017" : "rgba(255, 255, 255, 0.4)",
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {faq.id}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div className="faq-icon-box">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div className="faq-content-grid">
                  <div className="faq-content-inner">
                    <div
                      style={{
                        padding: "0 28px 24px 70px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        paddingTop: "16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14.5px",
                          color: "rgba(255, 255, 255, 0.7)",
                          lineHeight: 1.75,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Support Concierge CTA */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            padding: "28px 36px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(212, 160, 23, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)",
            border: "1px solid rgba(212, 160, 23, 0.3)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "#D4A017",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0F172A",
                flexShrink: 0,
                boxShadow: "0 6px 18px rgba(212, 160, 23, 0.4)",
              }}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "17px", color: "#ffffff", marginBottom: "4px" }}>
                Still Have Questions?
              </h4>
              <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "13.5px" }}>
                Our 24/7 client support team is ready to guide you on WhatsApp or call.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="https://wa.me/2348168426592"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "#D4A017",
                color: "#0F172A",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(212, 160, 23, 0.35)",
                transition: "all 0.3s ease",
              }}
            >
              <MessageSquare size={16} />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="tel:08168426592"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.3s ease",
              }}
            >
              <PhoneCall size={16} />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

