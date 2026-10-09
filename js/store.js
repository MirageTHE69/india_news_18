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
  TEAM: 'in18_team_v1',
  SEED: 'in18_seed_version'
};

// Bump when new stories are added to INSTAGRAM_STORIES, so browsers that
// already hold saved data pick them up without losing what they have stored.
const SEED_VERSION = 1;

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

// Stories published from the newsroom's Instagram account (@indianews18_).
// Each one becomes both an article and a video/reel entry. The original
// Gujarati copy ships alongside the English so the Gujarati edition shows the
// newsroom's own wording instead of a machine translation.
const INSTAGRAM_STORIES = [
  {
    code: 'DeO-1bAoUzb',
    kind: 'reel',
    publishedAt: '2026-10-08T12:54:57.000Z',
    category: 'Crime',
    videoCategory: 'Vadodara Breaking',
    filterType: 'Bulletins',
    location: 'Vadodara',
    title: 'Over 20 kg of silver seized from train in Vadodara; valuables worth ₹50.98 lakh confiscated',
    titleGu: 'ટ્રેનમાંથી ૨૦ કિલોથી વધુ ચાંદી ઝડપાઈ, ₹૫૦.૯૮ લાખનો મુદ્દામાલ જપ્ત',
    excerpt: 'During festive-season checking, Vadodara railway police found a large quantity of silver with a passenger from Rajkot travelling on the Santragachi–Porbandar Express.',
    excerptGu: 'તહેવારો નિમિત્તે વડોદરા રેલવે પોલીસના ચેકિંગ દરમિયાન સંતરાગાચી-પોરબંદર એક્સપ્રેસમાંથી રાજકોટના મુસાફર પાસેથી ચાંદીનો મોટો જથ્થો મળી આવ્યો.',
    points: [
      '72 slab-shaped silver pieces and ₹3.40 lakh in cash were taken into custody.',
      'The silver and cash together are valued at ₹50.98 lakh.',
      'The silver was being carried to Rajkot from Chhapa village near Raipur in Chhattisgarh, the inquiry revealed.',
      'Railway police have stepped up their investigation into the purchase bills and GST documents for the silver.'
    ],
    pointsGu: [
      'ચાંદીના ૭૨ ચોરસા દાગીના અને ₹૩.૪૦ લાખની રોકડ કબ્જે',
      'ચાંદી અને રોકડ મળીને કુલ ₹૫૦.૯૮ લાખનો મુદ્દામાલ જપ્ત',
      'છત્તીસગઢના રાયપુર પાસેના છપા ગામથી ચાંદી રાજકોટ લઈ જવાતી હોવાનો ખુલાસો',
      'ચાંદીના કાયદેસરના બિલો અને GST દસ્તાવેજો અંગે રેલવે પોલીસની તપાસ તેજ'
    ],
    tags: ['Vadodara', 'Railway Police', 'Silver Seizure'],
    isLead: true,
    isBreaking: true,
    isTrending: true
  },
  {
    code: 'DeO-mY3omNA',
    kind: 'reel',
    publishedAt: '2026-10-08T12:52:53.000Z',
    category: 'Crime',
    videoCategory: 'Vadodara Breaking',
    filterType: 'Bulletins',
    location: 'Gotri, Vadodara',
    title: 'Gotri: RSS office-bearer accused of attacking society member with a stick; video goes viral',
    titleGu: 'ગોત્રીમાં RSS હોદ્દેદારનો સોસાયટીના સભ્ય પર લાકડીથી હુમલાનો આક્ષેપ, વીડિયો વાયરલ',
    excerpt: 'The dispute broke out during a discussion about shifting electricity poles at Gangotri Tenament near Kunal Char Rasta in Gotri.',
    excerptGu: 'ગોત્રીના કુણાલ ચાર રસ્તા પાસેના ગંગોત્રી ટેનામેન્ટમાં વીજ થાંભલા ખસેડવા મુદ્દે ચર્ચા દરમિયાન વિવાદ થયો હતો.',
    points: [
      'RSS Prant Seva Pramukh Mansukh Jesadiya is alleged to have attacked society member Vishal Talsaniya with a stick.',
      'It is also alleged that he raised the stick at Talsaniya’s wife when she stepped in to protect him.',
      'The entire incident was recorded on a mobile phone and the video has gone viral on social media.',
      'A written application has been filed at Laxmipura police station demanding legal action.'
    ],
    pointsGu: [
      'RSSના પ્રાંત સેવા પ્રમુખ મનસુખ જેસડીયાએ સોસાયટીના સભ્ય વિશાલ તલસાણીયા પર લાકડીથી હુમલો કર્યાનો આક્ષેપ',
      'બચાવવા વચ્ચે પડેલા પત્ની પર પણ લાકડી ઉગામ્યાનો આક્ષેપ',
      'સમગ્ર ઘટના મોબાઈલમાં કેદ, વીડિયો સોશિયલ મીડિયા પર વાયરલ',
      'લક્ષ્મીપુરા પોલીસ મથકે લેખિત અરજી, કાયદેસર કાર્યવાહીની માંગ'
    ],
    tags: ['Vadodara', 'Gotri', 'Viral Video'],
    isTrending: true
  },
  {
    code: 'DeMGBKcIZ3t',
    kind: 'reel',
    publishedAt: '2026-10-07T10:00:00.000Z',
    category: 'City',
    videoCategory: 'Vadodara Breaking',
    filterType: 'Ground reports',
    location: 'Vadodara',
    title: 'Surprise police checking across Vadodara ahead of Navratri, from garba grounds to the railway station',
    titleGu: 'નવરાત્રી પહેલા પોલીસનું સરપ્રાઇઝ ચેકિંગ: ગરબા ગ્રાઉન્ડથી રેલવે સ્ટેશન સુધી સઘન તપાસ',
    excerpt: 'Vadodara police carried out intensive checks from the garba grounds to the railway station, with the SOG working alongside the bomb squad and the dog squad.',
    excerptGu: 'ગરબા ગ્રાઉન્ડથી રેલવે સ્ટેશન સુધી વડોદરા પોલીસે સઘન તપાસ હાથ ધરી. SOGએ બોમ્બ સ્ક્વોડ અને ડોગ સ્ક્વોડ સાથે મળીને ચેકિંગ કર્યું.',
    points: [
      'The premises, entry and exit points and parking areas of Vadodara Central railway station were checked.',
      'Security arrangements were reviewed at the United Way, Vibrant Navratri and Sara Foundation garba grounds.',
      'Police are keeping a close watch for any suspicious object or person.',
      'The advance planning is aimed at the safety of thousands of garba players; security in the city has been tightened so that no untoward incident takes place during Navratri.'
    ],
    pointsGu: [
      'વડોદરા સેન્ટ્રલ રેલવે સ્ટેશનના પરિસર, પ્રવેશ-નિર્ગમ સ્થળો અને પાર્કિંગમાં તપાસ',
      'યુનાઇટેડ-વે, વાયબ્રન્ટ નવરાત્રી અને સારા ફાઉન્ડેશનના ગ્રાઉન્ડ પર સુરક્ષા વ્યવસ્થાની સમીક્ષા',
      'શંકાસ્પદ વસ્તુ કે વ્યક્તિ પર પોલીસની બાજ નજર',
      'હજારો ખેલૈયાઓની સુરક્ષા માટે પોલીસનું આગોતરું આયોજન; નવરાત્રી દરમિયાન કોઈ અનિચ્છનીય બનાવ ન બને તે માટે શહેરમાં સુરક્ષા વધુ સઘન બનાવાઈ છે'
    ],
    tags: ['Vadodara', 'Navratri 2026', 'Vadodara Police', 'Garba'],
    isTrending: true
  },
  {
    code: 'DeL1PPaASxX',
    kind: 'p',
    publishedAt: '2026-10-07T07:33:22.000Z',
    category: 'Politics',
    videoCategory: 'Vadodara Politics',
    filterType: 'Bulletins',
    location: 'Vadodara',
    title: 'BJP holds grand celebration in Vadodara to mark PM Modi’s 25 years in public service',
    titleGu: 'વડાપ્રધાન મોદીની જાહેર સેવાના 25 વર્ષ: વડોદરામાં ભાજપની ભવ્ય ઉજવણી',
    excerpt: 'A Viksit Bharat Sankalp Sabha was held at Navlakhi ground, which the Prime Minister joined virtually and where he gave the slogan “We Will Do It”.',
    excerptGu: 'નવલખી મેદાન ખાતે વિકસિત ભારત સંકલ્પ સભા યોજાઈ, જેમાં વડાપ્રધાન વર્ચ્યુઅલી જોડાયા અને “We Will Do It”નો નારો આપ્યો.',
    points: [
      'The Viksit Bharat Sankalp Sabha was organised at Navlakhi ground in Vadodara.',
      'The Prime Minister joined the gathering virtually.',
      'After the meeting, a Seva Jyot Yatra was taken out up to Polo Ground.'
    ],
    pointsGu: [
      'વડોદરાના નવલખી મેદાન ખાતે વિકસિત ભારત સંકલ્પ સભા યોજાઈ',
      'વડાપ્રધાન સભામાં વર્ચ્યુઅલી જોડાયા',
      'સભા બાદ પોલો ગ્રાઉન્ડ સુધી સેવા જ્યોત યાત્રા નીકળી'
    ],
    tags: ['Vadodara', 'Narendra Modi', 'BJP Gujarat', 'Viksit Bharat']
  },
  {
    code: 'DeL06qqB7aY',
    kind: 'reel',
    publishedAt: '2026-10-07T07:30:33.000Z',
    category: 'Crime',
    videoCategory: 'Vadodara District',
    filterType: 'Ground reports',
    location: 'Karjan',
    title: 'Liquor worth ₹1.30 crore seized in Karjan and Valan destroyed under a bulldozer',
    titleGu: 'કરજણ-વલણમાં ઝડપાયેલા 1.30 કરોડના દારૂનો બુલડોઝર ફેરવી નાશ',
    excerpt: 'The stock of Indian-made foreign liquor seized within the limits of the Karjan and Valan police stations has been destroyed.',
    excerptGu: 'કરજણ અને વલણ પોલીસ મથકની હદમાંથી ઝડપાયેલા ભારતીય બનાવટના વિદેશી દારૂના જથ્થાનો નાશ કરવામાં આવ્યો.',
    points: [
      'A total of 43,427 bottles had been seized in 27 prohibition cases.',
      'The estimated value is ₹1,30,85,264.',
      'Following a court order, the bottles were destroyed on the open ground of the Modern factory at Karjan.',
      'The Karjan Prant Officer, the Deputy Superintendent of Police and other police and administrative officials were present.'
    ],
    pointsGu: [
      '27 પ્રોહિબિશનના ગુનાઓમાં કુલ 43,427 બોટલ ઝડપાઈ હતી',
      'અંદાજિત કિંમત રૂ. 1 કરોડ 30 લાખ 85 હજાર 264',
      'કોર્ટના હુકમ બાદ કરજણ ખાતે મોર્ડન ફેક્ટરીના ખુલ્લા મેદાનમાં બોટલોનો નાશ',
      'કરજણ પ્રાંત અધિકારી, નાયબ પોલીસ અધિક્ષક સહિતના પોલીસ અને વહીવટી અધિકારીઓ ઉપસ્થિત'
    ],
    tags: ['Vadodara', 'Karjan', 'Gujarat Police', 'Prohibition'],
    isTrending: true
  },
  {
    code: 'DeJfv8PiOY4',
    kind: 'p',
    publishedAt: '2026-10-06T09:47:07.000Z',
    category: 'Politics',
    videoCategory: 'Vadodara Politics',
    filterType: 'Explainers',
    location: 'Vadodara',
    title: 'Vadodara Nagar Prathmik Shikshan Samiti election announced: voting for 12 seats on 21 October',
    titleGu: 'નગર પ્રાથમિક શિક્ષણ સમિતિની ચૂંટણીનું બ્યુગલ વાગ્યું: 12 બેઠકો માટે 21 ઓક્ટોબરે મતદાન',
    excerpt: 'The official election programme has been declared. Voting for the 12 seats will be held on 21 October and the result will be announced the same day.',
    excerptGu: 'ચૂંટણીનો સત્તાવાર કાર્યક્રમ જાહેર થયો છે. 12 બેઠકો માટે 21 ઓક્ટોબરે મતદાન થશે અને એ જ દિવસે પરિણામ જાહેર થશે.',
    points: [
      'The new education committee will have 15 members in all: 12 elected and 3 nominated by the government.',
      'The BJP is deliberating on 36 names of probable candidates, with a mandate for 12 names likely on 6 October.',
      'Of the 12 seats, 8 are for the general category, 3 for members with matriculation or higher qualifications and 1 for SC/ST.',
      '6 October: last date for filing nomination forms.',
      '13 October: scrutiny of nomination papers.',
      '21 October: voting from 12 noon to 3 p.m., counting from 3:30 p.m.'
    ],
    pointsGu: [
      'નવી શિક્ષણ સમિતિમાં કુલ 15 સભ્યો: 12 ચૂંટાશે, 3 સરકાર દ્વારા નિયુક્ત',
      'ભાજપમાં સંભવિત ઉમેદવારોના 36 નામો પર મંથન, 6 ઓક્ટોબરે 12 નામો પર મેન્ડેટ અપાય તેવી શક્યતા',
      '12 બેઠકોમાં સામાન્ય વર્ગ માટે 8, મેટ્રિક/ઉચ્ચ લાયકાત માટે 3, SC/ST માટે 1 બેઠક',
      '6 ઓક્ટોબર: ઉમેદવારી ફોર્મ ભરવાની અંતિમ તારીખ',
      '13 ઓક્ટોબર: ઉમેદવારી પત્રોની ચકાસણી',
      '21 ઓક્ટોબર: બપોરે 12થી 3 મતદાન, 3:30 વાગ્યાથી મતગણતરી'
    ],
    tags: ['Vadodara', 'Education Committee', 'Election']
  }
];

function storyBody(lead, points) {
  return `<p>${lead}</p><ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>`;
}

const SEED_VIDEOS = INSTAGRAM_STORIES.map((s, idx) => ({
  id: `ig-${s.code}`,
  title: s.title,
  titleGu: s.titleGu,
  description: s.excerpt,
  descriptionGu: s.excerptGu,
  category: s.videoCategory,
  filterType: s.filterType,
  videoSource: 'instagram',
  videoUrl: `https://www.instagram.com/${s.kind}/${s.code}/`,
  thumbnail: `assets/news/${s.code}.jpg`,
  duration: s.kind === 'reel' ? 'Reel' : 'Post',
  articleId: `art-ig-${s.code}`,
  isLive: false,
  isFeatured: idx === 0,
  createdAt: s.publishedAt
}));

const SEED_ARTICLES = INSTAGRAM_STORIES.map(s => ({
  id: `art-ig-${s.code}`,
  title: s.title,
  titleGu: s.titleGu,
  excerpt: s.excerpt,
  excerptGu: s.excerptGu,
  content: storyBody(s.excerpt, s.points),
  contentGu: storyBody(s.excerptGu, s.pointsGu),
  category: s.category,
  location: s.location,
  author: 'India News 18 Desk',
  authorRole: 'Vadodara newsroom',
  image: `assets/news/${s.code}.jpg`,
  imageCaption: 'From the India News 18 video bulletin.',
  imageCredit: 'India News 18',
  tags: s.tags,
  videoId: `ig-${s.code}`,
  isLead: !!s.isLead,
  isBreaking: !!s.isBreaking,
  isTrending: !!s.isTrending,
  views: 0,
  publishedAt: s.publishedAt
}));

const DEFAULT_VIDEOS = [
  ...SEED_VIDEOS,
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
    isFeatured: false,
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

const DEFAULT_ARTICLES = SEED_ARTICLES;

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

// Add newly shipped stories to data that is already saved in this browser
function mergeSeed(key, seedItems, exclusiveFlag) {
  const list = loadData(key, []);
  const fresh = seedItems.filter(s => !list.some(x => x.id === s.id));
  if (!fresh.length) return;
  if (fresh.some(s => s[exclusiveFlag])) list.forEach(x => { x[exclusiveFlag] = false; });
  saveData(key, [...fresh, ...list]);
}

if (Number(localStorage.getItem(STORAGE_KEYS.SEED) || 0) < SEED_VERSION) {
  mergeSeed(STORAGE_KEYS.ARTICLES, SEED_ARTICLES, 'isLead');
  mergeSeed(STORAGE_KEYS.VIDEOS, SEED_VIDEOS, 'isFeatured');
  localStorage.setItem(STORAGE_KEYS.SEED, String(SEED_VERSION));
}

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
