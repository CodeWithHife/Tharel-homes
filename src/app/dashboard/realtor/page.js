"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredAuthUser, logoutAuth, updateProfileWithBackend } from "@/lib/auth";
import { getRealtorProperties, createProperty, updateProperty, deleteProperty } from "@/lib/properties";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Home, User, LogOut, Plus, Edit, Trash2, Eye, MessageCircle, LayoutDashboard, Crown, Zap, CheckCircle2, X, Search, Save, Edit2 } from "lucide-react";

const SUBSCRIPTION_PLANS = [
  { id: "basic", name: "Basic", icon: <Home size={20} />, price: "Free", listings: 1, features: ["1 listing", "Basic visibility"] },
  { id: "plus", name: "Plus", icon: <Zap size={20} />, price: "₦5,000", listings: 5, features: ["5 listings", "Enhanced visibility"] },
  { id: "premium", name: "Premium", icon: <Crown size={20} />, price: "₦25,000", listings: 20, features: ["20 listings", "Premium visibility"] },
  { id: "super", name: "Super", icon: <Crown size={20} style={{ color: "#FFD700" }} />, price: "₦50,000", listings: "Unlimited", features: ["Unlimited listings", "Top tier visibility"] },
];

export default function RealtorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", location: "", price: "", priceLabel: "", type: "",
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
  }, []);

  function handleLogout() { logoutAuth(); router.push("/"); }

  function resetForm() {
    setFormData({
      name: "", location: "", price: "", priceLabel: "", type: "",
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
    if (!confirm("Delete this property?")) return;
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
      name: property.name,
      location: property.location,
      price: property.price,
      priceLabel: property.priceLabel,
      type: property.type,
      beds: property.beds || "",
      baths: property.baths || "",
      size: property.size,
      image: property.image,
      description: property.description || "",
      features: property.features ? property.features.join(", ") : "",
      phone: property.phone || "08168426592",
    });
  }

  function handleEditProfile(e) { setEditForm({ ...editForm, [e.target.name]: e.target.value }); }

  async function saveProfile() {
    if (!user) return;
    try {
      const updated = await updateProfileWithBackend(editForm);
      setUser({ ...user, ...(updated || editForm) });
      setSaveMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("Error saving profile: " + err.message);
    }
  }

  const activePlan = SUBSCRIPTION_PLANS[0];
  const planListings = activePlan.listings === "Unlimited" ? Infinity : activePlan.listings;
  const usedListings = properties.length;
  const remainingListings = planListings === Infinity ? "∞" : Math.max(0, planListings - usedListings);

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
    { id: "properties", label: "Properties", icon: <Home size={18} /> },
    { id: "subscription", label: "Subscription", icon: <Crown size={18} /> },
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
        .db-welcome { margin-bottom: 20px; }
        .db-welcome h1 { font-size: clamp(18px, 4vw, 28px); font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .db-welcome p { font-size: 14px; color: #64748b; }
        .db-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        @media (min-width: 480px) { .db-stats { grid-template-columns: repeat(4, 1fr); } }
        .db-stat-card { background: #fff; border-radius: 12px; padding: 14px 12px; border: 1px solid #E2E8F0; }
        @media (min-width: 768px) { .db-stat-card { padding: 16px 18px; } }
        .db-stat-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(212,160,23,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .db-stat-icon svg { width: 16px; height: 16px; stroke: #D4A017; }
        @media (min-width: 768px) { .db-stat-icon { width: 36px; height: 36px; margin-bottom: 10px; } .db-stat-icon svg { width: 18px; height: 18px; } }
        .db-stat-num { font-size: 18px; font-weight: 900; color: #0F172A; }
        @media (min-width: 768px) { .db-stat-num { font-size: 22px; } }
        .db-stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
        @media (min-width: 768px) { .db-stat-lbl { font-size: 12px; } }
        .db-section-header { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
        @media (min-width: 480px) { .db-section-header { flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; } }
        .db-section-title { font-size: 17px; font-weight: 800; color: #0F172A; }
        .db-add-btn { display: flex; align-items: center; gap: 6px; background: #D4A017; color: #fff; padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .db-add-btn:hover { background: #b8860c; transform: translateY(-2px); }
        @media (max-width: 480px) { .db-add-btn { font-size: 12px; padding: 8px 12px; width: 100%; justify-content: center; } }
        .db-property-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 480px) { .db-property-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .db-property-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .db-property-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; }
        .db-property-img { width: 100%; height: 160px; object-fit: cover; background: #E2E8F0; }
        .db-property-body { padding: 14px 16px; }
        .db-property-name { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
        .db-property-loc { font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .db-property-price { font-size: 15px; font-weight: 800; color: #D4A017; }
        .db-property-actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .db-prop-btn { padding: 6px 12px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px; text-decoration: none; color: #0F172A; }
        .db-prop-btn.edit:hover { border-color: #D4A017; color: #D4A017; }
        .db-prop-btn.delete:hover { border-color: #ef4444; color: #ef4444; }
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
        .db-plan-price { font-size: 20px; font-weight: 900; color: #D4A017; margin: 6px 0; }
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
        .db-profile-edit-input { width: 100%; padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13.5px; outline: none; background: #fff; }
        .db-profile-edit-input:focus { border-color: #D4A017; }
        .db-profile-edit-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .db-profile-edit-actions button { flex: 1; min-width: 80px; justify-content: center; display: flex; align-items: center; gap: 6px; }
        .db-profile-save-btn { padding: 8px 20px; border-radius: 8px; border: none; background: #D4A017; color: #fff; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .db-profile-save-btn:hover { background: #b8860c; }
        .db-profile-cancel-btn { padding: 8px 20px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: border-color 0.2s; }
        .db-profile-cancel-btn:hover { border-color: #94a3b8; }
        .db-profile-edit-btn { padding: 6px 14px; border-radius: 8px; border: 1.5px solid #D4A017; background: transparent; color: #D4A017; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .db-profile-edit-btn:hover { background: #D4A017; color: #fff; }
        .db-save-message { padding: 8px 12px; border-radius: 8px; font-size: 13px; margin-top: 12px; }
        .db-save-message.success { background: #dcfce7; color: #16a34a; }
        .db-save-message.error { background: #fee2e2; color: #dc2626; }
        .db-empty-state { padding: 40px 20px; background: #fff; border-radius: 16px; border: 1px solid #E2E8F0; text-align: center; }
        .db-empty-state p { color: #94A3B8; margin-bottom: 12px; }
        .db-view-all-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #D4A017; border: 2px solid #D4A017; padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .db-view-all-btn:hover { background: #D4A017; color: #fff; }
        .db-listing-usage-card { background: #fff; border-radius: 16px; padding: 16px 20px; border: 1px solid #E2E8F0; margin-bottom: 24px; }
        @media (min-width: 768px) { .db-listing-usage-card { padding: 20px 24px; } }
        .db-listing-usage-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .db-listing-usage-label { font-size: 13px; color: #64748b; }
        .db-listing-usage-numbers { font-size: 20px; font-weight: 800; color: #0F172A; }
        .db-listing-usage-plan { font-size: 13px; color: #64748b; }
        .db-listing-usage-plan strong { color: #D4A017; }
        .db-listing-usage-bar { height: 6px; background: #E2E8F0; border-radius: 999px; margin-top: 12px; overflow: hidden; }
        .db-listing-usage-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
        .db-listing-usage-warning { font-size: 12px; color: #ef4444; margin-top: 8px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
        .modal-content { background: #fff; border-radius: 20px; padding: 24px 20px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; }
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
        @media (max-width: 480px) {
          .db-stats { grid-template-columns: 1fr 1fr; }
          .db-property-grid { grid-template-columns: 1fr; }
          .db-plan-grid { grid-template-columns: 1fr; }
          .db-section-header { flex-direction: column; align-items: stretch; }
          .db-add-btn { width: 100%; justify-content: center; }
          .db-profile-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .db-profile-row-value { text-align: left; max-width: 100%; }
          .db-profile-edit-input { max-width: 100% !important; }
          .db-plan-card { padding: 16px; }
        }
        @media (max-width: 380px) {
          .db-nav { padding: 0 10px; height: 56px; }
          .db-body { min-height: calc(100vh - 56px); }
          .db-mobile-tabs { padding: 8px 10px; }
          .db-mobile-tab { font-size: 11px; padding: 6px 10px; }
          .db-property-actions { flex-direction: column; align-items: stretch; }
          .db-prop-btn { justify-content: center; }
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
              <Link href="/properties" style={{textDecoration:"none"}}><button className="db-sidebar-btn"><Search size={18} /> Browse Properties</button></Link>
              <Link href="/" style={{textDecoration:"none"}}><button className="db-sidebar-btn"><Home size={18} /> Back to Home</button></Link>
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
                  <p>Here's your realtor dashboard overview.</p>
                </div>
                <div className="db-stats">
                  <div className="db-stat-card"><div className="db-stat-icon"><Home size={18} /></div><div className="db-stat-num">{properties.length}</div><div className="db-stat-lbl">Total Listings</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Eye size={18} /></div><div className="db-stat-num">0</div><div className="db-stat-lbl">Views</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><MessageCircle size={18} /></div><div className="db-stat-num">0</div><div className="db-stat-lbl">Enquiries</div></div>
                  <div className="db-stat-card"><div className="db-stat-icon"><Crown size={18} /></div><div className="db-stat-num">{activePlan.name}</div><div className="db-stat-lbl">Plan</div></div>
                </div>

                <div className="db-listing-usage-card">
                  <div className="db-listing-usage-top">
                    <div>
                      <div className="db-listing-usage-label">Listings Used</div>
                      <div className="db-listing-usage-numbers">{usedListings} / {typeof remainingListings === "string" ? remainingListings : planListings}</div>
                    </div>
                    <div className="db-listing-usage-plan">Plan: <strong>{activePlan.name}</strong></div>
                  </div>
                  <div className="db-listing-usage-bar">
                    <div className="db-listing-usage-fill" style={{
                      width: planListings === Infinity ? "30%" : Math.min(100, (usedListings / planListings) * 100) + "%",
                      background: usedListings >= planListings ? "#ef4444" : "linear-gradient(90deg, #D4A017, #b8860c)"
                    }} />
                  </div>
                  {usedListings >= planListings && planListings !== Infinity && (
                    <div className="db-listing-usage-warning">You've reached your listing limit. Upgrade your plan to add more.</div>
                  )}
                </div>

                <div className="db-section-header">
                  <div className="db-section-title">Recent Listings</div>
                  <button className="db-add-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} /> Add Property
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="db-empty-state">
                    <p>You haven't listed any properties yet.</p>
                    <button className="db-add-btn" style={{ display: "inline-flex", width: "auto" }} onClick={() => setShowAddModal(true)}>
                      <Plus size={16} /> Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="db-property-grid">
                    {properties.slice(0,3).map(p => (
                      <div key={p._id || p.id} className="db-property-card">
                        <img className="db-property-img" src={p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={p.name} />
                        <div className="db-property-body">
                          <div className="db-property-name">{p.name}</div>
                          <div className="db-property-loc">📍 {p.location}</div>
                          <div className="db-property-price">{p.priceLabel}</div>
                          <div className="db-property-actions">
                            <Link href={"/properties/" + p.slug} className="db-prop-btn" style={{textDecoration:"none"}}>View</Link>
                            <button className="db-prop-btn edit" onClick={() => openEdit(p)}>Edit</button>
                            <button className="db-prop-btn delete" onClick={() => handleDeleteProperty(p.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {properties.length > 3 && (
                  <div style={{textAlign:"center", marginTop:"16px"}}>
                    <button className="db-view-all-btn" onClick={() => setTab("properties")}>
                      View All ({properties.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === "properties" && (
              <div>
                <div className="db-section-header">
                  <div className="db-welcome" style={{marginBottom:0}}>
                    <h1>My Properties</h1>
                    <p>Manage all your property listings.</p>
                  </div>
                  <button className="db-add-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} /> Add Property
                  </button>
                </div>
                {properties.length === 0 ? (
                  <div className="db-empty-state">
                    <p>You haven't listed any properties yet.</p>
                    <button className="db-add-btn" style={{ display: "inline-flex", width: "auto" }} onClick={() => setShowAddModal(true)}>
                      <Plus size={16} /> Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="db-property-grid">
                    {properties.map(p => (
                      <div key={p._id || p.id} className="db-property-card">
                        <img className="db-property-img" src={p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={p.name} />
                        <div className="db-property-body">
                          <div className="db-property-name">{p.name}</div>
                          <div className="db-property-loc">📍 {p.location}</div>
                          <div className="db-property-price">{p.priceLabel}</div>
                          <div className="db-property-actions">
                            <Link href={"/properties/" + p.slug} className="db-prop-btn" style={{textDecoration:"none"}}>View</Link>
                            <button className="db-prop-btn edit" onClick={() => openEdit(p)}>Edit</button>
                            <button className="db-prop-btn delete" onClick={() => handleDeleteProperty(p.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "subscription" && (
              <div>
                <div className="db-welcome"><h1>Subscription Plans</h1><p>Choose a plan that fits your needs.</p></div>
                <div className="db-plan-grid">
                  {SUBSCRIPTION_PLANS.map(plan => {
                    const isActive = activePlan.id === plan.id;
                    return (
                      <div key={plan.id} className={"db-plan-card" + (plan.id === "plus" ? " popular" : "")}>
                        <div className="icon-wrap">{plan.icon}</div>
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
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">First Name</span>
                        <input className="db-profile-edit-input" name="firstName" value={editForm.firstName} onChange={handleEditProfile} style={{ maxWidth: "200px" }} />
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Last Name</span>
                        <input className="db-profile-edit-input" name="lastName" value={editForm.lastName} onChange={handleEditProfile} style={{ maxWidth: "200px" }} />
                      </div>
                      <div className="db-profile-row">
                        <span className="db-profile-row-label">Phone</span>
                        <input className="db-profile-edit-input" name="phone" value={editForm.phone} onChange={handleEditProfile} placeholder="080XXXXXXXX" style={{ maxWidth: "200px" }} />
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
                      <div className="db-profile-row"><span className="db-profile-row-label">First Name</span><span className="db-profile-row-value">{user.firstName}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Last Name</span><span className="db-profile-row-value">{user.lastName}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Phone</span><span className="db-profile-row-value">{user.phone || "Not set"}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Email</span><span className="db-profile-row-value">{user.email}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Role</span><span className="db-profile-row-value">{user.role}</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Plan</span><span className="db-profile-row-value">{activePlan.name} (read‑only)</span></div>
                      <div className="db-profile-row"><span className="db-profile-row-label">Member Since</span><span className="db-profile-row-value">{new Date(user.createdAt).toLocaleDateString("en-NG", { year:"numeric", month:"long", day:"numeric" })}</span></div>
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingProperty) && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowAddModal(false); setEditingProperty(null); resetForm(); } }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProperty ? "Edit Property" : "Add New Property"}</h2>
              <button className="modal-close" onClick={() => { setShowAddModal(false); setEditingProperty(null); resetForm(); }}><X size={24} /></button>
            </div>
            <div className="form-group"><label className="form-label">Property Name *</label><input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Luxury Duplex in Lekki" /></div>
            <div className="form-group"><label className="form-label">Location *</label><input className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Lekki Phase 1, Lagos" /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Price *</label><input className="form-input" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="150000000" /></div>
              <div className="form-group"><label className="form-label">Price Label *</label><input className="form-input" value={formData.priceLabel} onChange={e => setFormData({...formData, priceLabel: e.target.value})} placeholder="₦150,000,000" /></div>
            </div>
            <div className="form-group"><label className="form-label">Property Type *</label><input className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. Duplex, Land, Apartment" /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Beds</label><input className="form-input" type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} placeholder="3" /></div>
              <div className="form-group"><label className="form-label">Baths</label><input className="form-input" type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} placeholder="2" /></div>
            </div>
            <div className="form-group"><label className="form-label">Size</label><input className="form-input" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="e.g. 250 sqm, 1 Acre" /></div>
            <div className="form-group">
              <label className="form-label">Property Image *</label>
              {formData.image && (
                <div style={{ position: "relative", marginBottom: "8px", borderRadius: "8px", overflow: "hidden", height: "120px", border: "1px solid #E2E8F0" }}>
                  <img src={formData.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => setFormData({...formData, image: ""})} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(15,23,42,0.8)", border: "none", color: "#fff", borderRadius: "50%", padding: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} /></button>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="realtor-file-upload"
                  style={{ display: "none" }} 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadLoading(true);
                    try {
                      const url = await uploadToCloudinary(file);
                      setFormData(prev => ({ ...prev, image: url }));
                    } catch (err) {
                      alert(err.message + ". Using demo fallback image.");
                      setFormData(prev => ({ ...prev, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" }));
                    } finally {
                      setUploadLoading(false);
                    }
                  }} 
                />
                <label 
                  htmlFor="realtor-file-upload" 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    padding: "10px 16px", 
                    borderRadius: "10px", 
                    border: "1.5px dashed #D4A017", 
                    color: "#D4A017", 
                    fontWeight: 600, 
                    fontSize: "13px", 
                    cursor: "pointer", 
                    background: "rgba(212,160,23,0.05)",
                    flexShrink: 0
                  }}
                >
                  {uploadLoading ? "Uploading..." : "Upload Image"}
                </label>
                <input 
                  className="form-input" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="Or paste image URL" 
                />
              </div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your property..." /></div>
            <div className="form-group"><label className="form-label">Features (comma separated)</label><input className="form-input" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="Gated estate, 24/7 security, Swimming pool" /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="08168426592" /></div>
            <button className="form-submit" onClick={editingProperty ? handleEditProperty : handleAddProperty}>
              {editingProperty ? "Update Property" : "Add Property"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}