"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logoutUser, updateUserProfile } from "@/lib/storage";
import {
  Home,
  User,
  LogOut,
  LayoutDashboard,
  Crown,
  Calendar,
  Bed,
  Users,
  Plus,
  X,
  CheckCircle2,
  Search,
  Trash2,
  MapPin,
  Hotel,
  Edit2,
  Save,
} from "lucide-react";

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

  // Profile edit
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.push("/login"); return; }
    if (current.role !== "hotel") { router.push("/dashboard/buyer"); return; }
    setUser(current);
    setEditForm({ firstName: current.firstName, lastName: current.lastName, email: current.email, phone: current.phone || "" });

    const storedListings = JSON.parse(localStorage.getItem("hotel_listings") || "[]");
    setHotelListings(storedListings);
    const storedBookings = JSON.parse(localStorage.getItem("hotel_bookings_" + current.id) || "[]");
    setBookings(storedBookings);
  }, []);

  function handleLogout() { logoutUser(); router.push("/"); }

  function addBooking(e) {
    e.preventDefault();
    if (!newBooking.guestName || !newBooking.checkIn || !newBooking.checkOut || !newBooking.room) {
      alert("Please fill in all fields");
      return;
    }
    const booking = { ...newBooking, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [...bookings, booking];
    setBookings(updated);
    localStorage.setItem("hotel_bookings_" + user.id, JSON.stringify(updated));
    setShowBookingModal(false);
    setNewBooking({ guestName: "", checkIn: "", checkOut: "", room: "", status: "Pending" });
  }

  function updateBookingStatus(id, status) {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem("hotel_bookings_" + user.id, JSON.stringify(updated));
  }

  function deleteBooking(id) {
    if (confirm("Delete this booking?")) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem("hotel_bookings_" + user.id, JSON.stringify(updated));
    }
  }

  function handleEditProfile(e) { setEditForm({ ...editForm, [e.target.name]: e.target.value }); }

  function saveProfile() {
    if (!user) return;
    const success = updateUserProfile(user.id, editForm);
    if (success) {
      setUser({ ...user, ...editForm });
      setSaveMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage("Error saving profile.");
    }
  }

  const activePlan = SUBSCRIPTION_PLANS[0];
  const filteredBookings = bookings.filter(b =>
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "bookings", label: "Reservations", icon: <Calendar size={18} /> },
    { id: "listings", label: "My Hotels", icon: <Hotel size={18} /> },
    { id: "subscription", label: "Subscription", icon: <Crown size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
  ];

  if (!user) return null;

  return (
    <>
      <style>{`
        .db-page { min-height: 100vh; background: #F8FAFC; font-family: "Inter", sans-serif; }
        .db-nav { background: #fff; border-bottom: 1px solid #E2E8F0; padding: 0 20px; height: 68px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        @media (min-width: 768px) { .db-nav { padding: 0 32px; } }
        .db-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .db-nav-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: #D4A017; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .db-nav-logo-icon svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2.5; }
        .db-nav-logo-text { font-size: 13px; font-weight: 800; color: #0F172A; text-transform: uppercase; display: none; }
        @media (min-width: 480px) { .db-nav-logo-text { display: block; } }
        .db-nav-right { display: flex; align-items: center; gap: 10px; }
        .db-nav-name { font-size: 13px; font-weight: 600; color: #0F172A; display: none; }
        @media (min-width: 480px) { .db-nav-name { display: inline; } }
        .db-nav-avatar { width: 34px; height: 34px; border-radius: 50%; background: #D4A017; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .db-logout-btn { padding: 8px 14px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .db-logout-btn:hover { border-color: #ef4444; color: #ef4444; }
        .db-body { display: flex; min-height: calc(100vh - 68px); }
        .db-sidebar { width: 220px; background: #fff; border-right: 1px solid #E2E8F0; padding: 24px 12px; flex-shrink: 0; display: none; }
        @media (min-width: 768px) { .db-sidebar { display: block; } }
        .db-sidebar-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; padding: 0 12px; margin-bottom: 8px; }
        .db-sidebar-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 10px; border: none; background: transparent; font-size: 13.5px; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; text-align: left; margin-bottom: 2px; }
        .db-sidebar-btn:hover { background: #F8FAFC; color: #0F172A; }
        .db-sidebar-btn.active { background: rgba(212,160,23,0.1); color: #D4A017; font-weight: 600; }
        .db-main { flex: 1; padding: 20px 16px; }
        @media (min-width: 768px) { .db-main { padding: 32px; } }
        .db-mobile-tabs { display: flex; overflow-x: auto; gap: 6px; padding: 12px 16px; background: #fff; border-bottom: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-mobile-tabs { display: none; } }
        .db-mobile-tab { padding: 8px 14px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .db-mobile-tab.active { border-color: #D4A017; background: rgba(212,160,23,0.08); color: #D4A017; }
        .db-welcome { margin-bottom: 24px; }
        .db-welcome h1 { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .db-welcome p { font-size: 14px; color: #64748b; }
        .db-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 28px; }
        .db-stat-card { background: #fff; border-radius: 14px; padding: 16px 18px; border: 1px solid #E2E8F0; }
        .db-stat-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .db-stat-icon svg { width: 18px; height: 18px; stroke: #D4A017; }
        .db-stat-num { font-size: 22px; font-weight: 900; color: #0F172A; }
        .db-stat-lbl { font-size: 12px; color: #64748b; margin-top: 2px; }
        .db-section-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
        .db-section-title { font-size: 17px; font-weight: 800; color: #0F172A; }
        .db-add-btn { display: flex; align-items: center; gap: 6px; background: #D4A017; color: #fff; padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .db-add-btn:hover { background: #b8860c; transform: translateY(-2px); }
        .db-search { width: 100%; max-width: 300px; padding: 8px 14px 8px 36px; border-radius: 10px; border: 1.5px solid #E2E8F0; font-size: 14px; outline: none; background: white; transition: border-color 0.2s; }
        .db-search:focus { border-color: #D4A017; }
        .db-search-wrap { position: relative; }
        .db-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
        .db-booking-card { background: #fff; border-radius: 12px; padding: 16px 20px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; transition: all 0.2s; }
        .db-booking-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .db-booking-info { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
        .db-booking-name { font-weight: 700; color: #0F172A; font-size: 15px; }
        .db-booking-dates { font-size: 13px; color: #64748B; display: flex; align-items: center; gap: 4px; }
        .db-booking-room { font-size: 13px; color: #475569; background: #F1F5F9; padding: 2px 10px; border-radius: 999px; }
        .db-status-badge { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .db-status-confirmed { background: #dcfce7; color: #16a34a; }
        .db-status-pending { background: #fef3c7; color: #d97706; }
        .db-status-cancelled { background: #fee2e2; color: #dc2626; }
        .db-plan-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 16px; }
        @media (min-width: 640px) { .db-plan-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .db-plan-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        .db-plan-card { background: #fff; border-radius: 16px; padding: 24px 20px; border: 2px solid #E2E8F0; text-align: center; transition: all 0.3s; position: relative; }
        .db-plan-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
        .db-plan-card.popular { border-color: #D4A017; }
        .db-plan-card.popular::before { content: 'Most Popular'; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #D4A017; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 14px; border-radius: 999px; }
        .db-plan-card .icon-wrap { width: 48px; height: 48px; border-radius: 12px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #D4A017; }
        .db-plan-name { font-size: 17px; font-weight: 800; color: #0F172A; }
        .db-plan-price { font-size: 22px; font-weight: 900; color: #D4A017; margin: 6px 0; }
        .db-plan-features { list-style: none; padding: 0; margin: 0 0 16px; text-align: left; }
        .db-plan-features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; padding: 4px 0; }
        .db-plan-features li svg { color: #D4A017; flex-shrink: 0; }
        .db-plan-btn { width: 100%; padding: 10px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .db-plan-btn.active { background: #E2E8F0; color: #64748b; cursor: default; }
        .db-plan-btn:not(.active) { background: #D4A017; color: #fff; }
        .db-plan-btn:not(.active):hover { background: #b8860c; transform: translateY(-2px); }
        .db-profile-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; max-width: 480px; }
        .db-profile-avatar { display: flex; align-items: center; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #E2E8F0; margin-bottom: 20px; }
        .db-profile-avatar-circle { width: 56px; height: 56px; border-radius: 50%; background: #D4A017; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .db-profile-name { font-size: 17px; font-weight: 800; color: #0F172A; }
        .db-profile-role { font-size: 12px; color: #64748b; text-transform: capitalize; margin-top: 2px; }
        .db-profile-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13.5px; }
        .db-profile-row:last-child { border-bottom: none; }
        .db-profile-row-label { color: #64748b; font-weight: 500; }
        .db-profile-row-value { color: #0F172A; font-weight: 600; text-transform: capitalize; word-break: break-all; text-align: right; max-width: 60%; }
        .db-profile-edit-input { width: 100%; padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13.5px; outline: none; background: #fff; }
        .db-profile-edit-input:focus { border-color: #D4A017; }
        .db-profile-edit-actions { display: flex; gap: 8px; margin-top: 16px; }
        .db-profile-save-btn { padding: 8px 20px; border-radius: 8px; border: none; background: #D4A017; color: #fff; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .db-profile-save-btn:hover { background: #b8860c; }
        .db-profile-cancel-btn { padding: 8px 20px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: border-color 0.2s; }
        .db-profile-cancel-btn:hover { border-color: #94a3b8; }
        .db-profile-edit-btn { padding: 6px 14px; border-radius: 8px; border: 1.5px solid #D4A017; background: transparent; color: #D4A017; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .db-profile-edit-btn:hover { background: #D4A017; color: #fff; }
        .db-save-message { padding: 8px 12px; border-radius: 8px; font-size: 13px; margin-top: 12px; }
        .db-save-message.success { background: #dcfce7; color: #16a34a; }
        .db-save-message.error { background: #fee2e2; color: #dc2626; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: #fff; border-radius: 20px; padding: 32px 24px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 20px; font-weight: 800; color: #0F172A; }
        .modal-close { background: none; border: none; cursor: pointer; color: #94A3B8; }
        .modal-close:hover { color: #0F172A; }
        .form-group { margin-bottom: 14px; }
        .form-label { display: block; font-size: 12px; font-weight: 600; color: #0F172A; margin-bottom: 4px; }
        .form-input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #E2E8F0; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #D4A017; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
        .form-submit { width: 100%; padding: 12px; border-radius: 12px; border: none; background: #D4A017; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
        .form-submit:hover { background: #b8860c; }
        .db-empty { text-align: center; padding: 60px 20px; color: #94A3B8; }
        .db-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .db-empty h3 { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        .db-empty p { font-size: 14px; color: #64748B; margin-bottom: 16px; }
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
            <button className="db-logout-btn" onClick={handleLogout}><LogOut size={14} style={{marginRight:"4px"}} /> Logout</button>
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
                <button className="db-sidebar-btn"><Home size={18} /> Back to Home</button>
              </Link>
              <button className="db-sidebar-btn" onClick={handleLogout} style={{ color: "#ef4444", borderTop: "1px solid #E2E8F0", marginTop: "8px", paddingTop: "12px" }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>

          <main className="db-main">
            {tab === "overview" && (
              <div>
                <div className="db-welcome">
                  <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Hotel size={28} color="#D4A017" /> Welcome, {user.firstName}!
                  </h1>
                  <p>Manage your hotel reservations and listings.</p>
                </div>
                <div className="db-stats">
                  <div className="db-stat-card"><div className="db-stat-icon"><Calendar size={18} /></div><div className="db-stat-num">{bookings.length}</div><div className="db-stat-lbl">Total Bookings</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Hotel size={18} /></div><div className="db-stat-num">{hotelListings.length}</div><div className="db-stat-lbl">Listings</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Users size={18} /></div><div className="db-stat-num">{bookings.filter(b => b.status === "Confirmed").length}</div><div className="db-stat-lbl">Confirmed Guests</div></div>
                </div>

                <div className="db-section-header">
                  <div className="db-section-title">Recent Reservations</div>
                  <button className="db-add-btn" onClick={() => setShowBookingModal(true)}>
                    <Plus size={16} /> Add Booking
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="db-empty">
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                    <h3>No bookings yet</h3>
                    <p>Add your first reservation to get started.</p>
                  </div>
                ) : (
                  bookings.slice(0, 3).map(b => (
                    <div key={b.id} className="db-booking-card">
                      <div className="db-booking-info">
                        <span className="db-booking-name">{b.guestName}</span>
                        <span className="db-booking-dates">
                          <Calendar size={14} color="#D4A017" /> {b.checkIn} → {b.checkOut}
                        </span>
                        <span className="db-booking-room">{b.room}</span>
                      </div>
                      <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                        <span className={"db-status-badge " + (b.status === "Confirmed" ? "db-status-confirmed" : b.status === "Cancelled" ? "db-status-cancelled" : "db-status-pending")}>
                          {b.status}
                        </span>
                        {b.status === "Pending" && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, "Confirmed")} style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:"#22c55e",color:"white",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>✓ Confirm</button>
                            <button onClick={() => updateBookingStatus(b.id, "Cancelled")} style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:"#ef4444",color:"white",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>✕ Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {bookings.length > 3 && <div style={{textAlign:"center",marginTop:"12px"}}><button className="db-add-btn" style={{background:"transparent",color:"#D4A017",border:"2px solid #D4A017"}} onClick={() => setTab("bookings")}>View All ({bookings.length})</button></div>}
              </div>
            )}

            {tab === "bookings" && (
              <div>
                <div className="db-section-header"><div><h1 style={{fontSize:"20px",fontWeight:800,color:"#0F172A"}}>All Reservations</h1><p style={{color:"#64748B",fontSize:"14px"}}>Manage all guest bookings.</p></div><button className="db-add-btn" onClick={() => setShowBookingModal(true)}><Plus size={16} /> Add Booking</button></div>
                <div style={{marginBottom:"16px"}}><div className="db-search-wrap"><Search size={16} /><input className="db-search" type="text" placeholder="Search by guest or room..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div></div>
                {filteredBookings.length === 0 ? (
                  <div className="db-empty"><div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div><h3>No bookings found</h3><p>{searchTerm ? "Try a different search term." : "Add your first reservation."}</p></div>
                ) : (
                  filteredBookings.map(b => (
                    <div key={b.id} className="db-booking-card">
                      <div className="db-booking-info">
                        <span className="db-booking-name">{b.guestName}</span>
                        <span className="db-booking-dates"><Calendar size={14} color="#D4A017" /> {b.checkIn} → {b.checkOut}</span>
                        <span className="db-booking-room">{b.room}</span>
                      </div>
                      <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
                        <span className={"db-status-badge " + (b.status === "Confirmed" ? "db-status-confirmed" : b.status === "Cancelled" ? "db-status-cancelled" : "db-status-pending")}>{b.status}</span>
                        {b.status === "Pending" && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, "Confirmed")} style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:"#22c55e",color:"white",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>✓ Confirm</button>
                            <button onClick={() => updateBookingStatus(b.id, "Cancelled")} style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:"#ef4444",color:"white",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>✕ Cancel</button>
                          </>
                        )}
                        <button onClick={() => deleteBooking(b.id)} style={{padding:"4px 10px",borderRadius:"6px",border:"1.5px solid #fee2e2",background:"transparent",color:"#ef4444",fontSize:"11px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "listings" && (
              <div>
                <div className="db-welcome"><h1>My Hotel Listings</h1><p>Hotels you've listed on the platform.</p></div>
                {hotelListings.length === 0 ? (
                  <div className="db-empty"><div style={{ fontSize: "48px", marginBottom: "12px" }}>🏨</div><h3>No hotels listed yet</h3><p>Your hotel listings will appear here once you add them.</p></div>
                ) : (
                  hotelListings.map(h => (
                    <div key={h.id} style={{background:"#fff",borderRadius:"12px",padding:"16px 20px",border:"1px solid #E2E8F0",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
                      <div><div style={{fontWeight:700,color:"#0F172A"}}>{h.name}</div><div style={{fontSize:"13px",color:"#64748B",display:"flex",alignItems:"center",gap:"4px"}}><MapPin size={14} color="#D4A017" /> {h.location} • {h.rooms} rooms</div></div>
                      <span style={{background:"#F1F5F9",padding:"4px 12px",borderRadius:"999px",fontSize:"12px",color:"#475569"}}>{h.status || "Active"}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "subscription" && (
              <div>
                <div className="db-welcome"><h1>Subscription Plans</h1><p>Choose a plan that fits your hotel business.</p></div>
                <div className="db-plan-grid">
                  {SUBSCRIPTION_PLANS.map(plan => {
                    const isActive = activePlan.id === plan.id;
                    return (
                      <div key={plan.id} className={"db-plan-card" + (plan.id === "plus" ? " popular" : "")}>
                        <div className="icon-wrap"><Crown size={24} /></div>
                        <div className="db-plan-name">{plan.name}</div>
                        <div className="db-plan-price">{plan.price}</div>
                        <div className="db-plan-listing">{plan.listings === "Unlimited" ? "Unlimited listings" : plan.listings + " listings"}</div>
                        <ul className="db-plan-features">{plan.features.map((f,i) => <li key={i}><CheckCircle2 size={14} /> {f}</li>)}</ul>
                        <button className={"db-plan-btn " + (isActive ? "active" : "")} disabled={isActive}>{isActive ? "Current Plan" : "Upgrade"}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div>
                <div className="db-welcome">
                  <h1>My Profile</h1>
                  <p>Your account information.</p>
                  {saveMessage && <div className={"db-save-message " + (saveMessage.includes("Error") ? "error" : "success")}>{saveMessage}</div>}
                </div>
                <div className="db-profile-card">
                  <div className="db-profile-avatar">
                    <div className="db-profile-avatar-circle">{user.firstName[0]}{user.lastName[0]}</div>
                    <div><div className="db-profile-name">{user.firstName} {user.lastName}</div><div className="db-profile-role">{user.role}</div></div>
                  </div>
                  {isEditing ? (
                    <>
                      <div className="db-profile-row"><span className="db-profile-row-label">First Name</span><input className="db-profile-edit-input" name="firstName" value={editForm.firstName} onChange={handleEditProfile} style={{ maxWidth: "200px" }} /></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Last Name</span><input className="db-profile-edit-input" name="lastName" value={editForm.lastName} onChange={handleEditProfile} style={{ maxWidth: "200px" }} /></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Email</span><input className="db-profile-edit-input" name="email" type="email" value={editForm.email} onChange={handleEditProfile} style={{ maxWidth: "200px" }} /></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Phone</span><input className="db-profile-edit-input" name="phone" value={editForm.phone} onChange={handleEditProfile} placeholder="080XXXXXXXX" style={{ maxWidth: "200px" }} /></div>
                      <div className="db-profile-edit-actions">
                        <button className="db-profile-save-btn" onClick={saveProfile}><Save size={16} style={{ marginRight: "6px" }} /> Save</button>
                        <button className="db-profile-cancel-btn" onClick={() => { setIsEditing(false); setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || "" }); }}><X size={16} style={{ marginRight: "6px" }} /> Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="db-profile-row"><span className="db-profile-row-label">First Name</span><span className="db-profile-row-value">{user.firstName}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Last Name</span><span className="db-profile-row-value">{user.lastName}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Email</span><span className="db-profile-row-value">{user.email}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Phone</span><span className="db-profile-row-value">{user.phone || "Not set"}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Role</span><span className="db-profile-row-value">{user.role}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Plan</span><span className="db-profile-row-value">{activePlan.name} (read‑only)</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Member Since</span><span className="db-profile-row-value">{new Date(user.createdAt).toLocaleDateString("en-NG", { year:"numeric", month:"long", day:"numeric" })}</span></div>
                      <button className="db-profile-edit-btn" style={{ marginTop: "16px" }} onClick={() => { setIsEditing(true); setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || "" }); }}>
                        <Edit2 size={16} style={{ marginRight: "6px" }} /> Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowBookingModal(false); }}>
          <div className="modal-content">
            <div className="modal-header"><h2>Add New Reservation</h2><button className="modal-close" onClick={() => setShowBookingModal(false)}><X size={24} /></button></div>
            <form onSubmit={addBooking}>
              <div className="form-group"><label className="form-label">Guest Name *</label><input className="form-input" value={newBooking.guestName} onChange={e => setNewBooking({...newBooking, guestName: e.target.value})} required placeholder="John Doe" /></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Check-in *</label><input className="form-input" type="date" value={newBooking.checkIn} onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})} required /></div><div className="form-group"><label className="form-label">Check-out *</label><input className="form-input" type="date" value={newBooking.checkOut} onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})} required /></div></div>
              <div className="form-group"><label className="form-label">Room Type *</label><input className="form-input" value={newBooking.room} onChange={e => setNewBooking({...newBooking, room: e.target.value})} required placeholder="Executive Suite" /></div>
              <button type="submit" className="form-submit">Add Reservation</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}