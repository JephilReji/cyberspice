import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { apiClient, resolveImageUrl } from "../api/client";
import type { NewsArticle } from "./NewsArticle";

interface CategoryPrice {
  _id: string;
  avgPrice: number;
  totalVolume: number;
  listingCount: number;
  unit: string;
}

interface DemandListing {
  _id: string;
  title: string;
  category: string;
  grade: string;
  description: string;
  images: { cover?: string };
  pricePerUnit: number;
  unit: string;
  totalAvailable: number;
}

const categoryLabels: Record<string, string> = {
  "black-pepper": "PEPPER",
  cardamom: "CARDAMOM",
  cinnamon: "CINNAMON",
  turmeric: "TURMERIC",
  saffron: "SAFFRON",
  cloves: "CLOVES",
  ginger: "GINGER",
  chilies: "CHILIES",
};

const categoryFallback: Record<string, string> = {
  "black-pepper": "pepper,spice",
  cardamom: "cardamom,spice",
  cinnamon: "cinnamon,spice",
  turmeric: "turmeric,spice",
  saffron: "saffron,spice",
  chilies: "chili,pepper",
  default: "spices,agriculture",
};

function unsplashUrl(keywords: string) {
  return `https://source.unsplash.com/800x400/?${keywords}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
}

export default function Insights() {
  const [marketData, setMarketData] = useState<{
    pricesByCategory: CategoryPrice[];
    mostInDemand: DemandListing[];
  } | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );

    Promise.all([
      apiClient.get("/insights/market"),
      apiClient.get("/insights/news"),
    ])
      .then(([marketRes, newsRes]) => {
        setMarketData(marketRes.data);
        setNews(newsRes.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        <div className="mb-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-xs">
            Market Insights
          </h1>
          <p className="text-body-lg text-secondary max-w-2xl">
            Real-time agricultural commodity tracking for professional spice traders and bulk buyers.
          </p>
        </div>

        {/* Live Market Index */}
        <section className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-headline-md font-headline-md flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse inline-block" />
              Live Market Index
            </h2>
            <span className="text-label-caps font-label-caps text-secondary">
              UPDATED {lastUpdated}
            </span>
          </div>

          {loading ? (
            <div className="flex gap-sm overflow-x-auto pb-xs">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[160px] flex-shrink-0 h-24 bg-surface-container-low border border-outline-variant animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-5 gap-sm overflow-x-auto hide-scrollbar pb-xs">
              {marketData?.pricesByCategory.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="min-w-[160px] flex-shrink-0 bg-surface-container-lowest border border-outline-variant p-sm hover:-translate-y-0.5 transition-transform cursor-default"
                >
                  <p className="text-label-caps font-label-caps text-secondary mb-xs">
                    {categoryLabels[item._id] ?? item._id.toUpperCase()}
                  </p>
                  <div className="text-headline-md font-headline-md mb-xs">
                    ₹{Math.round(item.avgPrice).toLocaleString("en-IN")}
                    <span className="text-body-sm text-secondary">/{item.unit}</span>
                  </div>
                  <div className="flex items-center text-primary font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                    {item.listingCount} listing{item.listingCount !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="lg:col-span-2 space-y-lg">

            {/* Most in Demand */}
            <section>
              <h2 className="text-headline-md font-headline-md mb-md">Most in Demand</h2>
              <div className="space-y-md">
                {loading
                  ? [...Array(2)].map((_, i) => (
                      <div key={i} className="h-40 bg-surface-container-low border border-outline-variant animate-pulse rounded" />
                    ))
                  : marketData?.mostInDemand.map((item, i) => {
                      const coverUrl = resolveImageUrl(item.images?.cover) ??
                        unsplashUrl(categoryFallback[item.category] ?? categoryFallback.default);
                      const demandScore = Math.max(60, 95 - i * 14);
                      const demandLabel = i === 0 ? "High Interest" : i === 1 ? "Rising" : "Steady";
                      return (
                        <div key={item._id} className="group bg-surface-container-lowest border border-outline-variant p-md hover:border-primary transition-all">
                          <div className="flex flex-col md:flex-row md:items-center gap-md">
                            <div className="w-full md:w-40 h-40 bg-surface-container flex-shrink-0 overflow-hidden">
                              <img
                                src={coverUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = unsplashUrl(categoryFallback.default); }}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-xs">
                                <div>
                                  <span className="text-label-caps font-label-caps text-primary mb-1 inline-block">{item.grade}</span>
                                  <h3 className="text-headline-md font-headline-md">{item.title}</h3>
                                </div>
                                <div className="text-right ml-4 flex-shrink-0">
                                  <div className="text-primary font-bold">{demandLabel}</div>
                                  <div className="text-body-sm text-secondary">{demandScore}% Demand Score</div>
                                </div>
                              </div>
                              <div className="w-full bg-surface-container-high h-2 mb-sm">
                                <div className="bg-primary h-full transition-all duration-700" style={{ width: `${demandScore}%` }} />
                              </div>
                              <p className="text-body-sm text-secondary mb-md line-clamp-2">{item.description}</p>
                              <Link to="/buy" className="px-sm py-2 border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors inline-block">
                                View Listings
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </section>

            {/* Agriculture News — text only, no images */}
            <section>
              <div className="flex items-center justify-between mb-md">
                <h2 className="text-headline-md font-headline-md">Agriculture News</h2>
                <span className="text-label-md text-secondary font-label-md">
                  {news.length > 0 ? `${news.length} articles` : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {loading
                  ? [...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-surface-container-low border border-outline-variant animate-pulse rounded" />
                    ))
                  : news.length === 0 ? (
                      <p className="text-body-sm text-secondary col-span-2">No news available right now.</p>
                    )
                  : news.slice(0, 4).map((article) => {
                      const encoded = encodeURIComponent(article.article_id);
                      return (
                        <Link
                          key={article.article_id}
                          to={`/news/${encoded}`}
                          state={{ article }}
                          className="group bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all block p-md rounded-lg"
                        >
                          <div className="flex items-center gap-xs mb-sm flex-wrap">
                            <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                              {article.category?.[0] ?? "News"}
                            </span>
                            <span className="text-[11px] text-secondary">{timeAgo(article.pubDate)}</span>
                            <span className="text-outline text-[11px]">·</span>
                            <span className="text-[11px] text-secondary">{article.source_name}</span>
                          </div>
                          <h3 className="text-label-md font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors mb-sm">
                            {article.title}
                          </h3>
                          <span className="text-label-md text-primary flex items-center gap-1">
                            Read more <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </span>
                        </Link>
                      );
                    })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant p-md">
              <h3 className="text-label-md font-bold text-primary mb-md">Platform Stats</h3>
              <ul className="space-y-sm text-body-sm">
                <li className="flex justify-between border-b border-outline-variant pb-sm">
                  <span className="text-secondary">Total Listings</span>
                  <span className="font-bold">{marketData?.pricesByCategory.reduce((a, b) => a + b.listingCount, 0) ?? "—"}</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant pb-sm">
                  <span className="text-secondary">Categories</span>
                  <span className="font-bold">{marketData?.pricesByCategory.length ?? "—"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-secondary">Total Volume (Kg)</span>
                  <span className="font-bold">
                    {marketData?.pricesByCategory.reduce((a, b) => a + b.totalVolume, 0).toLocaleString("en-IN") ?? "—"}
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-primary text-on-primary p-md rounded-lg">
              <h3 className="text-label-md font-bold mb-sm">Ready to Trade?</h3>
              <p className="text-body-sm opacity-80 mb-md">Source bulk spices directly from verified producers on the CyberSpice marketplace.</p>
              <Link to="/buy" className="block text-center bg-on-primary text-primary font-label-md py-2 rounded hover:opacity-90 transition-opacity">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}