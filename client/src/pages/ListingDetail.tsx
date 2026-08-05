import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getListingById } from "../api/listings";
import type { Listing } from "../api/listings";
import { resolveImageUrl } from "../api/client";
import { useCart } from "../context/CartContext";

// Static quality metrics per category — cosmetic for demo
const qualityMetrics: Record<string, { label: string; value: string }[]> = {
  "black-pepper": [
    { label: "Piperine Content", value: "5.8% min" },
    { label: "Moisture", value: "11.5% max" },
    { label: "Volatile Oil", value: "3.2 ml/100g" },
  ],
  cardamom: [
    { label: "Volatile Oil", value: "8% min" },
    { label: "Moisture", value: "12% max" },
    { label: "Total Ash", value: "9% max" },
  ],
  saffron: [
    { label: "Crocin (Color)", value: "190+ absorbance" },
    { label: "Moisture", value: "12% max" },
    { label: "Safranal (Aroma)", value: "20–50 absorbance" },
  ],
  turmeric: [
    { label: "Curcumin Content", value: "3.5% min" },
    { label: "Moisture", value: "10% max" },
    { label: "Total Ash", value: "8% max" },
  ],
  cinnamon: [
    { label: "Volatile Oil", value: "1.5% min" },
    { label: "Moisture", value: "13% max" },
    { label: "Total Ash", value: "5% max" },
  ],
  default: [
    { label: "Moisture", value: "12% max" },
    { label: "Total Ash", value: "9% max" },
    { label: "Purity", value: "98% min" },
  ],
};


export default function ListingDetail() {
  const { addItem } = useCart();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [selectedPackaging] = useState("jute");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    getListingById(id)
      .then(setListing)
      .catch(() => setError("Could not load this listing."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-secondary">
          Loading...
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-error">
          {error || "Listing not found."}
        </main>
      </div>
    );
  }

  const metrics = qualityMetrics[listing.category] ?? qualityMetrics["default"];
  const estimatedTotal = (quantity * listing.pricePerUnit).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Build image array from available images, filter out undefined
  const images = [
    listing.images?.cover,
    listing.images?.macro,
    listing.images?.packaging,
    listing.images?.certification,
  ].filter(Boolean) as string[];

  const activeImageUrl = resolveImageUrl(images[activeImage] ?? images[0]);

  // Initials from title for supplier avatar
  const initials = listing.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

    

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">

          {/* Left: Image Gallery */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col space-y-sm">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant bg-surface-container-lowest relative group">
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded text-label-caps uppercase tracking-widest">
                {listing.grade}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-sm overflow-x-auto py-2">
                {images.map((img, i) => {
                  const url = resolveImageUrl(img);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImage ? "border-primary" : "border-outline-variant"
                      }`}
                    >
                      {url ? (
                        <img src={url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline text-sm">image</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="text-body-lg text-on-surface-variant pt-2 border-t border-outline-variant">
              {listing.description}
            </p>
          </div>

          {/* Right: Details & Order */}
          <div className="md:col-span-5 lg:col-span-5 space-y-sm">
            <div className="flex items-center space-x-2 text-secondary mb-2">
              {listing.origin && (
                <>
                  <span className="text-label-caps uppercase">Origin: {listing.origin}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full inline-block" />
                </>
              )}
              <span className="text-label-caps uppercase">Harvested: {listing.harvestDate}</span>
            </div>

            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary">
              {listing.title}
            </h1>

            {/* Quality Analysis */}
            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
              <h3 className="text-label-md font-bold text-primary mb-2">Quality Analysis</h3>
              <ul className="space-y-2 text-body-sm text-on-surface-variant">
                {metrics.map((m, i) => (
                  <li
                    key={m.label}
                    className={`flex justify-between ${i < metrics.length - 1 ? "border-b border-outline-variant pb-1" : ""}`}
                  >
                    <span>{m.label}</span>
                    <span className="font-bold text-on-surface">{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-outline-variant" />

            {/* Quantity Input */}
        <div className="space-y-2">
        <label className="block text-label-md font-label-md text-on-surface">
        Quantity ({listing.unit === "Gm" ? "Grams" : "Kilograms"})
        </label>
        <div className="flex items-center gap-sm">
        <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 10))}
        className="w-11 h-11 rounded-lg border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary transition-all flex items-center justify-center text-on-surface"
        >
        <span className="material-symbols-outlined">remove</span>
        </button>
        <input
          type="number"
          min={1}
          max={listing.maxPurchaseLimit ?? listing.totalAvailable}
          value={quantity}
          onChange={(e) => {
          const val = Number(e.target.value);
          const max = listing.maxPurchaseLimit ?? listing.totalAvailable;
          if (val >= 1 && val <= max) setQuantity(val);
          }}
          className="w-28 h-11 text-center font-bold text-primary text-body-lg border border-outline-variant rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(listing.maxPurchaseLimit ?? listing.totalAvailable, q + 10))}
          className="w-11 h-11 rounded-lg border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary transition-all flex items-center justify-center text-on-surface"
          >
              <span className="material-symbols-outlined">add</span>
            </button>
            <span className="text-label-md text-secondary">{listing.unit}</span>
          </div>
          <p className="text-[11px] text-secondary">
            Available: {listing.totalAvailable} {listing.unit}
            {listing.maxPurchaseLimit ? ` · Max order: ${listing.maxPurchaseLimit} ${listing.unit}` : ""}
          </p>
        </div>

            {/* Supplier Profile */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-label-md font-bold text-primary mb-4">Supplier Profile</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded flex items-center justify-center font-bold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">Verified Supplier</p>
                  <p className="text-body-sm text-secondary">Verified Member since 2023</p>
                  <div className="flex items-center mt-1 text-primary">
                    {[1, 2, 3, 4].map((s) => (
                      <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                    <span className="ml-2 text-label-md">4.8 (124 ratings)</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Price & Checkout */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-md space-y-md">
              <div className="flex justify-between items-end">
                <span className="text-body-lg text-on-surface-variant">Estimated Total</span>
                <div className="text-right">
                  <span className="text-body-sm text-secondary line-through block">
                    ₹{listing.pricePerUnit.toLocaleString("en-IN")}/{listing.unit}
                  </span>
                  <span className="text-headline-lg font-bold text-primary">
                    ₹{estimatedTotal}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/checkout/${listing._id}?qty=${quantity}&packaging=${selectedPackaging}`)}
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-body-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-body-sm text-secondary">
                Ships from Cochin Port in 3-5 business days.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-xs pt-4">
              {[
                { icon: "verified", label: "Organic Cert" },
                { icon: "potted_plant", label: "Traceable" },
                { icon: "local_shipping", label: "Bulk Ready" },
              ].map((badge) => (
                <div key={badge.label} className="text-center p-2">
                  <span
                    className="material-symbols-outlined text-primary mb-1 block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {badge.icon}
                  </span>
                  <span className="block text-label-caps text-secondary uppercase">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}