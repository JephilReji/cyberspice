import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();

  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { fullName, address, city, state, pincode, phone } = form;
    if (!fullName || !address || !city || !state || !pincode || !phone) {
      setError("Please fill in all required fields.");
      return;
    }
    // Pass delivery address to payment page via navigation state
    navigate("/payment", { state: { deliveryAddress: form } });
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-lg gap-sm">
          <div className="flex items-center gap-2 text-primary">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
              <span className="material-symbols-outlined text-[12px]">check</span>
            </span>
            <span className="text-label-caps uppercase font-bold">Cart</span>
          </div>
          <div className="h-px w-8 bg-primary" />
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">2</span>
            <span className="text-label-caps uppercase">Checkout</span>
          </div>
          <div className="h-px w-8 bg-outline-variant" />
          <div className="flex items-center gap-2 text-secondary opacity-50">
            <span className="w-6 h-6 rounded-full border-2 border-outline flex items-center justify-center text-[10px]">3</span>
            <span className="text-label-caps uppercase">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-start">
          {/* Left: Delivery Address */}
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-md">Confirm Details</h1>

            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-md border-b border-outline-variant flex items-center gap-sm bg-surface-container-low">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h2 className="text-headline-md font-headline-md">Delivery Destination</h2>
              </div>
              <div className="p-md">
                {error && (
                  <div className="text-error bg-error-container text-body-sm rounded-lg px-sm py-xs mb-md">
                    {error}
                  </div>
                )}
                <form id="delivery-form" onSubmit={handleSubmit} className="space-y-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block text-label-md font-label-md text-on-surface mb-1">Full Name *</label>
                      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe"
                        className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md text-on-surface mb-1">Company Name</label>
                      <input name="company" value={form.company} onChange={handleChange} placeholder="Trading Co. (optional)"
                        className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface mb-1">Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Warehouse / Office Address"
                      className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
                    <div>
                      <label className="block text-label-md font-label-md text-on-surface mb-1">City *</label>
                      <input name="city" value={form.city} onChange={handleChange} placeholder="Kochi"
                        className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md text-on-surface mb-1">State *</label>
                      <input name="state" value={form.state} onChange={handleChange} placeholder="Kerala"
                        className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md text-on-surface mb-1">Pincode *</label>
                      <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="682001"
                        className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface mb-1">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                      className="w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm" />
                  </div>
                </form>

                <div className="mt-md bg-primary/10 border border-primary/20 p-sm rounded-lg flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <div>
                    <p className="text-primary font-bold text-label-md">Estimated Delivery</p>
                    <p className="text-on-surface-variant text-body-sm">3–5 business days via Freight Cargo</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-md">Summary</h1>
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <h3 className="text-headline-md font-headline-md mb-md">Order Summary</h3>
              <div className="space-y-sm pb-md border-b border-outline-variant">
                {items.map((item) => (
                  <div key={item.listingId} className="flex justify-between items-start">
                    <div>
                      <p className="text-body-sm font-medium text-on-surface">{item.title}</p>
                      <p className="text-body-sm text-secondary">Qty: {item.quantity} {item.unit}</p>
                    </div>
                    <p className="font-bold text-body-sm">₹{item.subtotal.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
              <div className="py-md space-y-xs border-b border-outline-variant">
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">Shipping (Freight)</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">GST (5% Agricultural)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="py-md flex justify-between items-end mb-md">
                <span className="text-headline-md font-bold">Grand Total</span>
                <span className="text-headline-md font-bold text-primary">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="submit"
                form="delivery-form"
                className="w-full h-12 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-xs group"
              >
                Proceed to Payment
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <p className="text-[11px] text-secondary mt-sm text-center">
                By clicking, you agree to CyberSpice Terms of Bulk Trade &amp; Supply Logistics.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
