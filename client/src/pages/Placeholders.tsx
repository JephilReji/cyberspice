import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-headline-lg text-secondary">{title} — coming soon</h1>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export function Buy() {
  return <PlaceholderPage title="Buy" />;
}

export function Sell() {
  return <PlaceholderPage title="Sell" />;
}

export function Insights() {
  return <PlaceholderPage title="Insights" />;
}