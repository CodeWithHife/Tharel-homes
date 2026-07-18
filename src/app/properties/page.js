"use client";
import { useState, useEffect, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import { getAllProperties } from "@/lib/properties";
import { getAllHotels } from "@/lib/hotels";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function PropertiesPage() {
  const [allProperties, setAllProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(700000000);
  const [sortBy, setSortBy] = useState("featured");

  // ── Fetch live properties and hotels from backend ────────────────────────────
  useEffect(() => {
    Promise.all([
      getAllProperties().catch(() => []),
      getAllHotels().catch(() => [])
    ])
      .then(([props, hotels]) => {
        const normalizedHotels = hotels.map(h => ({
          _id: h._id,
          id: h._id,
          name: h.name,
          slug: h.slug || h.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          location: h.location,
          price: h.pricePerNight,
          priceLabel: h.pricePerNight ? `₦${Number(h.pricePerNight).toLocaleString()}/night` : "Price on request",
          type: h.roomType || "Hotel Room",
          beds: parseInt(h.capacity) || null,
          baths: null,
          size: h.reservationGoal || "",
          image: h.image,
          gallery: [h.image],
          description: h.description,
          features: h.amenities || [],
          phone: h.userId?.phone || "08168426592",
          isHotel: true
        }));
        setAllProperties([...props, ...normalizedHotels]);
      })
      .catch(() => setAllProperties([]))
      .finally(() => setLoadingProps(false));
  }, []);


  const locations = useMemo(() => {
    const states = allProperties.map((p) => {
      const parts = p.location.split(",");
      return parts[parts.length - 1].trim();
    });
    return ["All", ...new Set(states)];
  }, [allProperties]);

  const types = useMemo(() => {
    return ["All", ...new Set(allProperties.map((p) => p.type))];
  }, [allProperties]);

  const filtered = useMemo(() => {
    let list = allProperties.filter((p) => {
      const matchSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === "All" || p.location.includes(locationFilter);
      const matchType = typeFilter === "All" || p.type === typeFilter;
      const matchPrice = Number(p.price) <= maxPrice;
      return matchSearch && matchLocation && matchType && matchPrice;
    });

    if (sortBy === "price-low") {
      list = list.slice().sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      list = list.slice().sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      list = list.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [search, locationFilter, typeFilter, maxPrice, sortBy, allProperties]);

  const resetFilters = () => {
    setLocationFilter("All");
    setTypeFilter("All");
    setMaxPrice(700000000);
    setSearch("");
  };

  const FilterControls = () => (
    <>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
          Location
        </label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1.5px solid #E2E8F0",
            fontSize: "14px",
            outline: "none",
            background: "white",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
          Property Type
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1.5px solid #E2E8F0",
            fontSize: "14px",
            outline: "none",
            background: "white",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
          Max Price
        </label>
        <input
          type="range"
          min="1000000"
          max="700000000"
          step="1000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#D4A017" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "#94A3B8",
            marginTop: "6px",
          }}
        >
          <span>₦1M</span>
          <span style={{ fontWeight: 700, color: "#1A1A1A" }}>₦{(maxPrice / 1000000).toFixed(0)}M</span>
        </div>
      </div>

      <button
        onClick={resetFilters}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: "10px",
          border: "1.5px solid #CBD5E1",
          background: "transparent",
          color: "#1A1A1A",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Reset Filters
      </button>
    </>
  );

  return (
    <main
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: "140px 20px 60px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: "8px",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            Our Properties
          </h1>
          <p style={{ color: "#64748B", fontSize: "15px" }}>
            {filtered.length} {filtered.length === 1 ? "Property" : "Properties"} Available
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto 32px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by property name or location..."
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              borderRadius: "12px",
              border: "1.5px solid #E2E8F0",
              background: "white",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#D4A017";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(212,160,23,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
            }}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setFiltersOpen(true)}
          style={{
            display: "block",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            background: "#0F172A",
            color: "white",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            marginBottom: "24px",
          }}
          className="mobile-filter-btn"
        >
          <SlidersHorizontal size={16} style={{ marginRight: "8px" }} />
          Filters
        </button>

        {/* Main Layout: Sidebar + Grid */}
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* Sidebar - Desktop */}
          <aside
            style={{
              display: "block",
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              width: "280px",
              flexShrink: 0,
              position: "sticky",
              top: "160px",
              height: "fit-content",
              border: "1px solid #E2E8F0",
            }}
            className="desktop-sidebar"
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: "24px",
              }}
            >
              Filters
            </h3>
            <FilterControls />
          </aside>

          {/* Mobile Overlay */}
          {filtersOpen && (
            <div
              onClick={() => setFiltersOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 1050,
              }}
            />
          )}

          {/* Mobile Sidebar (slide-in) */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "85%",
              maxWidth: "320px",
              height: "100vh",
              background: "white",
              padding: "28px 24px",
              overflowY: "auto",
              zIndex: 1100,
              transform: filtersOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.35s ease",
              boxShadow: "0 4px 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={24} color="#0F172A" />
              </button>
            </div>
            <FilterControls />
          </div>

          {/* Property Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #E2E8F0",
                  background: "white",
                  fontSize: "14px",
                  outline: "none",
                  minWidth: "180px",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loadingProps ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ width: "40px", height: "40px", border: "4px solid #E2E8F0", borderTop: "4px solid #D4A017", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#94A3B8", marginTop: "16px", fontSize: "14px" }}>Loading properties...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <p style={{ color: "#64748B", fontSize: "16px" }}>
                  No properties match your filters. Try adjusting them.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // Always 3 columns
                  gap: "24px",
                }}
                className="property-grid"
              >
                {filtered.map((property) => (
                  <PropertyCard key={property._id || property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive CSS – override on smaller screens */}
      <style>{`
        .mobile-filter-btn {
          display: block;
        }
        .desktop-sidebar {
          display: none !important;
        }

        @media (min-width: 768px) {
          .mobile-filter-btn {
            display: none !important;
          }
          .desktop-sidebar {
            display: block !important;
          }
        }

        /* On small screens, switch to 2 columns, then 1 on very small */
        @media (max-width: 1024px) {
          .property-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .property-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}