"use client";
import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Adebayo Okafor",
    role: "Property Investor, Lagos",
    text: "The 10th Homes made my property investment journey seamless. I secured a plot in Lekki with a flexible payment plan and the documentation process was transparent from start to finish.",
    rating: 5,
  },
  {
    name: "Chidinma Eze",
    role: "First-time Buyer, Abuja",
    text: "I was skeptical about buying land online but The 10th Homes gave me confidence. They arranged a site inspection, explained the C of O clearly, and the team was available every step of the way.",
    rating: 5,
  },
  {
    name: "Emeka Nwosu",
    role: "Realtor, Port Harcourt",
    text: "As a realtor, I have referred multiple clients to The 10th Homes. Their property catalogue is verified, pricing is competitive, and the commission structure is fair.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true); // controls opacity transition
  const intervalRef = useRef(null);
  const timerRef = useRef(null); // for fade delay

  const total = testimonials.length;

  // Auto-slide logic
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      // Fade out, change, then fade in
      setFade(false);
      // After fade out, change index and fade in
      timerRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % total);
        setFade(true);
      }, 400); // matches transition duration
    }, 5000); // change every 5 seconds
  };

  // Clear intervals on unmount
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Function to manually change testimonial (with fade)
  const changeTestimonial = (index) => {
    // Clear auto-slide timer to reset
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Fade out, change, fade in
    setFade(false);
    timerRef.current = setTimeout(() => {
      setCurrent(index);
      setFade(true);
      // Restart auto-slide after 5 seconds of inactivity
      timerRef.current = setTimeout(() => {
        startAutoSlide();
      }, 5000);
    }, 400);
  };

  // Handlers for arrows and dots
  const prev = () => {
    const newIndex = current === 0 ? total - 1 : current - 1;
    changeTestimonial(newIndex);
  };

  const next = () => {
    const newIndex = current === total - 1 ? 0 : current + 1;
    changeTestimonial(newIndex);
  };

  const goTo = (index) => {
    changeTestimonial(index);
  };

  // Pause on hover, resume on leave
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    // Restart after a short delay
    timerRef.current = setTimeout(() => {
      startAutoSlide();
    }, 3000);
  };

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      style={{
        width: "100%",
        background: "white",
        padding: "80px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "#1A1A1A",
              marginBottom: "12px",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            What Our Clients Say
          </h2>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "15px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Real stories from real property owners and investors across Nigeria.
          </p>
        </div>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "#F8FAFC",
            borderRadius: "24px",
            padding: "40px 32px",
            boxShadow: "0 2px 14px rgba(15,23,42,0.07)",
            position: "relative",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Fading content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                color: "#D4A017",
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {t.name.charAt(0)}
            </div>

            <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={18} color="#D4A017" fill="#D4A017" />
              ))}
            </div>

            <p
              style={{
                fontSize: "16px",
                color: "#475569",
                lineHeight: 1.8,
                fontStyle: "italic",
                maxWidth: "600px",
              }}
            >
              "{t.text}"
            </p>

            <div>
              <p style={{ fontWeight: 700, color: "#1A1A1A", fontSize: "16px" }}>
                {t.name}
              </p>
              <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "4px" }}>
                {t.role}
              </p>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#D4A017";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "black";
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#D4A017";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "black";
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "32px",
          }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? "24px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: i === current ? "#D4A017" : "#CBD5E1",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}