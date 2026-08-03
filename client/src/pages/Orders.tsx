import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

interface Order {
  _id: string;
  orderNumber: string;
  items: { title: string; quantity: number; unit: string; subtotal: number }[];
  orderStatus: string;
  paymentMethod: string;
  grandTotal: number;
  estimatedDelivery: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-secondary-container text-on-secondary-container",
  confirmed: "bg-primary-container/30 text-primary",
  processing: "bg-surface-container-high text-on-surface",
  shipped: "bg-primary-fixed-dim text-primary",
  delivered: "bg-primary text-on-primary",
  cancelled: "bg-error-container text-error",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient.get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-md">
          <span className="material-symbols-outlined text-6xl text-outline">lock</span>
          <p className="text-body-lg text-secondary">Sign in to view your orders.</p>
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
        <header className="mb-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-xs">My Orders</h1>
          <p className="text-body-lg text-secondary">Track your purchases and trade history.</p>
        </header>

        {loading ? (
          <div className="space-y-md">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-container-low border border-outline-variant animate-pulse rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-6xl text-outline mb-md">shopping_bag</span>
            <h2 className="text-headline-md font-headline-md mb-xs">No orders yet</h2>
            <p className="text-body-lg text-secondary max-w-sm mb-lg">
              Once you place an order, it will appear here with full tracking and status updates.
            </p>
            <Link to="/buy" className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:opacity-90 transition-opacity inline-flex items-center gap-xs">
              Browse Marketplace
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-md">
            {orders.map((order) => (
              <div key={order._id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
                  <div>
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="font-bold text-on-surface">#{order.orderNumber}</h3>
                      <span className={`text-label-caps px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${statusColors[order.orderStatus] ?? statusColors.pending}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-body-sm text-secondary">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-headline-md font-bold text-primary">
                      ₹{order.grandTotal?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-body-sm text-secondary capitalize">{order.paymentMethod === "pod" ? "Pay on Delivery" : order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
                <div className="border-t border-outline-variant pt-md space-y-xs">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-body-sm">
                      <span className="text-on-surface">{item.title}</span>
                      <span className="text-secondary">{item.quantity} {item.unit} · ₹{item.subtotal?.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-md pt-md border-t border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-xs text-body-sm text-secondary">
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    Est. {order.estimatedDelivery}
                  </div>
                  <Link to="/buy" className="text-primary text-label-md font-label-md hover:underline flex items-center gap-1">
                    Buy Again <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
