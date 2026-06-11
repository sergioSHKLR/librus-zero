
/* =========================================================================
 IMMORTAL ARCHIVE v20 — STABLE DEMO MODE
 ========================================================================= */

const LibrusState = {
 theme: localStorage.getItem('archive_theme') || 'light',
 density: localStorage.getItem('archive_user_density') || 'normal',
 justify: localStorage.getItem('archive_justify') === 'true',
 fontSize: parseFloat(localStorage.getItem('archive_font_size')) || 1.0,
 serifIndex: parseInt(localStorage.getItem('archive_serif_family'), 10) || 0,

 serifFamilies: [
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Georgia, Times, "Times New Roman", serif',
  'Palatino Linotype, "Palatino", "Book Antiqua", serif',
  'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
 ],

 searchProviders: {
  pt_wikipedia: q => `https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`,
  en_wikipedia: q => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`,
  pt_wiktionary: q => `https://pt.wiktionary.org/w/index.php?search=${encodeURIComponent(q)}`,
  infopedia: q => `https://www.infopedia.pt/dicionarios/lingua-portuguesa/${q.toLowerCase()}`,
  openstreetmap: q => `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`
 },

 init() {
  this.apply('theme', this.theme);
  this.apply('density', this.density);
  this.apply('justify', String(this.justify));
  this.updateFontProperties();
 },

 set(key, value) {
  this[key] = value;
  this.apply(key, value);
 },

 apply(key, value) {
  const storageKey = key === 'density' ? 'archive_user_density' : `archive_${key}`;
  localStorage.setItem(storageKey, value);
  document.documentElement.setAttribute(`data-${key}`, value);
 },

 updateFontProperties() {
  document.documentElement.style.setProperty('--size-reading', this.fontSize + 'rem');
  document.documentElement.style.setProperty('--font-reading', this.serifFamilies[this.serifIndex]);
  localStorage.setItem('archive_font_size', this.fontSize);
  localStorage.setItem('archive_serif_family', this.serifIndex);
 }
};

document.addEventListener('DOMContentLoaded', () => {
 LibrusState.init();

 const DOM = {
  workspace: document.querySelector('.main-workspace'),
  content: document.getElementById('content-area'),
  toc: document.getElementById('toc-sidebar'),
  library: document.getElementById('library-sidebar'),
  settings: document.getElementById('settings-sidebar'),
  iframe: document.getElementById('context'),
  loader: document.getElementById('iframe-loader'),
  shade: document.getElementById('ctx-blur-shade'),
  tocContainer: document.getElementById('toc-links-container'),
  panelFilter: document.getElementById('panel-filter'),
  searchCount: document.getElementById('search-count'),
  tocBtn: document.getElementById('toc-open'),
  libBtn: document.getElementById('library-open'),
  settingsBtn: document.getElementById('settings-open'),
  themeBtn: document.getElementById('theme-toggle'),
  ctxToggle: document.getElementById('ctx-toggle'),
  ctxFullscreen: document.getElementById('ctx-fullscreen')
 };

 // Sidebar
 function closeAllSidebars() {
  [DOM.toc, DOM.library, DOM.settings].forEach(el => el?.classList.remove('active'));
 }

 function toggleSidebar(target, trigger) {
  if (!target) return;
  const willOpen = !target.classList.contains('active');
  closeAllSidebars();
  target.classList.toggle('active', willOpen);
  trigger?.setAttribute('aria-expanded', String(willOpen));
 }

 DOM.tocBtn?.addEventListener('click', e => { e.stopPropagation(); toggleSidebar(DOM.toc, DOM.tocBtn); });
 DOM.libBtn?.addEventListener('click', e => { e.stopPropagation(); toggleSidebar(DOM.library, DOM.libBtn); });
 DOM.settingsBtn?.addEventListener('click', e => { e.stopPropagation(); toggleSidebar(DOM.settings, DOM.settingsBtn); });

 document.addEventListener('click', e => {
  if (!e.target.closest('.overlay-sidebar') && !e.target.closest('.nav-btn, button[aria-label]')) closeAllSidebars();
 });

 // Theme toggle
 DOM.themeBtn?.addEventListener('click', () => LibrusState.set('theme', LibrusState.theme === 'light' ? 'dark' : 'light'));

 // Text controls
 document.getElementById('btn-density')?.addEventListener('click', () => {
  const opts = ['compact', 'normal', 'loose'];
  const idx = (opts.indexOf(LibrusState.density) + 1) % opts.length;
  LibrusState.set('density', opts[idx]);
 });
 document.getElementById('btn-justify')?.addEventListener('click', () => LibrusState.set('justify', !LibrusState.justify));
 document.getElementById('btn-font-inc')?.addEventListener('click', () => { LibrusState.fontSize = Math.min(LibrusState.fontSize + 0.05, 1.4); LibrusState.updateFontProperties(); });
 document.getElementById('btn-font-dec')?.addEventListener('click', () => { LibrusState.fontSize = Math.max(LibrusState.fontSize - 0.05, 0.85); LibrusState.updateFontProperties(); });
 document.getElementById('btn-font-family')?.addEventListener('click', () => { LibrusState.serifIndex = (LibrusState.serifIndex + 1) % LibrusState.serifFamilies.length; LibrusState.updateFontProperties(); });

 // Content Search
 let searchHits = [], currentIndex = -1;

 function clearHighlights() {
  searchHits = []; currentIndex = -1;
  DOM.searchCount.textContent = '0 / 0';
  DOM.content?.querySelectorAll('.search-highlight').forEach(m => m.outerHTML = m.textContent);
 }

 function highlightSearch(query) {
  clearHighlights();
  if (!query?.trim() || !DOM.content) return;
  const regex = new RegExp(query.replace(/[.*+?^${ }()|[\]\\]/g, '\\$&'), 'gi');
  DOM.content.innerHTML = DOM.content.innerHTML.replace(regex, m => `<mark class="search-highlight">${m}</mark>`);
  searchHits = Array.from(DOM.content.querySelectorAll('.search-highlight'));
  if (searchHits.length) activateHit(0);
 }

 function activateHit(idx) {
  if (!searchHits.length) return;
  searchHits.forEach((h, i) => h.classList.toggle('current-search-hit', i === idx));
  currentIndex = idx;
  DOM.searchCount.textContent = `${idx + 1} / ${searchHits.length}`;
  searchHits[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
 }

 document.getElementById('btn-search')?.addEventListener('click', () => highlightSearch(DOM.panelFilter.value));
 document.getElementById('btn-search-prev')?.addEventListener('click', () => activateHit((currentIndex - 1 + searchHits.length) % searchHits.length));
 document.getElementById('btn-search-next')?.addEventListener('click', () => activateHit((currentIndex + 1) % searchHits.length));

 // Clear buttons
 document.querySelectorAll('.input-clear-btn').forEach(btn => {
  btn.addEventListener('click', () => {
   const input = btn.previousElementSibling;
   if (input?.tagName === 'INPUT') {
    input.value = '';
    if (input.id === 'panel-filter') clearHighlights();
   }
  });
 });

 // Context buttons
 ['ctx-encyclopaedia', 'ctx-dictionary', 'ctx-map'].forEach(id => {
  const btn = document.getElementById(id);
  btn?.addEventListener('click', () => {
   const sel = window.getSelection().toString().trim();
   if (!sel) return alert("Selecione texto primeiro!");
   DOM.loader.classList.add('active');
   let key = LibrusState.activeSearchProvider;
   if (id === 'ctx-dictionary') key = document.querySelector('input[name="dictionary-provider"]:checked')?.value || 'pt_wiktionary';
   if (id === 'ctx-map') key = 'openstreetmap';
   DOM.iframe.src = LibrusState.searchProviders[key](sel);
  });
 });

 DOM.iframe?.addEventListener('load', () => DOM.loader.classList.remove('active'));
 DOM.ctxToggle?.addEventListener('click', () => DOM.shade.classList.toggle('active'));
 DOM.ctxFullscreen?.addEventListener('click', () => DOM.workspace.classList.toggle('drawer-fullscreen'));

 // Library Shelf
 const ArchiveLibraryShelf = [
  { title: "O Livro dos Espíritos", subtitle: "Allan Kardec" },
  { title: "O Evangelho Segundo o Espiritismo", subtitle: "Allan Kardec" },
  { title: "O Céu e o Inferno", subtitle: "Allan Kardec" }
 ];

 function renderLibraryShelf() {
  const container = document.getElementById('library-shelf-container');
  if (!container) return;
  container.innerHTML = '';
  ArchiveLibraryShelf.forEach(book => {
   const card = document.createElement('div');
   card.className = 'book-card';
   card.innerHTML = `<strong>${book.title}</strong><br><small>${book.subtitle}</small>`;
   card.onclick = () => alert(`Abrindo: ${book.title}`);
   container.appendChild(card);
  });
 }

 // Fallback Content + TOC
 function buildTOC() {
  if (!DOM.tocContainer || !DOM.content) return;
  DOM.tocContainer.innerHTML = '';
  DOM.content.querySelectorAll('h1,h2,h3,h4').forEach(h => {
   const a = document.createElement('a');
   a.href = `#${h.id = h.id || h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
   a.textContent = h.textContent;
   a.className = 'toc-link-item';
   DOM.tocContainer.appendChild(a);
  });
 }

 // Load Demo Content
 DOM.content.innerHTML = `
  <article>
   <h1>Immortal Archive</h1>
   <p>Bem-vindo ao Librus v.20 — eReader de sobrevivência geracional.</p>
   <h2>Capítulo 1 — Introdução ao Espiritismo</h2>
   <p>Selecionar qualquer palavra e usar os botões de contexto para Wikipedia/Wiktionary/Mapa.</p>
   <h3>Funcionalidades Ativas</h3>
   <p>Busca interna com destaque, TOC dinâmico, temas, densidade de linha, justificação.</p>
  </article>`;
 buildTOC();
 renderLibraryShelf();
});

/* =========================================================================
   PART 2 OF 5: DOM CACHING AND EVENT ROUTER SYSTEM REGISTER
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
 LibrusState.init();

 const DOM = {
  body: document.body,
  content: document.getElementById('content-area'),
  toc: document.getElementById('toc-sidebar'),
  lib: document.getElementById('library-sidebar'),
  settings: document.getElementById('settings-sidebar'),
  ctxPanel: document.getElementById('context-panel'),
  iframe: document.getElementById('context'),
  loader: document.getElementById('iframe-loader'),
  shade: document.getElementById('ctx-blur-shade'),
  tocContainer: document.getElementById('toc-links-container'),

  panelFilter: document.getElementById('panel-filter'),
  tocFilter: document.getElementById('toc-filter'),
  libFilter: document.getElementById('library-filter'),
  searchCount: document.getElementById('search-count'),

  tocToggle: document.getElementById('toc-open'),
  libToggle: document.getElementById('library-open'),
  themeToggle: document.getElementById('theme-toggle'),
  ctxToggle: document.getElementById('ctx-toggle'),
  ctxFullscreen: document.getElementById('ctx-fullscreen'),
  settingsToggle: document.getElementById('settings-open') // Cached natively inside DOM list object
 };

 function toggleSidebar(target, triggerBtn, forceClose) {
  if (!target) return;
  const closeOnly = forceClose || false;
  const isOpening = closeOnly ? false : !target.classList.contains('active');

  target.classList.toggle('active', isOpening);
  if (triggerBtn) triggerBtn.setAttribute('aria-expanded', String(isOpening));

  if (isOpening) {
   if (target !== DOM.toc) toggleSidebar(DOM.toc, DOM.tocToggle, true);
   if (target !== DOM.lib) toggleSidebar(DOM.lib, DOM.libToggle, true);
   if (target !== DOM.settings) toggleSidebar(DOM.settings, DOM.settingsToggle, true);
  }
 }

 if (DOM.tocToggle) {
  DOM.tocToggle.onclick = function (e) {
   e.stopPropagation();
   toggleSidebar(DOM.toc, DOM.tocToggle);
  };
 }

 if (DOM.libToggle) {
  DOM.libToggle.onclick = function (e) {
   e.stopPropagation();
   toggleSidebar(DOM.lib, DOM.libToggle);
  };
 }

 if (DOM.settingsToggle) {
  DOM.settingsToggle.onclick = function (e) {
   e.stopPropagation();
   toggleSidebar(DOM.settings, DOM.settingsToggle);
  };
 }

 // Dismiss overlay panels on outside boundary clicks
 document.onclick = function (e) {
  if (DOM.toc && DOM.toc.classList.contains('active') && !DOM.toc.contains(e.target) && !DOM.tocToggle.contains(e.target)) {
   toggleSidebar(DOM.toc, DOM.tocToggle, true);
  }
  if (DOM.lib && DOM.lib.classList.contains('active') && !DOM.lib.contains(e.target) && !DOM.libToggle.contains(e.target)) {
   toggleSidebar(DOM.lib, DOM.libToggle, true);
  }
  if (DOM.settings && DOM.settings.classList.contains('active') && !DOM.settings.contains(e.target) && !DOM.settingsToggle.contains(e.target)) {
   toggleSidebar(DOM.settings, DOM.settingsToggle, true);
  }
 };

 /* =========================================================================
   PART 3 OF 5: UNIFIED CONTEXT FRAME PIPELINE & REFERENCE ROUTER
   ========================================================================= */
 const providerTabs = ['ctx-encyclopaedia', 'ctx-dictionary', 'ctx-map'];

 document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
  radio.addEventListener('change', function (e) {
   const type = e.target.name.replace('-provider', '');
   if (type === 'encyclopedia') LibrusState.activeSearchProvider = e.target.value;
  });
 });

 providerTabs.forEach(function (id) {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.addEventListener('click', function (e) {
   e.preventDefault();

   // Capture the selection highlight string
   const selection = window.getSelection().toString().trim();

   if (!selection) {
    alert("Nenhum texto selecionado! Por favor, selecione uma palavra no texto para pesquisar.");
    return;
   }

   requestAnimationFrame(function () {
    if (DOM.loader) DOM.loader.classList.add('active');

    // Explicit routing structure based on which tab button was pressed
    let providerKey = LibrusState.activeSearchProvider;

    if (id === 'ctx-encyclopaedia') {
     providerKey = LibrusState.activeSearchProvider || 'pt_wikipedia';
     if (providerKey !== 'pt_wikipedia' && providerKey !== 'en_wikipedia') {
      providerKey = 'pt_wikipedia';
     }
    } else if (id === 'ctx-dictionary') {
     const checkedRadio = document.querySelector('input[name="dictionary-provider"]:checked');
     providerKey = checkedRadio ? checkedRadio.value : 'pt_wiktionary';
    } else if (id === 'ctx-map') {
     providerKey = 'openstreetmap';
    }

    // Fetch matching builder function from Part 1
    const builder = LibrusState.searchProviders[providerKey] || LibrusState.searchProviders.pt_wikipedia;

    let encodedQuery = encodeURIComponent(selection);
    if (providerKey === 'infopedia') encodedQuery = encodedQuery.toLowerCase();

    // Inject directly into the permanently visible split iframe window
    if (DOM.iframe) {
     DOM.iframe.src = builder(encodedQuery);
    }
   });
  });
 });

 if (DOM.iframe) {
  DOM.iframe.addEventListener('load', function () {
   requestAnimationFrame(function () {
    if (DOM.loader) DOM.loader.classList.remove('active');
   });
  });
 }

 /* =========================================================================
    PART 4 OF 5: DECOUPLED FILTERS AND SAFE HIGH-PERFORMANCE HIGHLIGHTS
    ========================================================================= */
 let searchHits = [];
 let currentSearchIndex = -1;

 function clearHighlights() {
  searchHits = [];
  currentSearchIndex = -1;
  if (DOM.searchCount) DOM.searchCount.textContent = '0 / 0';
  if (!DOM.content) return;

  const highlights = DOM.content.querySelectorAll('.search-highlight');
  highlights.forEach(function (highlight) {
   const parent = highlight.parentNode;
   if (!parent) return;
   parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
   parent.normalize();
  });
 }

 function highlightPanelSearch(query) {
  clearHighlights();
  const trimmed = query.trim();
  if (!trimmed || !DOM.content) return;

  const safeRegexString = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(safeRegexString, 'gi');

  const walker = document.createTreeWalker(DOM.content, NodeFilter.SHOW_TEXT, {
   acceptNode(node) {
    if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
    if (node.parentNode.closest('.search-highlight')) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
   }
  });

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) { textNodes.push(node); }

  textNodes.forEach(function (textNode) {
   const text = textNode.nodeValue;
   let lastIndex = 0;
   let match;
   const frag = document.createDocumentFragment();

   while ((match = pattern.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) frag.appendChild(document.createTextNode(before));

    const mark = document.createElement('mark');
    mark.className = 'search-highlight';
    mark.textContent = match[0];
    frag.appendChild(mark);

    lastIndex = match.index + match[0].length;
   }

   const after = text.slice(lastIndex);
   if (!frag.childNodes.length) return;
   if (after) frag.appendChild(document.createTextNode(after));

   textNode.parentNode.replaceChild(frag, textNode);
  });

  searchHits = Array.from(DOM.content.querySelectorAll('.search-highlight'));
  if (searchHits.length > 0) {
   activateSearchHit(0);
  }
 }

 function activateSearchHit(index) {
  if (!searchHits.length) return;
  searchHits.forEach(function (hit, idx) {
   hit.classList.toggle('current-search-hit', idx === index);
  });
  currentSearchIndex = index;

  if (DOM.searchCount) {
   DOM.searchCount.textContent = (currentSearchIndex + 1) + ' / ' + searchHits.length;
  }

  requestAnimationFrame(function () {
   const target = searchHits[currentSearchIndex];
   if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
 }

 function moveSearchHit(offset) {
  if (!searchHits.length) return;
  const nextIndex = (currentSearchIndex + offset + searchHits.length) % searchHits.length;
  activateSearchHit(nextIndex);
 }

 const btnSearch = document.getElementById('btn-search');
 if (btnSearch) {
  btnSearch.onclick = function () {
   if (DOM.panelFilter) highlightPanelSearch(DOM.panelFilter.value);
  };
 }

 const btnPrev = document.getElementById('btn-search-prev');
 if (btnPrev) btnPrev.onclick = function () { moveSearchHit(-1); };

 const btnNext = document.getElementById('btn-search-next');
 if (btnNext) btnNext.onclick = function () { moveSearchHit(1); };

 document.querySelectorAll('.input-clear-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
   const input = btn.previousElementSibling;
   if (input && input.tagName === 'INPUT') {
    input.value = '';
    if (input.id === 'panel-filter') clearHighlights();
    input.focus();
   }
  });
 });

 /* =========================================================================
    PART 5 OF 5: INDEXING OBSERVERS, LIBRARY SHELVES, ASYNC HYDRATION & CLOSURE
    ========================================================================= */
 function initializeActiveScrollObserver(headings) {
  if (window.ArchiveScrollObserver) window.ArchiveScrollObserver.disconnect();

  const observerOptions = {
   root: DOM.content,
   rootMargin: '0px 0px -70% 0px',
   threshold: 0
  };

  window.ArchiveScrollObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
    if (entry.isIntersecting) {
     const activeSlug = entry.target.id;
     DOM.toc.querySelectorAll('.toc-active-item').forEach(function (el) {
      el.classList.remove('toc-active-item');
     });

     const safeSlug = CSS.escape(activeSlug);
     const targetNavNode = DOM.toc.querySelector('[data-slug="' + safeSlug + '"], a[href="#' + safeSlug + '"]');

     if (targetNavNode) {
      targetNavNode.classList.add('toc-active-item');

      const activeAncestryChain = [];
      let currentParent = targetNavNode.parentElement;
      while (currentParent && currentParent !== DOM.tocContainer) {
       if (currentParent.tagName === 'DETAILS') activeAncestryChain.push(currentParent);
       currentParent = currentParent.parentElement;
      }

      DOM.tocContainer.querySelectorAll('details').forEach(function (detailsBox) {
       detailsBox.open = activeAncestryChain.includes(detailsBox);
      });

      targetNavNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
     }
    }
   });
  }, observerOptions);

  headings.forEach(function (heading) { window.ArchiveScrollObserver.observe(heading); });
 }

 function buildTableOfContents() {
  if (!DOM.tocContainer || !DOM.content) return;
  DOM.tocContainer.innerHTML = '';

  const headings = DOM.content.querySelectorAll('h1, h2, h3, h4');
  const fragment = document.createDocumentFragment();
  let activeContainers = { 1: fragment, 2: null, 3: null, 4: null };

  headings.forEach(function (heading, index) {
   const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sec-' + index;
   heading.id = slug;

   const level = parseInt(heading.tagName.substring(1), 10);
   const nextHeading = headings[index + 1];
   const hasChildren = nextHeading && parseInt(nextHeading.tagName.substring(1), 10) > level;

   if (hasChildren && level < 4) {
    const details = document.createElement('details');
    details.open = (level === 1);

    const summary = document.createElement('summary');
    summary.textContent = heading.textContent;
    summary.dataset.slug = slug;

    summary.onclick = function (e) {
     e.preventDefault();
     heading.scrollIntoView({ behavior: 'smooth' });
     if (window.innerWidth < 768) toggleSidebar(DOM.toc, DOM.tocToggle, true);
    };

    details.appendChild(summary);
    (activeContainers[level] || fragment).appendChild(details);
    activeContainers[level + 1] = details;
   } else {
    const link = document.createElement('a');
    link.href = '#' + slug;
    link.textContent = heading.textContent;
    link.className = 'toc-link-item';
    link.dataset.slug = slug;

    link.onclick = function (e) {
     e.preventDefault();
     heading.scrollIntoView({ behavior: 'smooth' });
     if (window.innerWidth < 768) toggleSidebar(DOM.toc, DOM.tocToggle, true);
    };

    (activeContainers[level] || fragment).appendChild(link);
   }
  });

  DOM.tocContainer.appendChild(fragment);
  initializeActiveScrollObserver(headings);
 }

 const ArchiveLibraryShelf = [
  { id: 'vol_1', title: 'Volume I', subtitle: 'History & Origins', icon: 'library_books.svg' },
  { id: 'vol_2', title: 'Volume II', subtitle: 'Natural Sciences', icon: 'library_books.svg' },
  { id: 'vol_3', title: 'Volume III', subtitle: 'Generational Culture', icon: 'library_books.svg' }
 ];

 function renderLibraryShelf(filterQuery) {
  const query = filterQuery || '';
  const shelfContainer = document.getElementById('library-shelf-container');
  if (!shelfContainer) return;

  shelfContainer.innerHTML = '';
  const shelfFragment = document.createDocumentFragment();
  const normalizedQuery = query.toLowerCase().trim();

  ArchiveLibraryShelf.forEach(function (book) {
   if (normalizedQuery &&
    !book.title.toLowerCase().includes(normalizedQuery) &&
    !book.subtitle.toLowerCase().includes(normalizedQuery)) {
    return;
   }

   const card = document.createElement('div');
   card.className = 'book-card';
   card.dataset.volumeId = book.id;
   card.tabIndex = 0;
   card.role = 'button';

   card.innerHTML = '<div class="book-meta" style="padding: 10px; border: 1px solid var(--border-light); margin-bottom: 8px; border-radius: 4px; cursor: pointer; background: var(--control-bg);">' +
    '<strong>' + book.title + '</strong><br>' +
    '<span style="font-size:0.85rem; color: var(--text-muted);">' + book.subtitle + '</span>' +
    '</div>';

   card.onclick = function () {
    alert('Loading dynamic resource archive: ' + book.title + '. Connecting data streams...');
    if (window.innerWidth < 768) toggleSidebar(DOM.lib, DOM.libToggle, true);
   };

   shelfFragment.appendChild(card);
  });

  shelfContainer.appendChild(shelfFragment);
 }

 if (DOM.libFilter) {
  DOM.libFilter.oninput = function (e) {
   requestAnimationFrame(function () { renderLibraryShelf(e.target.value); });
  };
 }

 // FIXED: Corrected jsDelivr module URLs to valid ESM files
 (window.requestIdleCallback || (function (cb) { setTimeout(cb, 0); }))(async function () {
  try {
   const [markedMod, purifyMod] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/marked@14.1.2/lib/marked.esm.js'),
    import('https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.es.mjs')
   ]);

   const marked = markedMod.marked;
   const DOMPurify = purifyMod.default || purifyMod.DOMPurify || purifyMod;

   const response = await fetch('../lde.md');
   if (!response.ok) throw new Error('HTTP Status: ' + response.status);
   const markdownText = await response.text();

   const rawHTML = marked.parse(markdownText);
   const cleanHTML = DOMPurify.sanitize(rawHTML);

   requestAnimationFrame(function () {
    if (DOM.content) {
     DOM.content.innerHTML = cleanHTML;
     buildTableOfContents();
    }
   });

  } catch (err) {
   console.warn("Using local workspace fallback framework.", err.message);
   if (DOM.content) {
    DOM.content.innerHTML = '<article>' +
     '<h1>Immortal Archive</h1>' +
     '<p>Fallback text initialized successfully. The app-v20 logic engine layer is running without exceptions.</p>' +
     '<h2>Sample Chapter One</h2>' +
     '<p>This is a default section layout block to demonstrate automated indexing mechanics.</p>' +
     '<h3>Sub-Heading Indexing</h3>' +
     '<p>Toggling headers now dynamically builds navigation details trees in your sidebar panel.</p>' +
     '<h2>Sample Chapter Two</h2>' +
     '<p>Live search highlights, dark mode profile toggles, and line spacing variations are ready.</p>' +
     '</article>';
    buildTableOfContents();
   }
  }
 });

 const btnDensity = document.getElementById('btn-density');
 if (btnDensity) {
  btnDensity.onclick = function () {
   const options = ['compact', 'normal', 'loose'];
   let idx = (options.indexOf(LibrusState.density) + 1) % options.length;
   LibrusState.set('density', options[idx]);
  };
 }

 const btnJustify = document.getElementById('btn-justify');
 if (btnJustify) {
  btnJustify.onclick = function () {
   LibrusState.set('justify', !LibrusState.justify);
  };
 }

 const btnFontInc = document.getElementById('btn-font-inc');
 if (btnFontInc) {
  btnFontInc.onclick = () => {
   LibrusState.fontSize = Math.min(LibrusState.fontSize + 0.05, 1.4);
   LibrusState.updateFontProperties();
  };
 }

 const btnFontDec = document.getElementById('btn-font-dec');
 if (btnFontDec) {
  btnFontDec.onclick = () => {
   LibrusState.fontSize = Math.max(LibrusState.fontSize - 0.05, 0.85);
   LibrusState.updateFontProperties();
  };
 }

 const btnFontFamily = document.getElementById('btn-font-family');
 if (btnFontFamily) {
  btnFontFamily.onclick = function () {
   LibrusState.serifIndex = (LibrusState.serifIndex + 1) % LibrusState.serifFamilies.length;
   LibrusState.updateFontProperties();
  };
 }

 if (DOM.themeToggle) {
  DOM.themeToggle.onclick = function () {
   LibrusState.set('theme', LibrusState.theme === 'dark' ? 'light' : 'dark');
  };
 }

 renderLibraryShelf();
});