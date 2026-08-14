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
  }


];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
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

