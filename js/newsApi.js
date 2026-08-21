/**
 * India News 18 / Breaking Edition — Live "India News" feed
 * Fetches national headlines from NewsData.io directly from the browser
 * (free tier, CORS-friendly). The API key is visible in page source since
 * there is no backend on this project — acceptable for this site's traffic,
 * but note that anyone could copy it and use up the shared daily quota.
 */

const API_KEY = 'pub_6fa4e6ee95ef4bf88b05953792808769';
const BASE_URL = 'https://newsdata.io/api/1/news';
const CACHE_PREFIX = 'in18_indianews_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — conserves the ~200 credits/day free budget

export const INDIA_NEWS_CATEGORIES = [
  { key: 'top', apiValue: 'top', labelKey: 'india_news_cat_top' },
  { key: 'politics', apiValue: 'politics', labelKey: 'india_news_cat_politics' },
  { key: 'business', apiValue: 'business', labelKey: 'india_news_cat_business' },
  { key: 'sports', apiValue: 'sports', labelKey: 'india_news_cat_sports' },
  { key: 'entertainment', apiValue: 'entertainment', labelKey: 'india_news_cat_entertainment' },
  { key: 'technology', apiValue: 'technology', labelKey: 'india_news_cat_technology' },
  { key: 'health', apiValue: 'health', labelKey: 'india_news_cat_health' }
];

function readCache(category) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + category);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.articles;
  } catch {
    return null;
  }
}

function writeCache(category, articles) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + category, JSON.stringify({ savedAt: Date.now(), articles }));
  } catch {
    // sessionStorage full/unavailable — just skip caching for this session.
  }
}

/**
 * Fetch India headlines for a category. Returns a normalized array of
 * { title, description, link, image, source, pubDate }.
 * Throws on failure so the caller can render an error state.
 */
export async function fetchIndiaNews(category = 'top') {
  const cached = readCache(category);
  if (cached) return cached;

  const url = `${BASE_URL}?apikey=${API_KEY}&country=in&language=en&category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsData.io HTTP ${res.status}`);
  const data = await res.json();

  if (data.status !== 'success' || !Array.isArray(data.results)) {
    throw new Error((data && data.results && data.results.message) || 'NewsData.io returned an error');
  }

  const articles = data.results.map(item => ({
    title: item.title || '',
    description: item.description || '',
    link: item.link || '#',
    image: item.image_url || '',
    source: item.source_id || item.source_name || 'Wire',
    pubDate: item.pubDate || null
  })).filter(a => a.title);

  writeCache(category, articles);
  return articles;
}
