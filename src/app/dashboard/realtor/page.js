"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import { getStoredAuthUser, logoutAuth, updateProfileWithBackend } from "@/lib/auth";
import { getRealtorProperties, createProperty, updateProperty, deleteProperty } from "@/lib/properties";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Home,
  User,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  LayoutDashboard,
  Crown,
  Zap,
  CheckCircle2,
  X,
  Search,
  Save,
  Edit2,
  Building2,
  SlidersHorizontal,
  Bell,
  Sparkles,
  ArrowUpRight,
  Send,
  Phone,
  Mail,
  Clock,
  ShieldCheck
} from "lucide-react";

const SUBSCRIPTION_PLANS = [
  { id: "basic", name: "Basic", icon: <Home size={20} />, price: "Free", listings: 1, features: ["1 listing", "Basic visibility"] },
  { id: "plus", name: "Plus", icon: <Zap size={20} />, price: "₦5,000", listings: 5, features: ["5 listings", "Enhanced visibility"] },
  { id: "premium", name: "Premium", icon: <Crown size={20} />, price: "₦25,000", listings: 20, features: ["20 listings", "Premium visibility"] },
  { id: "super", name: "Super", icon: <Crown size={20} style={{ color: "#D4A017" }} />, price: "₦50,000", listings: "Unlimited", features: ["Unlimited listings", "Top tier visibility"] },
];

export default function RealtorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Inquiries & Live Chat State
  const [inquiriesList, setInquiriesList] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", location: "", price: "", priceLabel: "", type: "Residential",
    beds: "", baths: "", size: "", image: "", description: "", features: "", phone: "",
  });

  // Profile edit
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const current = getStoredAuthUser();
    if (!current) { router.push("/login"); setLoading(false); return; }
    const role = current.role?.toLowerCase();
    if (role !== "realtor") { router.push("/dashboard/buyer"); setLoading(false); return; }
    setUser(current);
    setEditForm({ firstName: current.firstName, lastName: current.lastName, phone: current.phone || "" });
    getRealtorProperties()
      .then((props) => setProperties(props || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));

    // Load buyer inquiries sent to Obadimu Ifeoluwa / Realtor
    try {
      const storedInquiries = JSON.parse(window.localStorage.getItem("tharel_buyer_inquiries") || "[]");
      setInquiriesList(storedInquiries);
      if (storedInquiries.length > 0) {
        setSelectedInquiry(storedInquiries[0]);
      }
    } catch {
      setInquiriesList([]);
    }
  }, []);

  function handleLogout() { logoutAuth(); router.push("/"); }

  function resetForm() {
    setFormData({
      name: "", location: "", price: "", priceLabel: "", type: "Residential",
      beds: "", baths: "", size: "", image: "", description: "", features: "", phone: user?.phone || "08168426592",
    });
  }

  async function handleAddProperty() {
    try {
      const newProperty = await createProperty({
        ...formData,
        beds: parseInt(formData.beds) || null,
        baths: parseInt(formData.baths) || null,
        features: formData.features ? formData.features.split(",").map((f) => f.trim()) : [],
        gallery: [formData.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
        featured: false,
      });
      if (newProperty) setProperties((prev) => [...prev, newProperty]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert("Error creating property: " + err.message);
    }
  }

  async function handleEditProperty() {
    try {
      const id = editingProperty._id || editingProperty.id;
      const payload = { ...formData, beds: parseInt(formData.beds) || null, baths: parseInt(formData.baths) || null, features: formData.features ? formData.features.split(",").map((f) => f.trim()) : [] };
      const updated = await updateProperty(id, payload);
      if (updated) setProperties(properties.map((p) => (p._id || p.id) === id ? updated : p));
      setEditingProperty(null);
      resetForm();
    } catch (err) {
      alert("Error updating property: " + err.message);
    }
  }

  async function handleDeleteProperty(id) {
    if (!confirm("Delete this property listing?")) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert("Error deleting property: " + err.message);
    }
  }

  function openEdit(property) {
    setEditingProperty(property);
    setFormData({
      name: property.name || "",
      location: property.location || "",
      price: property.price || "",
      priceLabel: property.priceLabel || "",
      type: property.type || "Residential",
      beds: property.beds || "",
      baths: property.baths || "",
      size: property.size || "",
      image: property.image || "",
      description: property.description || "",
      features: Array.isArray(property.features) ? property.features.join(", ") : "",
      phone: property.phone || user?.phone || "08168426592",
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadLoading(false);
    }
  }

  // Handle Realtor Direct Reply to Buyer In-App
  function handleSendRealtorReply(e) {
    e.preventDefault();
    if (!replyInput.trim() || !selectedInquiry) return;

    const pId = String(selectedInquiry.propertyId);
    const replyMsg = {
      id: "msg_realtor_" + Date.now(),
      sender: "seller",
      senderName: `${user.firstName} ${user.lastName || ""}`.trim() + " (Verified Realtor)",
      text: replyInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      const existingThread = JSON.parse(window.localStorage.getItem("tharel_chat_" + pId) || "[]");
      const updatedThread = [...existingThread, replyMsg];
      window.localStorage.setItem("tharel_chat_" + pId, JSON.stringify(updatedThread));
    } catch {}

    setReplyInput("");
    alert("Reply sent directly to buyer (" + selectedInquiry.buyerName + ")!");
  }

  async function saveProfile() {
    try {
      const updated = await updateProfileWithBackend(editForm);
      setUser((prev) => ({ ...prev, ...(updated || editForm) }));
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  }

  const filteredProperties = properties.filter((p) => {
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.location || "").toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "For Sale") return matchSearch && (p.type || "").toLowerCase().includes("sale");
    if (filterStatus === "For Rent") return matchSearch && (p.type || "").toLowerCase().includes("rent");
    return matchSearch;
  });

  if (loading) {
    return <LoadingScreen message="The 10th Homes · Realtor Portal Loading..." />;
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #E2E8F0; color: #0F172A; }
        .pro-dashboard-wrap { min-height: 100vh; background: #E2E8F0; padding: 24px; }
        .pro-app-card {
          background: #F8FAFC; border-radius: 28px; border: 1px solid #CBD5E1;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08); overflow: hidden;
          max-width: 1440px; margin: 0 auto; display: flex; min-height: 860px;
        }
        .pro-sidebar {
          width: 270px; background: #ffffff; border-right: 1px solid #E2E8F0;
          padding: 28px 20px; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0;
        }
        .pro-sidebar-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; text-decoration: none; }
        .pro-brand-logo { width: 38px; height: 38px; border-radius: 12px; background: #059669; display: flex; align-items: center; justify-content: center; color: #ffffff; }
        .pro-sidebar-section { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; margin: 20px 0 10px 10px; }
        .pro-nav-btn {
          display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px;
          border-radius: 12px; border: none; background: transparent; font-size: 14px; font-weight: 600;
          color: #64748B; cursor: pointer; transition: all 0.25s ease; margin-bottom: 4px; text-align: left;
        }
        .pro-nav-btn:hover { background: #F1F5F9; color: #0F172A; }
        .pro-nav-btn.active { background: #ECFDF5; color: #059669; font-weight: 700; }
        .pro-upgrade-card { background: linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%); border: 1px solid #A7F3D0; border-radius: 20px; padding: 18px; margin-top: 24px; }
        .pro-upgrade-title { font-size: 14px; font-weight: 800; color: #065F46; }
        .pro-upgrade-sub { font-size: 12px; color: #047857; line-height: 1.4; margin-bottom: 14px; }
        .pro-upgrade-btn { width: 100%; padding: 10px; border-radius: 10px; background: #059669; color: #ffffff; font-weight: 700; font-size: 13px; border: none; cursor: pointer; }
        .pro-main-content { flex: 1; padding: 32px; overflow-y: auto; }
        .pro-top-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
        .pro-page-title { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; }
        .pro-search-box { position: relative; width: 280px; }
        .pro-search-input { width: 100%; padding: 10px 14px 10px 40px; border-radius: 12px; border: 1px solid #CBD5E1; font-size: 13.5px; outline: none; background: #ffffff; }
        .pro-btn-add { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 12px; background: #059669; color: #ffffff; font-weight: 700; font-size: 13.5px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25); }
        .pro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 22px; }
        .pro-card { background: #ffffff; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; transition: all 0.3s ease; position: relative; }
        .pro-card-img-wrap { position: relative; width: 100%; height: 180px; background: #CBD5E1; }
        .pro-card-img { width: 100%; height: 100%; object-fit: cover; }
        .pro-card-body { padding: 16px 18px; }
        .pro-card-title { font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .pro-card-price { font-size: 17px; font-weight: 900; color: #059669; }
        .pro-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(6px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .pro-modal-card { background: #ffffff; border-radius: 24px; max-width: 580px; width: 100%; padding: 32px; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3); max-height: 90vh; overflow-y: auto; }
        .pro-field { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #CBD5E1; font-size: 14px; outline: none; margin-bottom: 12px; }
      `}</style>

      <div className="pro-dashboard-wrap">
        <div className="pro-app-card">
          {/* LEFT SIDEBAR */}
          <aside className="pro-sidebar">
            <div>
              <Link href="/" className="pro-sidebar-brand">
                <div className="pro-brand-logo">
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "#0F172A" }}>The 10th Homes</div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#059669", textTransform: "uppercase" }}>Realtor Portal</div>
                </div>
              </Link>

              <div className="pro-sidebar-section">Menu</div>
              <button
                className={`pro-nav-btn ${tab === "overview" ? "active" : ""}`}
                onClick={() => setTab("overview")}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                className={`pro-nav-btn ${tab === "properties" ? "active" : ""}`}
                onClick={() => setTab("properties")}
              >
                <Home size={18} />
                <span>My Properties</span>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 800, background: "#E2E8F0", padding: "2px 8px", borderRadius: "999px" }}>
                  {properties.length}
                </span>
              </button>

              {/* BUYER INQUIRIES & DIRECT CHAT TAB */}
              <button
                className={`pro-nav-btn ${tab === "inquiries" ? "active" : ""}`}
                onClick={() => setTab("inquiries")}
              >
                <MessageCircle size={18} />
                <span>Buyer Inquiries</span>
                {inquiriesList.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 800, background: "#059669", color: "#ffffff", padding: "2px 8px", borderRadius: "999px" }}>
                    {inquiriesList.length}
                  </span>
                )}
              </button>

              <button
                className={`pro-nav-btn ${tab === "subscription" ? "active" : ""}`}
                onClick={() => setTab("subscription")}
              >
                <Crown size={18} />
                <span>Subscription Plan</span>
              </button>

              <div className="pro-sidebar-section">General</div>
              <button
                className={`pro-nav-btn ${tab === "profile" ? "active" : ""}`}
                onClick={() => setTab("profile")}
              >
                <User size={18} />
                <span>Account Settings</span>
              </button>

              <button className="pro-nav-btn" onClick={handleLogout} style={{ color: "#EF4444" }}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>

            {/* SIDEBAR BOTTOM UPGRADE CARD */}
            <div className="pro-upgrade-card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Sparkles size={16} color="#059669" />
                <span className="pro-upgrade-title">Realtor Pro Active</span>
              </div>
              <p className="pro-upgrade-sub">
                Logged in as {user.firstName} {user.lastName}. Manage buyer inquiries &amp; properties.
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="pro-main-content">
            {/* TOP HEADER */}
            <div className="pro-top-bar">
              <div>
                <h1 className="pro-page-title">
                  {tab === "inquiries" ? "Buyer Inquiries & Direct Chat Desk" : "Realtor Portal & Estate Listings"}
                </h1>
                <p style={{ fontSize: "13.5px", color: "#64748B" }}>
                  {tab === "inquiries"
                    ? "View messages sent by buyers from property inspection pages and reply in real-time."
                    : "Manage, list, and analyze your estate listings on The 10th Homes."}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <button
                  className="pro-btn-add"
                  onClick={() => { resetForm(); setShowAddModal(true); }}
                >
                  <Plus size={18} />
                  <span>Add Property</span>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "10px", borderLeft: "1px solid #CBD5E1" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#059669", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: "11px", color: "#64748B" }}>{user.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: PROPERTIES */}
            {tab === "properties" && (
              <div>
                <div className="pro-filter-bar">
                  <div className="pro-filter-chips">
                    {["All", "For Sale", "For Rent"].map((status) => (
                      <button
                        key={status}
                        className={`pro-chip ${filterStatus === status ? "active" : ""}`}
                        onClick={() => setFilterStatus(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 600 }}>
                    Showing {filteredProperties.length} of {properties.length} properties
                  </span>
                </div>

                {filteredProperties.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                    <Home size={40} color="#94A3B8" style={{ marginBottom: "12px" }} />
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>No properties found</h3>
                    <p style={{ fontSize: "13.5px", color: "#64748B", margin: "0 0 20px" }}>Click "+ Add Property" to publish your first estate listing.</p>
                  </div>
                ) : (
                  <div className="pro-grid">
                    {filteredProperties.map((p) => (
                      <div key={p._id || p.id} className="pro-card">
                        <div className="pro-card-img-wrap">
                          <img
                            src={p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
                            alt={p.name}
                            className="pro-card-img"
                          />
                          <span className="pro-card-badge">{p.type || "Residential"}</span>
                        </div>
                        <div className="pro-card-body">
                          <h4 className="pro-card-title">{p.name}</h4>
                          <p className="pro-card-loc">{p.location}</p>
                          <div className="pro-card-price">{formatPrice(p.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: BUYER INQUIRIES & LIVE CHAT DESK */}
            {tab === "inquiries" && (
              <div>
                {inquiriesList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                    <MessageCircle size={44} color="#059669" style={{ marginBottom: "12px" }} />
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>No buyer inquiries yet</h3>
                    <p style={{ fontSize: "14px", color: "#64748B" }}>
                      When buyers send direct messages on your property inspection pages, they will appear here instantly.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>
                    {/* Left: Inquiries List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {inquiriesList.map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          style={{
                            background: selectedInquiry?.id === inq.id ? "#ECFDF5" : "#ffffff",
                            border: selectedInquiry?.id === inq.id ? "1.5px solid #059669" : "1px solid #E2E8F0",
                            borderRadius: "16px",
                            padding: "16px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>{inq.buyerName}</span>
                            <span style={{ fontSize: "11px", color: "#64748B" }}>{inq.time}</span>
                          </div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#059669", marginBottom: "6px" }}>
                            {inq.propertyName}
                          </div>
                          <div style={{ fontSize: "13px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {inq.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: Selected Inquiry & Reply Drawer */}
                    {selectedInquiry && (
                      <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #E2E8F0" }}>
                            <div>
                              <span style={{ fontSize: "11px", fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>
                                Buyer Property Inquiry
                              </span>
                              <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                                {selectedInquiry.propertyName}
                              </h3>
                              <p style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
                                Location: {selectedInquiry.propertyLocation || "Lagos"}
                              </p>
                            </div>

                            <span style={{ background: "#ECFDF5", color: "#059669", padding: "6px 14px", borderRadius: "30px", fontSize: "12px", fontWeight: 800 }}>
                              Active Buyer Message
                            </span>
                          </div>

                          <div style={{ background: "#F8FAFC", borderRadius: "16px", padding: "18px", marginBottom: "24px", border: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                              <UserCheck size={18} color="#059669" />
                              <span style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>{selectedInquiry.buyerName}</span>
                              <span style={{ fontSize: "12px", color: "#64748B" }}>({selectedInquiry.buyerPhone || "Verified Buyer"})</span>
                            </div>
                            <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>
                              "{selectedInquiry.message}"
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleSendRealtorReply}>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#059669", marginBottom: "8px", textTransform: "uppercase" }}>
                            Send Direct Reply to Buyer
                          </label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <input
                              type="text"
                              placeholder={`Reply to ${selectedInquiry.buyerName}...`}
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              className="pro-field"
                              style={{ marginBottom: 0, flex: 1 }}
                              required
                            />
                            <button type="submit" className="pro-btn-add" style={{ padding: "12px 24px" }}>
                              <Send size={16} /> Send Reply
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SUBSCRIPTION */}
            {tab === "subscription" && (
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>Subscription Plans</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div key={plan.id} style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid #E2E8F0", padding: "24px" }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>{plan.name}</div>
                      <div style={{ fontSize: "24px", fontWeight: 900, color: "#059669", margin: "8px 0 16px" }}>{plan.price}</div>
                      <button style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#059669", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {tab === "profile" && (
              <div style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #E2E8F0", maxWidth: "560px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>Account Settings</h3>
                {saveMessage && <div style={{ padding: "10px", background: "#ECFDF5", color: "#047857", borderRadius: "8px", marginBottom: "12px", fontSize: "13px" }}>{saveMessage}</div>}
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748B", marginBottom: "4px" }}>First Name</label>
                  <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="pro-field" />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748B", marginBottom: "4px" }}>Last Name</label>
                  <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="pro-field" />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748B", marginBottom: "4px" }}>Phone Number</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="pro-field" />
                </div>
                <button onClick={saveProfile} style={{ padding: "11px 24px", borderRadius: "10px", background: "#059669", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Save Profile
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ADD / EDIT PROPERTY MODAL */}
      {(showAddModal || editingProperty) && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>{editingProperty ? "Edit Property Listing" : "Add New Property Listing"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingProperty(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Property Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pro-field" placeholder="e.g. Modern Downtown Villa" />
            </div>

            <div className="pro-input-grid">
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="pro-field" placeholder="e.g. Lekki Phase 1, Lagos" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Price (₦)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="pro-field" placeholder="e.g. 85000000" />
              </div>
            </div>

            <div className="pro-input-grid">
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Bedrooms</label>
                <input type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: e.target.value })} className="pro-field" placeholder="e.g. 4" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Bathrooms</label>
                <input type="number" value={formData.baths} onChange={(e) => setFormData({ ...formData, baths: e.target.value })} className="pro-field" placeholder="e.g. 4" />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Image File or URL</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "block", marginBottom: "6px" }} />
              {uploadLoading && <span style={{ fontSize: "12px", color: "#059669" }}>Uploading image...</span>}
              <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="pro-field" placeholder="or enter Image URL" />
            </div>

            <button
              onClick={editingProperty ? handleEditProperty : handleAddProperty}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#059669", color: "#fff", fontWeight: 800, border: "none", cursor: "pointer", marginTop: "10px" }}
            >
              {editingProperty ? "Update Listing" : "Publish Listing"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}