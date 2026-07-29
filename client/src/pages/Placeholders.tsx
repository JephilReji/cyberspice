import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export function Insights() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-headline-lg text-secondary">Insights — coming soon</h1>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
