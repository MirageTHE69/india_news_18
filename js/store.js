/**
 * India News 18 / Breaking Edition - Dynamic Store
 * Handles persistent state for Articles, Videos, Tickers, Tips, and Site Settings.
 */

const STORAGE_KEYS = {
  ARTICLES: 'in18_articles_v2', // bumped so browsers with cached sample articles reset to the empty default
  VIDEOS: 'in18_videos_v1',
  TICKERS: 'in18_tickers_v1',
  TIPS: 'in18_tips_v1',
  SETTINGS: 'in18_settings_v1',
  TEAM: 'in18_team_v1'
};

const DEFAULT_SETTINGS = {
  siteName: 'India News 18',
  editionName: 'Breaking Edition',
  deskTitle: 'City & District Desk',
  tagline: 'Eleven wards · Forty villages · Since 2016',
  whatsappTipNumber: '+91 98220 41122',
  editorPhone: '+91 98220 41130',
  deskEmail: 'desk@breakingedition.in',
  editorEmail: 'rahul@breakingedition.in',
  officeAddress: 'Breaking Edition, 2nd floor, Above Shree Stationers, Market Road, Near Old Bus Stand — 422001',
  whatsappChannelUrl: 'https://whatsapp.com/channel/in18-breaking',
  youtubeChannelUrl: 'https://youtube.com',
  announcement: 'Ward-wise water and power cuts, mandi rates, court dates and the day\'s bulletin — sent by 7 a.m.'
};

const DEFAULT_TICKERS = [
  { id: 't-1', text: 'Water supply to wards 4, 7 and 12 cut till Thursday for pipeline repair', active: true, priority: 1 },
  { id: 't-2', text: 'Two-wheeler theft ring busted near the bus stand, three held', active: true, priority: 2 },
  { id: 't-3', text: 'Municipal school results out; district pass rate up to 88%', active: true, priority: 3 },
  { id: 't-4', text: 'Heavy rain alert for the taluka; schools shut on Wednesday', active: true, priority: 4 },
  { id: 't-5', text: 'Weekly market shifts to the new ground from Sunday', active: true, priority: 5 }
];

const DEFAULT_VIDEOS = [
  {
    id: 'vid-1',
    title: 'General body meeting: ward 7 water item on the floor, live from the hall',
    description: 'Our reporter is inside with a single camera. We stay on till the item is taken up, and read out your questions from the WhatsApp channel.',
    category: 'Corporator Speaks',
    filterType: 'Live',
    videoSource: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    duration: '2:14:06',
    time: 'Live · 1,240 watching',
    views: 1240,
    isLive: true,
    isFeatured: true,
    createdAt: '2026-08-17T12:00:00.000Z'
  },
  {
    id: 'vid-2',
    title: 'Today in the city: road work, water cuts and the mandi rates',
    description: 'Tonight\'s bulletin: the ward 7 pump repair and what the contractor told us, the lane closure on the old bridge from Monday, today\'s mandi rates, and the district under-19 final shifting grounds.',
    category: 'Evening Bulletin',
    filterType: 'Bulletins',
    videoSource: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    duration: '12:40',
    time: 'Today, 19:30',
    views: 9420,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-17T10:30:00.000Z'
  },
  {
    id: 'vid-3',
    title: 'Walking the flooded lane behind the vegetable market',
    description: 'Ground report from the residential lanes near Bhaji market showing severe waterlogging and residents queuing at private tankers.',
    category: 'Ground Report',
    filterType: 'Ground reports',
    videoSource: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/C3_sample_reel/',
    duration: '07:22',
    time: 'Today, 14:30',
    views: 6310,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-17T09:00:00.000Z'
  },
  {
    id: 'vid-4',
    title: '‘The tender was cleared in March’ — ward 7 corporator answers',
    description: 'Exclusive interview with ward 7 corporator regarding pipeline repair delays and municipal budget allocations.',
    category: 'Corporator Speaks',
    filterType: 'Interviews',
    videoSource: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/ysz5S6PUM-U',
    duration: '16:05',
    time: 'Yesterday',
    views: 8200,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-16T15:00:00.000Z'
  },
  {
    id: 'vid-5',
    title: 'Onion and tomato rates, and what traders expect this week',
    description: 'Live coverage from the agricultural produce market committee (APMC) mandi with price breakdown.',
    category: 'Mandi Watch',
    filterType: 'Bulletins',
    videoSource: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/L_LUpnjgPso',
    duration: '05:18',
    time: 'Today, 16:05',
    views: 4500,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-17T08:00:00.000Z'
  },
  {
    id: 'vid-6',
    title: 'The school that runs three shifts in two rooms',
    description: 'Investigative piece on classroom shortages in the eastern municipal primary school.',
    category: 'Special Report',
    filterType: 'Explainers',
    videoSource: 'direct',
    videoUrl: '',
    duration: '11:47',
    time: '2 days ago',
    views: 5900,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'vid-7',
    title: 'How to file a complaint with the municipal corporation',
    description: 'Step-by-step citizen explainer on reaching the ward desk and filing road/water grievances.',
    category: 'City Explainer',
    filterType: 'Explainers',
    videoSource: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
    duration: '04:36',
    time: '2 days ago',
    views: 7800,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-15T08:00:00.000Z'
  },
  {
    id: 'vid-8',
    title: 'District under-19 final: the two boys everyone is watching',
    description: 'Special sports profile of young talent gearing up for the district cricket championships.',
    category: 'Sports Desk',
    filterType: 'Interviews',
    videoSource: 'youtube',
    videoUrl: '',
    duration: '08:30',
    time: '3 days ago',
    views: 3100,
    isLive: false,
    isFeatured: false,
    createdAt: '2026-08-14T11:00:00.000Z'
  }
];

// Intentionally empty — real stories are published through the admin panel.
const DEFAULT_ARTICLES = [];

const DEFAULT_TEAM = [
  { id: 'tm-1', name: 'Sneha Kulkarni', role: 'City Reporter', bio: 'Covers the municipal corporation, water and roads. Files most of the ward stories.' },
  { id: 'tm-2', name: 'Rahul Pawar', role: 'Editor & Anchor', bio: 'Started the channel in 2016. Reads the evening bulletin and handles corrections.' },
  { id: 'tm-3', name: 'Imran Shaikh', role: 'Camera & Video', bio: 'Shoots and cuts the ground reports. Runs the YouTube channel.' },
  { id: 'tm-4', name: 'Vaishali More', role: 'Rural Correspondent', bio: 'Covers 40 villages in the taluka — farming, schools and health centres.' }
];

const DEFAULT_TIPS = [
  {
    id: 'tip-1',
    name: 'Ganesh Patil',
    contact: '+91 94231 88990',
    subject: 'Sewage overflow on Market Link Road',
    message: 'Sewage line leaking directly in front of the primary health clinic for 2 days. Commuters slipping.',
    attachment: '',
    status: 'In Review',
    createdAt: '2026-08-17T08:15:00.000Z'
  },
  {
    id: 'tip-2',
    name: 'Anonymous Resident',
    contact: 'resident_w4@gmail.com',
    subject: 'Broken streetlight junction',
    message: 'Four streetlights dark at Shivaji Chowk. Multiple near-misses during evening rush hour.',
    attachment: '',
    status: 'New',
    createdAt: '2026-08-17T11:30:00.000Z'
  }
];

// Helper for local storage
function loadData(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    console.error('Storage parse error for', key, e);
    return defaultVal;
  }
}

function saveData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error for', key, e);
  }
}

// Initialise defaults if empty
if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) saveData(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) saveData(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS);
if (!localStorage.getItem(STORAGE_KEYS.TICKERS)) saveData(STORAGE_KEYS.TICKERS, DEFAULT_TICKERS);
if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) saveData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
if (!localStorage.getItem(STORAGE_KEYS.TEAM)) saveData(STORAGE_KEYS.TEAM, DEFAULT_TEAM);
if (!localStorage.getItem(STORAGE_KEYS.TIPS)) saveData(STORAGE_KEYS.TIPS, DEFAULT_TIPS);

export const NewsStore = {
  // Articles
  getArticles() {
    return loadData(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  },
  getArticle(id) {
    const list = this.getArticles();
    return list.find(a => a.id === id) || null;
  },
  saveArticle(article) {
    const list = this.getArticles();
    if (!article.id) {
      article.id = 'art-' + Date.now();
      article.publishedAt = article.publishedAt || new Date().toISOString();
      article.views = article.views || 0;
      list.unshift(article);
    } else {
      const idx = list.findIndex(a => a.id === article.id);
      if (idx >= 0) {
        article.updatedAt = new Date().toISOString();
        list[idx] = { ...list[idx], ...article };
      } else {
        list.unshift(article);
      }
    }
    // If marked lead, demote others
    if (article.isLead) {
      list.forEach(a => {
        if (a.id !== article.id) a.isLead = false;
      });
    }
    saveData(STORAGE_KEYS.ARTICLES, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'articles' } }));
    return article;
  },
  deleteArticle(id) {
    let list = this.getArticles();
    list = list.filter(a => a.id !== id);
    saveData(STORAGE_KEYS.ARTICLES, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'articles' } }));
    return true;
  },

  // Videos
  getVideos() {
    return loadData(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS);
  },
  getVideo(id) {
    const list = this.getVideos();
    return list.find(v => v.id === id) || null;
  },
  saveVideo(video) {
    const list = this.getVideos();
    if (!video.id) {
      video.id = 'vid-' + Date.now();
      video.createdAt = new Date().toISOString();
      video.views = video.views || 0;
      list.unshift(video);
    } else {
      const idx = list.findIndex(v => v.id === video.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...video };
      } else {
        list.unshift(video);
      }
    }
    if (video.isFeatured) {
      list.forEach(v => {
        if (v.id !== video.id) v.isFeatured = false;
      });
    }
    saveData(STORAGE_KEYS.VIDEOS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'videos' } }));
    return video;
  },
  deleteVideo(id) {
    let list = this.getVideos();
    list = list.filter(v => v.id !== id);
    saveData(STORAGE_KEYS.VIDEOS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'videos' } }));
    return true;
  },

  // Tickers
  getTickers() {
    return loadData(STORAGE_KEYS.TICKERS, DEFAULT_TICKERS);
  },
  saveTicker(ticker) {
    const list = this.getTickers();
    if (!ticker.id) {
      ticker.id = 't-' + Date.now();
      ticker.active = ticker.active !== undefined ? ticker.active : true;
      list.push(ticker);
    } else {
      const idx = list.findIndex(t => t.id === ticker.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...ticker };
      else list.push(ticker);
    }
    saveData(STORAGE_KEYS.TICKERS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'tickers' } }));
    return ticker;
  },
  deleteTicker(id) {
    let list = this.getTickers();
    list = list.filter(t => t.id !== id);
    saveData(STORAGE_KEYS.TICKERS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'tickers' } }));
    return true;
  },

  // Tips
  getTips() {
    return loadData(STORAGE_KEYS.TIPS, DEFAULT_TIPS);
  },
  addTip(tip) {
    const list = this.getTips();
    tip.id = 'tip-' + Date.now();
    tip.status = 'New';
    tip.createdAt = new Date().toISOString();
    list.unshift(tip);
    saveData(STORAGE_KEYS.TIPS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'tips' } }));
    return tip;
  },
  updateTipStatus(id, status) {
    const list = this.getTips();
    const item = list.find(t => t.id === id);
    if (item) {
      item.status = status;
      saveData(STORAGE_KEYS.TIPS, list);
      window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'tips' } }));
    }
    return item;
  },
  deleteTip(id) {
    let list = this.getTips();
    list = list.filter(t => t.id !== id);
    saveData(STORAGE_KEYS.TIPS, list);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'tips' } }));
    return true;
  },

  // Settings
  getSettings() {
    return loadData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    saveData(STORAGE_KEYS.SETTINGS, updated);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'settings' } }));
    return updated;
  },

  // Team
  getTeam() {
    return loadData(STORAGE_KEYS.TEAM, DEFAULT_TEAM);
  },

  // Reset to initial factory data
  resetAll() {
    saveData(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
    saveData(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS);
    saveData(STORAGE_KEYS.TICKERS, DEFAULT_TICKERS);
    saveData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    saveData(STORAGE_KEYS.TEAM, DEFAULT_TEAM);
    saveData(STORAGE_KEYS.TIPS, DEFAULT_TIPS);
    window.dispatchEvent(new CustomEvent('news_store_updated', { detail: { type: 'all' } }));
  }
};
