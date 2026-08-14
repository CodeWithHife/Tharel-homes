"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";
import { getStoredAuthUser } from "@/lib/auth";
import { getAllProperties } from "@/lib/properties";
import staticProperties from "@/data/properties";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  MessageCircle,
  Phone,
  Send,
  UserCheck,
  Star,
  Calendar,
  Share2,
  Building2,
  Sparkles,
  Award,
  Clock,
  Eye,
  Check
} from "lucide-react";

export default function PropertyInspectPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const rawParam = params?.slug;

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [isFav, setIsFav] = useState(false);

  // Live In-App Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    const current = getStoredAuthUser();
    setUser(current);

    if (!rawParam) return;
    const decodedParam = decodeURIComponent(rawParam);

    // Load property details matching slug, _id, or id
    getAllProperties()
      .then((all) => {
        const pool = all && all.length > 0 ? all : staticProperties;
        const found = pool.find(
          (p) =>
            String(p.slug || "").toLowerCase() === String(decodedParam).toLowerCase() ||
            String(p._id || p.id || "").toLowerCase() === String(decodedParam).toLowerCase() ||
            (p.name || p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === String(decodedParam).toLowerCase()
        );
        const matched = found || pool[0];
        setProperty(matched);

        // Auto-redirect numeric ID URL to clean SEO Property Name Slug
        const targetSlug = matched.slug || (matched.name || matched.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        if (targetSlug && String(decodedParam).toLowerCase() !== targetSlug.toLowerCase()) {
          router.replace(`/properties/${targetSlug}`);
        }
      })
      .catch(() => {
        const matched = staticProperties.find(
          (p) =>
            String(p.slug || "").toLowerCase() === String(decodedParam).toLowerCase() ||
            String(p._id || p.id || "").toLowerCase() === String(decodedParam).toLowerCase() ||
            (p.name || p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === String(decodedParam).toLowerCase()
        ) || staticProperties[0];
        setProperty(matched);

        const targetSlug = matched.slug || (matched.name || matched.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        if (targetSlug && String(decodedParam).toLowerCase() !== targetSlug.toLowerCase()) {
          router.replace(`/properties/${targetSlug}`);
        }
      })
      .finally(() => setLoading(false));

    // Load Favourites status
    if (current) {
      try {
        const favs = JSON.parse(window.localStorage.getItem("tharel_favs_" + current.id) || "[]");
        setIsFav(favs.includes(String(decodedParam)));
      } catch {
        setIsFav(false);
      }
    }

    // Load Live Chat Messages from LocalStorage
    try {
      const storedChats = JSON.parse(window.localStorage.getItem("tharel_chat_" + decodedParam) || "[]");
      if (storedChats.length > 0) {
        setChatMessages(storedChats);
      } else {
        const defaultChat = [
          {
            id: "msg_init",
            sender: "seller",
            senderName: "Obadimu Ifeoluwa (Verified Realtor)",
            text: "Hello! I am Obadimu Ifeoluwa, the verified realtor for this property. Send me a direct message here to request physical site inspection or verify title documentation.",
            time: "Just now",
          },
        ];
        setChatMessages(defaultChat);
      }
    } catch {
      setChatMessages([]);
    }

    // Load Reviews from LocalStorage (Strictly user-submitted, no fake hardcoded defaults)
    try {
      const allComments = JSON.parse(window.localStorage.getItem("tharel_comments") || "{}");
      const propReviews = allComments[String(decodedParam)] || [];
      setReviews(propReviews);
    } catch {
      setReviews([]);
    }
  }, [rawParam]);

  // Toggle Favourite
  function handleToggleFav() {
    if (!user) {
      router.push("/login");
      return;
    }
    const pId = String(property._id || property.id || property.slug);
    let favs = [];
    try {
      favs = JSON.parse(window.localStorage.getItem("tharel_favs_" + user.id) || "[]");
    } catch {
      favs = [];
    }

    let updated;
    if (favs.includes(pId)) {
      updated = favs.filter((id) => id !== pId);
      setIsFav(false);
    } else {
      updated = [...favs, pId];
      setIsFav(true);
    }
    window.localStorage.setItem("tharel_favs_" + user.id, JSON.stringify(updated));
  }

  // Send Direct Message to Seller / Realtor (Saved to central inquiries for Obadimu Ifeoluwa)
  function handleSendMessage(e) {
    e.preventDefault();
    if (!messageInput.trim() || !property) return;

    const pId = String(property._id || property.id || property.slug);
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const buyerName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Verified Buyer";

    const newMsg = {
      id: "msg_" + Date.now(),
      sender: "buyer",
      senderName: buyerName,
      text: messageInput.trim(),
      time: timeString,
    };

    const updatedChats = [...chatMessages, newMsg];
    setChatMessages(updatedChats);
    window.localStorage.setItem("tharel_chat_" + pId, JSON.stringify(updatedChats));

    // Save to shared Realtor Inquiries storage so Obadimu Ifeoluwa sees it in Realtor Dashboard
    try {
      const allInquiries = JSON.parse(window.localStorage.getItem("tharel_buyer_inquiries") || "[]");
      const inquiryEntry = {
        id: "inq_" + Date.now(),
        propertyId: pId,
        propertyName: property.name || property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        buyerName: buyerName,
        buyerPhone: user?.phone || "N/A",
        buyerEmail: user?.email || "N/A",
        message: messageInput.trim(),
        sellerName: property?.realtorName || "Obadimu Ifeoluwa",
        timestamp: new Date().toISOString(),
        time: timeString,
        status: "Unread",
      };
      const updatedInquiries = [inquiryEntry, ...allInquiries];
      window.localStorage.setItem("tharel_buyer_inquiries", JSON.stringify(updatedInquiries));
    } catch (err) {
      console.warn("Error storing buyer inquiry:", err);
    }

    setMessageInput("");

    // Automated immediate confirmation from seller bot/system
    setTimeout(() => {
      const sellerReply = {
        id: "msg_reply_" + Date.now(),
        sender: "seller",
        senderName: property?.realtorName || "Obadimu Ifeoluwa (Verified Realtor)",
        text: "Thank you for reaching out! I have received your message regarding " + (property?.name || "this estate") + ". I will review your inspection request in my Realtor Portal and reply shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => {
        const next = [...prev, sellerReply];
        window.localStorage.setItem("tharel_chat_" + pId, JSON.stringify(next));
        return next;
      });
    }, 1200);
  }

  // Post Review (Real user submission)
  function handlePostReview(e) {
    e.preventDefault();
    if (!newReviewText.trim() || !property) return;

    const pId = String(property._id || property.id || property.slug);
    const newRev = {
      id: "rev_" + Date.now(),
      userName: user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Verified Buyer",
      userAvatar: user?.firstName ? user.firstName[0].toUpperCase() : "B",
      rating: Number(newReviewRating),
      text: newReviewText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const allComments = JSON.parse(window.localStorage.getItem("tharel_comments") || "{}");
      allComments[pId] = updated;
      window.localStorage.setItem("tharel_comments", JSON.stringify(allComments));
    } catch {}

    setNewReviewText("");
    setNewReviewRating(5);
  }

  function formatPrice(price) {
    if (!price) return "Price on request";
    if (typeof price === "string" && price.startsWith("₦")) return price;
    const num = Number(String(price).replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num === 0) return String(price);
    return `₦${num.toLocaleString()}`;
  }

  if (loading) {
    return <LoadingScreen message="The 10th Homes · Loading Property Details..." />;
  }

  if (!property) return null;

  const sellerName = property.realtorName || property.phoneName || "Obadimu Ifeoluwa";

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #071521;
          color: #F8FAFC;
          line-height: 1.5;
          overflow-x: hidden;
        }

        .inspect-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── FLOATING TOP ACTION BAR (No Navbar Header) ── */
        .action-bar {
          padding: 24px 0 12px;
        }
        .action-bar .inspect-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #F5D061;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(14px);
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          padding: 10px 22px;
          border-radius: 30px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        .btn-back:hover {
          background: rgba(212, 160, 23, 0.2);
          border-color: #F5D061;
          transform: translateX(-3px);
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.25);
        }

        .badge-verified-hero {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          padding: 8px 18px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── LAYOUT GRID ── */
        .inspect-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 36px;
          padding: 16px 0 80px;
        }

        /* ── MAIN CARD ── */
        .main-card {
          background: linear-gradient(160deg, #0F172A 0%, #1E293B 100%);
          border-radius: 28px;
          border: 1.5px solid rgba(212, 160, 23, 0.35);
          overflow: hidden;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.4);
        }
        .gallery-container {
          position: relative;
          height: 460px;
          background: #1E293B;
          overflow: hidden;
        }
        .gallery-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-container:hover img {
          transform: scale(1.04);
        }

        .fav-circle-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(7, 21, 33, 0.8);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .fav-circle-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }

        .details-body {
          padding: 36px;
        }
        .price-tag {
          font-family: 'Montserrat', sans-serif;
          font-size: 34px;
          font-weight: 900;
          color: #F5D061;
          text-shadow: 0 2px 12px rgba(212, 160, 23, 0.3);
          letter-spacing: -0.02em;
        }
        .prop-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #ffffff;
          margin: 8px 0 12px;
          line-height: 1.3;
        }
        .prop-location {
          font-size: 15.5px;
          color: rgba(255, 255, 255, 0.75);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .specs-row {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          padding: 18px 24px;
          border-radius: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .spec-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14.5px;
          font-weight: 700;
          color: #ffffff;
        }

        /* Verified Realtor Card */
        .realtor-card {
          background: rgba(212, 160, 23, 0.12);
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          border-radius: 22px;
          padding: 24px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        /* ── IN-APP DIRECT LIVE CHAT WINDOW ── */
        .chat-card {
          background: linear-gradient(160deg, #0F172A 0%, #1E293B 100%);
          border-radius: 28px;
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          height: 640px;
          position: sticky;
          top: 30px;
        }
        .chat-header {
          padding: 22px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: #071521;
          border-radius: 28px 28px 0 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .msg-bubble {
          max-width: 84%;
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
        }
        .msg-bubble.buyer {
          align-self: flex-end;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 50%, #B8860B 100%);
          color: #071521;
          border-bottom-right-radius: 4px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(212, 160, 23, 0.25);
        }
        .msg-bubble.seller {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .msg-time {
          font-size: 10.5px;
          opacity: 0.75;
          margin-top: 4px;
          text-align: right;
        }

        .chat-footer {
          padding: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: #071521;
          border-radius: 0 0 28px 28px;
        }
        .btn-send {
          padding: 14px 22px;
          border-radius: 14px;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 100%);
          color: #071521;
          border: none;
          cursor: pointer;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }
        .btn-send:hover {
          background: linear-gradient(135deg, #ffffff 0%, #F5D061 100%);
          transform: translateY(-1px);
        }

        @media (max-width: 940px) {
          .inspect-grid { grid-template-columns: 1fr; }
          .chat-card { position: relative; top: 0; height: 520px; }
          .gallery-container { height: 320px; }
        }
      `}</style>

      {/* ── FLOATING TOP ACTION BAR (No Navbar Header as requested) ── */}
      <div className="action-bar">
        <div className="inspect-container">
          <Link href="/dashboard/buyer" className="btn-back">
            <ArrowLeft size={18} /> Back to Catalog
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", width: "34px", height: "34px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="Logo"
                width={34}
                height={34}
                style={{ objectFit: "contain" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "18px", color: "#ffffff" }}>
              The<span style={{ color: "#F5D061" }}>10th</span>Homes Apartments
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN INSPECTION CONTAINER ── */}
      <main className="inspect-container">
        <div className="inspect-grid">
          {/* Main Details Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div className="main-card">
              <div className="gallery-container">
                <img
                  src={property.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"}
                  alt={property.name}
                />
                <span className="badge-verified-hero" style={{ position: "absolute", top: "20px", left: "20px" }}>
                  <ShieldCheck size={16} /> Verified Title Document
                </span>
                <button
                  className="fav-circle-btn"
                  onClick={handleToggleFav}
                  title={isFav ? "Saved in Favourites" : "Save to Favourites"}
                >
                  <Heart size={22} fill={isFav ? "#EF4444" : "none"} color={isFav ? "#EF4444" : "#ffffff"} />
                </button>
              </div>

              <div className="details-body">
                <div className="price-tag">{formatPrice(property.price)}</div>
                <h1 className="prop-title">{property.name || property.title}</h1>

                <div className="prop-location">
                  <MapPin size={19} color="#F5D061" /> {property.location}
                </div>

                <div className="specs-row">
                  {property.beds !== null && property.beds !== undefined && (
                    <div className="spec-item">
                      <Bed size={19} color="#F5D061" /> {property.beds} Bedrooms
                    </div>
                  )}
                  {property.baths !== null && property.baths !== undefined && (
                    <div className="spec-item">
                      <Bath size={19} color="#F5D061" /> {property.baths} Bathrooms
                    </div>
                  )}
                  {property.size && (
                    <div className="spec-item">
                      <Maximize size={19} color="#F5D061" /> {property.size}
                    </div>
                  )}
                  <div className="spec-item">
                    <ShieldCheck size={19} color="#F5D061" /> {property.title || "C of O Title"}
                  </div>
                </div>

                {/* Verified Realtor Box */}
                <div className="realtor-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #F5D061 0%, #B8860B 100%)",
                        color: "#071521",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "20px",
                      }}
                    >
                      {sellerName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "17px", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                        {sellerName}
                      </h4>
                      <p style={{ fontSize: "13px", color: "#F5D061", fontWeight: 800, margin: "3px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <UserCheck size={15} /> Verified Estate Realtor
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid #10B981",
                      color: "#10B981",
                      padding: "8px 16px",
                      borderRadius: "30px",
                      fontSize: "13px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle2 size={16} /> Online for Direct In-App Chat
                  </div>
                </div>

                {/* About Description */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "19px", fontWeight: 900, color: "#ffffff", marginBottom: "12px" }}>
                    Verified Title &amp; Legal Description
                  </h3>
                  <p style={{ fontSize: "15.5px", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.75 }}>
                    {property.description ||
                      "This luxury estate offer features complete title documentation backed by state land registries. Zero government acquisition risk, ready for instant allocation and physical site inspection."}
                  </p>
                </div>

                {/* Estate Features Grid */}
                {property.features && property.features.length > 0 && (
                  <div style={{ marginBottom: "32px" }}>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "19px", fontWeight: 900, color: "#ffffff", marginBottom: "16px" }}>
                      Key Estate Features &amp; Infrastructure
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "14px" }}>
                      {property.features.map((feat, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14.5px",
                            color: "rgba(255, 255, 255, 0.85)",
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "14px 18px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255, 255, 255, 0.09)",
                          }}
                        >
                          <CheckCircle2 size={17} color="#F5D061" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Community Reviews Section (Real User Submissions Only) */}
            <div className="main-card" style={{ padding: "36px" }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "21px", fontWeight: 900, color: "#ffffff", marginBottom: "20px" }}>
                Buyer Discussions &amp; Reviews ({reviews.length})
              </h3>

              {/* Add Review Form */}
              <form
                onSubmit={handlePostReview}
                style={{
                  marginBottom: "32px",
                  background: "rgba(255, 255, 255, 0.04)",
                  padding: "24px",
                  borderRadius: "22px",
                  border: "1.5px solid rgba(212, 160, 23, 0.35)",
                }}
              >
                <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15.5px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
                  Write a Review or Ask a Title Question
                </h4>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      cursor="pointer"
                      onClick={() => setNewReviewRating(star)}
                      fill={star <= newReviewRating ? "#F5D061" : "none"}
                      color={star <= newReviewRating ? "#F5D061" : "rgba(255,255,255,0.3)"}
                    />
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your inspection review or ask about title documentation..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    fontSize: "14.5px",
                    color: "#ffffff",
                    outline: "none",
                    fontFamily: "inherit",
                    marginBottom: "14px",
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    padding: "12px 28px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #F5D061 0%, #D4A017 100%)",
                    color: "#071521",
                    fontWeight: 900,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Send size={17} /> Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {reviews.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 20px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "20px",
                      border: "1px dashed rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <MessageCircle size={40} color="#F5D061" style={{ margin: "0 auto 12px" }} />
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                      No comments or reviews yet
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                      Be the first verified buyer to leave feedback or inquire about this estate.
                    </p>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        borderRadius: "18px",
                        padding: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #F5D061 0%, #B8860B 100%)",
                              color: "#071521",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: "14px",
                            }}
                          >
                            {r.userAvatar || "B"}
                          </div>
                          <div>
                            <span style={{ fontSize: "14.5px", fontWeight: 800, color: "#ffffff" }}>{r.userName}</span>
                            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginLeft: "10px" }}>{r.date}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} size={15} fill="#F5D061" color="#F5D061" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.6 }}>{r.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: In-App Direct Live Chat Window */}
          <div>
            <div className="chat-card">
              <div className="chat-header">
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F5D061 0%, #B8860B 100%)",
                    color: "#071521",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "18px",
                  }}
                >
                  {sellerName[0].toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    In-App Direct Chat
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "#F5D061", fontWeight: 800, margin: 0 }}>
                    {sellerName} · Online
                  </p>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`msg-bubble ${msg.sender === "buyer" ? "buyer" : "seller"}`}>
                    <div style={{ fontSize: "11px", fontWeight: 800, opacity: 0.85, marginBottom: "3px" }}>
                      {msg.senderName}
                    </div>
                    <div>{msg.text}</div>
                    <div className="msg-time">{msg.time}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="chat-footer">
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder={`Message ${sellerName}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      fontSize: "14px",
                      color: "#ffffff",
                      outline: "none",
                    }}
                    required
                  />
                  <button type="submit" className="btn-send">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}