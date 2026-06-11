#!/usr/bin/env bash

echo "🚀 Constructing Librus Modular Production Environment..."

# 1. Structural Directories
mkdir -p styles
mkdir -p js/vendor
mkdir -p js/modules
mkdir -p icons

# 2. Relocate your existing local marked file if found in root
if [ -f "marked.esm.js" ]; then
    mv marked.esm.js js/vendor/marked.esm.js
    echo "📦 Relocated your local marked.esm.js into js/vendor/"
else
    touch js/vendor/marked.esm.js
    echo "📄 Created empty file for js/vendor/marked.esm.js"
fi

# =========================================================================
# 3. POPULATE STYLESYSTEM LAYER MATRIX
# =========================================================================

echo "🎨 Injecting split style matrices..."

cat << 'EOF' > styles/base.css
/**
 * LIBRUS CORE SYSTEM - BASE VARIABLES & TYPOGRAPHY MATRICES
 * File Location: /styles/base.css
 */
:root {
 --bg-main: #ffffff;
 --bg-panel: #f8f9fa;
 --text-primary: #212529;
 --text-muted: #6c757d;
 --border-light: #dee2e6;
 --accent-link: #0056b3;
 --control-size: 38px;
 --control-radius: 6px;
 --control-bg: #ffffff;
 --control-border: 1px solid var(--border-light);
 --icon-filter: none;
 --backdrop-shade: rgba(0, 0, 0, 0.25);
 --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
 --font-reading: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
 --size-reading: 1rem;
 --lh-reading: 1.6;
 --align-reading: left;
}
[data-theme="dark"] {
 --bg-main: #141414;
 --bg-panel: #1e1e1e;
 --text-primary: #e2e2e2;
 --text-muted: #8c8c8c;
 --border-light: #2d2d2d;
 --control-bg: #262626;
 --control-border: 1px solid #383838;
 --accent-link: #52a5ff;
 --icon-filter: invert(0.92) brightness(1.1);
 --backdrop-shade: rgba(0, 0, 0, 0.45);
}
* { box-sizing: border-box; }
body {
 margin: 0;
 padding: 0;
 font-family: var(--font-ui);
 background: var(--bg-main);
 color: var(--text-primary);
 display: flex;
 flex-direction: column;
 height: 100vh;
 overflow: hidden;
}
EOF

cat << 'EOF' > styles/layout.css
/**
 * LIBRUS CORE SYSTEM - VIEWPORT LAYOUT & LANDSCAPE SHIELD
 * File Location: /styles/layout.css
 */
.top-bar {
 display: flex;
 align-items: center;
 height: 50px;
 padding: 0 16px;
 background: var(--bg-panel);
 border-bottom: 1px solid var(--border-light);
 gap: 8px;
 z-index: 100;
}
button {
 width: var(--control-size);
 height: var(--control-size);
 border-radius: var(--control-radius);
 border: var(--control-border);
 background: var(--control-bg);
 color: var(--text-primary);
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: background 0.15s ease;
}
button:disabled { cursor: not-allowed; opacity: 0.5; }
button>img, .panel-header button>img { filter: var(--icon-filter); }
.brand {
 margin-left: auto;
 font-weight: bold;
 text-transform: uppercase;
 letter-spacing: 1px;
 font-size: 0.85rem;
 color: var(--text-muted);
}
.main-workspace {
 display: flex;
 flex: 1;
 position: relative;
 overflow: hidden;
 height: calc(100vh - 50px);
 width: 100vw;
 background: var(--bg-main);
}
#orientation-shield {
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: #111111;
 color: #ffffff;
 z-index: 9999;
 display: none;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 padding: 32px;
 text-align: center;
 font-family: var(--font-ui);
}
@media (orientation: portrait) { #orientation-shield { display: flex; } }
.device-silhouette {
 width: 70px;
 height: 130px;
 border: 3px solid #ffffff;
 border-radius: 12px;
 position: relative;
 margin-bottom: 24px;
 animation: rotateDeviceClockwise 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}
.device-silhouette::before {
 content: '';
 position: absolute;
 top: 6px;
 left: 50%;
 transform: translateX(-50%);
 width: 6px;
 height: 6px;
 background: #ffffff;
 border-radius: 50%;
}
@keyframes rotateDeviceClockwise {
 0% { transform: rotate(0deg); }
 30% { transform: rotate(0deg); }
 70% { transform: rotate(90deg); }
 100% { transform: rotate(90deg); }
}
.shield-title { font-size: 1.25rem; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.5px; }
.shield-sub { font-size: 0.9rem; color: #aaaaaa; max-width: 280px; line-height: 1.4; margin: 0; }
EOF

cat << 'EOF' > styles/panels.css
/**
 * LIBRUS CORE SYSTEM - SIDEBARS, INTERFACES & BACKDROP BLURS
 * File Location: /styles/panels.css
 */
.main-panel {
 width: 50vw;
 display: flex;
 flex-direction: column;
 height: 100%;
 border-right: 1px solid var(--border-light);
 overflow: hidden;
 will-change: transform, width;
 transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.research-drawer {
 width: 50vw;
 height: 100%;
 display: flex;
 flex-direction: column;
 background: var(--bg-panel);
 overflow: hidden;
 will-change: width;
 transition: width 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.main-workspace.drawer-expand .main-panel {
 width: 50vw !important;
 transform: translateX(-100%);
 border-right: none !important;
}
.main-workspace.drawer-expand .research-drawer {
 width: 100vw !important;
 margin-left: -50vw;
 transition: width 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), margin-left 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.overlay-sidebar {
 position: absolute;
 top: 0;
 bottom: 0;
 left: 0;
 width: 300px;
 height: 100%;
 background: var(--bg-panel);
 border-right: 1px solid var(--border-light);
 transform: translateX(-100%);
 transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
 z-index: 150;
 display: flex;
 flex-direction: column;
 box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
}
#library-sidebar { width: calc(100vw - 460px); min-width: 320px; }
#settings-sidebar {
 top: 104px;
 height: calc(100vh - 104px);
 left: auto;
 right: 0;
 border-right: none;
 border-left: 1px solid var(--border-light);
 transform: translateX(100%);
 box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
 z-index: 160;
}
.overlay-sidebar.active { transform: translateX(0) !important; display: flex !important; }
#sidebar-backdrop {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 z-index: 140;
 display: none;
 background: var(--backdrop-shade);
 backdrop-filter: blur(2px);
 opacity: 0;
 transition: opacity 0.2s ease;
}
#sidebar-backdrop.active { display: block !important; opacity: 1 !important; }
.panel-header {
 display: flex;
 align-items: center;
 padding: 8px 16px;
 background: var(--bg-panel);
 border-bottom: 1px solid var(--border-light);
 gap: 8px;
 flex-shrink: 0;
 height: 54px;
}
.sidebar-nav { padding: 16px; display: flex; flex-direction: column; gap: 16px; height: 100%; overflow-y: auto; }
.typo-dropdown-menu {
 display: none;
 position: absolute;
 top: calc(100% + 6px);
 left: 50%;
 transform: translateX(-50%);
 background-color: var(--bg-panel);
 border: 1px solid var(--border-light);
 border-radius: var(--control-radius);
 padding: 6px;
 gap: 6px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
 z-index: 250;
}
.typo-dropdown-menu.active { display: flex !important; flex-direction: row !important; }
.ctx-blur-shade {
 position: absolute;
 top: 0; left: 0; right: 0; bottom: 0;
 background: rgba(248, 249, 250, 0.85);
 backdrop-filter: blur(12px);
 display: flex;
 align-items: center;
 justify-content: center;
 opacity: 0;
 pointer-events: none;
 transition: opacity 0.2s ease;
 z-index: 10;
}
[data-theme="dark"] .ctx-blur-shade { background: rgba(20, 20, 20, 0.88); }
.ctx-blur-shade.active { opacity: 1; pointer-events: auto; }
.shade-message { font-weight: 600; background: var(--control-bg); border: var(--control-border); padding: 12px 20px; border-radius: 8px; color: var(--text-primary); }
.iframe-loading-overlay {
 position: absolute;
 top: 54px; left: 0; right: 0; bottom: 0;
 background: var(--bg-main);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 20;
 opacity: 0;
 pointer-events: none;
 transition: opacity 0.15s ease;
}
.iframe-loading-overlay.active { opacity: 1; pointer-events: auto; }
.loading-spinner-ring {
 width: 32px; height: 32px;
 border: 3px solid var(--border-light);
 border-top-color: var(--accent-link);
 border-radius: 50%;
 animation: spin 0.6s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
.paperback-card {
 display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px;
 border: 1px solid var(--border-light); border-radius: var(--control-radius); background: var(--control-bg);
 cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
}
.paperback-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
.paperback-card img { width: 100%; max-width: 80px; height: auto; border-radius: 2px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); }
EOF

cat << 'EOF' > styles/reader.css
/**
 * LIBRUS CORE SYSTEM - INTERACTIVE TEXT ENGINE TYPOGRAPHY LAYER
 * File Location: /styles/reader.css
 */
.panel-body { flex: 1; padding: 32px 24px; overflow-y: auto; background: var(--bg-main); color: var(--text-primary); }
.panel-body article {
 max-width: 680px; margin: 0 auto;
 line-height: var(--lh-reading) !important; font-size: var(--size-reading) !important;
 text-align: var(--align-reading) !important; font-family: var(--font-reading) !important;
}
.research-drawer iframe { width: 100%; height: 100%; border: none; background: transparent; flex: 1; }
.input-with-clear { position: relative; display: flex; align-items: center; width: 220px; flex-shrink: 0; }
.input-with-clear input {
 width: 100%; padding: 8px 12px; border-radius: var(--control-radius); border: var(--control-border);
 background: var(--control-bg); color: var(--text-primary); font-size: 0.85rem; font-family: var(--font-ui);
}
.divider { width: 1px; height: 24px; background: var(--border-light); margin: 0 4px; flex-shrink: 0; }
.search-count { font-size: 0.8rem; color: var(--text-muted); min-width: 52px; text-align: center; font-family: monospace; }
.search-highlight { background: #fff3cd; color: #000000; border-radius: 2px; }
.current-search-hit { background: #ffc107; font-weight: bold; box-shadow: 0 0 4px #ffc107; }
.toc-active-item { background: var(--border-light) !important; font-weight: bold !important; border-left: 3px solid var(--accent-link) !important; }
fieldset { border: var(--control-border); border-radius: var(--control-radius); margin-bottom: 12px; padding: 12px; background: var(--control-bg); }
legend { font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--text-muted); padding: 0 6px; }
fieldset label { display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 0.85rem; cursor: pointer; }
[data-density="compact"] { --lh-reading: 1.35; }
[data-density="normal"] { --lh-reading: 1.65; }
[data-density="loose"] { --lh-reading: 2.1; }
[data-justify="true"] { --align-reading: justify; }
[data-justify="false"] { --align-reading: left; }
#toc-links-container details { margin-bottom: 4px; width: 100%; }
#toc-links-container summary { padding: 8px 10px; cursor: pointer; border-radius: var(--control-radius); font-size: 0.9rem; font-weight: 600; background: var(--control-bg); border: var(--control-border); }
.toc-link-item { display: block; padding: 6px 12px; color: var(--accent-link); text-decoration: none; font-size: 0.85rem; }
EOF

# =========================================================================
# 4. POPULATE DECOUPLED JAVASCRIPT MODULE PACKAGES
# =========================================================================

echo "⚙️ Injecting application controller models..."

cat << 'EOF' > js/modules/state.js
/**
 * LIBRUS MODULE SYSTEM - DYNAMIC WORKSPACE CORE STATE
 * File Location: /js/modules/state.js
 */
export const LibrusState = {
 theme: localStorage.getItem('archive_theme') || 'light',
 density: localStorage.getItem('archive_user_density') || 'normal',
 justify: localStorage.getItem('archive_justify') === 'true',
 fontSize: parseFloat(localStorage.getItem('archive_font_size')) || 1.0,
 serifIndex: parseInt(localStorage.getItem('archive_serif_family'), 10) || 0,
 activeSearchProvider: 'pt_wikipedia',
 serifFamilies: [
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Georgia, Times, "Times New Roman", serif',
  'Palatino Linotype, "Palatino", "Book Antiqua", serif',
  'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
 ],
 searchProviders: {
  pt_wikipedia: q => `https://pt.wikipedia.org/w/index.php?search=${q}`,
  en_wikipedia: q => `https://en.wikipedia.org/w/index.php?search=${q}`,
  pt_wiktionary: q => `https://pt.wiktionary.org/w/index.php?search=${q}`,
  infopedia: q => `https://www.infopedia.pt/dicionarios/lingua-portuguesa/${q}`,
  openstreetmap: q => `https://www.openstreetmap.org/search?query=${q}`,
  sample1: q => `https://pt.wikipedia.org/w/index.php?search=Sample1+${q}`,
  sample2: q => `https://pt.wiktionary.org/w/index.php?search=Sample2+${q}`
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
  const storageKey = (key === 'density') ? 'archive_user_density' : `archive_${key}`;
  localStorage.setItem(storageKey, value);
  document.body.setAttribute(`data-${key}`, value);
 },
 updateFontProperties() {
  document.body.style.setProperty('--size-reading', `${this.fontSize}rem`);
  document.body.style.setProperty('--font-reading', this.serifFamilies[this.serifIndex]);
  localStorage.setItem('archive_font_size', this.fontSize);
  localStorage.setItem('archive_serif_family', this.serifIndex);
 }
};
EOF

cat << 'EOF' > js/modules/search.js
/**
 * LIBRUS MODULE SYSTEM - HIGH-PERFORMANCE DOM TEXT REGEX MATCH ENGINE
 * File Location: /js/modules/search.js
 */
export class SearchEngine {
 constructor(contentArea, countLabel) {
  this.contentArea = contentArea;
  this.countLabel = countLabel;
  this.hits = [];
  this.currentIndex = -1;
 }
 clear() {
  this.hits = [];
  this.currentIndex = -1;
  if (this.countLabel) this.countLabel.textContent = '0 / 0';
  if (!this.contentArea) return;
  const highlights = this.contentArea.querySelectorAll('.search-highlight');
  highlights.forEach(h => {
   const parent = h.parentNode;
   if (parent) {
    parent.replaceChild(document.createTextNode(h.textContent), h);
    parent.normalize();
   }
  });
 }
 execute(query) {
  this.clear();
  const cleanQuery = query.trim();
  if (!cleanQuery) return;
  const pattern = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const walker = document.createTreeWalker(this.contentArea, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while (n = walker.nextNode()) nodes.push(n);
  nodes.forEach(node => {
   const text = node.nodeValue;
   if (!pattern.test(text)) return;
   pattern.lastIndex = 0;
   const frag = document.createDocumentFragment();
   let lastIndex = 0, match;
   while ((match = pattern.exec(text)) !== null) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    const mark = document.createElement('mark');
    mark.className = 'search-highlight';
    mark.textContent = match[0];
    frag.appendChild(mark);
    lastIndex = pattern.lastIndex;
   }
   frag.appendChild(document.createTextNode(text.slice(lastIndex)));
   node.parentNode.replaceChild(frag, node);
  });
  this.hits = Array.from(this.contentArea.querySelectorAll('.search-highlight'));
  if (this.hits.length > 0) this.activateHit(0);
 }
 activateHit(index) {
  if (!this.hits.length) return;
  this.hits.forEach((hit, idx) => hit.classList.toggle('current-search-hit', idx === index));
  this.currentIndex = index;
  if (this.countLabel) this.countLabel.textContent = `${this.currentIndex + 1} / ${this.hits.length}`;
  this.hits[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
 }
 prev() { if (this.hits.length) this.activateHit((this.currentIndex - 1 + this.hits.length) % this.hits.length); }
 next() { if (this.hits.length) this.activateHit((this.currentIndex + 1) % this.hits.length); }
}
EOF

cat << 'EOF' > js/modules/ui.js
/**
 * LIBRUS MODULE SYSTEM - SIDEBAR DRAWER & OVERLAY INTERFACES
 * File Location: /js/modules/ui.js
 */
export class UIManager {
 constructor(domElements) { this.DOM = domElements; }
 closeAllSidebars() {
  [this.DOM.toc, this.DOM.library, this.DOM.settings].forEach(el => el && el.classList.remove('active'));
  if (this.DOM.backdrop) this.DOM.backdrop.classList.remove('active');
 }
 openSidebar(sidebarEl) {
  this.closeAllSidebars();
  if (sidebarEl) {
   sidebarEl.classList.add('active');
   if (this.DOM.backdrop) this.DOM.backdrop.classList.add('active');
  }
 }
 toggleTypographyMenu(toggleBtn, menuEl) { menuEl.classList.toggle('active'); }
 filterLibrary(query) {
  const cleanQuery = query.toLowerCase().trim();
  const cards = document.querySelectorAll('#library-shelf-container .paperback-card');
  cards.forEach(card => {
   const title = card.getAttribute('data-title').toLowerCase();
   card.style.display = title.includes(cleanQuery) ? 'flex' : 'none';
  });
 }
}
EOF

cat << 'EOF' > js/modules/reference.js
/**
 * LIBRUS MODULE SYSTEM - DYNAMIC ROUTING & ANNOTATION PIPELINES
 * File Location: /js/modules/reference.js
 */
import { LibrusState } from './state.js';
export class ReferenceRouter {
 constructor(iframe, loader, shade, workspace) {
  this.iframe = iframe; this.loader = loader; this.shade = shade; this.workspace = workspace;
 }
 query(id) {
  const selection = window.getSelection().toString().trim();
  if (!selection) { alert("No text selection discovered! Highlight a word inside the reading panel first."); return; }
  if (this.loader) this.loader.classList.add('active');
  let providerKey = LibrusState.activeSearchProvider;
  if (id === 'ctx-encyclopaedia') {
   const checkedRadio = document.querySelector('input[name="encyclopedia-provider"]:checked');
   providerKey = checkedRadio ? checkedRadio.value : 'pt_wikipedia';
  } else if (id === 'ctx-dictionary') {
   const checkedRadio = document.querySelector('input[name="dictionary-provider"]:checked');
   providerKey = checkedRadio ? checkedRadio.value : 'pt_wiktionary';
  }
  const builder = LibrusState.searchProviders[providerKey] || LibrusState.searchProviders.pt_wikipedia;
  let encodedQuery = encodeURIComponent(selection);
  if (providerKey === 'infopedia') encodedQuery = encodedQuery.toLowerCase();
  if (this.iframe) this.iframe.src = builder(encodedQuery);
 }
 toggleFocusShade() { if (this.shade) this.shade.classList.toggle('active'); }
 toggleMaximizePlane() { if (this.workspace) this.workspace.classList.toggle('drawer-expand'); }
 injectHypothesisEngine() {
  if (document.getElementById('hypothesis-script')) {
   if (window.annotator && typeof window.annotator.initialize === 'function') { window.annotator.initialize(); }
   return;
  }
  const script = document.createElement('script');
  script.id = 'hypothesis-script'; script.async = true; script.src = 'https://hypothes.is/embed.js';
  window.hypothesisConfig = function () { return { showHighlights: 'always', appDest: '#content-area', theme: LibrusState.theme }; };
  document.head.appendChild(script);
 }
}
EOF

# Placeholder for DOMPurify vendor layer
cat << 'EOF' > js/vendor/purify.esm.js
export default { sanitize: (html) => html };
EOF

# =========================================================================
# 5. POPULATE MAIN APPLICATION ENGINE RUNTIME
# =========================================================================

cat << 'EOF' > js/main.js
/**
 * LIBRUS BOOTSTRAPPER - MAIN APP INITIALIZATION COUPLING
 * File Location: /js/main.js
 */
import { LibrusState } from './modules/state.js';
import { SearchEngine } from './modules/search.js';
import { UIManager } from './modules/ui.js';
import { ReferenceRouter } from './modules/reference.js';
import { marked } from './vendor/marked.esm.js';

document.addEventListener('DOMContentLoaded', function () {
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
  backdrop: document.getElementById('sidebar-backdrop'),
  tocContainer: document.getElementById('toc-links-container'),
  searchCount: document.getElementById('search-count'),
  panelFilter: document.getElementById('panel-filter'),
  tocFilter: document.getElementById('toc-filter'),
  libFilter: document.getElementById('library-filter')
 };

 const UI = new UIManager(DOM);
 const Search = new SearchEngine(DOM.content, DOM.searchCount);
 const Ref = new ReferenceRouter(DOM.iframe, DOM.loader, DOM.shade, DOM.workspace);

 async function loadBookBySourceFile(sourceFile, title) {
  try {
   const response = await fetch(sourceFile.startsWith('http') ? sourceFile : `./${sourceFile}`);
   if (!response.ok) throw new Error('HTTP status failure: ' + response.status);
   const markdownText = await response.text();
   const cleanHTML = marked.parse(markdownText);
   requestAnimationFrame(() => {
    if (DOM.content) {
     DOM.content.innerHTML = `<article>${cleanHTML}</article>`;
     buildTableOfContents();
     localStorage.setItem('archive_last_loaded_source', sourceFile);
     localStorage.setItem('archive_last_loaded_title', title);
     Ref.injectHypothesisEngine();
    }
   });
  } catch (err) {
   if (DOM.content) {
    DOM.content.innerHTML = `<article><h1>${title || 'Workspace Asset'}</h1><p>Ingestion fallback notice: Standard file runtime active. Select another item from the Shelf drawer panels.</p></article>`;
    buildTableOfContents();
    Ref.injectHypothesisEngine();
   }
  }
 }

 function buildTableOfContents() {
  if (!DOM.tocContainer || !DOM.content) return;
  DOM.tocContainer.innerHTML = '';
  const headings = DOM.content.querySelectorAll('h1, h2, h3, h4');
  const fragment = document.createDocumentFragment();
  let activeContainers = { 1: fragment, 2: null, 3: null, 4: null };
  headings.forEach((heading, index) => {
   const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sec-' + index;
   heading.id = slug;
   const level = parseInt(heading.tagName.substring(1), 10);
   const nextHeading = headings[index + 1];
   const hasChildren = nextHeading && parseInt(nextHeading.tagName.substring(1), 10) > level;
   if (hasChildren && level < 4) {
    const details = document.createElement('details'); details.open = (level === 1);
    const summary = document.createElement('summary'); summary.textContent = heading.textContent; summary.dataset.slug = slug;
    summary.onclick = (e) => { e.preventDefault(); heading.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    details.appendChild(summary); (activeContainers[level] || fragment).appendChild(details); activeContainers[level + 1] = details;
   } else {
    const link = document.createElement('a'); link.href = '#' + slug; link.textContent = heading.textContent; link.className = 'toc-link-item'; link.dataset.slug = slug;
    link.onclick = (e) => { e.preventDefault(); heading.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    (activeContainers[level] || fragment).appendChild(link);
   }
  });
  DOM.tocContainer.appendChild(fragment); initializeScrollObserver(headings);
 }

 function initializeScrollObserver(headings) {
  if (window.ArchiveScrollObserver) window.ArchiveScrollObserver.disconnect();
  window.ArchiveScrollObserver = new IntersectionObserver(entries => {
   let active = entries.find(e => e.isIntersecting); if (!active) return;
   DOM.toc.querySelectorAll('.toc-active-item').forEach(el => el.classList.remove('toc-active-item'));
   const safeSlug = CSS.escape(active.target.id);
   const node = DOM.toc.querySelector(`[data-slug="${safeSlug}"], a[href="#${safeSlug}"]`);
   if (node) { node.classList.add('toc-active-item'); node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }, { root: DOM.content, rootMargin: '0px 0px -70% 0px' });
  headings.forEach(h => window.ArchiveScrollObserver.observe(h));
 }

 document.getElementById('toc-open').onclick = e => { e.stopPropagation(); DOM.toc.classList.contains('active') ? UI.closeAllSidebars() : UI.openSidebar(DOM.toc); };
 document.getElementById('library-open').onclick = e => { e.stopPropagation(); DOM.library.classList.contains('active') ? UI.closeAllSidebars() : UI.openSidebar(DOM.library); };
 document.getElementById('settings-open').onclick = e => { e.stopPropagation(); DOM.settings.classList.contains('active') ? UI.closeAllSidebars() : UI.openSidebar(DOM.settings); };
 if (DOM.backdrop) DOM.backdrop.onclick = e => { e.stopPropagation(); UI.closeAllSidebars(); };
 document.getElementById('btn-typo-toggle').onclick = e => { e.stopPropagation(); UI.toggleTypographyMenu(e.target, document.getElementById('typo-dropdown-container')); };
 if (DOM.libFilter) DOM.libFilter.oninput = e => UI.filterLibrary(e.target.value);
 if (DOM.panelFilter) DOM.panelFilter.oninput = e => Search.execute(e.target.value);
 document.getElementById('btn-search-prev').onclick = () => Search.prev();
 document.getElementById('btn-search-next').onclick = () => Search.next();
 document.getElementById('btn-density').onclick = () => { const opts = ['compact', 'normal', 'loose']; LibrusState.set('density', opts[(opts.indexOf(LibrusState.density) + 1) % opts.length]); };
 document.getElementById('btn-justify').onclick = () => LibrusState.set('justify', !LibrusState.justify);
 document.getElementById('btn-font-inc').onclick = () => { LibrusState.fontSize = Math.min(LibrusState.fontSize + 0.05, 1.4); LibrusState.updateFontProperties(); };
 document.getElementById('btn-font-dec').onclick = () => { LibrusState.fontSize = Math.max(LibrusState.fontSize - 0.05, 0.85); LibrusState.updateFontProperties(); };
 document.getElementById('btn-font-family').onclick = () => { LibrusState.serifIndex = (LibrusState.serifIndex + 1) % LibrusState.serifFamilies.length; LibrusState.updateFontProperties(); };
 document.getElementById('theme-toggle').onclick = () => LibrusState.set('theme', LibrusState.theme === 'dark' ? 'light' : 'dark');
 document.getElementById('ctx-encyclopaedia').onclick = () => Ref.query('ctx-encyclopaedia');
 document.getElementById('ctx-dictionary').onclick = () => Ref.query('ctx-dictionary');
 document.getElementById('ctx-toggle').onclick = () => Ref.toggleFocusShade();
 document.getElementById('ctx-expand').onclick = () => Ref.toggleMaximizePlane();

 document.querySelectorAll('#library-shelf-container .paperback-card').forEach(card => {
  card.onclick = () => { loadBookBySourceFile(card.getAttribute('data-source'), card.getAttribute('data-title')); UI.closeAllSidebars(); };
 });

 const savedSource = localStorage.getItem('archive_last_loaded_source');
 const savedTitle = localStorage.getItem('archive_last_loaded_title');
 if (savedSource && savedTitle) { loadBookBySourceFile(savedSource, savedTitle); } 
 else {
  UI.openSidebar(DOM.library);
  if (DOM.content) DOM.content.innerHTML = `<article style="text-align: center; padding-top: 14vh; color: var(--text-muted);"><h2>No Asset Selected</h2><p>Select an edition from the Shelf matrix on the left to initialize workspace viewports.</p></article>`;
 }
});
EOF

# =========================================================================
# 6. POPULATE THE SKELETON LAYER LAYOUT
# =========================================================================

cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>librus v.23 Production Framework</title>
 <link rel="stylesheet" href="styles/base.css">
 <link rel="stylesheet" href="styles/layout.css">
 <link rel="stylesheet" href="styles/panels.css">
 <link rel="stylesheet" href="styles/reader.css">
</head>
<body data-theme="light" data-density="normal" data-justify="false">
 <div id="orientation-shield" role="alert" aria-live="assertive">
  <div class="device-silhouette"></div>
  <p class="shield-title">Landscape Mode Required</p>
  <p class="shield-sub">Rotate your device horizontally to view the workspace layout correctly.</p>
 </div>
 <header class="top-bar">
  <button id="toc-open" title="Table of Contents"><img src="icons/toc.svg" alt="TOC"></button>
  <button id="library-open" title="Library Shell"><img src="icons/library_books.svg" alt="Library"></button>
  <div class="brand">librus v23</div>
  <button id="theme-toggle" title="Toggle Theme Matrix"><img src="icons/dark_mode.svg" alt="Theme"></button>
 </header>
 <div class="main-workspace">
  <div id="sidebar-backdrop"></div>
  <main class="main-panel" role="main">
   <div class="panel-header">
    <div class="input-with-clear"><input type="text" id="panel-filter" placeholder="Search text body..." autocomplete="off"></div>
    <div id="search-count" class="search-count">0 / 0</div>
    <button id="btn-search-prev" title="Previous Occurrence"><img src="icons/keyboard_arrow_up.svg" alt="Up"></button>
    <button id="btn-search-next" title="Next Occurrence"><img src="icons/keyboard_arrow_down.svg" alt="Down"></button>
    <div class="divider"></div>
    <div class="typo-menu-wrapper" style="position: relative; display: inline-block;">
     <button class="icon-btn" id="btn-typo-toggle" title="Typography Options" style="font-weight: bold; font-size: 0.95rem;">Aa</button>
     <div class="typo-dropdown-menu" id="typo-dropdown-container">
      <button class="icon-btn" id="btn-font-family" title="Cycle Font Matrix"><img src="icons/slab_serif.svg" alt="Font"></button>
      <button class="icon-btn" id="btn-font-inc" title="Increase Size"><img src="icons/text_increase.svg" alt="+"></button>
      <button class="icon-btn" id="btn-font-dec" title="Decrease Size"><img src="icons/text_decrease.svg" alt="-"></button>
      <button class="icon-btn" id="btn-density" title="Toggle Density"><img src="icons/format_line_spacing.svg" alt="Density"></button>
      <button class="icon-btn" id="btn-justify" title="Toggle Justification"><img src="icons/format_align_justify.svg" alt="Justify"></button>
     </div>
    </div>
   </div>
   <div class="panel-body" id="content-area"><article></article></div>
  </main>
  <aside id="context-panel" class="research-drawer" role="complementary" aria-label="Reference Panel">
   <div class="panel-header">
    <button id="ctx-encyclopaedia" title="Encyclopedia"><img src="icons/globe.svg" alt="Global"></button>
    <button id="ctx-dictionary" title="Dictionary"><img src="icons/dictionary.svg" alt="Lexicon"></button>
    <div class="divider"></div>
    <button id="ctx-toggle" title="Antidistraction Shade"><img src="icons/blur_on.svg" alt="Shade"></button>
    <button id="ctx-expand" title="Maximize Viewport"><img src="icons/arrows_outward.svg" alt="Expand"></button>
    <div class="divider"></div>
    <button id="settings-open" title="Configurations"><img src="icons/settings.svg" alt="Settings"></button>
   </div>
   <div class="research-frame-container" style="position: relative; flex: 1; width: 100%; height: 100%;">
    <div id="iframe-loader" class="iframe-loading-overlay"><div class="loading-spinner-ring"></div></div>
    <div id="ctx-blur-shade" class="ctx-blur-shade"><p class="shade-message">Focus Shading Shield Active</p></div>
    <iframe id="context" src="about:blank" title="Reference Area" loading="lazy"></iframe>
   </div>
  </aside>
  <aside id="toc-sidebar" class="overlay-sidebar" aria-label="Table of Contents Drawer">
   <div class="panel-header"><h3>Table of Contents</h3></div>
   <div class="sidebar-nav">
    <input type="text" id="toc-filter" placeholder="Filter sections...">
    <div id="toc-links-container"></div>
   </div>
  </aside>
  <aside id="library-sidebar" class="overlay-sidebar" aria-label="Library Shelf Drawer">
   <div class="panel-header"><h3>Digital Shelf</h3></div>
   <div class="sidebar-nav">
    <input type="text" id="library-filter" placeholder="Filter archive catalog...">
    <div class="library-grid" id="library-shelf-container">
     <div class="paperback-card" data-title="Volume I" data-source="lde.md"><img src="icons/cover-1.svg" alt="Cover 1"><span style="margin-top:6px; font-weight:600; font-size:0.8rem;">Volume I</span></div>
     <div class="paperback-card" data-title="Volume II" data-source="vol2.md"><img src="icons/cover-2.svg" alt="Cover 2"><span style="margin-top:6px; font-weight:600; font-size:0.8rem;">Volume II</span></div>
    </div>
   </div>
  </aside>
  <aside id="settings-sidebar" class="overlay-sidebar" aria-label="Engine Properties Panel">
   <div class="sidebar-nav">
    <h3 style="margin-top:0;">Configuration</h3>
    <fieldset>
     <legend>Encyclopaedic Hub Provider</legend>
     <label><input type="radio" name="encyclopedia-provider" value="pt_wikipedia" checked> Wikipédia (PT)</label>
     <label><input type="radio" name="encyclopedia-provider" value="en_wikipedia"> Wikipedia (EN)</label>
    </fieldset>
    <fieldset>
     <legend>Lexicon Dictionary Provider</legend>
     <label><input type="radio" name="dictionary-provider" value="pt_wiktionary" checked> Wikcionário (PT)</label>
     <label><input type="radio" name="dictionary-provider" value="infopedia"> Portal Infopédia</label>
    </fieldset>
   </div>
  </aside>
 </div>
 <script type="module" src="js/main.js"></script>
</body>
</html>
EOF

chmod +x setup.sh 2>/dev/null || true
echo "🏁 Execution framework successfully structured. Launch index.html inside a local web server (e.g. Live Server) to verify pipeline operations!"