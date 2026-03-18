/**
 * News Fetcher
 *
 * Hacker News API と Dev.to API から最新の技術ニュースを取得する。
 * どちらも無料・APIキー不要。
 */

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  score?: number;
  tags?: string[];
  description?: string;
}

// --- Hacker News API ---

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  type: string;
}

async function fetchHackerNews(limit = 30): Promise<NewsItem[]> {
  const res = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const ids: number[] = await res.json();

  const items = await Promise.all(
    ids.slice(0, limit).map(async (id) => {
      const itemRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return (await itemRes.json()) as HNItem;
    })
  );

  return items
    .filter((item) => item.type === "story" && item.url)
    .map((item) => ({
      title: item.title,
      url: item.url!,
      source: "Hacker News",
      score: item.score,
    }));
}

// --- Dev.to API ---

interface DevtoArticle {
  title: string;
  url: string;
  description: string;
  tag_list: string[];
  public_reactions_count: number;
}

async function fetchDevto(limit = 20): Promise<NewsItem[]> {
  const res = await fetch(
    `https://dev.to/api/articles?per_page=${limit}&top=1`
  );
  const articles: DevtoArticle[] = await res.json();

  return articles.map((article) => ({
    title: article.title,
    url: article.url,
    source: "Dev.to",
    score: article.public_reactions_count,
    tags: article.tag_list,
    description: article.description,
  }));
}

// --- Main fetch ---

export async function fetchTechNews(): Promise<NewsItem[]> {
  console.log("Fetching news from Hacker News and Dev.to...");

  const [hn, devto] = await Promise.all([
    fetchHackerNews(30).catch((err) => {
      console.warn("  Warning: Hacker News fetch failed:", err.message);
      return [] as NewsItem[];
    }),
    fetchDevto(20).catch((err) => {
      console.warn("  Warning: Dev.to fetch failed:", err.message);
      return [] as NewsItem[];
    }),
  ]);

  console.log(`  Hacker News: ${hn.length} articles`);
  console.log(`  Dev.to: ${devto.length} articles`);

  return [...hn, ...devto];
}

/**
 * ニュース一覧をテキスト形式でフォーマット（LLM への入力用）
 */
export function formatNewsForLLM(news: NewsItem[]): string {
  return news
    .map(
      (item, i) =>
        `[${i + 1}] ${item.title}\n    URL: ${item.url}\n    Source: ${item.source}${item.score ? ` | Score: ${item.score}` : ""}${item.tags?.length ? ` | Tags: ${item.tags.join(", ")}` : ""}${item.description ? `\n    ${item.description}` : ""}`
    )
    .join("\n\n");
}
