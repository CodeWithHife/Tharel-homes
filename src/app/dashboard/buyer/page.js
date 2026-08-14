"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";
import { getStoredAuthUser, logoutAuth, updateProfileWithBackend } from "@/lib/auth";
import { getAllProperties } from "@/lib/properties";
import staticProperties from "@/data/properties";
import {
  Home,
  CheckCircle2,
  Search,
  Heart,
  Star,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  MessageCircle,
  Phone,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Undo2,
  Bookmark,
  User,
  LogOut,
  Send,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Award,
  Calendar,
  UserCheck,
  Eye,
  Lock,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  Tag
} from "lucide-react";

export default function BuyerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Filters & State
  const [allProperties, setAllProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modals & Drawers
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [commentsModalProp, setCommentsModalProp] = useState(null);
  const [messageModalProp, setMessageModalProp] = useState(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Comments State (No fake defaults - strictly user comments)
  const [commentsStore, setCommentsStore] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRating, setNewCommentRating] = useState(5);

  // Message Form State
  const [messageForm, setMessageForm] = useState({ name: "", phone: "", message: "", sent: false });

  // Profile Edit State
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState("");

  // Initial Data Loading & Auth Guard
  useEffect(() => {
    const current = getStoredAuthUser();
    if (!current) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const role = current.role?.toLowerCase();
    if (role && role !== "buyer") {
      if (role === "realtor") router.push("/dashboard/realtor");
      else if (role === "hotel") router.push("/dashboard/hotel");
      else if (role === "admin") router.push("/dashboard/admin");
      setLoading(false);
      return;
    }

    setUser(current);
    setEditForm({
      firstName: current.firstName || "",
      lastName: current.lastName || "",
      phone: current.phone || "",
    });

    // Load saved favourites
    try {
      const favIds = JSON.parse(window.localStorage.getItem("tharel_favs_" + current.id) || "[]");
      setFavourites(favIds);
    } catch {
      setFavourites([]);
    }

    // Load saved comments from LocalStorage (No hardcoded fake defaults)
    try {
      const storedComments = JSON.parse(window.localStorage.getItem("tharel_comments") || "{}");
      setCommentsStore(storedComments);
    } catch {
      setCommentsStore({});
    }

    // Fetch properties from backend, fallback to static dataset
    getAllProperties()
      .then((props) => {
        if (props && props.length > 0) {
          setAllProperties(props);
        } else {
          setAllProperties(staticProperties);
        }
      })
      .catch(() => setAllProperties(staticProperties))
      .finally(() => setLoading(false));
  }, [router]);

  // Auth Logout
  function handleLogout() {
    logoutAuth();
    router.push("/");
  }

  // Toggle Favourite
  function toggleFavourite(propertyId, e) {
    if (e) e.stopPropagation();
    const pId = String(propertyId);
    let updatedFavs;
    if (favourites.includes(pId)) {
      updatedFavs = favourites.filter((id) => id !== pId);
    } else {
      updatedFavs = [...favourites, pId];
    }
    setFavourites(updatedFavs);
    if (user) {
      window.localStorage.setItem("tharel_favs_" + user.id, JSON.stringify(updatedFavs));
    }
  }

  // Format Currency
  function formatPrice(price) {
    if (!price) return "Price on request";
    if (typeof price === "string" && price.startsWith("₦")) return price;
    const num = Number(String(price).replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num === 0) return String(price);
    return `₦${num.toLocaleString()}`;
  }

  // Format Joined Date
  function getJoinedDate(createdAt) {
    if (!createdAt) return "August 2026";
    try {
      const d = new Date(createdAt);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "August 2026";
    }
  }

  // Add Real Comment to Property
  function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim() || !commentsModalProp) return;

    const propId = String(commentsModalProp._id || commentsModalProp.id);
    const newEntry = {
      id: "comment_" + Date.now(),
      userName: user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Verified Buyer",
      userAvatar: user?.firstName ? user.firstName[0].toUpperCase() : "B",
      rating: Number(newCommentRating),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const existingList = commentsStore[propId] || [];
    const updatedList = [newEntry, ...existingList];
    const updatedStore = { ...commentsStore, [propId]: updatedList };

    setCommentsStore(updatedStore);
    window.localStorage.setItem("tharel_comments", JSON.stringify(updatedStore));
    setNewCommentText("");
    setNewCommentRating(5);
  }

  // Handle Send Inquiry Message
  function handleSendMessage(e) {
    e.preventDefault();
    if (!messageModalProp) return;

    setMessageForm((prev) => ({ ...prev, sent: true }));
    setTimeout(() => {
      setMessageForm({ name: "", phone: "", message: "", sent: false });
      setMessageModalProp(null);
    }, 2200);
  }

  // Save Profile
  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!user) return;
    try {
      const updated = await updateProfileWithBackend(editForm);
      setUser({ ...user, ...(updated || editForm) });
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err) {
      setProfileMsg("Error updating profile: " + (err.message || "Something went wrong"));
    }
  }

  // Filter & Sort Logic
  const filteredProperties = allProperties.filter((p) => {
    const pId = String(p._id || p.id);
    const pType = (p.type || "").toLowerCase();
    const pName = (p.name || p.title || "").toLowerCase();
    const pLoc = (p.location || "").toLowerCase();

    // Type Filter
    if (currentFilter === "land" && !pType.includes("land")) return false;
    if (
      currentFilter === "residential" &&
      !pType.includes("duplex") &&
      !pType.includes("house") &&
      !pType.includes("residential") &&
      !pType.includes("apartment") &&
      !pType.includes("mansion")
    )
      return false;
    if (currentFilter === "favourites" && !favourites.includes(pId)) return false;

    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      if (!pName.includes(q) && !pLoc.includes(q) && !pType.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-low") {
      const numA = Number(String(a.price).replace(/[^0-9.]/g, "")) || 0;
      const numB = Number(String(b.price).replace(/[^0-9.]/g, "")) || 0;
      return numA - numB;
    } else if (sortBy === "price-high") {
      const numA = Number(String(a.price).replace(/[^0-9.]/g, "")) || 0;
      const numB = Number(String(b.price).replace(/[^0-9.]/g, "")) || 0;
      return numB - numA;
    } else if (sortBy === "views") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  if (loading) {
    return <LoadingScreen message="The 10th Homes · Verified Buyer Portal Loading..." />;
  }

  if (!user) return null;

  // Real comment metrics count
  const totalUserComments = Object.values(commentsStore).reduce(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );

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

        .buyer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── LUXURY DARK BLENDING TOP BAR ── */
        .top-bar {
          background: rgba(7, 21, 33, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid rgba(212, 160, 23, 0.25);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 160, 23, 0.1);
          transition: all 0.3s ease;
        }
        .top-bar .buyer-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 21px;
          color: #ffffff;
          letter-spacing: -0.4px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-gold {
          color: #F5D061;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-badge {
          font-weight: 800;
          font-size: 10px;
          color: #F5D061;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-left: 6px;
          background: rgba(212, 160, 23, 0.15);
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(212, 160, 23, 0.35);
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 28px;
          font-size: 14px;
          font-weight: 700;
        }
        .nav-links button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.75);
          padding: 6px 0;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .nav-links button::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #F5D061, #D4A017);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-links button:hover,
        .nav-links button.active {
          color: #F5D061;
        }
        .nav-links button:hover::after,
        .nav-links button.active::after {
          width: 100%;
        }

        @media (min-width: 840px) {
          .nav-links { display: flex; }
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          padding: 6px 16px 6px 8px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          border: 1.5px solid rgba(212, 160, 23, 0.45);
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }
        .user-badge:hover {
          background: rgba(212, 160, 23, 0.18);
          border-color: #F5D061;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.25);
        }
        .user-badge .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 50%, #B8860B 100%);
          color: #071521;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14.5px;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(212,160,23,0.4);
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.85);
          color: #F5D061;
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .menu-toggle:hover {
          background: rgba(212, 160, 23, 0.2);
          transform: scale(1.05);
        }
        @media (min-width: 840px) {
          .menu-toggle { display: none; }
        }

        /* ── HERO BANNER & STATS HIGHLIGHT ── */
        .buyer-hero {
          background: linear-gradient(160deg, #071521 0%, #0B2B3B 50%, #0F172A 100%);
          padding: 44px 0 36px;
          border-bottom: 1.5px solid rgba(212, 160, 23, 0.25);
          position: relative;
          overflow: hidden;
        }
        .buyer-hero::before {
          content: "";
          position: absolute;
          top: -20%;
          right: -10%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: floatPulse 8s ease-in-out infinite alternate;
        }
        @keyframes floatPulse {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 20px) scale(1.08); }
        }

        .welcome-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 28px;
        }
        .welcome-header h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .welcome-header h1 span {
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .welcome-sub {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
          font-weight: 500;
        }

        /* Metrics Bar */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .metric-card {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(212, 160, 23, 0.25);
          border-radius: 20px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        .metric-card:hover {
          transform: translateY(-4px);
          border-color: #D4A017;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(212, 160, 23, 0.2);
          background: rgba(15, 23, 42, 0.85);
        }
        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(212, 160, 23, 0.2) 0%, rgba(184, 134, 11, 0.3) 100%);
          border: 1px solid rgba(212, 160, 23, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F5D061;
          flex-shrink: 0;
        }
        .metric-info h4 {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
        }
        .metric-info p {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
          margin-top: 3px;
        }

        /* Search Box */
        .search-box {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 60px;
          overflow: hidden;
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
        }
        .search-box:focus-within {
          border-color: #F5D061;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.25), 0 16px 40px rgba(0, 0, 0, 0.4);
          transform: translateY(-2px);
        }
        .search-box input {
          flex: 1;
          min-width: 220px;
          padding: 18px 26px;
          border: none;
          background: transparent;
          font-size: 15.5px;
          font-weight: 500;
          color: #ffffff;
          outline: none;
        }
        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .search-box .search-btn {
          padding: 18px 36px;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 50%, #B8860B 100%);
          color: #071521;
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 14.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 0 60px 60px 0;
          white-space: nowrap;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .search-box .search-btn:hover {
          background: linear-gradient(135deg, #ffffff 0%, #F5D061 100%);
          box-shadow: 0 0 25px rgba(245, 208, 97, 0.6);
        }

        /* Quick Search Tags */
        .quick-tags {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }
        .tag-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.85);
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tag-btn:hover {
          background: rgba(212, 160, 23, 0.2);
          border-color: #D4A017;
          color: #F5D061;
        }

        /* ── FILTER TABS & CONTROL BAR ── */
        .filter-tabs {
          background: #0B2B3B;
          padding: 22px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .filter-tabs .buyer-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .tab-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          padding: 6px;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tab-group .tab {
          padding: 10px 22px;
          border-radius: 30px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.02em;
        }
        .tab-group .tab:hover {
          color: #F5D061;
          background: rgba(212, 160, 23, 0.12);
        }
        .tab-group .tab.active {
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 50%, #B8860B 100%);
          color: #071521;
          box-shadow: 0 4px 16px rgba(212, 160, 23, 0.35);
          font-weight: 900;
        }

        .favourites-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 800;
          color: #F5D061;
          padding: 10px 22px;
          border-radius: 30px;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.35);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .favourites-badge:hover {
          background: rgba(212, 160, 23, 0.25);
          border-color: #F5D061;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(212, 160, 23, 0.25);
        }

        /* ── LISTINGS SECTION ── */
        .listings-section {
          padding: 36px 0 80px;
          background: linear-gradient(180deg, #071521 0%, #0B2B3B 100%);
          min-height: 60vh;
        }
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 32px;
        }
        .status-bar .left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-bar .right {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
        }
        .status-bar select {
          border: 1.5px solid rgba(212, 160, 23, 0.35);
          background: rgba(15, 23, 42, 0.95);
          font-size: 13.5px;
          color: #ffffff;
          font-weight: 700;
          outline: none;
          padding: 9px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .status-bar select:hover {
          border-color: #F5D061;
          box-shadow: 0 0 12px rgba(212, 160, 23, 0.2);
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }

        /* ── PROPERTY CARD (Ultra Premium) ── */
        .property-card {
          background: linear-gradient(160deg, #0F172A 0%, #1E293B 100%);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
        }
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .property-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 160, 23, 0.25);
          border-color: rgba(212, 160, 23, 0.5);
        }
        .property-card .card-img {
          position: relative;
          height: 230px;
          background: #1E293B;
          overflow: hidden;
        }
        .property-card .card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .property-card:hover .card-img img {
          transform: scale(1.08);
        }

        .badge-verified {
          position: absolute;
          top: 14px;
          left: 14px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .badge-type {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(7, 21, 33, 0.85);
          color: #F5D061;
          font-size: 11px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid rgba(212, 160, 23, 0.35);
          backdrop-filter: blur(6px);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .favourite-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(7, 21, 33, 0.75);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid rgba(255, 255, 255, 0.18);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }
        .favourite-btn:hover,
        .favourite-btn.active {
          background: #ffffff;
          color: #EF4444;
          transform: scale(1.15);
          border-color: #EF4444;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }

        .card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-body .price {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #F5D061;
          margin-bottom: 6px;
          text-shadow: 0 2px 10px rgba(212, 160, 23, 0.25);
          letter-spacing: -0.02em;
        }
        .card-body .title {
          font-family: 'Montserrat', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
          line-height: 1.35;
          transition: color 0.2s;
        }
        .card-body .title:hover {
          color: #F5D061;
        }

        .card-body .seller-info {
          font-size: 12.5px;
          font-weight: 800;
          color: #F5D061;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          background: rgba(212, 160, 23, 0.12);
          padding: 5px 12px;
          border-radius: 8px;
          width: fit-content;
          border: 1px solid rgba(212, 160, 23, 0.3);
        }
        .card-body .location {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 18px;
        }

        .card-body .meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .card-body .meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Actions Footer */
        .card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
        }
        .btn-inspect {
          flex: 1;
          padding: 13px 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 50%, #B8860B 100%);
          color: #071521;
          font-family: 'Montserrat', sans-serif;
          font-size: 13.5px;
          font-weight: 900;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.03em;
          box-shadow: 0 4px 16px rgba(212, 160, 23, 0.3);
          text-transform: uppercase;
        }
        .btn-inspect:hover {
          background: linear-gradient(135deg, #ffffff 0%, #F5D061 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 208, 97, 0.5);
        }
        .btn-action-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .btn-action-icon:hover {
          background: rgba(212, 160, 23, 0.2);
          border-color: #F5D061;
          color: #F5D061;
          transform: translateY(-2px);
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 24px;
          background: rgba(15, 23, 42, 0.65);
          border-radius: 32px;
          border: 1.5px dashed rgba(212, 160, 23, 0.35);
          backdrop-filter: blur(16px);
        }
        .empty-state .icon {
          font-size: 60px;
          color: #F5D061;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        .empty-state h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .empty-state p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15.5px;
          max-width: 480px;
          margin: 0 auto 28px;
          line-height: 1.6;
        }
        .btn-reset {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 40px;
          background: linear-gradient(135deg, #F5D061 0%, #D4A017 100%);
          color: #071521;
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 14.5px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 18px rgba(212, 160, 23, 0.35);
          text-transform: uppercase;
        }
        .btn-reset:hover {
          background: linear-gradient(135deg, #ffffff 0%, #F5D061 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 208, 97, 0.5);
        }

        /* ── MODALS ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 21, 33, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-card {
          background: #0F172A;
          border-radius: 32px;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1.5px solid rgba(212, 160, 23, 0.4);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 160, 23, 0.2);
          position: relative;
          color: #ffffff;
        }
        .modal-header {
          padding: 26px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #071521;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .modal-close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F5D061;
          transition: all 0.3s;
        }
        .modal-close-btn:hover {
          background: rgba(212, 160, 23, 0.25);
          transform: rotate(90deg);
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .buyer-container { padding: 0 16px; }
          .welcome-header h1 { font-size: 20px; }
          .listings-grid { grid-template-columns: 1fr; }
          .favourites-badge { margin-left: 0; width: 100%; justify-content: center; }
          .search-box .search-btn { width: 100%; border-radius: 0 0 30px 30px; justify-content: center; }
          .search-box input { border-radius: 30px 30px 0 0; }
        }
      `}</style>

      {/* ── LUXURY DARK BLENDING TOP BAR (Matches Luxury Dark Theme) ── */}
      <header className="top-bar">
        <div className="buyer-container">
          <Link href="/" className="logo">
            <div style={{ position: "relative", width: "38px", height: "38px" }}>
              <Image
                src="/images/logos/logo.png"
                alt="The 10th Homes"
                width={38}
                height={38}
                style={{ objectFit: "contain" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            The<span className="logo-gold">10th</span>Homes
            <span className="logo-badge">Buyer Portal</span>
          </Link>

          <nav className="nav-links">
            <button
              className={currentFilter === "all" ? "active" : ""}
              onClick={() => setCurrentFilter("all")}
            >
              Buy
            </button>
            <button
              className={currentFilter === "residential" ? "active" : ""}
              onClick={() => setCurrentFilter("residential")}
            >
              Residential
            </button>
            <button
              className={currentFilter === "land" ? "active" : ""}
              onClick={() => setCurrentFilter("land")}
            >
              Verified Land
            </button>
            <button
              className={currentFilter === "favourites" ? "active" : ""}
              onClick={() => setCurrentFilter("favourites")}
            >
              Favourites ({favourites.length})
            </button>
            <button onClick={() => setAccountModalOpen(true)}>Profile &amp; Badges</button>
          </nav>

          <div className="top-actions">
            {/* Buyer Account Badge */}
            <div className="user-badge" onClick={() => setAccountModalOpen(true)}>
              <span className="avatar">
                {user.firstName ? user.firstName[0].toUpperCase() : "B"}
              </span>
              <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email}
              </span>
              <ChevronDown size={14} color="#F5D061" />
            </div>

            <button
              className="menu-toggle"
              aria-label="Menu"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div
            style={{
              background: "#0B2B3B",
              borderBottom: "2px solid rgba(212,160,23,0.4)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              animation: "modalFadeIn 0.25s ease",
            }}
          >
            <button
              style={{
                textAlign: "left",
                padding: "10px 0",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 800,
                color: "#F5D061",
              }}
              onClick={() => {
                setCurrentFilter("all");
                setMobileNavOpen(false);
              }}
            >
              Explore All Properties
            </button>
            <button
              style={{
                textAlign: "left",
                padding: "10px 0",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
              }}
              onClick={() => {
                setCurrentFilter("land");
                setMobileNavOpen(false);
              }}
            >
              Verified Land Titles (C of O)
            </button>
            <button
              style={{
                textAlign: "left",
                padding: "10px 0",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
              }}
              onClick={() => {
                setCurrentFilter("residential");
                setMobileNavOpen(false);
              }}
            >
              Residential &amp; Luxury Estates
            </button>
            <button
              style={{
                textAlign: "left",
                padding: "10px 0",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
              }}
              onClick={() => {
                setCurrentFilter("favourites");
                setMobileNavOpen(false);
              }}
            >
              Saved Favourites ({favourites.length})
            </button>
            <button
              style={{
                textAlign: "left",
                padding: "10px 0",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 800,
                color: "#EF4444",
              }}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </header>

      {/* ── HERO BANNER & METRICS ── */}
      <section className="buyer-hero">
        <div className="buyer-container">
          <div className="welcome-header">
            <div>
              <h1>
                Welcome back, <span>{user.firstName || "Verified Buyer"}</span>{" "}
                <Sparkles size={24} color="#F5D061" style={{ display: "inline-block" }} />
              </h1>
              <p className="welcome-sub">
                Explore 100% legal title-verified lands, luxury duplexes, and prime estate allocations.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10B981",
                padding: "8px 18px",
                borderRadius: "30px",
                color: "#10B981",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={18} /> Verified Buyer Status Active
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card" onClick={() => setCurrentFilter("all")}>
              <div className="metric-icon">
                <Building2 size={24} />
              </div>
              <div className="metric-info">
                <h4>{allProperties.length}</h4>
                <p>Verified Properties</p>
              </div>
            </div>

            <div className="metric-card" onClick={() => setCurrentFilter("favourites")}>
              <div
                className="metric-icon"
                style={{ background: "rgba(239, 68, 68, 0.15)", borderColor: "#EF4444", color: "#EF4444" }}
              >
                <Heart size={24} fill="#EF4444" />
              </div>
              <div className="metric-info">
                <h4>{favourites.length}</h4>
                <p>Saved Favourites</p>
              </div>
            </div>

            <div className="metric-card" onClick={() => setCurrentFilter("land")}>
              <div
                className="metric-icon"
                style={{ background: "rgba(16, 185, 129, 0.15)", borderColor: "#10B981", color: "#10B981" }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div className="metric-info">
                <h4>100%</h4>
                <p>Title C of O Guaranteed</p>
              </div>
            </div>

            <div className="metric-card" onClick={() => setAccountModalOpen(true)}>
              <div
                className="metric-icon"
                style={{ background: "rgba(245, 208, 97, 0.15)", borderColor: "#F5D061", color: "#F5D061" }}
              >
                <MessageCircle size={24} />
              </div>
              <div className="metric-info">
                <h4>{totalUserComments}</h4>
                <p>User Reviews</p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by estate, location, or legal title (e.g., Ikoyi, Lekki Phase 1, C of O)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" onClick={() => {}}>
              <Search size={19} /> Search Catalog
            </button>
          </div>

          {/* Quick Tags */}
          <div className="quick-tags">
            <span>Popular searches:</span>
            <button className="tag-btn" onClick={() => setSearchQuery("Lekki")}>Lekki</button>
            <button className="tag-btn" onClick={() => setSearchQuery("Ikoyi")}>Ikoyi</button>
            <button className="tag-btn" onClick={() => setSearchQuery("C of O")}>C of O Title</button>
            <button className="tag-btn" onClick={() => setSearchQuery("Duplex")}>Duplex</button>
            <button className="tag-btn" onClick={() => setSearchQuery("Victoria Island")}>Victoria Island</button>
            {searchQuery && (
              <button
                className="tag-btn"
                style={{ background: "rgba(239,68,68,0.2)", borderColor: "#EF4444", color: "#EF4444" }}
                onClick={() => setSearchQuery("")}
              >
                Clear Search ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="filter-tabs">
        <div className="buyer-container">
          <div className="tab-group">
            <button
              className={`tab ${currentFilter === "all" ? "active" : ""}`}
              onClick={() => setCurrentFilter("all")}
            >
              <SlidersHorizontal size={15} /> All Properties
            </button>
            <button
              className={`tab ${currentFilter === "land" ? "active" : ""}`}
              onClick={() => setCurrentFilter("land")}
            >
              <MapPin size={15} /> Verified Land
            </button>
            <button
              className={`tab ${currentFilter === "residential" ? "active" : ""}`}
              onClick={() => setCurrentFilter("residential")}
            >
              <Building2 size={15} /> Residential
            </button>
            <button
              className={`tab ${currentFilter === "favourites" ? "active" : ""}`}
              onClick={() => setCurrentFilter("favourites")}
            >
              <Star size={15} /> Favourites ({favourites.length})
            </button>
          </div>

          <button className="favourites-badge" onClick={() => setCurrentFilter("favourites")}>
            <Bookmark size={16} color="#F5D061" /> Saved Favourites ({favourites.length})
          </button>
        </div>
      </div>

      {/* ── LISTINGS SECTION ── */}
      <section className="listings-section">
        <div className="buyer-container">
          <div className="status-bar">
            <div className="left">
              <CheckCircle2 color="#F5D061" size={20} />
              <span>
                <strong style={{ color: "#ffffff" }}>Verified Catalog</strong> · Showing{" "}
                <strong style={{ color: "#F5D061" }}>{sortedProperties.length}</strong> properties
              </span>
            </div>
            <div className="right">
              <span>Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Most recent</option>
                <option value="views">Most viewed</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="listings-grid">
            {sortedProperties.map((p, idx) => {
              const pId = String(p._id || p.id);
              const pSlug = p.slug || (p.name || p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || pId;
              const isFav = favourites.includes(pId);
              const propComments = commentsStore[pId] || [];
              const sellerName = p.realtorName || p.phoneName || "Obadimu Ifeoluwa";

              return (
                <div key={pId} className="property-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div
                    className="card-img"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/properties/${pSlug}`)}
                  >
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"}
                      alt={p.name || p.title}
                    />
                    <span className="badge-verified">
                      <CheckCircle2 size={14} /> Verified Title
                    </span>
                    <span className="badge-type">{p.type || "Real Estate"}</span>
                    <button
                      className={`favourite-btn ${isFav ? "active" : ""}`}
                      onClick={(e) => toggleFavourite(pId, e)}
                      title={isFav ? "Remove from favourites" : "Save to favourites"}
                    >
                      <Heart
                        size={20}
                        fill={isFav ? "#EF4444" : "none"}
                        color={isFav ? "#EF4444" : "rgba(255,255,255,0.8)"}
                      />
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="price">{formatPrice(p.price || p.priceLabel)}</div>
                    <div
                      className="title"
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(`/properties/${pSlug}`)}
                    >
                      {p.name || p.title}
                    </div>

                    <div className="seller-info">
                      <UserCheck size={14} color="#F5D061" />
                      <span>Verified Seller: {sellerName}</span>
                    </div>

                    <div className="location">
                      <MapPin size={15} color="#F5D061" />
                      <span>{p.location}</span>
                    </div>

                    <div className="meta">
                      {p.beds !== null && p.beds !== undefined && (
                        <span>
                          <Bed size={16} color="#F5D061" /> {p.beds} Beds
                        </span>
                      )}
                      {p.baths !== null && p.baths !== undefined && (
                        <span>
                          <Bath size={16} color="#F5D061" /> {p.baths} Baths
                        </span>
                      )}
                      {p.size && (
                        <span>
                          <Maximize size={16} color="#F5D061" /> {p.size}
                        </span>
                      )}
                      {p.views !== undefined && p.views > 0 && (
                        <span>
                          <Eye size={16} color="#F5D061" /> {p.views} Views
                        </span>
                      )}
                    </div>

                    <div className="card-actions">
                      <button className="btn-inspect" onClick={() => router.push(`/properties/${pSlug}`)}>
                        <ShieldCheck size={18} /> Inspect Title
                      </button>

                      <button
                        className="btn-action-icon"
                        onClick={() => setCommentsModalProp(p)}
                        title="View & Add Comments"
                      >
                        <MessageCircle size={19} />
                        {propComments.length > 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-5px",
                              background: "#F5D061",
                              color: "#071521",
                              fontSize: "10px",
                              fontWeight: 900,
                              borderRadius: "50%",
                              width: "19px",
                              height: "19px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                            }}
                          >
                            {propComments.length}
                          </span>
                        )}
                      </button>

                      <button
                        className="btn-action-icon"
                        onClick={() => setMessageModalProp(p)}
                        title="Message Agent / Seller"
                      >
                        <Phone size={19} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {sortedProperties.length === 0 && (
            <div className="empty-state">
              <div className="icon">
                <Search size={60} />
              </div>
              <h3>No properties matched your criteria</h3>
              <p>
                {searchQuery.trim() !== ""
                  ? `No verified properties found matching "${searchQuery.trim()}". Try adjusting search keywords.`
                  : currentFilter === "favourites"
                  ? "You have no saved favourites yet. Click the heart icon on any property to save it to your portal."
                  : "Try clearing keywords or selecting a different filter."}
              </p>
              <button
                className="btn-reset"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentFilter("all");
                }}
              >
                <Undo2 size={18} /> Reset All Filters
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: "48px",
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.55)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "28px",
            }}
          >
            <ShieldCheck
              size={18}
              color="#F5D061"
              style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "8px" }}
            />
            All listed allocations feature verified Certificate of Occupancy (C of O) &amp; Governor's Consent documents.
          </div>
        </div>
      </section>

      {/* ── 1. CHECK PROPERTY INSPECTOR MODAL ── */}
      {selectedProperty && (
        <div className="modal-overlay" onClick={() => setSelectedProperty(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 900,
                    color: "#F5D061",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Verified Title Document Inspection
                </span>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "21px",
                    fontWeight: 900,
                    color: "#ffffff",
                    margin: "4px 0 0",
                  }}
                >
                  {selectedProperty.name || selectedProperty.title}
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedProperty(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              <div
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: "300px",
                  marginBottom: "28px",
                  position: "relative",
                  border: "1.5px solid rgba(212,160,23,0.4)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={selectedProperty.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"}
                  alt="Property"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className="badge-verified" style={{ top: "20px", left: "20px" }}>
                  <ShieldCheck size={15} /> Verified Documented Land
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "28px",
                      fontWeight: 900,
                      color: "#F5D061",
                    }}
                  >
                    {formatPrice(selectedProperty.price)}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <UserCheck size={16} color="#F5D061" />
                    <span style={{ fontSize: "14.5px", fontWeight: 700, color: "#ffffff" }}>
                      Listed Seller: {selectedProperty.realtorName || "Obadimu Ifeoluwa"}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "14.5px",
                      color: "rgba(255, 255, 255, 0.75)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    <MapPin size={17} color="#F5D061" /> {selectedProperty.location}
                  </p>
                </div>

                <button
                  style={{
                    padding: "12px 24px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1.5px solid rgba(212, 160, 23, 0.4)",
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#F5D061",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.25s",
                  }}
                  onClick={(e) => toggleFavourite(selectedProperty._id || selectedProperty.id, e)}
                >
                  <Heart
                    size={18}
                    fill={favourites.includes(String(selectedProperty._id || selectedProperty.id)) ? "#EF4444" : "none"}
                    color={favourites.includes(String(selectedProperty._id || selectedProperty.id)) ? "#EF4444" : "#F5D061"}
                  />
                  {favourites.includes(String(selectedProperty._id || selectedProperty.id)) ? "Saved in Favourites" : "Save to Favourites"}
                </button>
              </div>

              {/* Title & Document Status Banner */}
              <div
                style={{
                  background: "rgba(212, 160, 23, 0.12)",
                  border: "1.5px solid rgba(212, 160, 23, 0.4)",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <ShieldCheck size={36} color="#F5D061" />
                <div>
                  <h4
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "16px",
                      fontWeight: 900,
                      color: "#F5D061",
                      margin: 0,
                    }}
                  >
                    Legal Title: {selectedProperty.title || "Certificate of Occupancy (C of O)"}
                  </h4>
                  <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.85)", margin: "4px 0 0", lineHeight: 1.5 }}>
                    This estate allocation has been cross-verified with state land registries. Zero government acquisition risk.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h4
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#ffffff",
                    marginBottom: "12px",
                  }}
                >
                  About Property
                </h4>
                <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.7 }}>
                  {selectedProperty.description ||
                    "Prime real estate opportunity offering maximum ROI, top-tier layout security, and seamless property management through The 10th Homes."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "28px" }}>
                <button
                  className="btn-inspect"
                  style={{ flex: 1, padding: "16px" }}
                  onClick={() => {
                    const p = selectedProperty;
                    setSelectedProperty(null);
                    setMessageModalProp(p);
                  }}
                >
                  <Phone size={19} /> Message Seller ({selectedProperty.realtorName || "Obadimu Ifeoluwa"})
                </button>
                <button
                  style={{
                    padding: "16px 28px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onClick={() => {
                    const p = selectedProperty;
                    setSelectedProperty(null);
                    setCommentsModalProp(p);
                  }}
                >
                  <MessageCircle size={19} color="#F5D061" /> View Comments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. COMMENTS & REVIEWS MODAL (No hardcoded fake defaults) ── */}
      {commentsModalProp && (
        <div className="modal-overlay" onClick={() => setCommentsModalProp(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "11.5px", fontWeight: 900, color: "#F5D061", textTransform: "uppercase" }}>
                  Verified Buyer Discussion &amp; Reviews
                </span>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "19px", fontWeight: 900, color: "#ffffff", margin: "4px 0 0" }}>
                  {commentsModalProp.name || commentsModalProp.title}
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setCommentsModalProp(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              {/* Write Comment Form */}
              <form
                onSubmit={handleAddComment}
                style={{
                  marginBottom: "32px",
                  background: "rgba(255, 255, 255, 0.04)",
                  padding: "24px",
                  borderRadius: "24px",
                  border: "1.5px solid rgba(212, 160, 23, 0.35)",
                }}
              >
                <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 900, color: "#ffffff", marginBottom: "12px" }}>
                  Leave a Review or Title Inquiry Comment
                </h4>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      cursor="pointer"
                      onClick={() => setNewCommentRating(star)}
                      fill={star <= newCommentRating ? "#F5D061" : "none"}
                      color={star <= newCommentRating ? "#F5D061" : "rgba(255,255,255,0.3)"}
                    />
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your experience or ask a question about title verification for this estate..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
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
                <button type="submit" className="btn-inspect" style={{ padding: "12px 28px" }}>
                  <Send size={17} /> Post Comment
                </button>
              </form>

              {/* Comments List (No fake hardcoded defaults) */}
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 900, color: "#ffffff", marginBottom: "16px" }}>
                Community Comments ({(commentsStore[String(commentsModalProp._id || commentsModalProp.id)] || []).length})
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(commentsStore[String(commentsModalProp._id || commentsModalProp.id)] || []).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 20px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "20px",
                      border: "1px dashed rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <MessageCircle size={42} color="#F5D061" style={{ margin: "0 auto 12px" }} />
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                      No comments or reviews yet
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                      Be the first verified buyer to share feedback or inquire about this estate.
                    </p>
                  </div>
                ) : (
                  (commentsStore[String(commentsModalProp._id || commentsModalProp.id)] || []).map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        borderRadius: "20px",
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
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #F5D061 0%, #B8860B 100%)",
                              color: "#071521",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: "15px",
                            }}
                          >
                            {c.userAvatar}
                          </div>
                          <div>
                            <span style={{ fontSize: "14.5px", fontWeight: 800, color: "#ffffff" }}>
                              {c.userName}
                            </span>
                            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginLeft: "10px" }}>
                              {c.date}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {[...Array(c.rating || 5)].map((_, i) => (
                            <Star key={i} size={15} fill="#F5D061" color="#F5D061" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.6 }}>
                        {c.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. MESSAGE SELLER / AGENT MODAL (Direct Contact) ── */}
      {messageModalProp && (
        <div className="modal-overlay" onClick={() => setMessageModalProp(null)}>
          <div className="modal-card" style={{ maxWidth: "580px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "11.5px", fontWeight: 900, color: "#F5D061", textTransform: "uppercase" }}>
                  Direct Buyer Inquiry
                </span>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "19px", fontWeight: 900, color: "#ffffff", margin: "4px 0 0" }}>
                  Message Seller ({messageModalProp.realtorName || "Obadimu Ifeoluwa"})
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setMessageModalProp(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              {messageForm.sent ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <CheckCircle2 size={64} color="#F5D061" style={{ margin: "0 auto 18px" }} />
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "22px", fontWeight: 900, color: "#ffffff", marginBottom: "8px" }}>
                    Inquiry Sent to Seller!
                  </h3>
                  <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.75)" }}>
                    Seller {messageModalProp.realtorName || "Obadimu Ifeoluwa"} will review your message and confirm inspection schedule.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage}>
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      YOUR FULL NAME
                    </label>
                    <input
                      type="text"
                      value={messageForm.name || (user ? `${user.firstName} ${user.lastName || ""}`.trim() : "")}
                      onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "15px", color: "#ffffff", outline: "none" }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number for callback"
                      value={messageForm.phone || user?.phone || ""}
                      onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "15px", color: "#ffffff", outline: "none" }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "28px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      INQUIRY MESSAGE TO SELLER
                    </label>
                    <textarea
                      rows={3}
                      value={messageForm.message || `Hello Obadimu Ifeoluwa, I am interested in inspecting ${messageModalProp.name || messageModalProp.title} (${messageModalProp.location}). Please confirm available site inspection time slots.`}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "15px", color: "#ffffff", outline: "none", fontFamily: "inherit" }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    <button type="submit" className="btn-inspect" style={{ flex: 1, padding: "16px" }}>
                      <Send size={18} /> Send Message to Seller
                    </button>
                    <a
                      href={`https://wa.me/234${(messageModalProp.phone || "08168426592").replace(/^0/, "")}?text=${encodeURIComponent(`Hi Obadimu Ifeoluwa, I'm inquiring about ${messageModalProp.name || messageModalProp.title} on The 10th Homes.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "16px 26px",
                        borderRadius: "14px",
                        background: "#25D366",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 900,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: "0 4px 18px rgba(37, 211, 102, 0.35)",
                      }}
                    >
                      WhatsApp Direct <ExternalLink size={16} />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. BUYER PROFILE, ACCOUNT SETTINGS & MILESTONE BADGES MODAL ── */}
      {accountModalOpen && (
        <div className="modal-overlay" onClick={() => setAccountModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "11.5px", fontWeight: 900, color: "#F5D061", textTransform: "uppercase" }}>
                  Verified Buyer Portal
                </span>
                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "20px", fontWeight: 900, color: "#ffffff", margin: "4px 0 0" }}>
                  Account Settings &amp; Milestones
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setAccountModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              {/* Joined Date & Account Status */}
              <div
                style={{
                  background: "rgba(212, 160, 23, 0.12)",
                  border: "1.5px solid rgba(212, 160, 23, 0.4)",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #F5D061 0%, #B8860B 100%)", color: "#071521", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px" }}>
                    {user.firstName ? user.firstName[0].toUpperCase() : "B"}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "17px", fontWeight: 900, color: "#ffffff" }}>
                      {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
                    </h3>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                      <Calendar size={15} color="#F5D061" /> Member Since: {getJoinedDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", padding: "8px 16px", borderRadius: "999px", color: "#10B981", fontSize: "12.5px", fontWeight: 900, display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserCheck size={15} /> Verified Buyer
                </div>
              </div>

              {/* Achievement & Milestone Badges */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 900, color: "#ffffff", marginBottom: "14px" }}>
                  Buyer Achievement Badges &amp; Milestones
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
                  {/* Badge 1 */}
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <ShieldCheck size={28} color="#F5D061" />
                    <div>
                      <h5 style={{ fontSize: "13.5px", fontWeight: 900, color: "#ffffff" }}>Identity Verified</h5>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>Email &amp; auth active</p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div style={{ background: favourites.length > 0 ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.03)", border: favourites.length > 0 ? "1px solid rgba(212,160,23,0.4)" : "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <Star size={28} color={favourites.length > 0 ? "#F5D061" : "rgba(255,255,255,0.3)"} />
                    <div>
                      <h5 style={{ fontSize: "13.5px", fontWeight: 900, color: favourites.length > 0 ? "#F5D061" : "rgba(255,255,255,0.5)" }}>Property Collector</h5>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>{favourites.length} Saved Favourites</p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div style={{ background: totalUserComments > 0 ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.03)", border: totalUserComments > 0 ? "1px solid rgba(212,160,23,0.4)" : "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <MessageCircle size={28} color={totalUserComments > 0 ? "#F5D061" : "rgba(255,255,255,0.3)"} />
                    <div>
                      <h5 style={{ fontSize: "13.5px", fontWeight: 900, color: totalUserComments > 0 ? "#F5D061" : "rgba(255,255,255,0.5)" }}>Community Reviewer</h5>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>{totalUserComments} Property Reviews</p>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <Award size={28} color="#F5D061" />
                    <div>
                      <h5 style={{ fontSize: "13.5px", fontWeight: 900, color: "#ffffff" }}>VIP Inspection Access</h5>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>Direct seller contact</p>
                    </div>
                  </div>
                </div>
              </div>

              {profileMsg && (
                <div style={{ padding: "14px 18px", borderRadius: "14px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", color: "#10B981", fontSize: "14.5px", fontWeight: 800, marginBottom: "24px" }}>
                  {profileMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", textTransform: "uppercase" }}>FIRST NAME</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "14.5px", color: "#ffffff", outline: "none" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", textTransform: "uppercase" }}>LAST NAME</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "14.5px", color: "#ffffff", outline: "none" }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", textTransform: "uppercase" }}>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "rgba(255,255,255,0.5)", fontSize: "14.5px", cursor: "not-allowed" }}
                  />
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#F5D061", marginBottom: "8px", textTransform: "uppercase" }}>PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Enter phone number"
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.18)", fontSize: "14.5px", color: "#ffffff", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px" }}>
                  <button type="submit" className="btn-inspect" style={{ flex: 1, padding: "14px" }}>
                    Save Profile Changes
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "14px 24px",
                      borderRadius: "14px",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1.5px solid #EF4444",
                      color: "#EF4444",
                      fontSize: "14.5px",
                      fontWeight: 900,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s",
                    }}
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Log Out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}