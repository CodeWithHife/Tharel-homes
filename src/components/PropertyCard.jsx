"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, BedDouble, Bath, Ruler, MessageCircle, Heart } from "lucide-react";
import { getCurrentUser, toggleFavourite, getFavourites } from "@/lib/storage";

export default function PropertyCard({ property }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  const slug = property.slug || property.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const propId = property._id || property.id;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const favs = getFavourites(currentUser.id);
      setIsFavourite(favs.includes(propId));
    }
  }, [propId]);

  const handleFavourite = () => {
    if (!user) {
      router.push("/signup");
      return;
    }
    setLoading(true);
    try {
      const newFavs = toggleFavourite(user.id, propId);
      setIsFavourite(newFavs.includes(propId));
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
    setLoading(false);
  };

  const handleEnquire = () => {
    if (!user) {
      router.push("/signup");
      return;
    }
    // If logged in, open WhatsApp
    const message = `Hi, I'm interested in this property:\n\n${property.name}\nLocation: ${property.location}\nPrice: ${property.priceLabel}\n\nhttps://tharelhomes.com/properties/${slug}\n\nPlease send me more details.`;
    const phoneDigits = property.phone.replace(/^0/, "");
    const whatsappUrl = `https://wa.me/234${phoneDigits}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        background: "white",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Link href={`/properties/${slug}`}>
        <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#E2E8F0", width: "100%" }}>
          <img
            src={property.image}
            alt={property.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
            onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
          <span style={{ position: "absolute", top: "12px", left: "12px", background: "#D4A017", color: "white", padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            {property.type}
          </span>
        </div>
      </Link>

      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "16px" }}>
        <Link href={`/properties/${slug}`}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px", color: hovered ? "#D4A017" : "#111827", transition: "color 0.3s" }}>
            {property.name}
          </h3>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", color: "#64748B", fontSize: "12px" }}>
          <MapPin size={13} color="#D4A017" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {property.location}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "12px", fontSize: "12px", color: "#475569" }}>
          {property.beds > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <BedDouble size={13} />
              <span>{property.beds} Beds</span>
            </div>
          )}
          {property.baths > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Bath size={13} />
              <span>{property.baths} Baths</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", gridColumn: "1 / -1" }}>
            <Ruler size={13} />
            <span>{property.size}</span>
          </div>
        </div>

        <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", marginBottom: "2px" }}>
          Price
        </p>
        <p style={{ fontSize: "20px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>
          {property.priceLabel}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "auto" }}>
          {/* Add to Favourites button */}
          <button
            onClick={handleFavourite}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              height: "38px",
              borderRadius: "8px",
              border: "1.5px solid #CBD5E1",
              background: isFavourite ? "#ef4444" : "white",
              color: isFavourite ? "white" : "#1A1A1A",
              fontSize: "12px",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              transition: "all 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                if (isFavourite) {
                  e.currentTarget.style.background = "#dc2626";
                } else {
                  e.currentTarget.style.borderColor = "#D4A017";
                  e.currentTarget.style.background = "#F8FAFC";
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                if (isFavourite) {
                  e.currentTarget.style.background = "#ef4444";
                } else {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.background = "white";
                }
              }
            }}
          >
            <Heart size={14} fill={isFavourite ? "white" : "none"} />
            {loading ? "..." : isFavourite ? "Saved" : "Add"}
          </button>

          {/* Enquire button */}
          <button
            onClick={handleEnquire}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              height: "38px",
              borderRadius: "8px",
              background: "#D4A017",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#B8920F"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#D4A017"}
          >
            <MessageCircle size={13} />
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}