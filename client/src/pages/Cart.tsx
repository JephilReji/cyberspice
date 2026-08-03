import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../api/client";

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-md">
          <span className="material-symbols-outlined text-6xl text-outline">shopping_cart</span>
          <p className="text-body-lg text-secondary">Sign in to view your cart.</p>
          <Link to="/login" className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:opacity-90">
            Sign In
          </Link>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-lg gap-sm">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</span>
            <span className="text-label-caps uppercase">Cart</span>
          </div>
          <div className="h-px w-8 bg-outline-variant" />
          <div className="flex items-center gap-2 text-secondary opacity-50">
            <span className="w-6 h-6 rounded-full border-2 border-outline flex items-center justify-center text-[10px]">2</span>
            <span className="text-label-caps uppercase">Checkout</span>
          </div>
          <div className="h-px w-8 bg-outline-variant" />
          <div className="flex items-center gap-2 text-secondary opacity-50">
            <span className="w-6 h-6 rounded-full border-2 border-outline flex items-center justify-center text-[10px]">3</span>
            <span className="text-label-caps uppercase">Payment</span>
          </div>
        </div>

        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-lg">Your Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-6xl text-outline mb-md">shopping_cart</span>
            <h2 className="text-headline-md font-headline-md mb-xs">Your cart is empty</h2>
            <p className="text-body-lg text-secondary mb-lg max-w-sm">
              Browse the marketplace and add spices to your cart.
            </p>
            <Link to="/buy" className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:opacity-90 transition-opacity inline-flex items-center gap-xs">
              Browse Marketplace
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-md">
              {items.map((item) => {
                const imageUrl = resolveImageUrl(item.imageUrl);
                return (
                  <div key={item.listingId} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex gap-md items-start">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className="text-label-md font-bold text-on-surface">{item.title}</h3>
                        <button
                          onClick={() => removeItem(item.listingId)}
                          className="text-secondary hover:text-error transition-colors ml-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                      <p className="text-body-sm text-secondary mb-sm">
                        Packaging: {item.packaging}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-sm">
                        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.listingId, Math.max(1, item.quantity - 10))}
                            className="px-sm py-xs hover:bg-surface-container-low transition-colors text-secondary"
                          >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <span className="px-md py-xs font-bold text-on-surface border-x border-outline-variant min-w-[60px] text-center">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.listingId, item.quantity + 10)}
                            className="px-sm py-xs hover:bg-surface-container-low transition-colors text-secondary"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-body-sm text-secondary">₹{item.pricePerUnit.toLocaleString("en-IN")}/{item.unit}</p>
                          <p className="font-bold text-primary text-body-lg">
                            ₹{item.subtotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md sticky top-24">
              <h2 className="text-headline-md font-headline-md mb-md">Order Summary</h2>
              <div className="space-y-sm pb-md border-b border-outline-variant">
                {items.map((item) => (
                  <div key={item.listingId} className="flex justify-between text-body-sm">
                    <span className="text-secondary truncate max-w-[60%]">{item.title} ×{item.quantity}{item.unit}</span>
                    <span>₹{item.subtotal.toLocaleString("en-IN")}</span>
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
                onClick={() => navigate("/checkout")}
                className="w-full h-12 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-xs"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-[11px] text-secondary mt-sm text-center">
                By proceeding, you agree to CyberSpice Terms of Bulk Trade.
              </p>
              <div className="mt-md flex items-center justify-center gap-md text-outline">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
