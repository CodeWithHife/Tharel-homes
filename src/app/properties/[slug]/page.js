import { getPropertyBySlug, getAllProperties } from "@/lib/storage";
import { MapPin, BedDouble, Bath, Maximize, Phone, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import AddToFavouritesButton from "@/components/AddToFavouritesButton";

export default function PropertyDetails({ params }) {
  const slug = decodeURIComponent(params.slug);

  // 1. Try to find by actual slug field
  let property = getPropertyBySlug(slug);

  // 2. Fallback: find by generating slug from name
  if (!property) {
    const allProperties = getAllProperties();
    property = allProperties.find((p) => {
      const generatedSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return generatedSlug === slug;
    });
  }

  // 3. Still nothing? 404
  if (!property) {
    console.warn(`❌ Property with slug "${slug}" not found.`);
    return notFound();
  }

  return (
    <main style={{ backgroundColor: "#F8FAFC", padding: "140px 20px 60px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Main Image */}
        <div style={{ position: "relative", width: "100%", height: "420px", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
          <img src={property.image} alt={property.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Gallery */}
        {property.gallery && property.gallery.length > 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {property.gallery.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: "relative", width: "100%", height: "100px", borderRadius: "8px", overflow: "hidden" }}>
                <img src={img} alt={`${property.name} ${i + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        <span style={{ backgroundColor: "#D4AF37", color: "#0F172A", padding: "5px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, display: "inline-block" }}>
          {property.type}
        </span>

        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "30px", fontWeight: 800, color: "#0F172A", margin: "14px 0 8px" }}>
          {property.name}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", marginBottom: "20px" }}>
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
          {property.beds && <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}><BedDouble size={18} /> {property.beds} Beds</div>}
          {property.baths && <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}><Bath size={18} /> {property.baths} Baths</div>}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}><Maximize size={18} /> {property.size}</div>
        </div>

        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "28px", fontWeight: 800, color: "#D4AF37", marginBottom: "24px" }}>
          {property.priceLabel}
        </div>

        <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: "28px" }}>{property.description}</p>

        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "14px" }}>Features</h2>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
          {property.features && property.features.map((feature, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", marginBottom: "8px" }}>
              <CheckCircle2 size={16} color="#D4AF37" />
              {feature}
            </li>
          ))}
        </ul>

        <div style={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: "10px" }}>Title & Payment</h3>
          <p style={{ marginBottom: "6px" }}><strong>Title:</strong> {property.title}</p>
          <p style={{ marginBottom: "6px" }}><strong>Deposit:</strong> {property.deposit}</p>
          <p><strong>Payment Plan:</strong> {property.paymentPlan}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <a
            href={"tel:" + property.phone}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#D4AF37", color: "#0F172A", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", transition: "background 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b8860c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D4AF37")}
          >
            <Phone size={18} />
            Call {property.phone}
          </a>
          <AddToFavouritesButton propertyId={property.id} />
        </div>
      </div>
    </main>
  );
}