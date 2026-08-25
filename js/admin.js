/**
 * India News 18 / Breaking Edition — Admin Panel Engine
 */
import { NewsStore } from './store.js';

class AdminApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.editingArticleId = null;
    this.editingVideoId = null;
    this.init();
  }

  init() {
    this.bindNav();
    this.renderTab(this.currentTab);
    this.initArticleFormHandlers();
    this.initVideoFormHandlers();

    window.addEventListener('news_store_updated', () => {
      this.renderTab(this.currentTab);
    });
  }

  bindNav() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.currentTab = item.dataset.tab;
        this.renderTab(this.currentTab);
      });
    });
  }

  renderTab(tab) {
    const container = document.getElementById('adminBody');
    const pageTitle = document.getElementById('adminPageTitle');
    if (!container) return;

    switch (tab) {
      case 'dashboard':
        pageTitle.textContent = 'Dashboard & Overview';
        this.renderDashboard(container);
        break;
      case 'articles':
        pageTitle.textContent = 'News Articles Management';
        this.renderArticles(container);
        break;
      case 'videos':
        pageTitle.textContent = 'Video Bulletins & Reels CMS';
        this.renderVideos(container);
        break;
      case 'tickers':
        pageTitle.textContent = 'Live Breaking Ticker Manager';
        this.renderTickers(container);
        break;
      case 'tips':
        pageTitle.textContent = 'Citizen News Tips Inbox';
        this.renderTips(container);
        break;
      case 'settings':
        pageTitle.textContent = 'Site & Channel Settings';
        this.renderSettings(container);
        break;
      default:
        this.renderDashboard(container);
    }
  }

  // ==========================================
  // TAB: DASHBOARD
  // ==========================================
  renderDashboard(container) {
    const articles = NewsStore.getArticles();
    const videos = NewsStore.getVideos();
    const tickers = NewsStore.getTickers();
    const tips = NewsStore.getTips();

    container.innerHTML = `
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-label">Published Articles</div>
          <div class="admin-stat-value">${articles.length}</div>
          <div class="admin-stat-meta">Active stories on portal</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Video Bulletins</div>
          <div class="admin-stat-value">${videos.length}</div>
          <div class="admin-stat-meta">YouTube & Instagram Reels</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Breaking Tickers</div>
          <div class="admin-stat-value">${tickers.filter(t => t.active).length}</div>
          <div class="admin-stat-meta">Live marquee alerts</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Citizen Tips</div>
          <div class="admin-stat-value" style="color:var(--red-accent)">${tips.filter(t => t.status === 'New').length}</div>
          <div class="admin-stat-meta">Unread submissions</div>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:24px">
        <button class="admin-btn admin-btn-accent" onclick="window.admin.openArticleModal()">+ Write New News Story</button>
        <button class="admin-btn admin-btn-primary" onclick="window.admin.openVideoModal()">+ Add Video / Reel</button>
        <button class="admin-btn admin-btn-secondary" onclick="window.admin.promptNewTicker()">+ Add Breaking Ticker</button>
      </div>

      <div class="admin-panel">
        <div class="admin-panel-header">
          <div class="admin-panel-title">Recent News Stories</div>
          <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.admin.switchTab('articles')">View All Articles →</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${articles.length ? articles.slice(0, 5).map(a => `
              <tr>
                <td style="font-weight:600;max-width:320px">${a.title}</td>
                <td><span class="admin-badge badge-draft">${a.category}</span></td>
                <td>${a.author}</td>
                <td>
                  ${a.isLead ? '<span class="admin-badge badge-published">Lead Story</span>' : ''}
                  ${a.isBreaking ? '<span class="admin-badge badge-breaking">Breaking</span>' : ''}
                </td>
                <td>${new Date(a.publishedAt).toLocaleDateString('en-GB')}</td>
                <td>
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.admin.editArticle('${a.id}')">Edit</button>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="6" style="text-align:center;padding:24px;color:#718096">No articles yet — click "+ Write New News Story" to publish your first one.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB: ARTICLES
  // ==========================================
  renderArticles(container) {
    const articles = NewsStore.getArticles();

    container.innerHTML = `
      <div class="admin-panel">
        <div class="admin-panel-header">
          <div class="admin-panel-title">All News Articles (${articles.length})</div>
          <div style="display:flex;gap:10px">
            <input type="text" placeholder="Search articles..." class="admin-search-input" id="articleTableSearch" oninput="window.admin.filterArticlesTable(this.value)">
            <button class="admin-btn admin-btn-accent" onclick="window.admin.openArticleModal()">+ Create Article</button>
          </div>
        </div>
        <table class="admin-table" id="articlesTable">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Headline</th>
              <th>Category</th>
              <th>Author & Beat</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${articles.length ? articles.map(a => `
              <tr data-article-id="${a.id}">
                <td style="width:60px">
                  <div style="width:48px;height:36px;border-radius:4px;overflow:hidden;background:#E2E8F0">
                    ${a.image ? `<img src="${a.image}" style="width:100%;height:100%;object-fit:cover">` : '<div style="font-size:9px;text-align:center;line-height:36px">No img</div>'}
                  </div>
                </td>
                <td style="font-weight:600;max-width:300px">${a.title}</td>
                <td><span class="admin-badge badge-draft">${a.category}</span></td>
                <td>${a.author}</td>
                <td>
                  ${a.isLead ? '<span class="admin-badge badge-published">Lead</span> ' : ''}
                  ${a.isBreaking ? '<span class="admin-badge badge-breaking">Live</span> ' : ''}
                  ${a.isTrending ? '<span class="admin-badge badge-draft">Trending</span>' : ''}
                </td>
                <td style="white-space:nowrap">
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.admin.editArticle('${a.id}')">Edit</button>
                  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.admin.deleteArticle('${a.id}')">Delete</button>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="6" style="text-align:center;padding:24px;color:#718096">No articles yet. Click "+ Create Article" to publish your first story.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB: VIDEOS CMS
  // ==========================================
  renderVideos(container) {
    const videos = NewsStore.getVideos();

    container.innerHTML = `
      <div class="admin-panel">
        <div class="admin-panel-header">
          <div class="admin-panel-title">Video Bulletins, YouTube & Reels (${videos.length})</div>
          <button class="admin-btn admin-btn-accent" onclick="window.admin.openVideoModal()">+ Add New Video / Reel</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Title</th>
              <th>Show Category</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${videos.map(v => `
              <tr>
                <td>
                  <span class="admin-badge ${v.videoSource === 'youtube' ? 'badge-youtube' : v.videoSource === 'instagram' ? 'badge-instagram' : 'badge-direct'}">
                    ${v.videoSource ? v.videoSource.toUpperCase() : 'VIDEO'}
                  </span>
                </td>
                <td style="font-weight:600;max-width:320px">${v.title}</td>
                <td>${v.category}</td>
                <td>${v.duration || 'N/A'}</td>
                <td>${v.isFeatured ? '<span class="admin-badge badge-published">Featured</span>' : v.filterType || 'Regular'}</td>
                <td>
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.admin.editVideo('${v.id}')">Edit</button>
                  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.admin.deleteVideo('${v.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB: BREAKING TICKERS
  // ==========================================
  renderTickers(container) {
    const tickers = NewsStore.getTickers();

    container.innerHTML = `
      <div class="admin-panel">
        <div class="admin-panel-header">
          <div class="admin-panel-title">Live Breaking News Ticker Items (${tickers.length})</div>
          <button class="admin-btn admin-btn-accent" onclick="window.admin.promptNewTicker()">+ Add Breaking Item</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Ticker Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tickers.map(t => `
              <tr>
                <td>
                  <label class="form-checkbox-label">
                    <input type="checkbox" ${t.active ? 'checked' : ''} onchange="window.admin.toggleTicker('${t.id}', this.checked)">
                    <span class="admin-badge ${t.active ? 'badge-breaking' : 'badge-draft'}">${t.active ? 'ACTIVE' : 'PAUSED'}</span>
                  </label>
                </td>
                <td style="font-size:14px;font-weight:500">${t.text}</td>
                <td>
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.admin.editTicker('${t.id}')">Edit</button>
                  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.admin.deleteTicker('${t.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB: CITIZEN NEWS TIPS
  // ==========================================
  renderTips(container) {
    const tips = NewsStore.getTips();

    container.innerHTML = `
      <div class="admin-panel">
        <div class="admin-panel-header">
          <div class="admin-panel-title">Citizen News Tips & Reports (${tips.length})</div>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Citizen Name</th>
              <th>Contact</th>
              <th>Tip Description</th>
              <th>Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tips.length ? tips.map(t => `
              <tr>
                <td>
                  <select class="form-select" style="padding:4px 8px;font-size:12px" onchange="window.admin.updateTipStatus('${t.id}', this.value)">
                    <option value="New" ${t.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="In Review" ${t.status === 'In Review' ? 'selected' : ''}>In Review</option>
                    <option value="Published" ${t.status === 'Published' ? 'selected' : ''}>Published</option>
                    <option value="Dismissed" ${t.status === 'Dismissed' ? 'selected' : ''}>Dismissed</option>
                  </select>
                </td>
                <td style="font-weight:600">${t.name}</td>
                <td>${t.contact}</td>
                <td style="max-width:350px">${t.message}</td>
                <td>${new Date(t.createdAt).toLocaleDateString('en-GB')}</td>
                <td>
                  <button class="admin-btn admin-btn-accent admin-btn-sm" onclick="window.admin.convertTipToStory('${t.id}')">Convert to Article</button>
                  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.admin.deleteTip('${t.id}')">Delete</button>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="6" style="text-align:center;padding:24px;color:#718096">No citizen tips received yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB: SETTINGS
  // ==========================================
  renderSettings(container) {
    const settings = NewsStore.getSettings();

    container.innerHTML = `
      <div class="admin-panel" style="max-width:800px">
        <div class="admin-panel-header">
          <div class="admin-panel-title">Site & Channel Settings</div>
        </div>
        <form style="padding:24px" onsubmit="window.admin.saveSettingsForm(event)">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Portal Name</label>
              <input type="text" class="form-input" id="settingSiteName" value="${settings.siteName}">
            </div>
            <div class="form-group">
              <label class="form-label">Edition Title</label>
              <input type="text" class="form-input" id="settingEditionName" value="${settings.editionName}">
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">WhatsApp Channel URL</label>
              <input type="text" class="form-input" id="settingWhatsAppUrl" value="${settings.whatsappChannelUrl}">
            </div>
            <div class="form-group">
              <label class="form-label">WhatsApp Tip-Line Number</label>
              <input type="text" class="form-input" id="settingTipNumber" value="${settings.whatsappTipNumber}">
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">News Desk Email</label>
              <input type="email" class="form-input" id="settingDeskEmail" value="${settings.deskEmail}">
            </div>
            <div class="form-group">
              <label class="form-label">Editor Email</label>
              <input type="email" class="form-input" id="settingEditorEmail" value="${settings.editorEmail}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Physical Office Address</label>
            <textarea class="form-textarea" rows="3" id="settingAddress">${settings.officeAddress}</textarea>
          </div>
          <div style="display:flex;gap:12px;margin-top:20px">
            <button type="submit" class="admin-btn admin-btn-accent">Save Settings</button>
            <button type="button" class="admin-btn admin-btn-danger" onclick="window.admin.resetAllData()">Reset All Data to Defaults</button>
          </div>
        </form>
      </div>
    `;
  }

  // ==========================================
  // ARTICLE FORM & MEDIA UPLOAD / URL
  // ==========================================
  initArticleFormHandlers() {
    const fileInput = document.getElementById('articleImageFile');
    const urlInput = document.getElementById('articleImageUrl');
    const previewImg = document.getElementById('articlePreviewImg');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            previewImg.src = ev.target.result;
            previewImg.style.display = 'block';
            urlInput.value = ''; // clear url
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        if (e.target.value) {
          previewImg.src = e.target.value;
          previewImg.style.display = 'block';
        }
      });
    }
  }

  openArticleModal(article = null) {
    this.editingArticleId = article ? article.id : null;
    const modal = document.getElementById('articleModal');
    const modalTitle = document.getElementById('articleModalTitle');

    modalTitle.textContent = article ? 'Edit News Story' : 'Create New News Story';
    document.getElementById('articleTitle').value = article ? article.title : '';
    document.getElementById('articleCategory').value = article ? article.category : 'City';
    document.getElementById('articleExcerpt').value = article ? article.excerpt : '';
    document.getElementById('articleAuthor').value = article ? article.author : 'Sneha Kulkarni';
    document.getElementById('articleAuthorRole').value = article ? (article.authorRole || 'City Reporter') : 'City Reporter';
    document.getElementById('articleLocation').value = article ? (article.location || '') : 'Market Road';
    document.getElementById('articleImageUrl').value = article ? (article.image || '') : '';
    document.getElementById('articleImageCaption').value = article ? (article.imageCaption || '') : '';
    document.getElementById('articleContent').value = article ? article.content : '';
    document.getElementById('articleIsLead').checked = article ? !!article.isLead : false;
    document.getElementById('articleIsBreaking').checked = article ? !!article.isBreaking : false;
    document.getElementById('articleIsTrending').checked = article ? !!article.isTrending : false;

    const preview = document.getElementById('articlePreviewImg');
    if (article && article.image) {
      preview.src = article.image;
      preview.style.display = 'block';
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }

    modal.classList.add('open');
  }

  saveArticleForm() {
    const title = document.getElementById('articleTitle').value.trim();
    if (!title) {
      alert('Please enter an article headline.');
      return;
    }

    const previewImg = document.getElementById('articlePreviewImg');
    const urlInput = document.getElementById('articleImageUrl');

    const image = (previewImg.src && previewImg.src !== window.location.href) ? previewImg.src : urlInput.value.trim();

    const data = {
      id: this.editingArticleId,
      title: title,
      category: document.getElementById('articleCategory').value,
      excerpt: document.getElementById('articleExcerpt').value.trim(),
      author: document.getElementById('articleAuthor').value.trim() || 'Newsroom Desk',
      authorRole: document.getElementById('articleAuthorRole').value.trim(),
      location: document.getElementById('articleLocation').value.trim(),
      image: image,
      imageCaption: document.getElementById('articleImageCaption').value.trim(),
      content: document.getElementById('articleContent').value.trim(),
      isLead: document.getElementById('articleIsLead').checked,
      isBreaking: document.getElementById('articleIsBreaking').checked,
      isTrending: document.getElementById('articleIsTrending').checked
    };

    NewsStore.saveArticle(data);
    this.closeModal('articleModal');
    this.renderTab('articles');
    alert('News article published successfully!');
  }

  editArticle(id) {
    const a = NewsStore.getArticle(id);
    if (a) this.openArticleModal(a);
  }

  deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
      NewsStore.deleteArticle(id);
      this.renderTab('articles');
    }
  }

  // Rich writing format inserts
  insertFormatting(type) {
    const textarea = document.getElementById('articleContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || 'Sample text';
    let replacement = '';

    if (type === 'h2') replacement = `<h2>${selected}</h2>\n`;
    else if (type === 'quote') replacement = `<blockquote class="story-quote"><p>“${selected}”</p><cite>— Person Name, Title</cite></blockquote>\n`;
    else if (type === 'callout') replacement = `<div class="story-callout"><div class="callout-label">Also Read</div><a href="#/" class="callout-link">${selected}</a></div>\n`;
    else if (type === 'p') replacement = `<p>${selected}</p>\n`;

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
  }

  // ==========================================
  // VIDEO FORM & MEDIA (YT / INSTA / DIRECT)
  // ==========================================
  initVideoFormHandlers() {
    const sourceSelect = document.getElementById('videoSourceType');
    const fileGroup = document.getElementById('videoLocalFileGroup');
    const urlGroup = document.getElementById('videoUrlGroup');
    const fileInput = document.getElementById('videoLocalFileInput');
    const urlInput = document.getElementById('videoUrlInput');
    const videoPreview = document.getElementById('videoPreviewTag');

    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'direct') {
          fileGroup.style.display = 'block';
          urlGroup.querySelector('label').textContent = 'Direct Video MP4 URL (Optional if file uploaded)';
        } else if (val === 'instagram') {
          fileGroup.style.display = 'none';
          urlGroup.querySelector('label').textContent = 'Instagram Reel Link (e.g. https://www.instagram.com/reel/...)';
        } else {
          fileGroup.style.display = 'none';
          urlGroup.querySelector('label').textContent = 'YouTube Video Link or Embed URL';
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            videoPreview.src = ev.target.result;
            videoPreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  openVideoModal(video = null) {
    this.editingVideoId = video ? video.id : null;
    const modal = document.getElementById('videoModal');
    document.getElementById('videoModalTitle').textContent = video ? 'Edit Video Bulletin' : 'Add Video / Reel';

    document.getElementById('videoTitle').value = video ? video.title : '';
    document.getElementById('videoCategory').value = video ? video.category : 'Evening Bulletin';
    document.getElementById('videoSourceType').value = video ? (video.videoSource || 'youtube') : 'youtube';
    document.getElementById('videoUrlInput').value = video ? (video.videoUrl || '') : '';
    document.getElementById('videoDuration').value = video ? (video.duration || '12:40') : '12:40';
    document.getElementById('videoFilterType').value = video ? (video.filterType || 'Bulletins') : 'Bulletins';
    document.getElementById('videoDescription').value = video ? video.description : '';
    document.getElementById('videoIsFeatured').checked = video ? !!video.isFeatured : false;

    // Trigger source change UI
    document.getElementById('videoSourceType').dispatchEvent(new Event('change'));
    modal.classList.add('open');
  }

  saveVideoForm() {
    const title = document.getElementById('videoTitle').value.trim();
    if (!title) {
      alert('Please enter a video title.');
      return;
    }

    const videoPreview = document.getElementById('videoPreviewTag');
    const urlInput = document.getElementById('videoUrlInput').value.trim();

    const data = {
      id: this.editingVideoId,
      title: title,
      category: document.getElementById('videoCategory').value,
      videoSource: document.getElementById('videoSourceType').value,
      videoUrl: (videoPreview.src && videoPreview.style.display !== 'none') ? videoPreview.src : urlInput,
      duration: document.getElementById('videoDuration').value.trim() || '10:00',
      filterType: document.getElementById('videoFilterType').value,
      description: document.getElementById('videoDescription').value.trim(),
      isFeatured: document.getElementById('videoIsFeatured').checked
    };

    NewsStore.saveVideo(data);
    this.closeModal('videoModal');
    this.renderTab('videos');
    alert('Video saved and updated on portal!');
  }

  editVideo(id) {
    const v = NewsStore.getVideo(id);
    if (v) this.openVideoModal(v);
  }

  deleteVideo(id) {
    if (confirm('Delete this video bulletin?')) {
      NewsStore.deleteVideo(id);
      this.renderTab('videos');
    }
  }

  // Tickers
  promptNewTicker() {
    const text = prompt('Enter new Breaking Live Ticker headline:');
    if (text) {
      NewsStore.saveTicker({ text: text.trim(), active: true });
      this.renderTab('tickers');
    }
  }

  editTicker(id) {
    const t = NewsStore.getTickers().find(x => x.id === id);
    if (t) {
      const newText = prompt('Edit Breaking Ticker text:', t.text);
      if (newText) {
        NewsStore.saveTicker({ id: t.id, text: newText.trim(), active: t.active });
        this.renderTab('tickers');
      }
    }
  }

  toggleTicker(id, active) {
    const t = NewsStore.getTickers().find(x => x.id === id);
    if (t) {
      NewsStore.saveTicker({ ...t, active });
    }
  }

  deleteTicker(id) {
    if (confirm('Delete this ticker item?')) {
      NewsStore.deleteTicker(id);
      this.renderTab('tickers');
    }
  }

  // Tips
  updateTipStatus(id, status) {
    NewsStore.updateTipStatus(id, status);
  }

  convertTipToStory(id) {
    const tip = NewsStore.getTips().find(t => t.id === id);
    if (tip) {
      this.openArticleModal({
        title: tip.subject || 'Citizen Report: ' + tip.name,
        category: 'City',
        excerpt: tip.message.substring(0, 120) + '...',
        content: `<p>${tip.message}</p><p><em>Submitted confidentially by citizen ${tip.name}. Verified by editorial desk.</em></p>`,
        author: 'Desk Verified',
        isBreaking: true
      });
    }
  }

  deleteTip(id) {
    if (confirm('Delete this citizen tip?')) {
      NewsStore.deleteTip(id);
      this.renderTab('tips');
    }
  }

  // Settings
  saveSettingsForm(e) {
    e.preventDefault();
    const updated = {
      siteName: document.getElementById('settingSiteName').value.trim(),
      editionName: document.getElementById('settingEditionName').value.trim(),
      whatsappChannelUrl: document.getElementById('settingWhatsAppUrl').value.trim(),
      whatsappTipNumber: document.getElementById('settingTipNumber').value.trim(),
      deskEmail: document.getElementById('settingDeskEmail').value.trim(),
      editorEmail: document.getElementById('settingEditorEmail').value.trim(),
      officeAddress: document.getElementById('settingAddress').value.trim()
    };
    NewsStore.saveSettings(updated);
    alert('Settings updated successfully!');
  }

  resetAllData() {
    if (confirm('Are you sure you want to reset all articles, videos, and settings to factory defaults?')) {
      NewsStore.resetAll();
      alert('Store reset complete.');
      this.renderTab('dashboard');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  switchTab(tab) {
    const navItem = document.querySelector(`[data-tab="${tab}"]`);
    if (navItem) navItem.click();
  }

  filterArticlesTable(val) {
    const query = val.toLowerCase();
    document.querySelectorAll('#articlesTable tbody tr').forEach(tr => {
      const text = tr.innerText.toLowerCase();
      tr.style.display = text.includes(query) ? '' : 'none';
    });
  }
}

window.admin = new AdminApp();
