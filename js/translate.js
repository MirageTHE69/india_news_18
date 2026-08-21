/**
 * India News 18 / Breaking Edition — Auto-translation layer (English → Gujarati)
 * Uses the free MyMemory Translation API (no key/billing account required).
 * Translations are cached in localStorage forever (one API call per unique
 * string, ever) to stay well inside MyMemory's ~5,000 words/day anonymous quota.
 */
import { I18n } from './i18n.js';

const CACHE_KEY = 'in18_translations_v1';
const FAIL_COOLDOWN_MS = 60000;
const UPDATED_EVENT = 'in18_translations_updated';

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable — translations just won't persist across reloads.
  }
}

const cache = loadCache();
const inflight = new Map();
const failedUntil = new Map();

function notifyUpdated() {
  window.dispatchEvent(new CustomEvent(UPDATED_EVENT));
}

async function translateChunk(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|gu`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const translated = data && data.responseData && data.responseData.translatedText;
  if (!translated || data.responseStatus >= 400) throw new Error('MyMemory translation failed');
  return translated;
}

// MyMemory limits requests to ~500 bytes; split long text on sentence/paragraph
// boundaries and translate each piece, then rejoin.
function chunkText(text, maxLen = 450) {
  if (text.length <= maxLen) return [text];
  const sentences = text.split(/(?<=[.!?।])\s+/);
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).trim().length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = (current ? current + ' ' : '') + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Kick off (and cache) translation of a plain-text string. Non-blocking. */
function ensureTranslated(text) {
  if (!text || !text.trim()) return;
  if (cache[text] !== undefined) return;
  if (inflight.has(text)) return;
  const cooldownUntil = failedUntil.get(text);
  if (cooldownUntil && Date.now() < cooldownUntil) return;

  const promise = (async () => {
    const chunks = chunkText(text);
    const translatedChunks = [];
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk));
    }
    return translatedChunks.join(' ');
  })()
    .then(result => {
      cache[text] = result;
      saveCache();
      notifyUpdated();
    })
    .catch(() => {
      failedUntil.set(text, Date.now() + FAIL_COOLDOWN_MS);
    })
    .finally(() => {
      inflight.delete(text);
    });

  inflight.set(text, promise);
}

/**
 * Localize a plain-text field for display. Returns the cached Gujarati
 * translation if ready, otherwise the original English while translation
 * runs in the background (a re-render will pick it up via the
 * 'in18_translations_updated' event once it resolves).
 */
export function L(text) {
  if (!text) return text;
  if (I18n.getLang() !== 'gu') return text;
  ensureTranslated(text);
  return cache[text] || text;
}

/**
 * Localize an HTML fragment (e.g. article body) — walks text nodes so tags,
 * links and formatting survive translation.
 */
export function LH(html) {
  if (!html) return html;
  if (I18n.getLang() !== 'gu') return html;
  if (cache[html] !== undefined) return cache[html];

  if (!inflight.has(html)) {
    const cooldownUntil = failedUntil.get(html);
    if (!cooldownUntil || Date.now() >= cooldownUntil) {
      const promise = translateHtmlNodes(html)
        .then(result => {
          cache[html] = result;
          saveCache();
          notifyUpdated();
        })
        .catch(() => {
          failedUntil.set(html, Date.now() + FAIL_COOLDOWN_MS);
        })
        .finally(() => {
          inflight.delete(html);
        });
      inflight.set(html, promise);
    }
  }

  return html;
}

async function translateHtmlNodes(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) nodes.push(node);
  }
  for (const n of nodes) {
    const chunks = chunkText(n.textContent);
    const translatedChunks = [];
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk));
    }
    n.textContent = translatedChunks.join(' ');
  }
  return wrapper.innerHTML;
}

export const TRANSLATIONS_UPDATED_EVENT = UPDATED_EVENT;
