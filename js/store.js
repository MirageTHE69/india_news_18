/**
 * India News 18 / Breaking Edition - Dynamic Store
 * Handles persistent state for Articles, Videos, Tickers, Tips, and Site Settings.
 */

const STORAGE_KEYS = {
  ARTICLES: 'in18_articles_v1',
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

const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'Ward 7 goes without water for a third day as pump repair drags on',
    excerpt: 'Four lanes behind the vegetable market have been buying tanker water since Sunday. The corporation says the replacement motor arrives Wednesday. The contractor told us Thursday.',
    content: `
      <p>Taps in four lanes behind the vegetable market have been dry since Sunday morning, after the motor at the ward 7 pumping station burned out during a voltage drop. About 600 households are affected.</p>
      <p>Residents say they are spending ₹400 to ₹600 a day on private tankers, which are now making three trips to the lane instead of one. Two families told us they have shifted their children to relatives in the east ward until the supply returns.</p>
      <p>The corporation's water department says a replacement motor has been ordered and will be installed by Wednesday evening. The contractor handling the pumping station told this reporter on Tuesday that the part reaches the city only on Thursday.</p>
      <blockquote class="story-quote">
        <p>“We have paid the tax for eleven years. Three days without water, and nobody from the office has come to see the lane.”</p>
        <cite>— Shobha Jadhav, resident, Bhaji Market Lane</cite>
      </blockquote>
      <h2>What the corporation has said</h2>
      <p>The ward 7 corporator raised the item at Monday's standing committee, where ₹2.4 crore was cleared for replacing the pipeline along the market stretch. That work is separate from the pump, and tenders for it have not been called yet.</p>
      <p>Two tankers have been sent by the corporation since Monday evening, one in the morning and one after 6 p.m. Residents say the evening tanker did not arrive on Tuesday.</p>
      <div class="story-callout">
        <div class="callout-label">Also read</div>
        <a href="#/article/art-2" class="callout-link">Ward-wise water cut schedule for this week</a>
      </div>
      <p>We will be at the pumping station on Wednesday evening when the motor is due. If the supply resumes, or does not, this page will be updated the same night.</p>
    `,
    category: 'City',
    author: 'Sneha Kulkarni',
    authorRole: 'City Reporter · Filed from Bhaji Market Lane',
    location: 'Bhaji Market Lane, Ward 7',
    image: '',
    imageCaption: 'Residents of Bhaji Market Lane filling cans from a private tanker on Tuesday morning, the third day without supply.',
    imageCredit: 'Photo: Imran Shaikh / Breaking Edition',
    isLead: true,
    isBreaking: true,
    isTrending: true,
    tags: ['Ward 7', 'Water supply', 'Municipal corporation', 'Tenders', 'Monsoon'],
    views: 14820,
    publishedAt: '2026-08-15T08:42:00.000Z',
    updatedAt: '2026-08-17T13:20:00.000Z'
  },
  {
    id: 'art-2',
    title: 'Ward-wise water cut schedule for this week',
    excerpt: 'Detailed municipal schedule for rotational pressure reduction and pipeline maintenance across wards 4, 7, 9, and 12.',
    content: `
      <p>The municipal engineering department has published the revised rotational supply timetable for this week following maintenance on the main feeding duct.</p>
      <p>Wards 4 and 12 will receive water from 5:00 AM to 8:30 AM on alternating days, while Ward 9 will experience reduced pressure between 4:00 PM and 7:00 PM.</p>
      <h2>Emergency Helpline Numbers</h2>
      <p>Citizens needing municipal tankers can call the central control room or contact their local ward office officer directly.</p>
    `,
    category: 'City',
    author: 'Sneha Kulkarni',
    authorRole: 'City Reporter',
    location: 'City Corporation Hall',
    image: '',
    imageCaption: 'Control room map of the municipal water distribution line.',
    imageCredit: 'Breaking Edition Desk',
    isLead: false,
    isBreaking: false,
    isTrending: true,
    tags: ['Water cuts', 'Municipal Helpline', 'Ward 4', 'Ward 12'],
    views: 9320,
    publishedAt: '2026-08-16T09:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'art-3',
    title: 'Three held in two-wheeler theft ring operating near the bus stand',
    excerpt: 'Police recover eleven stolen motorcycles hidden in a rural shed outside the taluka borders.',
    content: `
      <p>City police on Monday night arrested three individuals in connection with a string of two-wheeler thefts reported outside the central bus station over the last six weeks.</p>
      <p>Acting on CCTV footage and informant tips, the crime branch raided a storage shed near the bypass where eleven vehicles with altered chassis numbers were seized.</p>
      <p>The accused have been remanded in police custody for five days as investigation into the resale network continues.</p>
    `,
    category: 'Crime',
    author: 'Rahul Pawar',
    authorRole: 'Crime Desk',
    location: 'Central Police Station',
    image: '',
    imageCaption: 'Recovered vehicles parked outside the police headquarters.',
    imageCredit: 'Photo: Breaking Edition',
    isLead: false,
    isBreaking: false,
    isTrending: true,
    tags: ['Crime Branch', 'Bus Stand', 'Police Action'],
    views: 8120,
    publishedAt: '2026-08-17T12:00:00.000Z',
    updatedAt: '2026-08-17T12:30:00.000Z'
  },
  {
    id: 'art-4',
    title: 'Standing committee clears ₹2.4 crore for the ward 7 pipeline',
    excerpt: 'Resolution passed unanimously after corporators from four wards raise water pressure complaints.',
    content: `
      <p>The municipal standing committee on Monday gave administrative sanction for ₹2.4 crore to replace the ageing cast iron pipeline along the market road.</p>
      <p>The proposal had been pending since March. The commissioner assured that tendering will commence within ten days.</p>
    `,
    category: 'City',
    author: 'Sneha Kulkarni',
    authorRole: 'City Desk',
    location: 'Standing Committee Hall',
    image: '',
    imageCaption: 'Corporation meeting in progress.',
    imageCredit: 'Breaking Edition Desk',
    isLead: false,
    isBreaking: false,
    isTrending: false,
    tags: ['Civic Budget', 'Ward 7', 'Pipeline'],
    views: 4300,
    publishedAt: '2026-08-17T11:00:00.000Z',
    updatedAt: '2026-08-17T11:00:00.000Z'
  },
  {
    id: 'art-5',
    title: 'Onion arrivals double at the mandi; rates fall to ₹18 a kilo',
    excerpt: 'Traders report heavy influx from nearby villages following dry weather over the weekend.',
    content: `
      <p>Prices of summer onion dipped to ₹18–₹22 per kilogram at the wholesale market on Monday as daily arrivals crossed 12,000 quintals.</p>
      <p>Farmers have urged the district marketing federation to set up procurement centers to prevent further distress selling.</p>
    `,
    category: 'Business',
    author: 'Vaishali More',
    authorRole: 'Rural & Mandi Correspondent',
    location: 'APMC Market Yard',
    image: '',
    imageCaption: 'Unloading of onion sacks at the central mandi.',
    imageCredit: 'Photo: Imran Shaikh',
    isLead: false,
    isBreaking: false,
    isTrending: true,
    tags: ['Mandi', 'Onion Rates', 'Agriculture', 'Farmers'],
    views: 7450,
    publishedAt: '2026-08-17T07:30:00.000Z',
    updatedAt: '2026-08-17T09:00:00.000Z'
  },
  {
    id: 'art-6',
    title: 'District under-19 final moved to the college ground after rain',
    excerpt: 'Ground staff work around the clock to ready the turf after the municipal stadium outfield waterlogged.',
    content: `
      <p>The district under-19 cricket championship final between Star Club and City Academy has been shifted to the Arts & Commerce College grounds following incessant downpours.</p>
      <p>Play begins on Friday at 9:00 AM. Entry is free for the public.</p>
    `,
    category: 'Sports',
    author: 'Rahul Pawar',
    authorRole: 'Sports Desk',
    location: 'College Stadium',
    image: '',
    imageCaption: 'Ground preparations underway at the college turf.',
    imageCredit: 'Breaking Edition',
    isLead: false,
    isBreaking: false,
    isTrending: false,
    tags: ['Cricket', 'Under-19', 'District Sports'],
    views: 3100,
    publishedAt: '2026-08-17T06:45:00.000Z',
    updatedAt: '2026-08-17T06:45:00.000Z'
  },
  {
    id: 'art-7',
    title: 'MIDC unit adds a second shift, 60 jobs opening this month',
    excerpt: 'Automotive component manufacturer expands assembly operations in the industrial belt.',
    content: `
      <p>A leading precision auto-parts supplier in the MIDC industrial estate announced the commissioning of its second assembly line, creating 60 technical and supervisory roles.</p>
      <p>Walk-in interviews for ITI certified candidates will be conducted this Saturday at the unit premises.</p>
    `,
    category: 'Business',
    author: 'Vaishali More',
    authorRole: 'Business Desk',
    location: 'MIDC Phase 2',
    image: '',
    imageCaption: 'Industrial expansion in MIDC.',
    imageCredit: 'Breaking Edition',
    isLead: false,
    isBreaking: false,
    isTrending: false,
    tags: ['Jobs', 'MIDC', 'Industry', 'Employment'],
    views: 5200,
    publishedAt: '2026-08-16T14:00:00.000Z',
    updatedAt: '2026-08-16T14:00:00.000Z'
  },
  {
    id: 'art-8',
    title: 'Municipal school results out; district pass rate up to 88%',
    excerpt: 'East ward high school registers 100% success rate with top rankers felicitated by the mayor.',
    content: `
      <p>Students from municipal corporation run high schools recorded an impressive 88.4% pass percentage in the annual board examinations, an increase of 4% over last year.</p>
      <p>Seven students secured above 90% marks, with four securing admissions to premier engineering diploma institutes.</p>
    `,
    category: 'City',
    author: 'Sneha Kulkarni',
    authorRole: 'Education Desk',
    location: 'Town Hall',
    image: '',
    imageCaption: 'Students celebrating board results.',
    imageCredit: 'Photo: Imran Shaikh',
    isLead: false,
    isBreaking: false,
    isTrending: true,
    tags: ['Schools', 'Results', 'Education'],
    views: 6890,
    publishedAt: '2026-08-16T11:00:00.000Z',
    updatedAt: '2026-08-16T11:00:00.000Z'
  },
  {
    id: 'art-9',
    title: 'Street light contract goes back to tender after complaints',
    excerpt: 'Over 40 complaints of dark stretches on the bypass road trigger municipal review of contractor performance.',
    content: `
      <p>The municipal commissioner has ordered re-tendering of the annual maintenance contract for bypass streetlights following delays in replacing faulty LED fittings.</p>
      <p>New tenders with strict 24-hour response clauses will be floated on Friday.</p>
    `,
    category: 'City',
    author: 'Sneha Kulkarni',
    authorRole: 'City Desk',
    location: 'Bypass Road',
    image: '',
    imageCaption: 'Inspection of faulty street poles.',
    imageCredit: 'Breaking Edition',
    isLead: false,
    isBreaking: false,
    isTrending: false,
    tags: ['Streetlights', 'Municipal Corporation', 'Civic'],
    views: 3400,
    publishedAt: '2026-08-17T09:30:00.000Z',
    updatedAt: '2026-08-17T09:30:00.000Z'
  },
  {
    id: 'art-10',
    title: 'City kabaddi league draws 14 teams, matches from Friday',
    excerpt: 'Chhatrapati Shivaji Krida Mandal to host three-day tournament with top taluka players.',
    content: `
      <p>Fourteen registered clubs from across the taluka have confirmed participation in the annual district kabaddi invitational cup kicking off this Friday evening.</p>
      <p>Matches will be played under floodlights with live commentary broadcast on our YouTube channel.</p>
    `,
    category: 'Sports',
    author: 'Rahul Pawar',
    authorRole: 'Sports Desk',
    location: 'Krida Mandal Ground',
    image: '',
    imageCaption: 'Teams preparing at the practice court.',
    imageCredit: 'Breaking Edition',
    isLead: false,
    isBreaking: false,
    isTrending: false,
    tags: ['Kabaddi', 'Local Sports', 'Tournament'],
    views: 2900,
    publishedAt: '2026-08-17T05:00:00.000Z',
    updatedAt: '2026-08-17T05:00:00.000Z'
  }
];

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
