import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getAllListings } from "../api/listings";
import type { Listing } from "../api/listings";
import { resolveImageUrl } from "../api/client";

export default function Buy() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchListings = useCallback((query?: string) => {
    setLoading(true);
    setError(null);
    getAllListings()
      .then(setListings)
      .catch(() => setError("Couldn't load listings right now."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    fetchListings(searchInput);
  }

  function handleClear() {
    setSearchInput("");
    setSearch("");
    fetchListings();
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg mb-24 md:mb-0">
        <header className="mb-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-2">
            Premium Marketplace
          </h1>
          <p className="text-body-lg text-secondary">
            Source the world's finest spices directly from origin. Certified organic and bulk options available.
          </p>
        </header>

        <form onSubmit={handleSearch} className="mb-lg flex gap-sm">
          <div className="flex-1 flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-sm gap-sm focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-secondary">search</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by spice name, origin, category..."
              className="flex-1 py-sm bg-transparent outline-none text-body-lg placeholder:text-outline"
            />
            {searchInput && (
              <button type="button" onClick={handleClear} className="text-secondary hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
          <button type="submit" className="bg-primary text-on-primary px-lg rounded-xl font-label-md hover:opacity-90 transition-all flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="hidden md:block">Search</span>
          </button>
        </form>

        {search && (
          <p className="text-body-sm text-secondary mb-md">
            {listings.length} result{listings.length !== 1 ? "s" : ""} for <span className="font-bold text-on-surface">"{search}"</span>
            <button onClick={handleClear} className="ml-sm text-primary hover:underline">Clear</button>
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-surface-container-low border border-outline-variant animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-xl text-secondary">
            <span className="material-symbols-outlined text-5xl block mb-2 text-outline">error</span>
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-xl border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-5xl block mb-2 text-outline">search_off</span>
            <p className="text-body-lg text-secondary">
              {search ? `No listings found for "${search}"` : "No listings yet."}
            </p>
            {search && (
              <button onClick={handleClear} className="mt-md text-primary font-label-md hover:underline">View all listings</button>
            )}
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {listings.map((listing) => {
              const coverUrl = resolveImageUrl(listing.images?.cover);
              return (
                <div key={listing._id} className="group bg-surface-container-lowest border border-outline-variant hover:shadow-md hover:border-primary transition-all duration-300 rounded-lg overflow-hidden">
                  <div className="relative w-full aspect-video overflow-hidden bg-surface-variant">
                    <div className="absolute top-sm left-sm z-10 bg-primary text-on-primary px-3 py-1 text-label-caps font-label-caps rounded-sm">
                      {listing.grade}
                    </div>
                    {coverUrl ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverUrl} alt={listing.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-5xl">grain</span>
                      </div>
                    )}
                  </div>
                  <div className="p-sm flex flex-col space-y-sm">
                    <div>
                      <div className="text-body-sm text-secondary mb-1">ID: {listing.sku}</div>
                      <h3 className="text-headline-md font-headline-md text-on-surface">{listing.title}</h3>
                      {listing.origin && (
                        <p className="text-body-sm text-secondary flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {listing.origin}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center py-2 border-y border-outline-variant">
                      <div className="flex flex-col">
                        <span className="text-label-caps font-label-caps text-secondary">HARVEST</span>
                        <span className="text-body-sm font-medium">{listing.harvestDate}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-label-caps font-label-caps text-secondary">PRICE</span>
                        <span className="text-headline-md font-headline-md text-primary">
                          ₹{listing.pricePerUnit.toLocaleString("en-IN")}
                          <span className="text-body-sm text-secondary">/{listing.unit}</span>
                        </span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/listing/${listing._id}`)} className="w-full h-12 bg-primary text-on-primary font-label-md hover:opacity-90 active:scale-95 transition-all rounded-lg">
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