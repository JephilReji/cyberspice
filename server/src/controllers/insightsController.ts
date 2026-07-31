import { Request, Response } from "express";
import https from "https";
import { Listing } from "../models/Listing";

// Simple in-memory cache so we don't burn through the 500 req/day free limit
let newsCache: { data: NewsArticle[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

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
  image_url: string | null; // We'll use Unsplash fallback when this is null
}

function fetchFromNewsdata(): Promise<NewsArticle[]> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
      reject(new Error("NEWSDATA_API_KEY not set in .env"));
      return;
    }

    const query = encodeURIComponent("spices OR pepper OR cardamom OR turmeric OR saffron OR agriculture");
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&language=en&category=business,food&size=9`;

    https.get(url, (res) => {
      let raw = "";
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.status === "success") {
            resolve(parsed.results as NewsArticle[]);
          } else {
            reject(new Error(parsed.message || "Newsdata API error"));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

export async function getNews(_req: Request, res: Response) {
  try {
    const now = Date.now();

    // Serve from cache if fresh
    if (newsCache && now - newsCache.fetchedAt < CACHE_TTL_MS) {
      return res.json(newsCache.data);
    }

    const articles = await fetchFromNewsdata();
    newsCache = { data: articles, fetchedAt: now };
    return res.json(articles);
  } catch (err: any) {
    console.error("News fetch error:", err.message);
    // If API fails, return empty array rather than crashing the page
    return res.json([]);
  }
}

export async function getMarketData(_req: Request, res: Response) {
  try {
    // Aggregate average price per category from real listings
    const pricesByCategory = await Listing.aggregate([
      {
        $group: {
          _id: "$category",
          avgPrice: { $avg: "$pricePerUnit" },
          totalVolume: { $sum: "$totalAvailable" },
          listingCount: { $sum: 1 },
          unit: { $first: "$unit" },
        },
      },
      { $sort: { listingCount: -1 } },
    ]);

    // Most in demand = highest totalAvailable (proxy for supply/demand activity)
    const mostInDemand = await Listing.find()
      .sort({ totalAvailable: -1 })
      .limit(3)
      .select("title category grade description images pricePerUnit unit totalAvailable origin");

    return res.json({ pricesByCategory, mostInDemand });
  } catch (err) {
    console.error("Market data error:", err);
    return res.status(500).json({ message: "Could not load market data." });
  }
}
