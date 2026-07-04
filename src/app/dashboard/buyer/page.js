"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logoutUser, getFavourites, getAllProperties, toggleFavourite, updateUserProfile } from "@/lib/storage";
import { Home, Heart, User, LogOut, Search, Trash2, Eye, MessageCircle, ChevronRight, LayoutDashboard, Edit2, Save, X } from "lucide-react";

export default function BuyerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [favourites, setFavourites] = useState([]);
  const [favProperties, setFavProperties] = useState([]);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      router.push("/login");
      setLoading(false);
      return;
    }
    if (current.role !== "buyer") {
      router.push("/dashboard/realtor");
      setLoading(false);
      return;
    }
    setUser(current);
    setEditForm({ firstName: current.firstName, lastName: current.lastName, phone: current.phone || "" });
    const favIds = getFavourites(current.id);
    setFavourites(favIds);
    const all = getAllProperties();
    setFavProperties(all.filter((p) => favIds.includes(p.id)));
    setLoading(false);
  }, []);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  function handleRemoveFav(propertyId) {
    const newFavs = toggleFavourite(user.id, propertyId);
    setFavourites(newFavs);
    setFavProperties((prev) => prev.filter((p) => p.id !== propertyId));
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", paddingTop: "80px" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid #E2E8F0", borderTop: "4px solid #D4A017", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "favourites", label: "Favourites", icon: <Heart size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
  ];

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
        .db-mobile-tab .badge { background: #D4A017; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 999px; margin-left: 4px; }
        .db-welcome { margin-bottom: 20px; }
        .db-welcome h1 { font-size: clamp(18px, 4vw, 28px); font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .db-welcome p { font-size: 14px; color: #64748b; }
        .db-stats { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 24px; }
        @media (min-width: 480px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
        .db-stat-card { background: #fff; border-radius: 12px; padding: 14px 12px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-stat-card { padding: 16px 18px; } }
        .db-stat-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .db-stat-icon svg { width: 16px; height: 16px; stroke: #D4A017; fill: none; stroke-width: 2; }
        @media (min-width: 768px) { .db-stat-icon { width: 36px; height: 36px; margin-bottom: 10px; } .db-stat-icon svg { width: 18px; height: 18px; } }
        .db-stat-num { font-size: 18px; font-weight: 900; color: #0F172A; }
        @media (min-width: 768px) { .db-stat-num { font-size: 22px; } }
        .db-stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
        @media (min-width: 768px) { .db-stat-lbl { font-size: 12px; } }
        .db-empty { text-align: center; padding: 32px 16px; background: #fff; border-radius: 16px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-empty { padding: 48px 20px; } }
        .db-empty-icon { width: 48px; height: 48px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .db-empty-icon svg { width: 22px; height: 22px; stroke: #94a3b8; fill: none; stroke-width: 2; }
        .db-empty h3 { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        .db-empty p { font-size: 13px; color: #64748b; margin-bottom: 18px; }
        .db-empty-btn { display: inline-flex; align-items: center; gap: 6px; background: #D4A017; color: #fff; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; transition: all 0.2s; }
        .db-empty-btn:hover { background: #b8860c; transform: translateY(-2px); }
        .db-fav-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 480px) { .db-fav-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .db-fav-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .db-fav-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; }
        .db-fav-img { width: 100%; height: 150px; object-fit: cover; background: #E2E8F0; }
        .db-fav-body { padding: 14px 16px; }
        .db-fav-name { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
        .db-fav-loc { font-size: 12px; color: #64748b; margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
        .db-fav-price { font-size: 15px; font-weight: 800; color: #D4A017; margin-bottom: 10px; }
        .db-fav-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .db-fav-view { flex: 1; padding: 8px 14px; border-radius: 8px; border: 1.5px solid #0F172A; background: #fff; color: #0F172A; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; transition: all 0.2s; min-width: 60px; }
        .db-fav-view:hover { background: #0F172A; color: #fff; }
        .db-fav-remove { padding: 8px 12px; border-radius: 8px; border: 1.5px solid #fecaca; background: #fff; color: #ef4444; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .db-fav-remove:hover { background: #fef2f2; }
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
        .db-profile-edit-input { width: 100%; padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13.5px; outline: none; background: #fff; }
        .db-profile-edit-input:focus { border-color: #D4A017; }
        .db-profile-edit-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .db-profile-edit-actions button { flex: 1; min-width: 80px; justify-content: center; }
        .db-profile-save-btn { padding: 8px 20px; border-radius: 8px; border: none; background: #D4A017; color: #fff; font-weight: 700; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; justify-content: center; }
        .db-profile-save-btn:hover { background: #b8860c; }
        .db-profile-cancel-btn { padding: 8px 20px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: border-color 0.2s; display: flex; align-items: center; gap: 6px; justify-content: center; }
        .db-profile-cancel-btn:hover { border-color: #94a3b8; }
        .db-profile-edit-btn { padding: 6px 14px; border-radius: 8px; border: 1.5px solid #D4A017; background: transparent; color: #D4A017; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .db-profile-edit-btn:hover { background: #D4A017; color: #fff; }
        .db-save-message { padding: 8px 12px; border-radius: 8px; font-size: 13px; margin-top: 12px; }
        .db-save-message.success { background: #dcfce7; color: #16a34a; }
        .db-save-message.error { background: #fee2e2; color: #dc2626; }
        @media (max-width: 480px) {
          .db-welcome h1 { font-size: 20px; }
          .db-stats { grid-template-columns: 1fr; }
          .db-fav-grid { grid-template-columns: 1fr; }
          .db-fav-img { height: 120px; }
          .db-profile-card { padding: 16px; }
        }
        @media (max-width: 380px) {
          .db-nav { padding: 0 10px; height: 56px; }
          .db-body { min-height: calc(100vh - 56px); }
          .db-mobile-tabs { padding: 8px 10px; }
          .db-mobile-tab { font-size: 11px; padding: 6px 10px; }
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
          {tabs.map((t) => (
            <button
              key={t.id}
              className={"db-mobile-tab " + (tab === t.id ? "active" : "")}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
              {t.id === "favourites" && favourites.length > 0 && (
                <span className="badge">{favourites.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="db-body">
          <aside className="db-sidebar">
            <div style={{ marginBottom: "24px" }}>
              <div className="db-sidebar-label">Menu</div>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={"db-sidebar-btn " + (tab === t.id ? "active" : "")}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon}
                  {t.label}
                  {t.id === "favourites" && favourites.length > 0 && (
                    <span className="badge" style={{ marginLeft: "auto", background: "#D4A017", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>
                      {favourites.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div>
              <div className="db-sidebar-label">Quick Links</div>
              <Link href="/properties" style={{ textDecoration: "none" }}>
                <button className="db-sidebar-btn">
                  <Search size={18} /> Browse Properties
                </button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button className="db-sidebar-btn">
                  <Home size={18} /> Back to Home
                </button>
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
                  <h1>Welcome back, {user.firstName}! 👋</h1>
                  <p>Here's your activity overview on The 10th Homes.</p>
                </div>
                <div className="db-stats">
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><Heart size={18} /></div>
                    <div className="db-stat-num">{favourites.length}</div>
                    <div className="db-stat-lbl">Saved Properties</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><Eye size={18} /></div>
                    <div className="db-stat-num">0</div>
                    <div className="db-stat-lbl">Properties Viewed</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon"><MessageCircle size={18} /></div>
                    <div className="db-stat-num">0</div>
                    <div className="db-stat-lbl">Enquiries Sent</div>
                  </div>
                </div>

                <div className="db-empty">
                  <div className="db-empty-icon"><Home size={28} /></div>
                  <h3>Start your property journey</h3>
                  <p>Explore our verified listings and save your favourites here.</p>
                  <Link href="/properties" className="db-empty-btn">
                    <Search size={16} />
                    Browse Properties
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {tab === "favourites" && (
              <div>
                <div className="db-welcome">
                  <h1>Saved Properties</h1>
                  <p>Properties you've marked as favourites.</p>
                </div>
                {favProperties.length === 0 ? (
                  <div className="db-empty">
                    <div className="db-empty-icon"><Heart size={28} /></div>
                    <h3>No saved properties yet</h3>
                    <p>Browse our listings and tap the heart icon to save properties here.</p>
                    <Link href="/properties" className="db-empty-btn">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="db-fav-grid">
                    {favProperties.map((p) => (
                      <div key={p.id} className="db-fav-card">
                        <img
                          className="db-fav-img"
                          src={p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
                          alt={p.name}
                          onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
                        />
                        <div className="db-fav-body">
                          <div className="db-fav-name">{p.name}</div>
                          <div className="db-fav-loc">📍 {p.location}</div>
                          <div className="db-fav-price">{p.priceLabel}</div>
                          <div className="db-fav-actions">
                            <Link href={"/properties/" + (p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} className="db-fav-view">View Details</Link>
                            <button className="db-fav-remove" onClick={() => handleRemoveFav(p.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <div>
                      <div className="db-profile-name">{user.firstName} {user.lastName}</div>
                      <div className="db-profile-role">{user.role}</div>
                    </div>
                  </div>

                  {isEditing ? (
                    <>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">First Name</span>
                        <input className="db-profile-edit-input" name="firstName" value={editForm.firstName} onChange={handleEditChange} />
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Last Name</span>
                        <input className="db-profile-edit-input" name="lastName" value={editForm.lastName} onChange={handleEditChange} />
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Phone</span>
                        <input className="db-profile-edit-input" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="080XXXXXXXX" />
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Email</span>
                        <span className="db-profile-row-value">{user.email}</span>
                      </div>
                      <div className="db-profile-edit-actions">
                        <button className="db-profile-save-btn" onClick={saveProfile}><Save size={16} /> Save</button>
                        <button className="db-profile-cancel-btn" onClick={() => { setIsEditing(false); setEditForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || "" }); }}><X size={16} /> Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">First Name</span>
                        <span className="db-profile-row-value">{user.firstName}</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Last Name</span>
                        <span className="db-profile-row-value">{user.lastName}</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Phone</span>
                        <span className="db-profile-row-value">{user.phone || "Not set"}</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Email</span>
                        <span className="db-profile-row-value">{user.email}</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Role</span>
                        <span className="db-profile-row-value">{user.role}</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Plan</span>
                        <span className="db-profile-row-value">Basic (read‑only)</span>
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Member Since</span>
                        <span className="db-profile-row-value">{new Date(user.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                      <button className="db-profile-edit-btn" style={{ marginTop: "16px" }} onClick={() => { setIsEditing(true); setEditForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || "" }); }}>
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}