/**
 * India News 18 / Breaking Edition — Static UI Dictionary (English / Gujarati)
 * Covers fixed chrome text that ships with the code (nav, buttons, labels, toasts).
 * Dynamic content authored via the admin CMS (articles, videos, tips, tickers)
 * is handled separately by translate.js.
 */

const LANG_KEY = 'in18_lang';

const DICT = {
  en: {
    nav_home: 'Home', nav_city: 'City', nav_crime: 'Crime', nav_politics: 'Politics',
    nav_business: 'Business', nav_sports: 'Sports', nav_entertainment: 'Entertainment',
    nav_videos: 'Videos', nav_india_news: 'India News', nav_about: 'About', nav_contact: 'Contact',

    search_btn: 'Search news',
    search_placeholder: 'Search breaking stories, wards, or topics...',
    search_hint: "Type a keyword to search local stories and video bulletins...",
    search_no_results: 'No stories found matching',

    splash_loading: "Loading today's bulletin",
    splash_skip: 'Tap anywhere to skip',
    splash_subtitle: 'Eleven wards · Forty villages · Since 2016',

    brand_title: 'City & District Desk',
    brand_sub: 'Local news since 2016',

    footer_sections: 'Sections', footer_watch: 'Watch', footer_agency: 'The Agency',
    footer_watch_evening: 'Evening Bulletin', footer_watch_ground: 'Ground Report',
    footer_watch_corporator: 'Corporator Speaks', footer_watch_mandi: 'Mandi Watch',
    footer_watch_explainer: 'City Explainer',
    footer_about_us: 'About Us', footer_contact_us: 'Contact Us',
    footer_editorial: 'Editorial Standards', footer_corrections: 'Corrections & Tips',
    footer_advertise: 'Advertise', footer_privacy: 'Privacy', footer_terms: 'Terms',
    footer_rss: 'RSS', footer_times: 'All times IST',
    footer_tagline: 'Local news since 2016. Eleven wards, forty villages, nine reporters and one camera unit.',
    footer_copyright: '© 2026 India News 18 · Breaking Edition · Published from Market Road',

    tab_home: 'Home', tab_videos: 'Videos', tab_search: 'Search', tab_sections: 'Sections',

    home_featured_videos: 'Featured Videos',
    home_featured_videos_sub: 'Bulletins, ground reports and interviews shot in the city',
    home_all_shows: 'All shows →',
    home_city_civic: 'City & Civic',
    home_view_all: 'View all →',
    home_business: 'Business',
    home_sports: 'Sports',
    home_most_read_today: 'Most read today',
    home_live_corp: 'Live from the corporation',
    home_newsletter_title: 'The morning list, in your inbox',
    home_newsletter_desc: "Ward-wise water and power cuts, mandi rates, court dates and the day's bulletin — sent by 7 a.m. Free, and you can leave any time.",
    home_subscribe: 'Subscribe',
    home_whatsapp_follow: 'Or follow on WhatsApp',
    home_whatsapp_desc: 'Breaking alerts only — about four messages a day.',
    home_join_channel: 'Join the channel',
    email_placeholder: 'you@example.com',

    byline_reported_by: 'Reported by', byline_desk: 'desk',
    byline_updated: 'Updated', byline_published: 'Published',

    cat_latest: 'Latest', cat_most_read: 'Most read', cat_video_only: 'Video only',
    cat_no_stories: 'No stories published in this category yet.',
    cat_load_more: 'Load more stories',
    cat_most_read_in: 'Most read in',
    breadcrumb_home: 'Home',

    cat_blurb_city: 'Wards, water, roads and power — what the municipal corporation did today.',
    cat_blurb_crime: 'Station-wise reports, court hearings and follow-ups our reporters keep chasing.',
    cat_blurb_politics: "Corporators, the MLA's office and district-level party news.",
    cat_blurb_business: 'Mandi rates, the MIDC belt, local traders and jobs.',
    cat_blurb_sports: 'District leagues, school tournaments and the players coming up.',
    cat_blurb_entertainment: 'Ganesh mandals, local theatre, shoots in town and weekend listings.',
    cat_blurb_default: 'Local district reporting and updates.',

    article_not_found: 'Article not found.',
    article_share: 'Share',
    article_live_updates: 'Live updates',
    article_default_role: 'City Reporter',
    article_default_author: 'Newsroom',
    article_default_caption: 'Scene from the reported location.',
    article_default_credit: 'Photo: Breaking Edition',
    article_default_body: 'Report details being updated from the field.',
    article_related: 'Related reading',
    article_watch_story: 'Watch on this story',
    share_copy_link: 'Link',

    videos_eyebrow: 'Video',
    videos_h1: 'Bulletins & Ground Reports',
    videos_desc: 'Three bulletins a week plus field reports, shot by our own camera unit across the city and the taluka.',
    videos_filter_all: 'All', videos_filter_bulletins: 'Bulletins',
    videos_filter_ground: 'Ground reports', videos_filter_interviews: 'Interviews',
    videos_filter_explainers: 'Explainers', videos_filter_live: 'Live',
    videos_latest_episodes: 'Latest episodes',
    video_watching_now: 'watching now',
    video_send_whatsapp: 'Send on WhatsApp',
    video_up_next: 'Up next',
    video_views: 'views',
    video_default_filter: 'Special Bulletin',
    video_recent: 'Recent',
    video_today: 'Today',

    about_eyebrow: 'About us',
    about_h1: 'A small newsroom that covers one city properly',
    about_p1: 'Breaking Edition started in 2016 as a YouTube bulletin recorded in one room above a stationery shop. Today nine reporters and stringers cover eleven wards and about forty villages in the taluka, and we record three video bulletins a week.',
    about_p2: 'We are not owned by a party or a builder. The channel runs on local advertising and reader contributions, and every story carries the name of the reporter who went there.',
    about_stat1_label: 'Started as a YouTube bulletin from one room',
    about_stat2_label: 'Reporters and stringers across the district',
    about_stat3_label: 'Video bulletins recorded every week',
    about_stat4_label: 'Wards and 40 villages we cover regularly',
    about_who_works: 'Who works here',

    contact_eyebrow: 'Contact',
    contact_h1: 'Reach the newsroom',
    contact_desc: 'Someone is at the desk from 7 a.m. to 11 p.m. For a correction or a complaint about a story, call the editor directly — we reply the same day.',
    contact_name: 'Name', contact_name_ph: 'Your full name',
    contact_email: 'Email',
    contact_subject: 'Subject',
    contact_opt_general: 'General enquiry', contact_opt_correction: 'Correction request',
    contact_opt_press: 'Press / licensing', contact_opt_careers: 'Careers',
    contact_message: 'Message', contact_message_ph: 'Tell us what this is about',
    contact_send: 'Send message',
    contact_reply_note: 'We reply from a monitored address.',
    contact_tip_label: 'Submit a news tip',
    contact_tip_desc: "Send a photo, a video or just an address. Tips come to the editor's phone only, and we never publish your name without asking.",
    contact_tip_whatsapp: 'Send a tip on WhatsApp',
    contact_tip_online: 'Online Tip Form',
    contact_office: 'Office',
    contact_desk_whatsapp: 'News desk / WhatsApp',
    contact_editor_ads: 'Editor / Ads',

    toast_subscribed: 'Thank you for subscribing to The Morning List!',
    toast_invalid_email: 'Please enter a valid email address.',
    toast_msg_received: 'Your message has been received by the desk.',
    toast_link_copied: 'Article link copied to clipboard!',
    toast_tip_submitted: 'Tip submitted safely to the editor!',
    alert_all_loaded: 'All latest stories loaded for',

    time_just_now: 'Just now', time_min_ago: 'min ago',
    time_hour_ago: 'hour ago', time_hours_ago: 'hours ago',
    time_day_ago: 'day ago', time_days_ago: 'days ago',

    india_news_h1: 'India News',
    india_news_blurb: 'Live national headlines from the wire, alongside our own reporting.',
    india_news_source: 'Source',
    india_news_wire: 'Wire',
    india_news_loading: 'Loading live headlines...',
    india_news_error: 'Live news is unavailable right now. Please try again shortly.',
    india_news_empty: 'No headlines found for this category right now.',
    india_news_cat_top: 'Top', india_news_cat_politics: 'Politics',
    india_news_cat_business: 'Business', india_news_cat_sports: 'Sports',
    india_news_cat_entertainment: 'Entertainment', india_news_cat_technology: 'Technology',
    india_news_cat_health: 'Health',
    india_news_read_more: 'Read full story ↗',

    ticker_none: 'No active breaking bulletins at this moment.',
    badge_breaking: 'Breaking',
    article_local_desk: 'Local Desk',
    home_live_widget_headline: 'General body meeting: ward 7 water item on the floor',
    tip_prompt_name: 'Your Name (or leave blank for Anonymous):',
    tip_prompt_contact: 'WhatsApp / Phone number (Confidential):',
    tip_prompt_message: 'Describe the news tip or report:'
  },
  gu: {
    nav_home: 'હોમ', nav_city: 'શહેર', nav_crime: 'ક્રાઇમ', nav_politics: 'રાજકારણ',
    nav_business: 'બિઝનેસ', nav_sports: 'સ્પોર્ટ્સ', nav_entertainment: 'મનોરંજન',
    nav_videos: 'વિડિયો', nav_india_news: 'ભારત સમાચાર', nav_about: 'અમારા વિશે', nav_contact: 'સંપર્ક',

    search_btn: 'સમાચાર શોધો',
    search_placeholder: 'બ્રેકિંગ સ્ટોરી, વોર્ડ અથવા વિષય શોધો...',
    search_hint: 'સ્થાનિક સમાચાર અને વિડિયો બુલેટિન શોધવા માટે કીવર્ડ ટાઈપ કરો...',
    search_no_results: 'આને મળતી કોઈ સ્ટોરી મળી નથી',

    splash_loading: 'આજનું બુલેટિન લોડ થઈ રહ્યું છે',
    splash_skip: 'છોડવા માટે ગમે ત્યાં ટેપ કરો',
    splash_subtitle: 'અગિયાર વોર્ડ · ચાલીસ ગામ · 2016 થી',

    brand_title: 'શહેર અને જિલ્લા ડેસ્ક',
    brand_sub: '2016 થી સ્થાનિક સમાચાર',

    footer_sections: 'વિભાગો', footer_watch: 'જુઓ', footer_agency: 'એજન્સી',
    footer_watch_evening: 'ઈવનિંગ બુલેટિન', footer_watch_ground: 'ગ્રાઉન્ડ રિપોર્ટ',
    footer_watch_corporator: 'કોર્પોરેટર બોલે છે', footer_watch_mandi: 'મંડી વોચ',
    footer_watch_explainer: 'સિટી એક્સપ્લેનર',
    footer_about_us: 'અમારા વિશે', footer_contact_us: 'સંપર્ક કરો',
    footer_editorial: 'સંપાદકીય ધોરણો', footer_corrections: 'સુધારા અને ટીપ્સ',
    footer_advertise: 'જાહેરાત આપો', footer_privacy: 'ગોપનીયતા', footer_terms: 'શરતો',
    footer_rss: 'RSS', footer_times: 'બધા સમય IST',
    footer_tagline: '2016થી સ્થાનિક સમાચાર. અગિયાર વોર્ડ, ચાલીસ ગામ, નવ રિપોર્ટર અને એક કેમેરા યુનિટ.',
    footer_copyright: '© 2026 ઈન્ડિયા ન્યૂઝ 18 · બ્રેકિંગ એડિશન · માર્કેટ રોડ થી પ્રકાશિત',

    tab_home: 'હોમ', tab_videos: 'વિડિયો', tab_search: 'શોધો', tab_sections: 'વિભાગો',

    home_featured_videos: 'મુખ્ય વિડિયો',
    home_featured_videos_sub: 'શહેરમાં શૂટ થયેલા બુલેટિન, ગ્રાઉન્ડ રિપોર્ટ અને ઈન્ટરવ્યુ',
    home_all_shows: 'બધા શો →',
    home_city_civic: 'શહેર અને નાગરિક',
    home_view_all: 'બધું જુઓ →',
    home_business: 'બિઝનેસ',
    home_sports: 'સ્પોર્ટ્સ',
    home_most_read_today: 'આજે સૌથી વધુ વંચાયેલ',
    home_live_corp: 'કોર્પોરેશનમાંથી લાઈવ',
    home_newsletter_title: 'સવારની યાદી, તમારા ઈનબોક્સમાં',
    home_newsletter_desc: 'વોર્ડ મુજબ પાણી અને વીજ કાપ, મંડી ભાવ, કોર્ટની તારીખો અને દિવસનું બુલેટિન — સવારે 7 વાગ્યા સુધીમાં મોકલાય છે. મફત, અને તમે ગમે ત્યારે છોડી શકો છો.',
    home_subscribe: 'સબ્સ્ક્રાઈબ કરો',
    home_whatsapp_follow: 'અથવા WhatsApp પર ફોલો કરો',
    home_whatsapp_desc: 'ફક્ત બ્રેકિંગ એલર્ટ — દિવસમાં લગભગ ચાર મેસેજ.',
    home_join_channel: 'ચેનલમાં જોડાઓ',
    email_placeholder: 'you@example.com',

    byline_reported_by: 'અહેવાલ', byline_desk: 'ડેસ્ક',
    byline_updated: 'અપડેટેડ', byline_published: 'પ્રકાશિત',

    cat_latest: 'લેટેસ્ટ', cat_most_read: 'સૌથી વધુ વંચાયેલ', cat_video_only: 'ફક્ત વિડિયો',
    cat_no_stories: 'આ વિભાગમાં હજુ કોઈ સ્ટોરી પ્રકાશિત થઈ નથી.',
    cat_load_more: 'વધુ સ્ટોરી લોડ કરો',
    cat_most_read_in: 'માં સૌથી વધુ વંચાયેલ',
    breadcrumb_home: 'હોમ',

    cat_blurb_city: 'વોર્ડ, પાણી, રસ્તા અને વીજળી — આજે નગરપાલિકાએ શું કર્યું.',
    cat_blurb_crime: 'સ્ટેશન મુજબ અહેવાલ, કોર્ટની સુનાવણી અને અમારા રિપોર્ટર જે ફોલો-અપ કરતા રહે છે.',
    cat_blurb_politics: 'કોર્પોરેટર, ધારાસભ્યની ઓફિસ અને જિલ્લા સ્તરના પક્ષના સમાચાર.',
    cat_blurb_business: 'મંડી ભાવ, MIDC પટ્ટો, સ્થાનિક વેપારીઓ અને નોકરીઓ.',
    cat_blurb_sports: 'જિલ્લા લીગ, શાળા ટુર્નામેન્ટ અને આવનારા ખેલાડીઓ.',
    cat_blurb_entertainment: 'ગણેશ મંડળ, સ્થાનિક નાટક, શહેરમાં શૂટિંગ અને વીકએન્ડ લિસ્ટિંગ.',
    cat_blurb_default: 'સ્થાનિક જિલ્લા અહેવાલ અને અપડેટ.',

    article_not_found: 'લેખ મળ્યો નથી.',
    article_share: 'શેર',
    article_live_updates: 'લાઈવ અપડેટ',
    article_default_role: 'સિટી રિપોર્ટર',
    article_default_author: 'ન્યૂઝરૂમ',
    article_default_caption: 'અહેવાલ સ્થળનું દ્રશ્ય.',
    article_default_credit: 'ફોટો: બ્રેકિંગ એડિશન',
    article_default_body: 'ફિલ્ડમાંથી અહેવાલની વિગતો અપડેટ થઈ રહી છે.',
    article_related: 'સંબંધિત વાંચન',
    article_watch_story: 'આ સ્ટોરી પર જુઓ',
    share_copy_link: 'લિંક',

    videos_eyebrow: 'વિડિયો',
    videos_h1: 'બુલેટિન અને ગ્રાઉન્ડ રિપોર્ટ',
    videos_desc: 'અઠવાડિયામાં ત્રણ બુલેટિન વત્તા ફિલ્ડ રિપોર્ટ, અમારા પોતાના કેમેરા યુનિટ દ્વારા શહેર અને તાલુકામાં શૂટ કરાયેલા.',
    videos_filter_all: 'બધા', videos_filter_bulletins: 'બુલેટિન',
    videos_filter_ground: 'ગ્રાઉન્ડ રિપોર્ટ', videos_filter_interviews: 'ઈન્ટરવ્યુ',
    videos_filter_explainers: 'સમજૂતી', videos_filter_live: 'લાઈવ',
    videos_latest_episodes: 'લેટેસ્ટ એપિસોડ',
    video_watching_now: 'હમણાં જોઈ રહ્યા છે',
    video_send_whatsapp: 'WhatsApp પર મોકલો',
    video_up_next: 'હવે પછી',
    video_views: 'વ્યુઝ',
    video_default_filter: 'ખાસ બુલેટિન',
    video_recent: 'તાજેતરનું',
    video_today: 'આજે',

    about_eyebrow: 'અમારા વિશે',
    about_h1: 'એક નાનું ન્યૂઝરૂમ જે એક શહેરને યોગ્ય રીતે કવર કરે છે',
    about_p1: 'બ્રેકિંગ એડિશનની શરૂઆત 2016માં એક સ્ટેશનરી દુકાનની ઉપરના એક રૂમમાં રેકોર્ડ થયેલા YouTube બુલેટિન તરીકે થઈ હતી. આજે નવ રિપોર્ટર અને સ્ટ્રિંગર્સ અગિયાર વોર્ડ અને તાલુકાના લગભગ ચાલીસ ગામ કવર કરે છે, અને અમે અઠવાડિયામાં ત્રણ વિડિયો બુલેટિન રેકોર્ડ કરીએ છીએ.',
    about_p2: 'અમે કોઈ પક્ષ કે બિલ્ડરની માલિકીના નથી. ચેનલ સ્થાનિક જાહેરાત અને વાચકોના યોગદાનથી ચાલે છે, અને દરેક સ્ટોરી પર ત્યાં ગયેલા રિપોર્ટરનું નામ હોય છે.',
    about_stat1_label: 'એક રૂમમાંથી YouTube બુલેટિન તરીકે શરૂઆત',
    about_stat2_label: 'જિલ્લાભરમાં રિપોર્ટર અને સ્ટ્રિંગર્સ',
    about_stat3_label: 'દર અઠવાડિયે રેકોર્ડ થતા વિડિયો બુલેટિન',
    about_stat4_label: 'વોર્ડ અને 40 ગામ જે અમે નિયમિત કવર કરીએ છીએ',
    about_who_works: 'અહીં કોણ કામ કરે છે',

    contact_eyebrow: 'સંપર્ક',
    contact_h1: 'ન્યૂઝરૂમનો સંપર્ક કરો',
    contact_desc: 'સવારે 7 થી રાત્રે 11 વાગ્યા સુધી ડેસ્ક પર કોઈ હાજર હોય છે. સ્ટોરી અંગે સુધારો કે ફરિયાદ માટે, સંપાદકને સીધો કૉલ કરો — અમે તે જ દિવસે જવાબ આપીએ છીએ.',
    contact_name: 'નામ', contact_name_ph: 'તમારું પૂરું નામ',
    contact_email: 'ઈમેલ',
    contact_subject: 'વિષય',
    contact_opt_general: 'સામાન્ય પૂછપરછ', contact_opt_correction: 'સુધારાની વિનંતી',
    contact_opt_press: 'પ્રેસ / લાયસન્સિંગ', contact_opt_careers: 'કારકિર્દી',
    contact_message: 'સંદેશ', contact_message_ph: 'આ શેના વિશે છે તે અમને જણાવો',
    contact_send: 'સંદેશ મોકલો',
    contact_reply_note: 'અમે મોનિટર થતા સરનામાંથી જવાબ આપીએ છીએ.',
    contact_tip_label: 'સમાચાર ટીપ સબમિટ કરો',
    contact_tip_desc: 'ફોટો, વિડિયો અથવા ફક્ત સરનામું મોકલો. ટીપ ફક્ત સંપાદકના ફોન પર આવે છે, અને અમે પૂછ્યા વગર તમારું નામ ક્યારેય પ્રકાશિત કરતા નથી.',
    contact_tip_whatsapp: 'WhatsApp પર ટીપ મોકલો',
    contact_tip_online: 'ઓનલાઈન ટીપ ફોર્મ',
    contact_office: 'ઓફિસ',
    contact_desk_whatsapp: 'ન્યૂઝ ડેસ્ક / WhatsApp',
    contact_editor_ads: 'સંપાદક / જાહેરાત',

    toast_subscribed: 'ધ મોર્નિંગ લિસ્ટ સબ્સ્ક્રાઈબ કરવા બદલ આભાર!',
    toast_invalid_email: 'કૃપા કરી માન્ય ઈમેલ સરનામું દાખલ કરો.',
    toast_msg_received: 'તમારો સંદેશ ડેસ્ક દ્વારા મળી ગયો છે.',
    toast_link_copied: 'લેખની લિંક ક્લિપબોર્ડ પર કૉપિ થઈ ગઈ!',
    toast_tip_submitted: 'ટીપ સંપાદકને સુરક્ષિત રીતે સબમિટ થઈ ગઈ!',
    alert_all_loaded: 'માટે બધી લેટેસ્ટ સ્ટોરી લોડ થઈ ગઈ',

    time_just_now: 'હમણાં જ', time_min_ago: 'મિનિટ પહેલા',
    time_hour_ago: 'કલાક પહેલા', time_hours_ago: 'કલાક પહેલા',
    time_day_ago: 'દિવસ પહેલા', time_days_ago: 'દિવસ પહેલા',

    india_news_h1: 'ભારત સમાચાર',
    india_news_blurb: 'અમારા પોતાના અહેવાલ સાથે, વાયરમાંથી લાઈવ રાષ્ટ્રીય હેડલાઈન.',
    india_news_source: 'સ્રોત',
    india_news_wire: 'વાયર',
    india_news_loading: 'લાઈવ હેડલાઈન લોડ થઈ રહી છે...',
    india_news_error: 'લાઈવ સમાચાર હાલમાં ઉપલબ્ધ નથી. કૃપા કરી થોડી વારમાં ફરી પ્રયાસ કરો.',
    india_news_empty: 'આ વિભાગ માટે હાલમાં કોઈ હેડલાઈન મળી નથી.',
    india_news_cat_top: 'ટોપ', india_news_cat_politics: 'રાજકારણ',
    india_news_cat_business: 'બિઝનેસ', india_news_cat_sports: 'સ્પોર્ટ્સ',
    india_news_cat_entertainment: 'મનોરંજન', india_news_cat_technology: 'ટેકનોલોજી',
    india_news_cat_health: 'આરોગ્ય',
    india_news_read_more: 'પૂરી સ્ટોરી વાંચો ↗',

    ticker_none: 'હાલમાં કોઈ સક્રિય બ્રેકિંગ બુલેટિન નથી.',
    badge_breaking: 'બ્રેકિંગ',
    article_local_desk: 'લોકલ ડેસ્ક',
    home_live_widget_headline: 'જનરલ બોડી મીટિંગ: વોર્ડ 7 પાણીનો મુદ્દો ફ્લોર પર',
    tip_prompt_name: 'તમારું નામ (અથવા અનામી માટે ખાલી છોડો):',
    tip_prompt_contact: 'WhatsApp / ફોન નંબર (ગોપનીય):',
    tip_prompt_message: 'સમાચાર ટીપ અથવા અહેવાલનું વર્ણન કરો:'
  }
};

export const I18n = {
  getLang() {
    return localStorage.getItem(LANG_KEY) === 'gu' ? 'gu' : 'en';
  },
  setLang(lang) {
    const next = lang === 'gu' ? 'gu' : 'en';
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent('in18_lang_changed', { detail: { lang: next } }));
  },
  toggleLang() {
    this.setLang(this.getLang() === 'gu' ? 'en' : 'gu');
  },
  t(key) {
    const lang = this.getLang();
    return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
  }
};
