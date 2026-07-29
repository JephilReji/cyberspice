import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getAllListings } from "../api/listings";
import type { Listing } from "../api/listings";
import { resolveImageUrl } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Buy() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    getAllListings()
      .then((data) => {
        if (isMounted) setListings(data);
      })
      .catch(() => {
        if (isMounted) setError("Couldn't load listings right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg mb-24 md:mb-0">
        <header className="mb-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-2">
            Spice Market 
          </h1>
          <p className="text-body-lg text-secondary">
            Source the world's finest spices directly from origin. Certified organic and bulk options available.
          </p>
        </header>

        {loading && <p className="text-secondary text-body-sm">Loading listings...</p>}
        {!loading && error && <p className="text-error text-body-sm">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="text-secondary text-body-sm">No listings yet — be the first to sell on CyberSpice.</p>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {listings.map((listing) => {
              const coverUrl = resolveImageUrl(listing.images?.cover);
              return (
                <div
                  key={listing._id}
                  className="group bg-surface-container-lowest border border-outline-variant hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-surface-variant">
                    <div className="absolute top-sm left-sm z-10 bg-primary text-on-primary px-3 py-1 text-label-caps font-label-caps rounded-sm">
                      {listing.grade}
                    </div>
                    {coverUrl ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={coverUrl}
                        alt={listing.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-sm flex flex-col space-y-sm">
                    <div>
                      <div className="text-body-sm font-body-sm text-secondary mb-1">ID: {listing.sku}</div>
                      <h3 className="text-headline-md font-headline-md text-on-surface">{listing.title}</h3>
                    </div>
                    <div className="flex justify-between items-center py-2 border-y border-outline-variant">
                      <div className="flex flex-col">
                        <span className="text-label-caps font-label-caps text-secondary">HARVEST</span>
                        <span className="text-body-sm font-body-sm font-medium">{listing.harvestDate}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-label-caps font-label-caps text-secondary">PRICE</span>
                        <span className="text-headline-md font-headline-md text-primary">
                          ₹{listing.pricePerUnit.toLocaleString("en-IN")}
                          <span className="text-body-sm font-body-sm text-secondary">/{listing.unit}</span>
                        </span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/listing/${listing._id}`)}
                      className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
                        Check Item 
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}