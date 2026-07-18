"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredAuthUser, logoutAuth } from "@/lib/auth";
import { getAdminStats, getAllUsersForAdmin, deleteUser, getAllPropertiesForAdmin } from "@/lib/admin";
import { getAllHotels, deleteHotel, getMyAllBookings } from "@/lib/hotels";
import {
  Home,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Bed,
  Trash2,
  Crown,
  Search,
  Hotel,
  Shield,
  DollarSign,
  PieChart,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const current = getStoredAuthUser();
    if (!current) {
      router.push("/login");
      setLoading(false);
      return;
    }
    const role = current.role?.toLowerCase();
    if (role !== "admin") {
      if (role === "realtor") router.push("/dashboard/realtor");
      else if (role === "hotel") router.push("/dashboard/hotel");
      else router.push("/dashboard/buyer");
      setLoading(false);
      return;
    }
    setUser(current);
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, usersData, propsData, hotelsData] = await Promise.all([
        getAdminStats(),
        getAllUsersForAdmin(),
        getAllPropertiesForAdmin(),
        getAllHotels(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setProperties(propsData);
      setHotels(hotelsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutAuth();
    router.push("/");
  }

  async function handleDeleteUser(id) {
    if (confirm("Delete this user? This action cannot be undone.")) {
      try { await deleteUser(id); await loadData(); } catch (err) { alert(err.message); }
    }
  }

  async function handleDeleteProperty(id) {
    if (confirm("Delete this property?")) {
      try {
        const { apiDelete } = await import('@/lib/api');
        await apiDelete('/properties/' + id);
        await loadData();
      } catch (err) { alert(err.message); }
    }
  }

  async function handleDeleteHotel(id) {
    if (confirm("Delete this hotel listing?")) {
      try { await deleteHotel(id); await loadData(); } catch (err) { alert(err.message); }
    }
  }

  // Bookings handled in hotel dashboard — admin view is read-only
  function handleDeleteBooking(id) {
    if (confirm("Delete this booking?")) {
      setBookings((prev) => prev.filter(b => (b._id || b.id) !== id));
    }
  }

  function getSafeSlug(property) {
    if (property.slug) return property.slug;
    return property.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "properties", label: "Properties", icon: <Building size={18} /> },
    { id: "hotels", label: "Hotels", icon: <Hotel size={18} /> },
    { id: "bookings", label: "Bookings", icon: <Calendar size={18} /> },
  ];

  const planColors = {
    basic: "#64748B",
    plus: "#D4A017",
    premium: "#0F172A",
    super: "#FFD700",
  };

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
        @media (max-width: 380px) { .db-logout-btn span { display: none; } } /* hide "Logout" text on very small screens, show icon only */
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
        .db-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
        @media (min-width: 480px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px) { .db-stats { grid-template-columns: repeat(5, 1fr); gap: 16px; } }
        .db-stat-card { background: #fff; border-radius: 12px; padding: 14px 12px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-stat-card { padding: 16px 18px; } }
        .db-stat-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .db-stat-icon svg { width: 16px; height: 16px; stroke: #D4A017; }
        @media (min-width: 768px) { .db-stat-icon { width: 36px; height: 36px; margin-bottom: 10px; } .db-stat-icon svg { width: 18px; height: 18px; } }
        .db-stat-num { font-size: 18px; font-weight: 900; color: #0F172A; }
        @media (min-width: 768px) { .db-stat-num { font-size: 22px; } }
        .db-stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
        @media (min-width: 768px) { .db-stat-lbl { font-size: 12px; } }
        .db-plan-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
        @media (min-width: 480px) { .db-plan-grid { grid-template-columns: repeat(4, 1fr); } }
        .db-plan-card { background: #fff; border-radius: 12px; padding: 14px; border: 1px solid #E2E8F0; text-align: center; }
        .db-plan-card .plan-count { font-size: 20px; font-weight: 900; }
        @media (min-width: 768px) { .db-plan-card .plan-count { font-size: 24px; } }
        .db-plan-card .plan-name { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: capitalize; }
        .db-table-wrap { overflow-x: auto; background: #fff; border-radius: 12px; border: 1px solid #E2E8F0; margin: 0 -4px; }
        @media (min-width: 768px) { .db-table-wrap { margin: 0; } }
        .db-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 600px; }
        @media (max-width: 480px) { .db-table { font-size: 12px; min-width: 100%; } }
        .db-table th { text-align: left; padding: 10px 12px; background: #F8FAFC; font-weight: 700; color: #0F172A; border-bottom: 1px solid #E2E8F0; }
        .db-table td { padding: 8px 12px; border-bottom: 1px solid #F1F5F9; color: #1A1A1A; vertical-align: middle; }
        @media (min-width: 768px) { .db-table th, .db-table td { padding: 12px 16px; } }
        .db-table tr:hover td { background: #F8FAFC; }
        .db-table .actions { display: flex; gap: 4px; flex-wrap: wrap; }
        .db-table .actions button { padding: 4px 8px; border-radius: 6px; border: none; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .db-table .actions .delete { background: #fee2e2; color: #ef4444; }
        .db-table .actions .delete:hover { background: #fecaca; }
        .db-table .actions .view { background: #dbeafe; color: #2563eb; }
        .db-table .actions .view:hover { background: #bfdbfe; }
        .db-empty-state { text-align: center; padding: 40px 20px; color: #94A3B8; }
        .db-empty-state h3 { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        @media (max-width: 480px) {
          .db-stats { grid-template-columns: 1fr 1fr; }
          .db-plan-grid { grid-template-columns: 1fr 1fr; }
          .db-table { font-size: 11px; }
          .db-table th, .db-table td { padding: 6px 8px; }
          .db-main { padding: 12px 8px; }
          .db-welcome h1 { font-size: 20px; }
          .db-stat-card { padding: 10px; }
          .db-stat-num { font-size: 16px; }
          .db-stat-lbl { font-size: 10px; }
        }
        @media (max-width: 380px) {
          .db-stats { grid-template-columns: 1fr; }
          .db-plan-grid { grid-template-columns: 1fr; }
          .db-nav { padding: 0 10px; height: 56px; }
          .db-body { min-height: calc(100vh - 56px); }
        }
      `}</style>

      <div className="db-page">
        <nav className="db-nav">
          <Link href="/" className="db-nav-logo">
            <div className="db-nav-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
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
            </button>
          ))}
        </div>

        <div className="db-body">
          <aside className="db-sidebar">
            <div style={{ marginBottom: "24px" }}>
              <div className="db-sidebar-label">Admin Menu</div>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={"db-sidebar-btn " + (tab === t.id ? "active" : "")}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div>
              <div className="db-sidebar-label">Quick Links</div>
              <Link href="/properties" style={{ textDecoration: "none" }}>
                <button className="db-sidebar-btn"><Search size={18} /> Browse Properties</button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button className="db-sidebar-btn"><Home size={18} /> Back to Home</button>
              </Link>
              <button
                className="db-sidebar-btn"
                onClick={handleLogout}
                style={{ color: "#ef4444", borderTop: "1px solid #E2E8F0", marginTop: "8px", paddingTop: "12px" }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>

          <main className="db-main">
            {tab === "overview" && stats && (
              <div>
                <div className="db-welcome">
                  <h1><Shield size={28} color="#D4A017" /> Welcome, Admin!</h1>
                  <p>Here's your platform overview.</p>
                </div>
                <div className="db-stats">
                  <div className="db-stat-card"><div className="db-stat-icon"><Users size={18} /></div><div className="db-stat-num">{stats.totalUsers}</div><div className="db-stat-lbl">Total Users</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Building size={18} /></div><div className="db-stat-num">{stats.totalProperties}</div><div className="db-stat-lbl">Properties</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Hotel size={18} /></div><div className="db-stat-num">{stats.totalHotels}</div><div className="db-stat-lbl">Hotels</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Calendar size={18} /></div><div className="db-stat-num">{stats.totalBookings}</div><div className="db-stat-lbl">Bookings</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><DollarSign size={18} /></div><div className="db-stat-num">₦{stats.revenue.toLocaleString()}</div><div className="db-stat-lbl">Revenue</div></div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <PieChart size={18} /> Subscription Plans
                  </h3>
                  <div className="db-plan-grid">
                    {Object.entries(stats.planDistribution).map(([plan, count]) => (
                      <div key={plan} className="db-plan-card">
                        <div className="plan-count" style={{ color: planColors[plan] || "#64748B" }}>{count}</div>
                        <div className="plan-name">{plan}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
                  <div className="db-stat-card"><div className="db-stat-num">{stats.buyers}</div><div className="db-stat-lbl">Buyers</div></div>
                  <div className="db-stat-card"><div className="db-stat-num">{stats.realtors}</div><div className="db-stat-lbl">Realtors</div></div>
                  <div className="db-stat-card"><div className="db-stat-num">{stats.hotelOwners}</div><div className="db-stat-lbl">Hotel Owners</div></div>
                  <div className="db-stat-card"><div className="db-stat-num">{stats.admins}</div><div className="db-stat-lbl">Admins</div></div>
                </div>
              </div>
            )}

            {tab === "users" && (
              <div>
                <div className="db-welcome"><h1>All Users</h1><p>Manage registered users.</p></div>
                {users.length === 0 ? (
                  <div className="db-empty-state"><h3>No users found</h3></div>
                ) : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th><th>Actions</th></tr></thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.email}</td>
                            <td><span style={{ textTransform: "capitalize", background: u.role === "admin" ? "#fef3c7" : "#e2e8f0", padding: "2px 10px", borderRadius: "999px", fontSize: "11px" }}>{u.role}</span></td>
                            <td><span style={{ textTransform: "capitalize" }}>{u.subscriptionPlan || "basic"}</span></td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="actions">
                                {u.role !== "admin" && (
                                  <button className="delete" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === "properties" && (
              <div>
                <div className="db-welcome"><h1>All Properties</h1><p>Manage all property listings.</p></div>
                {properties.length === 0 ? (
                  <div className="db-empty-state"><h3>No properties found</h3></div>
                ) : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr><th>Name</th><th>Location</th><th>Price</th><th>Type</th><th>Actions</th></tr></thead>
                      <tbody>
                        {properties.map((p) => {
                          const slug = getSafeSlug(p);
                          return (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>{p.location}</td>
                              <td>{p.priceLabel}</td>
                              <td>{p.type}</td>
                              <td>
                                <div className="actions">
                                  <Link href={"/properties/" + slug}>
                                    <button className="view">View</button>
                                  </Link>
                                  <button className="delete" onClick={() => handleDeleteProperty(p.id)}>Delete</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === "hotels" && (
              <div>
                <div className="db-welcome"><h1>All Hotels</h1><p>Manage hotel listings.</p></div>
                {hotels.length === 0 ? (
                  <div className="db-empty-state"><h3>No hotels found</h3></div>
                ) : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr><th>Name</th><th>Location</th><th>Rooms</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {hotels.map((h) => (
                          <tr key={h.id}>
                            <td>{h.name}</td>
                            <td>{h.location}</td>
                            <td>{h.rooms}</td>
                            <td>{h.status || "Active"}</td>
                            <td>
                              <div className="actions">
                                <button className="delete" onClick={() => handleDeleteHotel(h.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === "bookings" && (
              <div>
                <div className="db-welcome"><h1>All Bookings</h1><p>Manage hotel reservations.</p></div>
                {bookings.length === 0 ? (
                  <div className="db-empty-state"><h3>No bookings found</h3></div>
                ) : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td>{b.guestName}</td>
                            <td>{b.room}</td>
                            <td>{b.checkIn}</td>
                            <td>{b.checkOut}</td>
                            <td><span style={{ textTransform: "capitalize", background: b.status === "Confirmed" ? "#dcfce7" : b.status === "Cancelled" ? "#fee2e2" : "#fef3c7", padding: "2px 10px", borderRadius: "999px", fontSize: "11px" }}>{b.status}</span></td>
                            <td>
                              <div className="actions">
                                <button className="delete" onClick={() => handleDeleteBooking(b.id, b.userId)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}