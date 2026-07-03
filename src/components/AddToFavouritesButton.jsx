"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { getCurrentUser, toggleFavourite, getFavourites } from "@/lib/storage";

export default function AddToFavouritesButton({ propertyId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      const favs = getFavourites(current.id);
      setIsFavourite(favs.includes(propertyId));
    }
  }, [propertyId]);

  const handleClick = () => {
    if (!user) {
      // Redirect to signup if not logged in
      router.push("/signup");
      return;
    }
    setLoading(true);
    try {
      const newFavs = toggleFavourite(user.id, propertyId);
      setIsFavourite(newFavs.includes(propertyId));
      // Optional: show a toast or notification
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: isFavourite ? "#ef4444" : "#0F172A",
        color: "white",
        padding: "14px 28px",
        borderRadius: "8px",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          if (isFavourite) e.currentTarget.style.backgroundColor = "#dc2626";
          else e.currentTarget.style.backgroundColor = "#D4AF37";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          if (isFavourite) e.currentTarget.style.backgroundColor = "#ef4444";
          else e.currentTarget.style.backgroundColor = "#0F172A";
        }
      }}
    >
      <Heart size={18} fill={isFavourite ? "white" : "none"} />
      {loading ? "Saving..." : isFavourite ? "Remove from Favourites" : "Add to Favourites"}
    </button>
  );
}