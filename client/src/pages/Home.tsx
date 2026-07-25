import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getFeaturedListings } from "../api/listings";
import type { Listing } from "../api/listings";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getFeaturedListings()
      .then((data) => {
        if (isMounted) setListings(data);
      })
      .catch(() => {
        if (isMounted) setError("Couldn't load featured listings right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (listings.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % listings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [listings.length]);

  const current = listings[activeSlide];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg mb-24 md:mb-0">
        <section className="mb-lg">
          <div className="bg-surface-container-high p-lg rounded-xl border border-outline-variant">
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-xs text-primary">
              Specialized Market Intelligence
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-md">
              Real-time spice market data and analytics.
            </p>
            <Link
              to="/insights"
              className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
            >
              View Market Insights
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        <section className="mb-lg">
          <div className="relative overflow-hidden border border-outline-variant rounded-lg h-[400px] lg:h-[500px] bg-surface-container-high">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary">
                Loading featured listings...
              </div>
            )}

            {!loading && error && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary text-body-sm">
                {error}
              </div>
            )}

            {!loading && !error && listings.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary text-body-sm">
                No featured listings yet.
              </div>
            )}

            {!loading && !error && current && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url('${current.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-md md:p-lg text-white w-full max-w-2xl">
                  {current.grade && (
                    <span className="bg-primary text-on-primary px-2 py-1 text-label-caps rounded mb-2 inline-block">
                      {current.grade}
                    </span>
                  )}
                  <h3 className="text-headline-lg-mobile md:text-headline-lg mb-2">{current.title}</h3>
                  <p className="text-body-lg opacity-90">{current.description}</p>
                </div>

                {listings.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {listings.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className="w-2 h-2 rounded-full bg-white transition-opacity"
                        style={{ opacity: i === activeSlide ? 1 : 0.4 }}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}