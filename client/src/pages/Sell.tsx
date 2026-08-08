import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { createListing } from "../api/listings";

const categories = [
  { value: "black-pepper", label: "Black Pepper (Whole/Ground)" },
  { value: "cardamom", label: "Cardamom (Green/Black)" },
  { value: "cinnamon", label: "Cinnamon (Ceylon/Cassia)" },
  { value: "cloves", label: "Cloves (Handpicked)" },
  { value: "turmeric", label: "Turmeric (High Curcumin)" },
  { value: "ginger", label: "Ginger (Dried/Fresh)" },
  { value: "saffron", label: "Saffron (Threads)" },
  { value: "chilies", label: "Chilies (Dried)" },
];

const packagingOptions = ["Vacuum Sealed Bags", "Gunny Sacks (Bulk)", "Retail Glass Jars"];

type ImageSlot = "cover" | "macro" | "packaging" | "certification";

const imageSlots: { key: ImageSlot; label: string }[] = [
  { key: "cover", label: "Cover Photo" },
  { key: "macro", label: "Macro Shot" },
  { key: "packaging", label: "Packaging" },
  { key: "certification", label: "Certification" },
];

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<Record<ImageSlot, File | null>>({
    cover: null,
    macro: null,
    packaging: null,
    certification: null,
  });
  const [title, setTitle] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [unit, setUnit] = useState<"Kg" | "Gm">("Kg");
  const [totalAvailable, setTotalAvailable] = useState("");
  const [maxPurchaseLimit, setMaxPurchaseLimit] = useState("");
  const [packagingType, setPackagingType] = useState(packagingOptions[0]);
  const [description, setDescription] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="text-body-lg text-secondary">You need to be logged in to sell on CyberSpice.</p>
          <Link to="/login" className="bg-primary text-white h-12 px-8 rounded-md font-label-md flex items-center">
            Log In
          </Link>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  function handleImageChange(slot: ImageSlot, file: File | null) {
    setImages((prev) => ({ ...prev, [slot]: file }));
  }

  async function handleSubmit() {
    setError(null);

    if (!title || !pricePerUnit || !totalAvailable || !description || !harvestDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createListing({
        title,
        category,
        description,
        harvestDate,
        pricePerUnit,
        unit,
        totalAvailable,
        maxPurchaseLimit: maxPurchaseLimit || undefined,
        packagingType,
        cover: images.cover,
        macro: images.macro,
        packaging: images.packaging,
        certification: images.certification,
      });

      setSuccessMessage("Product listed successfully on CyberSpice!");
      setTimeout(() => navigate("/buy"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not list your product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = ["Category", "Images", "Details"];

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-10">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-2">
            List Your Spices
          </h1>
          <p className="text-body-lg text-secondary">Follow the steps below to put your harvest on the global market.</p>
        </header>

        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < step;
            const isActive = stepNum === step;
            return (
              <div key={label} className="z-10 flex flex-col items-center gap-2">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm " +
                    (isDone
                      ? "bg-primary-container text-white"
                      : isActive
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-secondary border border-outline-variant")
                  }
                >
                  {isDone ? <span className="material-symbols-outlined text-sm">check</span> : stepNum}
                </div>
                <span className={"text-label-md font-label-md " + (isDone || isActive ? "text-primary" : "text-secondary")}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 text-body-sm text-error bg-error-container rounded-lg px-4 py-3">{error}</div>
        )}

        {step === 1 && (
          <section className="space-y-6">
            <div className="bg-white border border-outline-variant p-6 rounded-lg">
              <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="spice-category">
                Select Spice Category
              </label>
              <div className="relative">
                <select
                  id="spice-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 bg-white border border-outline-variant rounded-lg px-4 appearance-none text-on-surface text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option disabled value="">
                    Choose a category...
                  </option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  expand_more
                </span>
              </div>
              <p className="mt-4 text-body-sm text-secondary">
                Choose the category that best matches your product. You can refine details in the next step.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                disabled={!category}
                onClick={() => setStep(2)}
                className="bg-primary text-white h-12 px-8 rounded-md font-label-md hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-40"
              >
                Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <div className="bg-white border border-outline-variant p-6 rounded-lg">
              <h2 className="text-headline-md font-headline-md mb-4">Product Visuals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {imageSlots.map((slot) => (
                  <label
                    key={slot.key}
                    className="aspect-square border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center p-4 text-center hover:border-primary transition-colors cursor-pointer group bg-surface-container-lowest overflow-hidden relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(slot.key, e.target.files?.[0] ?? null)}
                    />
                    {images[slot.key] ? (
                      <img
                        src={URL.createObjectURL(images[slot.key] as File)}
                        alt={slot.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-outline group-hover:text-primary mb-2">
                          add_a_photo
                        </span>
                        <span className="text-label-md font-label-md text-secondary group-hover:text-primary">
                          {slot.label}
                        </span>
                      </>
                    )}
                  </label>
                ))}
              </div>
              <div className="p-4 bg-primary-container/10 border-l-4 border-primary rounded-r-lg">
                <p className="text-body-sm text-primary">
                  <strong>Pro Tip:</strong> High-resolution photos from at least 3 angles increase seller trust score
                  by up to 40%.
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-secondary border border-outline-variant h-12 px-8 rounded-md font-label-md hover:bg-surface-container-low transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-primary text-white h-12 px-8 rounded-md font-label-md hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div className="bg-white border border-outline-variant p-6 rounded-lg space-y-6">
              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-2">Product Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Malabar Black Pepper"
                  className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-md px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Price per Unit (₹) <span className="text-error">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-md px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as "Kg" | "Gm")}
                      className="h-12 bg-surface-container-low border border-outline-variant rounded-md px-2 outline-none focus:border-primary transition-all"
                    >
                      <option value="Kg">/Kg</option>
                      <option value="Gm">/Gm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">
                    Total Available ({unit}) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={totalAvailable}
                    onChange={(e) => setTotalAvailable(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-md px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">
                    Max Purchase Limit ({unit}) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={maxPurchaseLimit}
                    onChange={(e) => setMaxPurchaseLimit(e.target.value)}
                    placeholder="Optional"
                    className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-md px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Packaging Type</label>
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-md px-4 outline-none focus:border-primary transition-all"
                  >
                    {packagingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Harvest Date <span className="text-error">*</span></label>
                  <div className="flex gap-2">
                    <select
                      value={harvestDate.split(" ")[0] ?? ""}
                      onChange={(e) => {
                        const parts = harvestDate.split(" ");
                        setHarvestDate(`${e.target.value} ${parts[1] ?? ""}`);
                      }}
                      className="flex-1 h-12 bg-surface-container-low border border-outline-variant rounded-md px-2 outline-none focus:border-primary transition-all"
                    >
                      <option value="" disabled>Month</option>
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={harvestDate.split(" ")[1] ?? ""}
                      onChange={(e) => {
                        const parts = harvestDate.split(" ");
                        setHarvestDate(`${parts[0] ?? ""} ${e.target.value}`);
                      }}
                      className="flex-1 h-12 bg-surface-container-low border border-outline-variant rounded-md px-2 outline-none focus:border-primary transition-all"
                    >
                      <option value="" disabled>Year</option>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-2">Detailed Description <span className="text-error">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention harvest region, drying method, and moisture content..."
                  rows={4}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-md p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-secondary border border-outline-variant h-12 px-8 rounded-md font-label-md hover:bg-surface-container-low transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary text-white h-12 px-12 rounded-md font-label-md hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? "Listing..." : "List Product"}
                <span className="material-symbols-outlined">publish</span>
              </button>
            </div>
          </section>
        )}

        {successMessage && (
          <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-label-md">{successMessage}</span>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
