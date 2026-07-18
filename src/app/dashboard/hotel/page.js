"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredAuthUser, logoutAuth } from "@/lib/auth";
import { getMyHotels, createHotel, updateHotel, deleteHotel, getMyAllBookings, updateBookingStatus as updateBookingStatusAPI, deleteBooking as deleteBookingAPI } from "@/lib/hotels";
import { Home, User, LogOut, LayoutDashboard, Crown, Calendar, Bed, Users, Plus, X, CheckCircle2, Search } from "lucide-react";

// ===== SUBSCRIPTION PLANS =====
const SUBSCRIPTION_PLANS = [
  { id: "basic", name: "Basic", price: "Free", listings: 1, features: ["1 listing", "Basic visibility"] },
  { id: "plus", name: "Plus", price: "₦5,000", listings: 5, features: ["5 listings", "Enhanced visibility"] },
  { id: "premium", name: "Premium", price: "₦25,000", listings: 20, features: ["20 listings", "Premium visibility"] },
  { id: "super", name: "Super", price: "₦50,000", listings: "Unlimited", features: ["Unlimited listings", "Top tier visibility"] },
];

export default function HotelDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [hotelListings, setHotelListings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ guestName: "", checkIn: "", checkOut: "", room: "", status: "Pending" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const current = getStoredAuthUser();
    if (!current) { router.push("/login"); return; }
    const role = current.role?.toLowerCase();
    if (role !== "hotel") { router.push("/dashboard/buyer"); return; }
    setUser(current);
    getMyHotels().then(setHotelListings).catch(() => {});
    getMyAllBookings().then(setBookings).catch(() => {});
  }, []);

  function handleLogout() {
    logoutAuth();
    router.push("/");
  }

  async function addBooking(e) {
    e.preventDefault();
    if (!newBooking.guestName || !newBooking.checkIn || !newBooking.checkOut) {
      alert("Please fill in all required fields");
      return;
    }
    // If there are no hotel listings, we cannot create a booking
    if (hotelListings.length === 0) {
      alert("Please add a hotel listing first before creating bookings.");
      return;
    }
    try {
      const hotelId = hotelListings[0]._id || hotelListings[0].id;
      const booking = await createHotel && await fetch(
        (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') + `/hotels/${hotelId}/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (window.localStorage.getItem('auth_token') || '') }, body: JSON.stringify({ guestName: newBooking.guestName, guestEmail: newBooking.guestEmail || 'N/A@na.com', checkIn: newBooking.checkIn, checkOut: newBooking.checkOut, guests: 1, notes: newBooking.room }) }
      ).then(r => r.json()).then(d => d.data?.booking);
      if (booking) setBookings((prev) => [booking, ...prev]);
    } catch (err) {
      alert("Error creating booking: " + err.message);
    }
    setShowBookingModal(false);
    setNewBooking({ guestName: "", checkIn: "", checkOut: "", room: "", status: "Pending" });
  }

  async function updateBookingStatus(id, status) {
    try {
      await updateBookingStatusAPI(id, status);
      setBookings((prev) => prev.map(b => (b._id || b.id) === id ? { ...b, status } : b));
    } catch (err) { alert("Error: " + err.message); }
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBookingAPI(id);
      setBookings((prev) => prev.filter(b => (b._id || b.id) !== id));
    } catch (err) { alert("Error: " + err.message); }
  }

  const activePlan = SUBSCRIPTION_PLANS[0];
  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "bookings", label: "Reservations", icon: <Calendar size={18} /> },
    { id: "listings", label: "My Hotels", icon: <Bed size={18} /> },
    { id: "subscription", label: "Subscription", icon: <Crown size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
  ];

  if (!user) return null;

  return (
    <>
      <style>{`
        .db-page { min-height: 100vh; background: #F8FAFC; font-family: "Inter", sans-serif; }
        .db-nav { background: #fff; border-bottom: 1px solid #E2E8F0; padding: 0 16px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        @media (min-width: 768px) { .db-nav { padding: 0 32px; height: 68px; } }
        .db-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .db-nav-logo-icon { width: 32px; height: 32px; border-radius: 10px; background: #D4A017; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .db-nav-logo-icon svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; }
        @media (min-width: 768px) { .db-nav-logo-icon { width: 36px; height: 36px; } .db-nav-logo-icon svg { width: 18px; height: 18px; } }
        .db-nav-logo-text { font-size: 13px; font-weight: 800; color: #0F172A; text-transform: uppercase; display: none; }
        @media (min-width: 480px) { .db-nav-logo-text { display: block; } }
        .db-nav-right { display: flex; align-items: center; gap: 8px; }
        .db-nav-name { font-size: 13px; font-weight: 600; color: #0F172A; display: none; }
        @media (min-width: 480px) { .db-nav-name { display: inline; } }
        .db-nav-avatar { width: 30px; height: 30px; border-radius: 50%; background: #D4A017; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
        @media (min-width: 768px) { .db-nav-avatar { width: 34px; height: 34px; font-size: 13px; } }
        .db-logout-btn { padding: 6px 12px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
        .db-logout-btn:hover { border-color: #ef4444; color: #ef4444; }
        @media (max-width: 380px) { .db-logout-btn span { display: none; } }
        .db-body { display: flex; min-height: calc(100vh - 64px); }
        @media (min-width: 768px) { .db-body { min-height: calc(100vh - 68px); } }
        .db-sidebar { width: 220px; background: #fff; border-right: 1px solid #E2E8F0; padding: 24px 12px; flex-shrink: 0; display: none; }
        @media (min-width: 768px) { .db-sidebar { display: block; } }
        .db-sidebar-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; padding: 0 12px; margin-bottom: 8px; }
        .db-sidebar-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 10px; border: none; background: transparent; font-size: 13.5px; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; text-align: left; margin-bottom: 2px; }
        .db-sidebar-btn:hover { background: #F8FAFC; color: #0F172A; }
        .db-sidebar-btn.active { background: rgba(212,160,23,0.1); color: #D4A017; font-weight: 600; }
        .db-main { flex: 1; padding: 16px 12px; }
        @media (min-width: 768px) { .db-main { padding: 32px; } }
        .db-mobile-tabs { display: flex; overflow-x: auto; gap: 6px; padding: 10px 12px; background: #fff; border-bottom: 1px solid #E2E8F0; scrollbar-width: thin; }
        .db-mobile-tabs::-webkit-scrollbar { height: 3px; }
        .db-mobile-tabs::-webkit-scrollbar-thumb { background: #D4A017; border-radius: 10px; }
        @media (min-width: 768px) { .db-mobile-tabs { display: none; } }
        .db-mobile-tab { padding: 8px 14px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.2s; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .db-mobile-tab.active { border-color: #D4A017; background: rgba(212,160,23,0.08); color: #D4A017; }
        .db-welcome { margin-bottom: 20px; }
        .db-welcome h1 { font-size: clamp(18px, 4vw, 28px); font-weight: 800; color: #0F172A; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .db-welcome p { font-size: 14px; color: #64748b; }
        .db-stats { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 24px; }
        @media (min-width: 480px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
        .db-stat-card { background: #fff; border-radius: 12px; padding: 14px 12px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-stat-card { padding: 16px 18px; } }
        .db-stat-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .db-stat-icon svg { width: 16px; height: 16px; stroke: #D4A017; }
        @media (min-width: 768px) { .db-stat-icon { width: 36px; height: 36px; margin-bottom: 10px; } .db-stat-icon svg { width: 18px; height: 18px; } }
        .db-stat-num { font-size: 18px; font-weight: 900; color: #0F172A; }
        @media (min-width: 768px) { .db-stat-num { font-size: 22px; } }
        .db-stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
        @media (min-width: 768px) { .db-stat-lbl { font-size: 12px; } }
        .db-section-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
        .db-section-header h1 { font-size: clamp(18px, 3vw, 20px) !important; font-weight: 800 !important; color: #0F172A !important; margin: 0 !important; }
        .db-section-header p { font-size: 14px !important; color: #64748B !important; margin: 0 !important; }
        .db-section-title { font-size: 17px; font-weight: 800; color: #0F172A; }
        .db-add-btn { display: flex; align-items: center; gap: 6px; background: #D4A017; color: #fff; padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .db-add-btn:hover { background: #b8860c; transform: translateY(-2px); }
        @media (max-width: 480px) { .db-add-btn { font-size: 12px; padding: 8px 12px; } }
        .db-search { width: 100%; max-width: 300px; padding: 8px 14px 8px 36px; border-radius: 10px; border: 1.5px solid #E2E8F0; font-size: 14px; outline: none; background: white; transition: border-color 0.2s; }
        .db-search:focus { border-color: #D4A017; }
        @media (max-width: 480px) { .db-search { max-width: 100%; font-size: 16px; } }
        .db-search-wrap { position: relative; width: 100%; max-width: 300px; }
        @media (max-width: 480px) { .db-search-wrap { max-width: 100%; } }
        .db-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; width: 16px; height: 16px; }
        .db-booking-card { background: #fff; border-radius: 12px; padding: 14px 16px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; transition: all 0.2s; }
        @media (min-width: 640px) { .db-booking-card { flex-direction: row; justify-content: space-between; align-items: center; padding: 16px 20px; gap: 12px; } }
        .db-booking-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .db-booking-info { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; }
        .db-booking-name { font-weight: 700; color: #0F172A; font-size: 15px; }
        .db-booking-dates { font-size: 13px; color: #64748B; }
        .db-booking-room { font-size: 13px; color: #475569; background: #F1F5F9; padding: 2px 10px; border-radius: 999px; }
        .db-booking-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        @media (max-width: 480px) { .db-booking-actions { width: 100%; justify-content: flex-start; } }
        .db-status-badge { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .db-status-confirmed { background: #dcfce7; color: #16a34a; }
        .db-status-pending { background: #fef3c7; color: #d97706; }
        .db-status-cancelled { background: #fee2e2; color: #dc2626; }
        .db-booking-action-btn { padding: 4px 10px; border-radius: 6px; border: none; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .db-booking-action-btn.confirm { background: #22c55e; color: white; }
        .db-booking-action-btn.confirm:hover { background: #16a34a; }
        .db-booking-action-btn.cancel { background: #ef4444; color: white; }
        .db-booking-action-btn.cancel:hover { background: #dc2626; }
        .db-booking-action-btn.delete { background: transparent; color: #ef4444; border: 1.5px solid #fee2e2; }
        .db-booking-action-btn.delete:hover { background: #fee2e2; }
        .db-plan-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 16px; }
        @media (min-width: 480px) { .db-plan-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .db-plan-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        .db-plan-card { background: #fff; border-radius: 16px; padding: 20px 16px; border: 2px solid #E2E8F0; text-align: center; transition: all 0.3s; position: relative; }
        @media (min-width: 768px) { .db-plan-card { padding: 24px 20px; } }
        .db-plan-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
        .db-plan-card.popular { border-color: #D4A017; }
        .db-plan-card.popular::before { content: 'Most Popular'; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #D4A017; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 14px; border-radius: 999px; white-space: nowrap; }
        .db-plan-card .icon-wrap { width: 44px; height: 44px; border-radius: 12px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: #D4A017; }
        @media (min-width: 768px) { .db-plan-card .icon-wrap { width: 48px; height: 48px; } }
        .db-plan-name { font-size: 16px; font-weight: 800; color: #0F172A; }
        .db-plan-price { font-size: 20px; font-weight: 900; color: #D4A017; margin: 4px 0; }
        .db-plan-listing { font-size: 13px; color: #64748B; margin-bottom: 12px; }
        .db-plan-features { list-style: none; padding: 0; margin: 0 0 16px; text-align: left; }
        .db-plan-features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; padding: 4px 0; }
        .db-plan-features li svg { color: #D4A017; flex-shrink: 0; width: 14px; height: 14px; }
        .db-plan-btn { width: 100%; padding: 10px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .db-plan-btn.active { background: #E2E8F0; color: #64748b; cursor: default; }
        .db-plan-btn:not(.active) { background: #D4A017; color: #fff; }
        .db-plan-btn:not(.active):hover { background: #b8860c; transform: translateY(-2px); }
        .db-profile-card { background: #fff; border-radius: 16px; padding: 20px 16px; border: 1px solid #E2E8F0; max-width: 100%; }
        @media (min-width: 768px) { .db-profile-card { padding: 24px; max-width: 480px; } }
        .db-profile-avatar { display: flex; align-items: center; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; margin-bottom: 16px; flex-wrap: wrap; }
        .db-profile-avatar-circle { width: 48px; height: 48px; border-radius: 50%; background: #D4A017; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; }
        @media (min-width: 768px) { .db-profile-avatar-circle { width: 56px; height: 56px; font-size: 20px; } }
        .db-profile-name { font-size: 16px; font-weight: 800; color: #0F172A; }
        .db-profile-role { font-size: 12px; color: #64748b; text-transform: capitalize; margin-top: 2px; }
        .db-profile-row { display: flex; flex-direction: column; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13.5px; gap: 4px; }
        @media (min-width: 480px) { .db-profile-row { flex-direction: row; justify-content: space-between; align-items: center; padding: 12px 0; } }
        .db-profile-row:last-child { border-bottom: none; }
        .db-profile-row-label { color: #64748b; font-weight: 500; flex-shrink: 0; }
        .db-profile-row-value { color: #0F172A; font-weight: 600; text-transform: capitalize; word-break: break-all; text-align: left; width: 100%; }
        @media (min-width: 480px) { .db-profile-row-value { text-align: right; max-width: 60%; width: auto; } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
        .modal-content { background: #fff; border-radius: 20px; padding: 24px 20px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
        @media (min-width: 480px) { .modal-content { padding: 32px 24px; } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 18px; font-weight: 800; color: #0F172A; }
        @media (min-width: 480px) { .modal-header h2 { font-size: 20px; } }
        .modal-close { background: none; border: none; cursor: pointer; color: #94A3B8; padding: 4px; }
        .modal-close:hover { color: #0F172A; }
        .form-group { margin-bottom: 14px; }
        .form-label { display: block; font-size: 12px; font-weight: 600; color: #0F172A; margin-bottom: 4px; }
        .form-input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #E2E8F0; font-size: 14px; outline: none; transition: border-color 0.2s; background: #fff; }
        @media (max-width: 480px) { .form-input { font-size: 16px; } }
        .form-input:focus { border-color: #D4A017; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
        .form-submit { width: 100%; padding: 12px; border-radius: 12px; border: none; background: #D4A017; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
        .form-submit:hover { background: #b8860c; }
        .db-empty { text-align: center; padding: 40px 16px; color: #94A3B8; background: #fff; border-radius: 16px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-empty { padding: 60px 20px; } }
        .db-empty-icon { font-size: 40px; margin-bottom: 12px; }
        @media (min-width: 768px) { .db-empty-icon { font-size: 48px; } }
        .db-empty h3 { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        .db-empty p { font-size: 14px; color: #64748B; margin-bottom: 16px; }
        .db-view-all-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #D4A017; border: 2px solid #D4A017; padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .db-view-all-btn:hover { background: #D4A017; color: #fff; }
        @media (max-width: 480px) {
          .db-welcome h1 { font-size: 20px; }
          .db-stats { grid-template-columns: 1fr; }
          .db-booking-info { gap: 6px; }
          .db-booking-name { font-size: 14px; }
          .db-booking-dates { font-size: 12px; }
          .db-booking-room { font-size: 12px; }
          .db-plan-card { padding: 16px; }
          .db-plan-card .icon-wrap { width: 40px; height: 40px; }
          .db-plan-card .icon-wrap svg { width: 20px; height: 20px; }
          .db-plan-name { font-size: 15px; }
          .db-plan-price { font-size: 18px; }
          .db-profile-card { padding: 16px; }
        }
        @media (max-width: 380px) {
          .db-nav { padding: 0 10px; height: 56px; }
          .db-body { min-height: calc(100vh - 56px); }
          .db-mobile-tabs { padding: 8px 10px; }
          .db-mobile-tab { font-size: 11px; padding: 6px 10px; }
          .db-section-header { flex-direction: column; align-items: stretch; }
          .db-add-btn { justify-content: center; }
          .db-plan-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-page">
        <nav className="db-nav">
          <Link href="/" className="db-nav-logo">
            <div className="db-nav-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="db-nav-logo-text">The 10th Homes</div>
          </Link>
          <div className="db-nav-right">
            <span className="db-nav-name">{user.firstName}</span>
            <div className="db-nav-avatar">{user.firstName[0]}{user.lastName[0]}</div>
            <button className="db-logout-btn" onClick={handleLogout}>
              <LogOut size={14} /> <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="db-mobile-tabs">
          {tabs.map(t => (
            <button key={t.id} className={"db-mobile-tab " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="db-body">
          <aside className="db-sidebar">
            <div style={{marginBottom:"24px"}}>
              <div className="db-sidebar-label">Menu</div>
              {tabs.map(t => (
                <button key={t.id} className={"db-sidebar-btn " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div>
              <div className="db-sidebar-label">Quick Links</div>
              <Link href="/properties" style={{textDecoration:"none"}}>
                <button className="db-sidebar-btn"><Home size={18} /> Browse Properties</button>
              </Link>
              <Link href="/" style={{textDecoration:"none"}}>
                <button className="db-sidebar-btn"><Home size={18} /> Homepage</button>
              </Link>
            </div>
          </aside>

          <main className="db-main">
            {/* ===== OVERVIEW ===== */}
            {tab === "overview" && (
              <div>
                <div className="db-welcome">
                  <h1>🏨 Welcome, {user.firstName}!</h1>
                  <p>Manage your hotel reservations and listings.</p>
                </div>
                <div className="db-stats">
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><Calendar size={18} /></div>
                    <div className="db-stat-num">{bookings.length}</div>
                    <div className="db-stat-lbl">Total Bookings</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><Bed size={18} /></div>
                    <div className="db-stat-num">{hotelListings.length}</div>
                    <div className="db-stat-lbl">Listings</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><Users size={18} /></div>
                    <div className="db-stat-num">{bookings.filter(b => b.status === "Confirmed").length}</div>
                    <div className="db-stat-lbl">Confirmed Guests</div>
                  </div>
                </div>

                <div className="db-section-header">
                  <div className="db-section-title">Recent Reservations</div>
                  <button className="db-add-btn" onClick={() => setShowBookingModal(true)}>
                    <Plus size={16} /> Add Booking
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="db-empty">
                    <div className="db-empty-icon">📭</div>
                    <h3>No bookings yet</h3>
                    <p>Add your first reservation to get started.</p>
                  </div>
                ) : (
                  bookings.slice(0, 3).map(b => (
                    <div key={b.id} className="db-booking-card">
                      <div className="db-booking-info">
                        <span className="db-booking-name">{b.guestName}</span>
                        <span className="db-booking-dates">📅 {b.checkIn} → {b.checkOut}</span>
                        <span className="db-booking-room">{b.room}</span>
                      </div>
                      <div className="db-booking-actions">
                        <span className={"db-status-badge " + (b.status === "Confirmed" ? "db-status-confirmed" : b.status === "Cancelled" ? "db-status-cancelled" : "db-status-pending")}>
                          {b.status}
                        </span>
                        {b.status === "Pending" && (
                          <>
                            <button className="db-booking-action-btn confirm" onClick={() => updateBookingStatus(b.id, "Confirmed")}>✓ Confirm</button>
                            <button className="db-booking-action-btn cancel" onClick={() => updateBookingStatus(b.id, "Cancelled")}>✕ Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {bookings.length > 3 && (
                  <div style={{textAlign:"center",marginTop:"12px"}}>
                    <button className="db-view-all-btn" onClick={() => setTab("bookings")}>
                      View All ({bookings.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===== BOOKINGS ===== */}
            {tab === "bookings" && (
              <div>
                <div className="db-section-header">
                  <div>
                    <h1>All Reservations</h1>
                    <p>Manage all guest bookings.</p>
                  </div>
                  <button className="db-add-btn" onClick={() => setShowBookingModal(true)}>
                    <Plus size={16} /> Add Booking
                  </button>
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div className="db-search-wrap">
                    <Search size={16} />
                    <input className="db-search" type="text" placeholder="Search by guest or room..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="db-empty">
                    <div className="db-empty-icon">📭</div>
                    <h3>No bookings found</h3>
                    <p>{searchTerm ? "Try a different search term." : "Add your first reservation."}</p>
                  </div>
                ) : (
                  filteredBookings.map(b => (
                    <div key={b.id} className="db-booking-card">
                      <div className="db-booking-info">
                        <span className="db-booking-name">{b.guestName}</span>
                        <span className="db-booking-dates">📅 {b.checkIn} → {b.checkOut}</span>
                        <span className="db-booking-room">{b.room}</span>
                      </div>
                      <div className="db-booking-actions">
                        <span className={"db-status-badge " + (b.status === "Confirmed" ? "db-status-confirmed" : b.status === "Cancelled" ? "db-status-cancelled" : "db-status-pending")}>
                          {b.status}
                        </span>
                        {b.status === "Pending" && (
                          <>
                            <button className="db-booking-action-btn confirm" onClick={() => updateBookingStatus(b.id, "Confirmed")}>✓ Confirm</button>
                            <button className="db-booking-action-btn cancel" onClick={() => updateBookingStatus(b.id, "Cancelled")}>✕ Cancel</button>
                          </>
                        )}
                        <button className="db-booking-action-btn delete" onClick={() => deleteBooking(b.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== LISTINGS ===== */}
            {tab === "listings" && (
              <div>
                <div className="db-welcome">
                  <h1>My Hotel Listings</h1>
                  <p>Hotels you've listed on the platform.</p>
                </div>
                {hotelListings.length === 0 ? (
                  <div className="db-empty">
                    <div className="db-empty-icon">🏨</div>
                    <h3>No hotels listed yet</h3>
                    <p>Your hotel listings will appear here once you add them.</p>
                  </div>
                ) : (
                  hotelListings.map(h => (
                    <div key={h.id} style={{background:"#fff",borderRadius:"12px",padding:"14px 16px",border:"1px solid #E2E8F0",marginBottom:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                        <div>
                          <div style={{fontWeight:700,color:"#0F172A",fontSize:"15px"}}>{h.name}</div>
                          <div style={{fontSize:"13px",color:"#64748B"}}>📍 {h.location}</div>
                        </div>
                        <span style={{background:"#F1F5F9",padding:"4px 12px",borderRadius:"999px",fontSize:"12px",color:"#475569"}}>{h.status || "Active"}</span>
                      </div>
                      <div style={{fontSize:"13px",color:"#64748B"}}>{h.rooms} rooms</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== SUBSCRIPTION ===== */}
            {tab === "subscription" && (
              <div>
                <div className="db-welcome">
                  <h1>Subscription Plans</h1>
                  <p>Choose a plan that fits your hotel business.</p>
                </div>
                <div className="db-plan-grid">
                  {SUBSCRIPTION_PLANS.map(plan => {
                    const isActive = activePlan.id === plan.id;
                    return (
                      <div key={plan.id} className={"db-plan-card" + (plan.id === "plus" ? " popular" : "")}>
                        <div className="icon-wrap"><Crown size={24} /></div>
                        <div className="db-plan-name">{plan.name}</div>
                        <div className="db-plan-price">{plan.price}</div>
                        <div className="db-plan-listing">{plan.listings === "Unlimited" ? "Unlimited listings" : plan.listings + " listings"}</div>
                        <ul className="db-plan-features">
                          {plan.features.map((f,i) => <li key={i}><CheckCircle2 size={14} /> {f}</li>)}
                        </ul>
                        <button className={"db-plan-btn " + (isActive ? "active" : "")} disabled={isActive}>
                          {isActive ? "Current Plan" : "Upgrade"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== PROFILE ===== */}
            {tab === "profile" && (
              <div>
                <div className="db-welcome">
                  <h1>My Profile</h1>
                  <p>Your account information.</p>
                </div>
                <div className="db-profile-card">
                  <div className="db-profile-avatar">
                    <div className="db-profile-avatar-circle">{user.firstName[0]}{user.lastName[0]}</div>
                    <div>
                      <div className="db-profile-name">{user.firstName} {user.lastName}</div>
                      <div className="db-profile-role">{user.role}</div>
                    </div>
                  </div>
                  <div className="db-profile-row"><span className="db-profile-row-label">Email</span><span className="db-profile-row-value">{user.email}</span></div>
                  <div className="db-profile-row"><span className="db-profile-row-label">Role</span><span className="db-profile-row-value">{user.role}</span></div>
                  <div className="db-profile-row"><span className="db-profile-row-label">Plan</span><span className="db-profile-row-value">{activePlan.name}</span></div>
                  <div className="db-profile-row">
                    <span className="db-profile-row-label">Member Since</span>
                    <span className="db-profile-row-value">{new Date(user.createdAt).toLocaleDateString("en-NG", { year:"numeric", month:"long", day:"numeric" })}</span>
                  </div>
                  {user.onboardingAnswers && (
                    <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid #E2E8F0"}}>
                      <div style={{fontSize:"12px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"12px"}}>
                        Onboarding Preferences
                      </div>
                      {Object.entries(user.onboardingAnswers).map(([key, value]) => (
                        <div key={key} className="db-profile-row">
                          <span className="db-profile-row-label" style={{textTransform:"capitalize"}}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span className="db-profile-row-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===== ADD BOOKING MODAL ===== */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowBookingModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Reservation</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={addBooking}>
              <div className="form-group">
                <label className="form-label">Guest Name *</label>
                <input className="form-input" value={newBooking.guestName} onChange={e => setNewBooking({...newBooking, guestName: e.target.value})} required placeholder="John Doe" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Check-in *</label>
                  <input className="form-input" type="date" value={newBooking.checkIn} onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out *</label>
                  <input className="form-input" type="date" value={newBooking.checkOut} onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Room Type *</label>
                <input className="form-input" value={newBooking.room} onChange={e => setNewBooking({...newBooking, room: e.target.value})} required placeholder="Executive Suite" />
              </div>
              <button type="submit" className="form-submit">Add Reservation</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}