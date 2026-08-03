import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";
import { apiClient } from "../api/client";

type PaymentMethod = "upi" | "card" | "pod";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const deliveryAddress = location.state?.deliveryAddress;

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gst = Math.round(subtotal * 0.05);
  const handlingFee = method === "pod" ? 5 : 0;
  const grandTotal = subtotal + gst + handlingFee;

  if (!deliveryAddress || items.length === 0) {
    navigate("/cart");
    return null;
  }

  async function handlePayment() {
    setError(null);
    setProcessing(true);
    try {
      const orderItems = items.map((item) => ({
        listing: item.listingId,
        title: item.title,
        quantity: item.quantity,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit,
        subtotal: item.subtotal,
        imageUrl: item.imageUrl,
      }));

      const { data } = await apiClient.post("/orders", {
        items: orderItems,
        deliveryAddress,
        paymentMethod: method,
      });

      clearCart();
      navigate("/order-success", { state: { order: data } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-lg gap-sm">
          {[
            { label: "Cart", done: true },
            { label: "Checkout", done: true },
            { label: "Payment", active: true },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${step.done || step.active ? "bg-primary" : "bg-outline-variant"}`} />}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step.done ? "bg-primary text-white" : step.active ? "border-2 border-primary bg-surface" : "border-2 border-outline bg-surface opacity-50"}`}>
                  {step.done
                    ? <span className="material-symbols-outlined text-[16px]">check</span>
                    : step.active
                    ? <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    : i + 1}
                </div>
                <span className={`text-label-caps uppercase ${step.done || step.active ? "text-primary font-bold" : "text-secondary opacity-50"}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-8 space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-md border-b border-outline-variant">
                <h2 className="text-headline-md font-headline-md">Select Payment Method</h2>
              </div>
              <div className="p-md space-y-md">
                {/* UPI */}
                <label className={`flex items-start gap-md p-md border rounded-xl cursor-pointer transition-all ${method === "upi" ? "border-primary bg-surface-container-low" : "border-outline-variant hover:bg-surface-container-low"}`}>
                  <input type="radio" name="payment" value="upi" checked={method === "upi"} onChange={() => setMethod("upi")} className="mt-1 w-5 h-5 text-primary border-outline focus:ring-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                      <span className="font-bold text-on-surface">UPI / Net Banking</span>
                    </div>
                    <p className="text-body-sm text-secondary">Pay via UPI ID, BHIM, PhonePe, Google Pay, or Net Banking.</p>
                    {method === "upi" && (
                      <div className="mt-md">
                        <label className="block text-label-md font-label-md mb-1">UPI ID</label>
                        <input type="text" placeholder="yourname@upi" className="w-full h-11 px-sm bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                    )}
                  </div>
                </label>

                {/* Card */}
                <label className={`flex items-start gap-md p-md border rounded-xl cursor-pointer transition-all ${method === "card" ? "border-primary bg-surface-container-low" : "border-outline-variant hover:bg-surface-container-low"}`}>
                  <input type="radio" name="payment" value="card" checked={method === "card"} onChange={() => setMethod("card")} className="mt-1 w-5 h-5 text-primary border-outline focus:ring-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                      <span className="font-bold text-on-surface">Credit / Debit Card</span>
                    </div>
                    <p className="text-body-sm text-secondary">Visa, Mastercard, RuPay accepted. Secure 3D authentication.</p>
                    {method === "card" && (
                      <div className="mt-md space-y-sm">
                        <input type="text" placeholder="Card Number" maxLength={19} className="w-full h-11 px-sm bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        <div className="grid grid-cols-2 gap-sm">
                          <input type="text" placeholder="MM / YY" className="w-full h-11 px-sm bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                          <input type="text" placeholder="CVV" maxLength={3} className="w-full h-11 px-sm bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* POD */}
                <label className={`flex items-start gap-md p-md border rounded-xl cursor-pointer transition-all ${method === "pod" ? "border-primary bg-surface-container-low" : "border-outline-variant hover:bg-surface-container-low"}`}>
                  <input type="radio" name="payment" value="pod" checked={method === "pod"} onChange={() => setMethod("pod")} className="mt-1 w-5 h-5 text-primary border-outline focus:ring-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                        <span className="font-bold text-on-surface">Pay on Delivery</span>
                      </div>
                      <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px] font-bold uppercase">Recommended</span>
                    </div>
                    <p className="text-body-sm text-secondary">Cash or QR code payment at your doorstep.</p>
                    <p className="text-[12px] text-error mt-xs font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      Additional ₹5 handling fee applies
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-lg text-secondary py-md border border-outline-variant rounded-xl bg-surface-container-lowest">
              {[
                { icon: "shield", label: "256-bit SSL" },
                { icon: "verified_user", label: "PCI Compliant" },
                { icon: "lock", label: "Secure Payment" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                  <span className="text-[11px] text-secondary uppercase tracking-wide">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4 sticky top-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-md">
              <h3 className="text-headline-md font-headline-md">Order Summary</h3>
              <div className="space-y-xs text-body-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Delivery</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">GST (5%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                {method === "pod" && (
                  <div className="flex justify-between text-error">
                    <span>Handling Fee (POD)</span>
                    <span>₹5</span>
                  </div>
                )}
              </div>
              <div className="pt-md border-t border-outline-variant flex justify-between items-end mb-md">
                <span className="text-headline-md font-bold">Grand Total</span>
                <span className="text-headline-lg font-bold text-primary">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {error && (
                <p className="text-error text-body-sm bg-error-container rounded-lg px-sm py-xs">{error}</p>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-14 bg-primary text-on-primary rounded-lg font-bold text-body-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </>
                ) : method === "pod" ? (
                  <>Confirm Order <span className="material-symbols-outlined">arrow_forward</span></>
                ) : (
                  <>Pay Now <span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>
              <p className="text-center text-body-sm text-secondary leading-tight">
                By clicking, you agree to CyberSpice's terms and conditions.
              </p>

              {/* Spice image accent */}
              <div className="rounded-lg overflow-hidden border border-outline-variant">
                <img
                  src="https://source.unsplash.com/400x120/?spices,market"
                  alt="Spices"
                  className="w-full h-24 object-cover"
                />
                <div className="p-sm">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-tight">Bulk Order Benefit</p>
                  <p className="text-label-md text-on-surface-variant">Quality inspection report included for this shipment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
