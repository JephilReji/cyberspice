import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();

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
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-xs">
            My Orders
          </h1>
          <p className="text-body-lg text-secondary">
            Track your purchases and trade history.
          </p>
        </header>

        {/* Empty state — replaced with real orders after checkout is built */}
        <div className="flex flex-col items-center justify-center py-xl text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
          <span className="material-symbols-outlined text-6xl text-outline mb-md">
            shopping_bag
          </span>
          <h2 className="text-headline-md font-headline-md text-on-surface mb-xs">
            No orders yet
          </h2>
          <p className="text-body-lg text-secondary max-w-sm mb-lg">
            Once you place an order, it will appear here with full tracking and status updates.
          </p>
          <Link
            to="/buy"
            className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:opacity-90 transition-opacity inline-flex items-center gap-xs"
          >
            Browse Marketplace
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
