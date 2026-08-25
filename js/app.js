/**
 * India News 18 / Breaking Edition — Public Front-End Application
 */
import { NewsStore } from './store.js';
import { I18n } from './i18n.js';
import { L, LH, TRANSLATIONS_UPDATED_EVENT } from './translate.js';
import { fetchIndiaNews, INDIA_NEWS_CATEGORIES } from './newsApi.js';

class App {
  constructor() {
    this.currentRoute = 'home';
    this.currentCategory = 'City';
    this.currentArticleId = null;
    this.currentVideoId = null;
    this.videoFilter = 'All';
    this.categoryFilter = 'Latest';
    this.indiaNewsCategory = 'top';
    this._rerenderTimer = null;

    this.init();
  }

  init() {
    document.documentElement.lang = I18n.getLang();
    this.initClock();
    this.initSplash();
    this.initRouter();
    this.initSearch();
    this.initMobileDrawer();
    this.initLangToggle();
    this.applyStaticI18n();

    // Listen to store updates
    window.addEventListener('news_store_updated', () => {
      this.renderTicker();
      this.renderCurrentView();
    });

    // Language switched — refresh static chrome + re-render current view
    window.addEventListener('in18_lang_changed', () => {
      this.applyStaticI18n();
      this.renderTicker();
      this.renderCurrentView();
    });

    // Background translations resolved — debounce bursts into one re-render
    window.addEventListener(TRANSLATIONS_UPDATED_EVENT, () => {
      clearTimeout(this._rerenderTimer);
      this._rerenderTimer = setTimeout(() => {
        this.renderTicker();
        this.renderCurrentView();
      }, 150);
    });

    this.renderTicker();
    this.handleRoute();
  }

  // ==========================================
  // I18N HELPERS
  // ==========================================
  applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = I18n.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', I18n.t(el.dataset.i18nPlaceholder));
    });
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) toggleBtn.dataset.active = I18n.getLang();
  }

  initLangToggle() {
    const btn = document.getElementById('langToggleBtn');
    if (!btn) return;
    btn.dataset.active = I18n.getLang();
    btn.addEventListener('click', () => I18n.toggleLang());
  }

  catLabel(cat) {
    if (!cat) return cat;
    const key = 'nav_' + cat.toLowerCase();
    const translated = I18n.t(key);
    return translated === key ? cat : translated;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  safeUrl(url) {
    try {
      const u = new URL(url, window.location.href);
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch {
      // fall through
    }
    return '#';
  }

  // Live IST Clock
  initClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;

    const updateClock = () => {
      const d = new Date();
      const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const t = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      clockEl.textContent = `${day} · ${t} IST`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Splash Screen Handlers
  initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const hide = () => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 500);
    };

    splash.addEventListener('click', hide);
    setTimeout(hide, 2400);
  }

  // Client Routing (Hash Based)
  initRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/').filter(Boolean);

    // If navigating to admin
    if (parts[0] === 'admin') {
      window.location.href = 'admin.html';
      return;
    }

    if (parts[0] === 'category' && parts[1]) {
      this.currentRoute = 'category';
      this.currentCategory = decodeURIComponent(parts[1]);
    } else if (parts[0] === 'article' && parts[1]) {
      this.currentRoute = 'article';
      this.currentArticleId = parts[1];
    } else if (parts[0] === 'videos') {
      this.currentRoute = 'videos';
    } else if (parts[0] === 'video' && parts[1]) {
      this.currentRoute = 'video';
      this.currentVideoId = parts[1];
    } else if (parts[0] === 'india-news') {
      this.currentRoute = 'india-news';
    } else if (parts[0] === 'about') {
      this.currentRoute = 'about';
    } else if (parts[0] === 'contact') {
      this.currentRoute = 'contact';
    } else {
      this.currentRoute = 'home';
    }

    this.updateNavState();
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateNavState() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (
        (this.currentRoute === 'home' && href === '#/') ||
        (this.currentRoute === 'category' && href === `#/category/${this.currentCategory}`) ||
        (this.currentRoute === 'videos' && href === '#/videos') ||
        (this.currentRoute === 'video' && href === '#/videos') ||
        (this.currentRoute === 'india-news' && href === '#/india-news')
      ) {
        link.classList.add('active');
      }
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      const target = btn.dataset.target;
      if (
        (this.currentRoute === 'home' && target === 'home') ||
        (this.currentRoute === 'videos' && target === 'videos') ||
        (this.currentRoute === 'about' && target === 'about')
      ) {
        btn.classList.add('active');
      }
    });
  }

  renderCurrentView() {
    const container = document.getElementById('appView');
    if (!container) return;

    switch (this.currentRoute) {
      case 'home':
        this.renderHome(container);
        break;
      case 'category':
        this.renderCategory(container);
        break;
      case 'article':
        this.renderArticle(container);
        break;
      case 'videos':
        this.renderVideos(container);
        break;
      case 'video':
        this.renderVideoDetail(container);
        break;
      case 'india-news':
        this.renderIndiaNews(container);
        break;
      case 'about':
        this.renderAbout(container);
        break;
      case 'contact':
        this.renderContact(container);
        break;
      default:
        this.renderHome(container);
    }
  }

  // Breaking Live Ticker
  renderTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const tickers = NewsStore.getTickers().filter(t => t.active);
    if (!tickers.length) {
      track.innerHTML = `<span class="ticker-item">${I18n.t('ticker_none')}</span>`;
      return;
    }

    const itemsHtml = tickers.map(t => `<span class="ticker-item">${L(t.text)}</span>`).join('');
    // Duplicate for seamless infinite loop
    track.innerHTML = `${itemsHtml}${itemsHtml}`;
  }

  // ==========================================
  // VIEW: HOME
  // ==========================================
  renderHome(container) {
    const articles = NewsStore.getArticles();
    const videos = NewsStore.getVideos();
    const settings = NewsStore.getSettings();

    const leadArticle = articles.find(a => a.isLead) || articles[0] || {};
    const secondaryArticles = articles.filter(a => a.id !== leadArticle.id).slice(0, 4);

    const cityArticles = articles.filter(a => a.category === 'City').slice(0, 3);
    const businessArticles = articles.filter(a => a.category === 'Business').slice(0, 4);
    const sportsArticles = articles.filter(a => a.category === 'Sports').slice(0, 3);
    const trendingArticles = articles.filter(a => a.isTrending).slice(0, 7);

    container.innerHTML = `
      ${articles.length ? `
      <!-- Hero Top Section -->
      <section class="container home-hero-section">
        <article class="hero-lead-article" onclick="location.hash='#/article/${leadArticle.id}'">
          <div class="hero-media-box">
            ${leadArticle.image
              ? `<img src="${leadArticle.image}" alt="${this.escapeHtml(leadArticle.title)}">`
              : `<div class="media-placeholder">LEAD PHOTO — 1600×900</div>`}
            <div class="badges">
              ${leadArticle.isBreaking ? `<span class="badge-breaking">${I18n.t('badge_breaking')}</span>` : ''}
              <span class="badge-category-dark">${this.catLabel(leadArticle.category) || this.catLabel('City')}</span>
            </div>
          </div>
          <h1 class="hero-lead-title">${L(leadArticle.title)}</h1>
          <p class="hero-lead-excerpt">${L(leadArticle.excerpt) || ''}</p>
          <div class="byline-meta">
            <span class="author-name">${I18n.t('byline_reported_by')} ${leadArticle.author || 'Newsroom'}</span>
            <span>·</span>
            <span>${this.catLabel(leadArticle.category) || this.catLabel('City')} ${I18n.t('byline_desk')}</span>
            <span>·</span>
            <span>${I18n.t('byline_updated')} ${this.formatTimeAgo(leadArticle.updatedAt || leadArticle.publishedAt)}</span>
          </div>
        </article>

        <!-- Secondary Stories Rail -->
        <div class="secondary-stories-rail">
          ${secondaryArticles.map(art => `
            <article class="secondary-story-card" onclick="location.hash='#/article/${art.id}'">
              <div>
                <span class="badge-pill-red">${this.catLabel(art.category)}</span>
                <h3 class="secondary-story-title">${L(art.title)}</h3>
                <div class="secondary-story-time">${this.formatTimeAgo(art.publishedAt)}</div>
              </div>
              <div class="secondary-story-thumb">
                ${art.image
                  ? `<img src="${art.image}" alt="${this.escapeHtml(art.title)}">`
                  : `<div class="media-placeholder">PHOTO</div>`}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      ` : this.renderHomeEmptyState()}

      <!-- Featured Videos Strip -->
      <section class="featured-videos-section">
        <div class="container">
          <div class="section-header-dark">
            <h2>${I18n.t('home_featured_videos')}</h2>
            <span class="sub">${I18n.t('home_featured_videos_sub')}</span>
            <div class="nav-spacer"></div>
            <a href="#/videos" style="color:var(--link-blue);font-size:12.5px;font-weight:700;text-transform:uppercase">${I18n.t('home_all_shows')}</a>
          </div>
          <div class="videos-horizontal-scroll">
            ${videos.map(v => `
              <article class="video-card-dark" onclick="location.hash='#/video/${v.id}'">
                <div class="video-thumb-box">
                  ${v.thumbnail
                    ? `<img src="${v.thumbnail}" alt="${this.escapeHtml(v.title)}">`
                    : `<div class="media-placeholder">VIDEO</div>`}
                  <div class="video-play-overlay">
                    <div class="play-circle-btn"><span class="triangle"></span></div>
                  </div>
                  <span class="video-source-badge">${v.videoSource || 'YT'}</span>
                  <span class="video-duration-pill">${v.duration || '00:00'}</span>
                </div>
                <div class="video-card-cat">${L(v.category)}</div>
                <h3 class="video-card-title">${L(v.title)}</h3>
                <div class="video-card-time">${v.time ? L(v.time) : this.formatTimeAgo(v.createdAt)}</div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      ${articles.length ? `
      <!-- Beat Stories & Sidebar -->
      <section class="container home-content-split">
        <div style="display:flex;flex-direction:column;gap:38px;">
          <!-- City & Civic -->
          <div>
            <div class="section-title-bar">
              <span class="red-bar-indicator"></span>
              <h2>${I18n.t('home_city_civic')}</h2>
              <div class="nav-spacer"></div>
              <a href="#/category/City" class="section-view-all">${I18n.t('home_view_all')}</a>
            </div>
            <div class="grid-3-col">
              ${cityArticles.map(a => this.renderStandardNewsCard(a)).join('')}
            </div>
          </div>

          <!-- Business (Beige Box) -->
          <div class="business-beige-box">
            <div class="section-title-bar">
              <span class="red-bar-indicator"></span>
              <h2>${I18n.t('home_business')}</h2>
              <div class="nav-spacer"></div>
              <a href="#/category/Business" class="section-view-all">${I18n.t('home_view_all')}</a>
            </div>
            <div class="grid-2-col">
              ${businessArticles.map(a => `
                <article class="business-card-horizontal" onclick="location.hash='#/article/${a.id}'">
                  <div class="business-thumb">
                    ${a.image ? `<img src="${a.image}">` : '<div class="media-placeholder">PHOTO</div>'}
                  </div>
                  <div>
                    <span class="badge-pill-red">${this.catLabel(a.category)}</span>
                    <h3 style="font-family:var(--font-serif);font-size:17px;line-height:1.26;margin-top:8px">${L(a.title)}</h3>
                    <div style="font-size:11.5px;color:var(--text-subtle);margin-top:8px">${this.formatTimeAgo(a.publishedAt)}</div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>

          <!-- Sports -->
          <div>
            <div class="section-title-bar">
              <span class="red-bar-indicator"></span>
              <h2>${I18n.t('home_sports')}</h2>
              <div class="nav-spacer"></div>
              <a href="#/category/Sports" class="section-view-all">${I18n.t('home_view_all')}</a>
            </div>
            <div class="grid-3-col">
              ${sportsArticles.map(a => this.renderStandardNewsCard(a)).join('')}
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <aside class="home-sidebar">
          <div class="trending-widget">
            <div class="trending-header">
              <span class="red-dot"></span>
              <span class="trending-header-title">${I18n.t('home_most_read_today')}</span>
            </div>
            <ol class="trending-list">
              ${trendingArticles.map((t, idx) => `
                <li class="trending-list-item" onclick="location.hash='#/article/${t.id}'">
                  <span class="trending-num">${idx + 1}</span>
                  <span class="trending-title">${L(t.title)}</span>
                </li>
              `).join('')}
            </ol>
          </div>

          <div class="live-corporation-widget">
            <div class="live-widget-title">${I18n.t('home_live_corp')}</div>
            <div class="live-widget-card" onclick="location.hash='#/videos'">
              <div class="live-widget-thumb">
                <span class="badge-live-mini">LIVE</span>
                <div class="media-placeholder" style="color:#fff">FEED</div>
              </div>
              <div>
                <h4 style="font-family:var(--font-serif);font-size:16px;line-height:1.25">${I18n.t('home_live_widget_headline')}</h4>
                <div style="font-size:11.5px;color:var(--link-blue);margin-top:6px;font-weight:700">1,240 ${I18n.t('video_watching_now')}</div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      ` : ''}

      <!-- Community / Newsletter CTA -->
      <section class="container cta-banner-section">
        <div class="cta-banner-card">
          <div>
            <h2>${I18n.t('home_newsletter_title')}</h2>
            <p>${I18n.t('home_newsletter_desc')}</p>
            <div class="cta-input-group">
              <input type="email" placeholder="${I18n.t('email_placeholder')}" class="cta-input" id="newsletterEmail">
              <button class="btn-white" onclick="window.app.handleNewsletterSub()">${I18n.t('home_subscribe')}</button>
            </div>
          </div>
          <div class="cta-whatsapp-side">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8B8983">${I18n.t('home_whatsapp_follow')}</div>
            <p style="margin:10px 0 18px">${I18n.t('home_whatsapp_desc')}</p>
            <a href="${settings.whatsappChannelUrl}" target="_blank" class="btn-red" style="display:inline-flex;align-items:center;justify-content:center">${I18n.t('home_join_channel')}</a>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // VIEW: CATEGORY
  // ==========================================
  renderCategory(container) {
    const articles = NewsStore.getArticles().filter(a => a.category.toLowerCase() === this.currentCategory.toLowerCase());
    const lead = articles[0] || {};
    const remaining = articles.slice(1);
    const categoryBlurbKeys = {
      City: 'cat_blurb_city',
      Crime: 'cat_blurb_crime',
      Politics: 'cat_blurb_politics',
      Business: 'cat_blurb_business',
      Sports: 'cat_blurb_sports',
      Entertainment: 'cat_blurb_entertainment'
    };

    container.innerHTML = `
      <section class="category-header-banner">
        <div class="container">
          <div class="breadcrumb-nav">
            <a href="#/">${I18n.t('breadcrumb_home')}</a> <span>/</span> ${this.catLabel(this.currentCategory)}
          </div>
          <div class="category-title-flex">
            <h1>${this.catLabel(this.currentCategory)}</h1>
            <p class="category-blurb">${I18n.t(categoryBlurbKeys[this.currentCategory] || 'cat_blurb_default')}</p>
            <div class="nav-spacer"></div>
            <div class="filter-pills-row">
              <button class="filter-pill ${this.categoryFilter === 'Latest' ? 'active' : ''}" onclick="window.app.setCategoryFilter('Latest')">${I18n.t('cat_latest')}</button>
              <button class="filter-pill ${this.categoryFilter === 'Most read' ? 'active' : ''}" onclick="window.app.setCategoryFilter('Most read')">${I18n.t('cat_most_read')}</button>
              <button class="filter-pill ${this.categoryFilter === 'Video only' ? 'active' : ''}" onclick="location.hash='#/videos'">${I18n.t('cat_video_only')}</button>
            </div>
          </div>
        </div>
      </section>

      <section class="container category-content-grid" style="padding-top:28px">
        <div>
          ${lead.id ? `
            <article class="category-lead-story" onclick="location.hash='#/article/${lead.id}'">
              <div class="hero-media-box" style="aspect-ratio:16/10">
                ${lead.image ? `<img src="${lead.image}">` : '<div class="media-placeholder">TOP STORY PHOTO</div>'}
              </div>
              <div style="align-self:center">
                <span class="badge-pill-red">${this.catLabel(lead.category)}</span>
                <h2 class="category-lead-title">${L(lead.title)}</h2>
                <p style="font-size:15.5px;line-height:1.55;color:var(--text-secondary);margin-top:11px">${L(lead.excerpt)}</p>
                <div class="byline-meta" style="margin-top:12px">
                  <span>${I18n.t('byline_reported_by')} ${lead.author}</span>
                  <span>·</span>
                  <span>${this.formatTimeAgo(lead.publishedAt)}</span>
                </div>
              </div>
            </article>
          ` : `<p>${I18n.t('cat_no_stories')}</p>`}

          <div class="grid-3-col" style="margin-top:26px">
            ${remaining.map(a => this.renderStandardNewsCard(a)).join('')}
          </div>

          <div style="display:flex;justify-content:center;padding:34px 0 8px">
            <button class="btn-load-more" onclick="alert('${I18n.t('alert_all_loaded')} ${this.catLabel(this.currentCategory)}')">${I18n.t('cat_load_more')}</button>
          </div>
        </div>

        <aside class="home-sidebar">
          <div class="trending-widget">
            <div class="trending-header">
              <span class="trending-header-title">${I18n.t('cat_most_read_in')} ${this.catLabel(this.currentCategory)}</span>
            </div>
            <ol class="trending-list">
              ${articles.slice(0, 5).map((t, idx) => `
                <li class="trending-list-item" onclick="location.hash='#/article/${t.id}'">
                  <span class="trending-num">${idx + 1}</span>
                  <span class="trending-title">${L(t.title)}</span>
                </li>
              `).join('')}
            </ol>
          </div>
        </aside>
      </section>
    `;
  }

  // ==========================================
  // VIEW: ARTICLE DETAIL
  // ==========================================
  renderArticle(container) {
    const article = NewsStore.getArticle(this.currentArticleId) || NewsStore.getArticles()[0];
    if (!article) {
      container.innerHTML = `<div class="container" style="padding:40px 24px"><h2>${I18n.t('article_not_found')}</h2></div>`;
      return;
    }

    const related = NewsStore.getArticles().filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
    const relatedVideos = NewsStore.getVideos().slice(0, 3);

    container.innerHTML = `
      <div class="container-narrow" style="padding-top:26px">
        <div class="breadcrumb-nav">
          <a href="#/">${I18n.t('breadcrumb_home')}</a> <span>/</span> <a href="#/category/${article.category}">${this.catLabel(article.category)}</a> <span>/</span> ${article.location || I18n.t('article_local_desk')}
        </div>

        <div class="article-page-layout">
          <!-- Sticky Social Share Rail -->
          <div class="article-share-rail">
            <div class="share-rail-label">${I18n.t('article_share')}</div>
            <div class="share-btn-box" title="Share on WhatsApp" onclick="window.app.shareArticle('whatsapp', '${(article.title || '').replace(/'/g, '')}')">WA</div>
            <div class="share-btn-box" title="Share on Facebook" onclick="window.app.shareArticle('facebook', '${(article.title || '').replace(/'/g, '')}')">FB</div>
            <div class="share-btn-box" title="Share on X" onclick="window.app.shareArticle('twitter', '${(article.title || '').replace(/'/g, '')}')">X</div>
            <div class="share-btn-box" title="Copy Link" onclick="window.app.copyArticleLink()">${I18n.t('share_copy_link')}</div>
          </div>

          <article>
            <div style="display:flex;gap:8px;align-items:center">
              ${article.isBreaking ? `<span class="badge-breaking">${I18n.t('article_live_updates')}</span>` : ''}
              <span class="badge-pill-red">${this.catLabel(article.category)}</span>
            </div>

            <h1 class="article-headline-main">${L(article.title)}</h1>
            <p class="article-standfirst">${L(article.excerpt) || ''}</p>

            <div class="article-author-strip">
              <div class="author-avatar-circle">${article.author ? article.author.charAt(0) : 'R'}</div>
              <div>
                <div style="font-size:14px;font-weight:700">${article.author || I18n.t('article_default_author')}</div>
                <div style="font-size:12.5px;color:var(--text-muted)">${article.authorRole ? L(article.authorRole) : I18n.t('article_default_role')}</div>
              </div>
              <div class="nav-spacer"></div>
              <div style="font-size:12.5px;color:var(--text-muted);text-align:right">
                <div>${I18n.t('byline_published')} ${this.formatDate(article.publishedAt)}</div>
                <div style="color:var(--red-accent);font-weight:700">${I18n.t('byline_updated')} ${this.formatTimeAgo(article.updatedAt || article.publishedAt)}</div>
              </div>
            </div>

            <figure class="article-featured-media">
              <div class="hero-media-box">
                ${article.image ? `<img src="${article.image}">` : '<div class="media-placeholder">FEATURED PHOTO — 1600×900</div>'}
              </div>
              <figcaption class="media-caption">
                ${article.imageCaption ? L(article.imageCaption) : I18n.t('article_default_caption')}
                <span style="color:var(--text-subtle)">${article.imageCredit ? L(article.imageCredit) : I18n.t('article_default_credit')}</span>
              </figcaption>
            </figure>

            <div class="article-body-prose">
              ${article.content ? LH(article.content) : `<p>${I18n.t('article_default_body')}</p>`}
            </div>

            <div class="tags-row">
              ${(article.tags || ['City', 'Ward Desk', 'Monsoon']).map(tag => `
                <span class="tag-pill-item">#${L(tag)}</span>
              `).join('')}
            </div>
          </article>
        </div>
      </div>

      <!-- Related Stories -->
      <section style="background:var(--bg-canvas);margin-top:52px;padding:40px 0">
        <div class="container-narrow">
          <div class="section-title-bar">
            <span class="red-bar-indicator"></span>
            <h2>${I18n.t('article_related')}</h2>
          </div>
          <div class="grid-3-col">
            ${related.map(a => this.renderStandardNewsCard(a)).join('')}
          </div>

          <div class="section-title-bar" style="margin-top:40px">
            <span class="red-bar-indicator"></span>
            <h2>${I18n.t('article_watch_story')}</h2>
          </div>
          <div class="grid-3-col">
            ${relatedVideos.map(v => `
              <article class="video-card-dark" style="color:var(--text-primary)" onclick="location.hash='#/video/${v.id}'">
                <div class="video-thumb-box">
                  ${v.thumbnail ? `<img src="${v.thumbnail}">` : '<div class="media-placeholder">VIDEO</div>'}
                  <div class="video-play-overlay"><div class="play-circle-btn"><span class="triangle"></span></div></div>
                  <span class="video-duration-pill">${v.duration || '00:00'}</span>
                </div>
                <h4 style="font-family:var(--font-serif);font-size:17.5px;line-height:1.26;margin-top:11px">${L(v.title)}</h4>
                <div style="font-size:11.5px;color:var(--text-subtle);margin-top:6px">${v.time ? L(v.time) : this.formatTimeAgo(v.createdAt)}</div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // VIEW: VIDEOS HUB
  // ==========================================
  renderVideos(container) {
    const allVideos = NewsStore.getVideos();
    const filters = [
      { key: 'All', labelKey: 'videos_filter_all' },
      { key: 'Bulletins', labelKey: 'videos_filter_bulletins' },
      { key: 'Ground reports', labelKey: 'videos_filter_ground' },
      { key: 'Interviews', labelKey: 'videos_filter_interviews' },
      { key: 'Explainers', labelKey: 'videos_filter_explainers' },
      { key: 'Live', labelKey: 'videos_filter_live' }
    ];
    const filtered = this.videoFilter === 'All'
      ? allVideos
      : allVideos.filter(v => v.filterType === this.videoFilter || v.category.includes(this.videoFilter));

    const featuredVideo = allVideos.find(v => v.isFeatured) || allVideos[0] || {};

    container.innerHTML = `
      <section class="videos-hub-header">
        <div class="container">
          <div style="display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap">
            <div>
              <div style="font-size:11.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--red-accent)">${I18n.t('videos_eyebrow')}</div>
              <h1 style="font-family:var(--font-serif);font-size:44px;margin-top:8px">${I18n.t('videos_h1')}</h1>
              <p style="font-size:15.5px;color:#B7B5AF;margin-top:10px;max-width:64ch">${I18n.t('videos_desc')}</p>
            </div>
            <div class="nav-spacer"></div>
            <div class="filter-pills-row">
              ${filters.map(f => `
                <button class="filter-pill ${this.videoFilter === f.key ? 'active' : ''}" style="color:#C9C7C1;border-color:var(--navy-border)" onclick="window.app.setVideoFilter('${f.key}')">${I18n.t(f.labelKey)}</button>
              `).join('')}
            </div>
          </div>

          <!-- Featured Live/Main Video Card -->
          ${featuredVideo.id ? `
            <div class="featured-video-card" onclick="location.hash='#/video/${featuredVideo.id}'">
              <div class="video-thumb-box" style="aspect-ratio:16/9">
                ${featuredVideo.thumbnail ? `<img src="${featuredVideo.thumbnail}">` : '<div class="media-placeholder">FEATURED VIDEO</div>'}
                <div class="video-play-overlay"><div class="play-circle-btn"><span class="triangle"></span></div></div>
                ${featuredVideo.isLive ? `<span class="badge-breaking" style="position:absolute;left:12px;top:12px">${I18n.t('videos_filter_live').toUpperCase()}</span>` : ''}
                <span class="video-duration-pill">${featuredVideo.duration || '00:00'}</span>
              </div>
              <div style="align-self:center">
                <div style="font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--link-blue)">${L(featuredVideo.category)}</div>
                <h2 style="font-family:var(--font-serif);font-size:29px;line-height:1.16;margin-top:10px">${L(featuredVideo.title)}</h2>
                <p style="font-size:14.5px;line-height:1.55;color:#B7B5AF;margin-top:12px">${L(featuredVideo.description)}</p>
                <div style="font-size:12px;color:#8B8983;margin-top:14px">${featuredVideo.time ? L(featuredVideo.time) : `1,240 ${I18n.t('video_watching_now')}`}</div>
              </div>
            </div>
          ` : ''}

          <h3 style="font-family:var(--font-serif);font-size:24px;margin:40px 0 18px">${I18n.t('videos_latest_episodes')}</h3>
          <div class="grid-3-col grid-videos-latest">
            ${filtered.map(v => `
              <article class="video-card-dark" onclick="location.hash='#/video/${v.id}'">
                <div class="video-thumb-box">
                  ${v.thumbnail ? `<img src="${v.thumbnail}">` : '<div class="media-placeholder">VIDEO</div>'}
                  <div class="video-play-overlay"><div class="play-circle-btn"><span class="triangle"></span></div></div>
                  <span class="video-source-badge">${v.videoSource}</span>
                  <span class="video-duration-pill">${v.duration || '00:00'}</span>
                </div>
                <div class="video-card-cat">${L(v.category)}</div>
                <h4 style="font-family:var(--font-serif);font-size:17.5px;line-height:1.26;margin-top:6px">${L(v.title)}</h4>
                <div class="video-card-time">${v.time ? L(v.time) : this.formatTimeAgo(v.createdAt)}</div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // VIEW: VIDEO DETAIL & THEATER PLAYER
  // ==========================================
  renderVideoDetail(container) {
    const video = NewsStore.getVideo(this.currentVideoId) || NewsStore.getVideos()[0];
    const upNext = NewsStore.getVideos().filter(v => v.id !== video.id).slice(0, 5);

    let mediaEmbedHtml = '';
    if (video.videoSource === 'youtube' && video.videoUrl) {
      const embedUrl = video.videoUrl.includes('embed') ? video.videoUrl : `https://www.youtube.com/embed/${this.extractYouTubeId(video.videoUrl)}`;
      mediaEmbedHtml = `<iframe src="${embedUrl}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (video.videoSource === 'instagram' && video.videoUrl) {
      mediaEmbedHtml = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;flex-direction:column;gap:12px">
          <div style="font-size:18px;font-weight:700">Instagram Reel</div>
          <a href="${video.videoUrl}" target="_blank" class="btn-red" style="padding:8px 16px">Open Reel in Instagram ↗</a>
        </div>
      `;
    } else if (video.videoSource === 'direct' && video.videoUrl) {
      mediaEmbedHtml = `<video controls autoplay src="${video.videoUrl}"></video>`;
    } else {
      mediaEmbedHtml = `
        <div class="custom-player-overlay">
          <div class="play-circle-btn" style="width:78px;height:78px"><span class="triangle" style="border-left-width:24px;border-top-width:15px;border-bottom-width:15px;margin-left:6px"></span></div>
          <div class="player-ctrl-bar">
            <span style="width:0;height:0;border-left:12px solid #fff;border-top:7px solid transparent;border-bottom:7px solid transparent"></span>
            <div class="player-progress-track"><div class="player-progress-fill"></div></div>
            <span style="font-size:12px;color:#EDEBE4;font-variant-numeric:tabular-nums">${video.duration || '18:24'}</span>
            <span style="font-size:11px;border:1px solid rgba(255,255,255,0.4);border-radius:4px;padding:2px 6px">HD</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <section style="background:var(--navy-primary);padding:26px 0 34px;color:#fff">
        <div class="container video-theater-container">
          <div>
            <div class="player-embed-wrapper">
              ${mediaEmbedHtml}
            </div>

            <div style="display:flex;gap:8px;margin-top:20px">
              <span class="badge-pill-red" style="background:rgba(217,35,42,0.18);color:#F1918D">${L(video.category)}</span>
              <span style="border:1px solid var(--navy-border);color:#B7B5AF;font-size:10.5px;font-weight:700;text-transform:uppercase;padding:4px 9px;border-radius:999px">${video.filterType ? L(video.filterType) : I18n.t('video_default_filter')}</span>
            </div>

            <h1 style="font-family:var(--font-serif);font-size:38px;line-height:1.12;margin-top:14px">${L(video.title)}</h1>

            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px;padding:16px 0;border-top:1px solid var(--navy-border);border-bottom:1px solid var(--navy-border)">
              <div class="author-avatar-circle" style="background:var(--navy-surface);color:#fff">R</div>
              <div>
                <div style="font-size:13.5px;font-weight:700">Anchor Desk</div>
                <div style="font-size:12px;color:#8B8983">${video.time ? L(video.time) : I18n.t('video_today')} · ${video.views || '9,420'} ${I18n.t('video_views')}</div>
              </div>
              <div class="nav-spacer"></div>
              <button class="btn-white" onclick="window.app.shareArticle('whatsapp', '${(video.title || '').replace(/'/g, '')}')">${I18n.t('video_send_whatsapp')}</button>
            </div>

            <p style="font-size:16px;line-height:1.65;color:#C9C7C1;margin-top:20px">${L(video.description)}</p>
          </div>

          <aside>
            <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8B8983;margin-bottom:14px">${I18n.t('video_up_next')}</div>
            <div style="display:flex;flex-direction:column;gap:14px">
              ${upNext.map(v => `
                <article style="display:grid;grid-template-columns:138px 1fr;gap:12px;cursor:pointer" onclick="location.hash='#/video/${v.id}'">
                  <div class="video-thumb-box" style="aspect-ratio:16/9">
                    ${v.thumbnail ? `<img src="${v.thumbnail}">` : '<div class="media-placeholder">VIDEO</div>'}
                    <span class="video-duration-pill" style="font-size:10px;padding:2px 5px">${v.duration || '00:00'}</span>
                  </div>
                  <div>
                    <h4 style="font-family:var(--font-serif);font-size:15.5px;line-height:1.26;color:#fff">${L(v.title)}</h4>
                    <div style="font-size:11px;color:#8B8983;margin-top:6px">${L(v.category)} · ${v.time ? L(v.time) : I18n.t('video_recent')}</div>
                  </div>
                </article>
              `).join('')}
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  // ==========================================
  // VIEW: INDIA NEWS (Live Wire)
  // ==========================================
  renderIndiaNews(container) {
    const activeCat = this.indiaNewsCategory;

    container.innerHTML = `
      <section class="category-header-banner">
        <div class="container">
          <div class="breadcrumb-nav">
            <a href="#/">${I18n.t('breadcrumb_home')}</a> <span>/</span> ${I18n.t('india_news_h1')}
          </div>
          <div class="category-title-flex">
            <h1 style="display:flex;align-items:center;gap:10px">${I18n.t('india_news_h1')} <span class="wire-badge">${I18n.t('india_news_wire')}</span></h1>
            <p class="category-blurb">${I18n.t('india_news_blurb')}</p>
            <div class="nav-spacer"></div>
            <div class="filter-pills-row">
              ${INDIA_NEWS_CATEGORIES.map(c => `
                <button class="filter-pill ${activeCat === c.key ? 'active' : ''}" onclick="window.app.setIndiaNewsCategory('${c.key}')">${I18n.t(c.labelKey)}</button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="container" style="padding-top:28px">
        <div class="grid-3-col" id="indiaNewsGrid">
          ${this.renderIndiaNewsSkeleton()}
        </div>
      </section>
    `;

    this.loadIndiaNews(activeCat);
  }

  renderIndiaNewsSkeleton() {
    return Array.from({ length: 6 }).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-media"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    `).join('');
  }

  async loadIndiaNews(category) {
    try {
      const articles = await fetchIndiaNews(category);
      if (this.currentRoute !== 'india-news' || this.indiaNewsCategory !== category) return;
      const gridEl = document.getElementById('indiaNewsGrid');
      if (!gridEl) return;
      if (!articles.length) {
        gridEl.innerHTML = `<div class="wire-state-box">${I18n.t('india_news_empty')}</div>`;
        return;
      }
      gridEl.innerHTML = articles.map(a => this.renderWireNewsCard(a)).join('');
    } catch (err) {
      if (this.currentRoute !== 'india-news' || this.indiaNewsCategory !== category) return;
      const gridEl = document.getElementById('indiaNewsGrid');
      if (gridEl) gridEl.innerHTML = `<div class="wire-state-box">${I18n.t('india_news_error')}</div>`;
    }
  }

  renderWireNewsCard(a) {
    const href = this.safeUrl(a.link);
    const title = this.escapeHtml(L(a.title));
    const source = this.escapeHtml(a.source);
    const img = a.image ? this.safeUrl(a.image) : '';
    return `
      <a class="news-card-standard wire-news-card" href="${href}" target="_blank" rel="noopener noreferrer">
        <div class="news-card-media">
          ${img && img !== '#' ? `<img src="${img}" loading="lazy">` : '<div class="media-placeholder">PHOTO</div>'}
        </div>
        <div class="news-card-body">
          <span class="badge-pill-red">${I18n.t('india_news_wire')}</span>
          <h3 class="news-card-headline">${title}</h3>
          <div class="news-card-source">${source} · ${I18n.t('india_news_read_more')}</div>
        </div>
      </a>
    `;
  }

  setIndiaNewsCategory(key) {
    this.indiaNewsCategory = key;
    this.renderCurrentView();
  }

  // ==========================================
  // VIEW: ABOUT US
  // ==========================================
  renderAbout(container) {
    const team = NewsStore.getTeam();
    container.innerHTML = `
      <section class="container about-hero-grid">
        <div>
          <div style="font-size:11.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--red-accent)">${I18n.t('about_eyebrow')}</div>
          <h1 style="font-family:var(--font-serif);font-size:50px;line-height:1.08;margin-top:12px">${I18n.t('about_h1')}</h1>
          <p style="font-size:17px;line-height:1.6;color:var(--text-secondary);margin-top:18px">${I18n.t('about_p1')}</p>
          <p style="font-size:17px;line-height:1.6;color:var(--text-secondary);margin-top:14px">${I18n.t('about_p2')}</p>
        </div>
        <div class="hero-media-box" style="aspect-ratio:4/5">
          <div class="media-placeholder">NEWSROOM PHOTO — 4:5</div>
        </div>
      </section>

      <section class="stats-navy-strip">
        <div class="container stats-4-grid">
          <div><div class="stat-number">2016</div><div class="stat-label">${I18n.t('about_stat1_label')}</div></div>
          <div><div class="stat-number">9</div><div class="stat-label">${I18n.t('about_stat2_label')}</div></div>
          <div><div class="stat-number">3</div><div class="stat-label">${I18n.t('about_stat3_label')}</div></div>
          <div><div class="stat-number">11</div><div class="stat-label">${I18n.t('about_stat4_label')}</div></div>
        </div>
      </section>

      <section class="container" style="padding-top:44px">
        <div class="section-title-bar">
          <span class="red-bar-indicator"></span>
          <h2>${I18n.t('about_who_works')}</h2>
        </div>
        <div class="team-roster-grid">
          ${team.map(m => `
            <div class="team-card">
              <div class="team-portrait">PORTRAIT</div>
              <div style="font-family:var(--font-serif);font-size:20px;margin-top:12px">${m.name}</div>
              <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--red-text);margin-top:5px">${L(m.role)}</div>
              <p style="font-size:13.5px;line-height:1.5;color:var(--text-secondary);margin-top:9px">${L(m.bio)}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ==========================================
  // VIEW: CONTACT & TIP LINE
  // ==========================================
  renderContact(container) {
    const settings = NewsStore.getSettings();
    container.innerHTML = `
      <section class="container" style="padding-top:40px">
        <div style="font-size:11.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--red-accent)">${I18n.t('contact_eyebrow')}</div>
        <h1 style="font-family:var(--font-serif);font-size:46px;margin-top:12px">${I18n.t('contact_h1')}</h1>
        <p style="font-size:16.5px;line-height:1.6;color:var(--text-secondary);margin-top:12px;max-width:62ch">${I18n.t('contact_desc')}</p>

        <div class="contact-split-grid">
          <form class="contact-form-box" onsubmit="window.app.handleContactSubmit(event)">
            <div class="grid-2-col">
              <div>
                <label class="form-label">${I18n.t('contact_name')}</label>
                <input type="text" class="form-control" placeholder="${I18n.t('contact_name_ph')}" required id="contactName">
              </div>
              <div>
                <label class="form-label">${I18n.t('contact_email')}</label>
                <input type="email" class="form-control" placeholder="${I18n.t('email_placeholder')}" required id="contactEmail">
              </div>
            </div>
            <div style="margin-top:16px">
              <label class="form-label">${I18n.t('contact_subject')}</label>
              <select class="form-control" id="contactSubject">
                <option>${I18n.t('contact_opt_general')}</option>
                <option>${I18n.t('contact_opt_correction')}</option>
                <option>${I18n.t('contact_opt_press')}</option>
                <option>${I18n.t('contact_opt_careers')}</option>
              </select>
            </div>
            <div style="margin-top:16px">
              <label class="form-label">${I18n.t('contact_message')}</label>
              <textarea rows="6" class="form-control" placeholder="${I18n.t('contact_message_ph')}" required id="contactMessage"></textarea>
            </div>
            <div style="display:flex;align-items:center;gap:16px;margin-top:20px;flex-wrap:wrap">
              <button type="submit" class="btn-load-more">${I18n.t('contact_send')}</button>
              <span style="font-size:12.5px;color:var(--text-muted)">${I18n.t('contact_reply_note')}</span>
            </div>
          </form>

          <div style="display:flex;flex-direction:column;gap:20px">
            <!-- News Tip Card -->
            <div class="tip-cta-box">
              <div style="display:flex;align-items:center;gap:9px">
                <span class="red-dot" style="background:var(--red-accent);width:8px;height:8px;border-radius:50%"></span>
                <span style="font-size:11.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--red-text)">${I18n.t('contact_tip_label')}</span>
              </div>
              <p style="font-size:14.5px;line-height:1.55;color:#3A3A37;margin:10px 0 16px">${I18n.t('contact_tip_desc')}</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <a href="https://wa.me/919822041122" target="_blank" class="btn-red" style="display:inline-flex;align-items:center;text-decoration:none">${I18n.t('contact_tip_whatsapp')}</a>
                <button type="button" class="btn-white" style="border:1px solid #E9B6B3" onclick="window.app.openTipModal()">${I18n.t('contact_tip_online')}</button>
              </div>
            </div>

            <!-- Address and Phones -->
            <div style="border:1px solid var(--border-subtle);border-radius:12px;padding:20px;background:#fff">
              <div style="font-size:11.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-subtle)">${I18n.t('contact_office')}</div>
              <div style="font-size:15px;line-height:1.5;margin-top:6px">${L(settings.officeAddress)}</div>
              <div class="office-contact-grid">
                <div>
                  <div style="font-size:11.5px;font-weight:700;text-transform:uppercase;color:var(--text-subtle)">${I18n.t('contact_desk_whatsapp')}</div>
                  <div style="font-size:14.5px;margin-top:4px">${settings.whatsappTipNumber}</div>
                  <a href="mailto:${settings.deskEmail}" style="font-size:13.5px;word-break:break-word">${settings.deskEmail}</a>
                </div>
                <div>
                  <div style="font-size:11.5px;font-weight:700;text-transform:uppercase;color:var(--text-subtle)">${I18n.t('contact_editor_ads')}</div>
                  <div style="font-size:14.5px;margin-top:4px">${settings.editorPhone}</div>
                  <a href="mailto:${settings.editorEmail}" style="font-size:13.5px;word-break:break-word">${settings.editorEmail}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderHomeEmptyState() {
    return `
      <section class="container" style="padding:56px 24px">
        <div style="max-width:520px;margin:0 auto;text-align:center;border:1px dashed var(--border-subtle);border-radius:12px;padding:40px 28px">
          <h2 style="font-family:var(--font-serif);font-size:26px;margin-bottom:10px">${I18n.t('home_empty_title')}</h2>
          <p style="font-size:14.5px;line-height:1.6;color:var(--text-secondary)">${I18n.t('home_empty_desc')}</p>
        </div>
      </section>
    `;
  }

  // ==========================================
  // HELPERS & ACTIONS
  // ==========================================
  renderStandardNewsCard(a) {
    return `
      <article class="news-card-standard" onclick="location.hash='#/article/${a.id}'">
        <div class="news-card-media">
          ${a.image ? `<img src="${a.image}">` : '<div class="media-placeholder">PHOTO</div>'}
        </div>
        <div class="news-card-body">
          <span class="badge-pill-red">${this.catLabel(a.category)}</span>
          <h3 class="news-card-headline">${L(a.title)}</h3>
          <div class="news-card-time">${this.formatTimeAgo(a.publishedAt)}</div>
        </div>
      </article>
    `;
  }

  formatTimeAgo(dateStr) {
    if (!dateStr) return I18n.t('time_just_now');
    const diffMs = new Date() - new Date(dateStr);
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return I18n.t('time_just_now');
    if (mins < 60) return `${mins} ${I18n.t('time_min_ago')}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${I18n.t(hours > 1 ? 'time_hours_ago' : 'time_hour_ago')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${I18n.t(days > 1 ? 'time_days_ago' : 'time_day_ago')}`;
  }

  formatDate(dateStr) {
    if (!dateStr) return '';
    const locale = I18n.getLang() === 'gu' ? 'gu-IN' : 'en-GB';
    try {
      return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  }

  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  setCategoryFilter(filter) {
    this.categoryFilter = filter;
    this.renderCurrentView();
  }

  setVideoFilter(filter) {
    this.videoFilter = filter;
    this.renderCurrentView();
  }

  // Search Engine
  initSearch() {
    const searchBtn = document.getElementById('searchNewsBtn');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeBtn = document.getElementById('searchCloseBtn');
    const searchInput = document.getElementById('searchModalInput');
    const resultsContainer = document.getElementById('searchResultsList');

    if (!searchModal) return;

    const openSearch = () => {
      searchModal.classList.add('open');
      searchInput.focus();
    };

    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', openSearch);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        searchModal.classList.remove('open');
      });
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('open');
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = `<div style="padding:20px;color:#8B8983;text-align:center">${I18n.t('search_hint')}</div>`;
          return;
        }

        const articles = NewsStore.getArticles().filter(a =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          (a.tags && a.tags.some(t => t.toLowerCase().includes(query)))
        );

        if (!articles.length) {
          resultsContainer.innerHTML = `<div style="padding:20px;color:#8B8983;text-align:center">${I18n.t('search_no_results')} "${this.escapeHtml(query)}".</div>`;
          return;
        }

        resultsContainer.innerHTML = articles.map(a => `
          <div class="search-result-item" onclick="location.hash='#/article/${a.id}'; document.getElementById('searchModal').classList.remove('open');">
            <span class="badge-pill-red">${this.catLabel(a.category)}</span>
            <h4>${L(a.title)}</h4>
            <div class="meta">${a.author} · ${this.formatTimeAgo(a.publishedAt)}</div>
          </div>
        `).join('');
      });
    }
  }

  initMobileDrawer() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sectionsTabBtn = document.getElementById('mobileSectionsTabBtn');
    const nav = document.getElementById('mainNav');
    const backdrop = document.getElementById('drawerBackdrop');

    const toggleDrawer = () => {
      const isOpen = nav.classList.toggle('drawer-open');
      if (backdrop) backdrop.classList.toggle('show', isOpen);
    };

    const closeDrawer = () => {
      nav.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('show');
    };

    if (hamburger) hamburger.addEventListener('click', toggleDrawer);
    if (sectionsTabBtn) sectionsTabBtn.addEventListener('click', toggleDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Auto close drawer when any link is clicked
    if (nav) {
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });
    }
  }

  handleNewsletterSub() {
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput && emailInput.value) {
      this.showToast(I18n.t('toast_subscribed'));
      emailInput.value = '';
    } else {
      alert(I18n.t('toast_invalid_email'));
    }
  }

  handleContactSubmit(e) {
    e.preventDefault();
    this.showToast(I18n.t('toast_msg_received'));
    e.target.reset();
  }

  shareArticle(platform, title) {
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  }

  copyArticleLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showToast(I18n.t('toast_link_copied'));
    });
  }

  showToast(msg) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  openTipModal() {
    const name = prompt(I18n.t('tip_prompt_name'));
    const contact = prompt(I18n.t('tip_prompt_contact'));
    const msg = prompt(I18n.t('tip_prompt_message'));
    if (msg) {
      NewsStore.addTip({ name: name || 'Anonymous', contact: contact || 'N/A', subject: 'Public Portal Tip', message: msg });
      this.showToast(I18n.t('toast_tip_submitted'));
    }
  }
}

window.app = new App();
