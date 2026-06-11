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
