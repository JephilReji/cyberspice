import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  link: string;
  source_name: string;
  pubDate: string;
  category: string[];
  keywords: string[] | null;
  image_url: string | null;
}

const categoryKeywords: Record<string, string> = {
  business: "spice,trade,market",
  food: "spices,agriculture,food",
  default: "spices,agriculture",
};

function unsplashUrl(keywords: string) {
  return `https://source.unsplash.com/1200x600/?${keywords}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const article: NewsArticle | undefined = location.state?.article;

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="text-body-lg text-secondary">Article not found.</p>
          <button
            onClick={() => navigate("/insights")}
            className="text-primary underline font-label-md"
          >
            Back to Insights
          </button>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const keyword = article.category?.[0] ?? "default";
  const heroImage = unsplashUrl(categoryKeywords[keyword] ?? categoryKeywords.default);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-xs text-secondary hover:text-primary transition-colors mb-lg font-label-md"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Insights
          </button>

          {/* Category + meta */}
          <div className="flex items-center gap-sm mb-md">
            {article.category?.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-primary text-on-primary text-label-caps rounded uppercase"
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-md">
            {article.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-md border-b border-outline-variant pb-md mb-lg">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold flex-shrink-0">
              {article.source_name?.[0]?.toUpperCase() ?? "N"}
            </div>
            <div>
              <p className="text-label-md font-bold text-on-surface">{article.source_name}</p>
              <p className="text-body-sm text-secondary">
                {formatDate(article.pubDate)} • 4 min read
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-outline-variant rounded hover:bg-surface-container-low transition-colors flex items-center gap-1 text-label-md text-secondary"
              >
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                Source
              </a>
            </div>
          </div>

          {/* Hero image from Unsplash */}
          <div className="w-full mb-lg overflow-hidden rounded-xl">
            <img
              src={heroImage}
              alt={article.title}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = unsplashUrl("spices,agriculture");
              }}
            />
          </div>

          {/* Article body */}
          <div className="article-content font-body-lg text-body-lg text-on-surface space-y-md">
            {article.description && (
              <p className="font-medium text-lg leading-relaxed text-on-surface">
                {article.description}
              </p>
            )}

            {article.content ? (
              <p className="text-on-surface-variant leading-relaxed">{article.content}</p>
            ) : (
              <div className="p-6 bg-surface-container-low border-l-4 border-primary rounded-r-lg">
                <p className="text-secondary italic">
                  Full article content is available at the original source.
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-label-md hover:underline mt-2 inline-flex items-center gap-1"
                >
                  Read full article
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-outline-variant">
              {article.keywords.slice(0, 6).map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-md rounded capitalize"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
