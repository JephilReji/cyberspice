import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/dashboard");
      return;
    }
    // Confetti effect
    const colors = ["#173809", "#a9d293", "#2d4f1e", "#c5efad"];
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 50; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      document.body.appendChild(el);
      particles.push(el);

      const animation = el.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
        ],
        { duration: Math.random() * 2000 + 1500, easing: "cubic-bezier(0, .9, .57, 1)", fill: "forwards" }
      );
      animation.onfinish = () => el.remove();
    }

    return () => particles.forEach((p) => p.remove());
  }, [order, navigate]);

  if (!order) return null;

  const methodLabel: Record<string, string> = {
    upi: "UPI Payment",
    card: "Credit / Debit Card",
    pod: "Pay on Delivery",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center px-sm py-xl relative overflow-hidden">
        {/* Subtle background icons */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-md justify-center items-center">
          {["spa", "eco", "grain", "local_florist", "yard"].map((icon) => (
            <span key={icon} className="material-symbols-outlined text-[120px]">{icon}</span>
          ))}
        </div>

        <div className="w-full max-w-xl bg-surface-container-lowest border border-outline-variant p-md md:p-xl rounded-xl shadow-sm relative z-10 flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="w-24 h-24 bg-primary-fixed-dim rounded-full flex items-center justify-center mb-md">
            <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>

          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-xs">
            Payment Successful!
          </h1>
          <p className="text-body-lg text-secondary mb-lg">
            Your order{" "}
            <span className="font-bold text-on-surface">#{order.orderNumber}</span>{" "}
            has been placed successfully.
          </p>

          {/* Order Summary Card */}
          <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm md:p-md text-left mb-lg">
            <h2 className="text-label-caps font-label-caps text-secondary uppercase tracking-wider mb-sm">
              Order Summary
            </h2>
            <div className="space-y-sm">
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-body-sm text-secondary">Amount Paid</span>
                <span className="text-body-lg font-bold text-on-surface">
                  ₹{order.grandTotal?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-body-sm text-secondary">Payment Method</span>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {order.paymentMethod === "card" ? "credit_card" : order.paymentMethod === "upi" ? "account_balance" : "local_shipping"}
                  </span>
                  <span className="text-body-sm text-on-surface">{methodLabel[order.paymentMethod] ?? order.paymentMethod}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-body-sm text-secondary">Delivery To</span>
                <span className="text-body-sm text-on-surface font-medium text-right max-w-[60%]">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-secondary">Est. Delivery</span>
                <span className="text-body-sm text-on-surface font-medium">{order.estimatedDelivery ?? "3-5 Business Days"}</span>
              </div>
            </div>
          </div>

          {/* B2B Badge */}
          <div className="flex items-center gap-xs bg-primary-container text-on-primary-container px-sm py-xs rounded-full mb-lg">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-label-caps font-label-caps">Bulk Order Verified</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-sm w-full">
            <Link
              to="/orders"
              className="flex-1 h-12 bg-surface border border-outline text-secondary font-label-md rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-xs order-2 md:order-1"
            >
              <span className="material-symbols-outlined text-[20px]">list_alt</span>
              View Order Details
            </Link>
            <Link
              to="/buy"
              className="flex-1 h-12 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-xs order-1 md:order-2"
            >
              Continue Shopping
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
