import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getFeaturedListings } from "../api/listings";
import type { Listing } from "../api/listings";
import { resolveImageUrl, apiClient } from "../api/client";
import type { NewsArticle } from "./NewsArticle";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const categoryKeywords: Record<string, string> = {
  business: "spice,trade,market",
  food: "spices,agriculture,food",
  default: "spices,agriculture,farming",
};

function unsplashUrl(keywords: string) {
  return `https://source.unsplash.com/800x400/?${keywords}`;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getFeaturedListings()
      .then((data) => { if (isMounted) setListings(data); })
      .catch(() => { if (isMounted) setError("Couldn't load featured listings."); })
      .finally(() => { if (isMounted) setLoading(false); });

    apiClient.get("/insights/news")
      .then((res) => { if (isMounted) setNews(res.data.slice(0, 3)); })
      .catch(() => {})
      .finally(() => { if (isMounted) setNewsLoading(false); });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (listings.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % listings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [listings.length, activeSlide]);

  const goToPrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + listings.length) % listings.length);
  }, [listings.length]);

  const goToNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % listings.length);
  }, [listings.length]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg mb-24 md:mb-0">

        {/* Hero Banner */}
        <section className="mb-lg">
          <div className="relative bg-primary rounded-xl p-lg md:p-xl overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "url('https://source.unsplash.com/1200x400/?spices,market')", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-xs bg-on-primary/20 text-on-primary px-sm py-1 rounded-full text-label-caps mb-md">
                <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse inline-block" />
                LIVE MARKETPLACE
              </span>
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-primary mb-xs">
                Specialized Market Intelligence
              </h1>
              <p className="text-body-lg text-on-primary/80 mb-lg max-w-xl">
                Real-time spice market data and analytics. Source bulk commodities directly from verified producers.
              </p>
              <div className="flex flex-wrap gap-sm">
                <Link
                  to="/insights"
                  className="bg-on-primary text-primary px-lg py-md rounded-lg font-label-md hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  View Market Insights
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link
                  to="/buy"
                  className="border border-on-primary text-on-primary px-lg py-md rounded-lg font-label-md hover:bg-on-primary/10 transition-all inline-flex items-center gap-2"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Strip */}
        <section className="mb-lg grid grid-cols-2 md:grid-cols-4 gap-sm">
          {[
            { icon: "storefront", label: "Active Listings", value: "6+" },
            { icon: "public", label: "Origins", value: "4 Countries" },
            { icon: "verified", label: "Verified Sellers", value: "100%" },
            { icon: "local_shipping", label: "Export Ready", value: "All Listings" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {stat.icon}
              </span>
              <div>
                <div className="font-bold text-on-surface text-label-md">{stat.value}</div>
                <div className="text-secondary text-[11px]">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Listings Carousel */}
        <section className="mb-lg">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-headline-md font-headline-md">Featured Spices</h2>
            <Link to="/buy" className="text-label-md text-primary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-outline-variant h-[380px] lg:h-[480px] bg-surface-container">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary animate-pulse">
                Loading featured listings...
              </div>
            )}
            {!loading && error && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary text-body-sm">{error}</div>
            )}
            {!loading && !error && listings.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-secondary text-body-sm">
                No featured listings yet.
              </div>
            )}

            {!loading && !error && listings.length > 0 && (
              <>
                {listings.map((listing, i) => {
                  const isBroken = brokenImages.has(i);
                  const coverUrl = resolveImageUrl(listing.images?.cover);
                  return (
                    <div
                      key={listing._id}
                      className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                      style={{ opacity: i === activeSlide ? 1 : 0, pointerEvents: i === activeSlide ? "auto" : "none" }}
                    >
                      {isBroken || !coverUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-surface-container text-secondary">
                          <span className="material-symbols-outlined text-5xl">image</span>
                        </div>
                      ) : (
                        <>
                          <img
                            src={coverUrl}
                            alt={listing.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={() => setBrokenImages((prev) => new Set(prev).add(i))}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        </>
                      )}
                      <div className="absolute bottom-0 left-0 p-md md:p-lg text-white w-full">
                        <div className="flex items-end justify-between">
                          <div className="max-w-lg">
                            {listing.grade && (
                              <span className="bg-primary text-on-primary px-2 py-1 text-label-caps rounded mb-2 inline-block">
                                {listing.grade}
                              </span>
                            )}
                            <h3 className="text-headline-lg-mobile md:text-headline-lg mb-1">{listing.title}</h3>
                            <p className="text-body-lg opacity-80 line-clamp-2">{listing.description}</p>
                          </div>
                          <Link
                            to={`/listing/${listing._id}`}
                            className="hidden md:flex items-center gap-xs bg-white/20 backdrop-blur-sm border border-white/30 text-white px-md py-sm rounded-lg hover:bg-white/30 transition-all text-label-md flex-shrink-0 ml-md"
                          >
                            View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {listings.length > 1 && (
                  <>
                    <button onClick={goToPrev} aria-label="Previous"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={goToNext} aria-label="Next"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                      {listings.map((_, i) => (
                        <button key={i} onClick={() => setActiveSlide(i)}
                          className="w-2 h-2 rounded-full bg-white transition-opacity"
                          style={{ opacity: i === activeSlide ? 1 : 0.4 }} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Agriculture News Feed */}
        <section className="mb-lg">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h2 className="text-headline-md font-headline-md">Agriculture News Feed</h2>
              <p className="text-body-sm text-secondary">The latest intelligence from the field.</p>
            </div>
            <Link to="/insights" className="text-label-md text-primary hover:underline flex items-center gap-1 font-label-md">
              See All <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-surface-container-low border border-outline-variant animate-pulse rounded-lg" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-lg text-secondary border border-dashed border-outline-variant rounded-lg">
              <span className="material-symbols-outlined text-4xl mb-2 block">newspaper</span>
              News feed unavailable right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {news.map((article) => {
                const keyword = article.category?.[0] ?? "default";
                const imageUrl = unsplashUrl(categoryKeywords[keyword] ?? categoryKeywords.default);
                const encoded = encodeURIComponent(article.article_id);
                return (
                  <Link
                    key={article.article_id}
                    to={`/news/${encoded}`}
                    state={{ article }}
                    className="group bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all rounded-lg overflow-hidden block"
                  >
                    <div className="h-44 overflow-hidden bg-surface-container relative">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = unsplashUrl(categoryKeywords.default); }}
                      />
                      <div className="absolute top-2 left-2 bg-primary text-on-primary text-label-caps px-2 py-0.5 rounded text-[10px] uppercase">
                        {article.category?.[0] ?? "News"}
                      </div>
                    </div>
                    <div className="p-sm">
                      <p className="text-[11px] text-secondary mb-1 font-medium uppercase tracking-wide">
                        {timeAgo(article.pubDate)}
                      </p>
                      <h3 className="text-label-md font-bold text-on-surface line-clamp-2 mb-xs group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-body-sm text-secondary line-clamp-2 mb-sm">
                        {article.description ?? ""}
                      </p>
                      <span className="text-label-md font-label-md text-primary flex items-center gap-1">
                        Read detail <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center gap-md">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
            <div>
              <h3 className="font-bold text-on-surface mb-1">Have spices to sell?</h3>
              <p className="text-body-sm text-secondary mb-sm">List your harvest and reach global buyers.</p>
              <Link to="/sell" className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">
                Start Selling <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center gap-md">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            <div>
              <h3 className="font-bold text-on-surface mb-1">Track market trends</h3>
              <p className="text-body-sm text-secondary mb-sm">Real-time price data across all spice categories.</p>
              <Link to="/insights" className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">
                View Insights <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
