/**
 * LIBRUS v25 – Main System Controller Application Script
 * Clean overlay management, decoupled state tracking, performance-throttled scroll handlers.
 */

import DOMPurify from './vendor/purify.esm.js';
import { marked } from './vendor/marked.esm.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log('LIBRUS v25 initialized – built to last.');

 let currentlyOpenOverlay = null;

 // === OVERLAY MANAGEMENT LAYER ===
 window.toggleOverlay = function (id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  // Close any currently open overlay first to avoid multi-layer issues
  if (currentlyOpenOverlay && currentlyOpenOverlay !== overlay) {
   currentlyOpenOverlay.style.display = 'none';
  }

  const isOpen = overlay.style.display === 'flex';

  if (isOpen) {
   overlay.style.display = 'none';
   currentlyOpenOverlay = null;
  } else {
   overlay.style.display = 'flex';
   currentlyOpenOverlay = overlay;
  }
 };

 // Close overlays gracefully when clicking directly on the structural layout backdrop
 document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
   if (e.target === overlay) {
    overlay.style.display = 'none';
    currentlyOpenOverlay = null;
   }
  });
 });

 // === THROTTLED LAYOUT ANIMATION (SCROLL DIRECTION CONTROLLER) ===
 const topbar = document.getElementById('topbar');
 const mainToolbar = document.getElementById('main-panel-toolbar');
 const contextToolbar = document.getElementById('context-panel-toolbar');
 const mainContent = document.getElementById('main-content');

 let lastScrollY = 0;
 let ticking = false;

 function handleScroll() {
  if (!mainContent) return;
  const scrollY = mainContent.scrollTop;

  if (scrollY > lastScrollY && scrollY > 600) {
   // User Scrolling DOWN -> Hide the global topbar out of the view frame boundaries
   topbar.style.transitionDuration = '0.35s';
   topbar.style.marginTop = `-${topbar.offsetHeight}px`;

   if (mainToolbar) {
    mainToolbar.style.transitionDuration = '0.35s';
    mainToolbar.style.marginTop = '0px';
   }
   if (contextToolbar) {
    contextToolbar.style.transitionDuration = '0.35s';
    contextToolbar.style.marginTop = '0px';
   }
  } else if (scrollY < lastScrollY) {
   // User Scrolling UP -> Re-align all view layouts back to zero baseline point
   topbar.style.transitionDuration = '0.65s';
   topbar.style.marginTop = '0px';

   if (mainToolbar) {
    mainToolbar.style.transitionDuration = '0.65s';
    mainToolbar.style.marginTop = '0px';
   }
   if (contextToolbar) {
    contextToolbar.style.transitionDuration = '0.65s';
    contextToolbar.style.marginTop = '0px';
   }
  }

  lastScrollY = scrollY;
  ticking = false;
 }

 if (mainContent) {
  mainContent.addEventListener('scroll', () => {
   if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
   }
  });
 }

 // === LOCAL PERSISTED SYSTEM PERSISTENCE (DARK MODE) ===
 window.toggleDarkMode = function () {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
 };

 if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
 }

 // === LIBRARY POPULATOR (simple client-side book switcher) ===
 const libraryBooks = [
  { file: 'adv_01_scandal_in_bohemia.md', title: 'A Scandal in Bohemia' },
  { file: 'adv_02_red_headed_league.md', title: 'The Red-Headed League' },
  { file: 'adv_03_a_case_of_identity.md', title: 'A Case of Identity' },
  { file: 'adv_04_boscombe_valley_mystery.md', title: 'The Boscombe Valley Mystery' },
  { file: 'adv_05_five_orange_pips.md', title: 'The Five Orange Pips' },
  { file: 'adv_06_the_man_with_the_twisted_lip.md', title: 'The Man with the Twisted Lip' },
  { file: 'adv_07_the_blue_carbuncle.md', title: 'The Adventure of the Blue Carbuncle' },
  { file: 'adv_08_the_speckled_band.md', title: 'The Adventure of the Speckled Band' },
  { file: 'adv_09_the_engineers_thumb.md', title: 'The Adventure of the Engineer\'s Thumb' },
  { file: 'adv_10_the_noble_bachelor.md', title: 'The Adventure of the Noble Bachelor' },
  { file: 'adv_11_the_beryl_coronet.md', title: 'The Adventure of the Beryl Coronet' },
  { file: 'adv_12_the_copper_beeches.md', title: 'The Adventure of the Copper Beeches' },
 ];

 function initLibrary() {
  const container = document.getElementById('library-content');
  if (!container) return;
  container.innerHTML = '<div style="padding:1rem;font-family:var(--font-sans);font-size:0.95rem;line-height:1.5;"></div>';
  const list = container.firstChild;
  libraryBooks.forEach(book => {
   const item = document.createElement('div');
   item.style.cssText = 'padding:6px 4px;cursor:pointer;border-bottom:1px solid var(--color-border);';
   item.textContent = '📖 ' + book.title;
   item.onclick = () => {
    fetch('assets/books/' + book.file)
     .then(r => r.text())
     .then(text => {
      if (window.loadBook) window.loadBook(text, book.title);
      // close library overlay after selection
      const libOverlay = document.getElementById('library-overlay');
      if (libOverlay) { libOverlay.style.display = 'none'; currentlyOpenOverlay = null; }
     });
   };
   list.appendChild(item);
  });
 }
 initLibrary();

 // === MARKDOWN FILE CONVERSION ENGINE ===
 window.loadBook = function (content, title = '') {
  const container = document.getElementById('main-content');
  if (!container) return;

  // Assumes DOMPurify and marked are imported in scope context securely
  const cleanHTML = DOMPurify.sanitize(marked.parse(content));
  container.innerHTML = `
      ${title ? `<h1>${title}</h1>` : ''}
      <div class="main-content-body">${cleanHTML}</div>
    `;
 };

 // === CONTEXT SIDEFRAME PDF DATA LOADER ===
 window.loadPdf = function (file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const iframe = document.getElementById('context-iframe');
  if (iframe) iframe.src = url;
 };

 // === UTILITY ACTIONS ACTION STUBS ===
 window.shareCurrentBook = function () {
  alert('Share functionality coming soon...');
 };

 // Keyboard accessibility escaping helper
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentlyOpenOverlay) {
   currentlyOpenOverlay.style.display = 'none';
   currentlyOpenOverlay = null;
  }
 });

 // Auto-load sample book from library (restarts the reader with real markdown content)
 fetch('assets/books/adv_01_scandal_in_bohemia.md')
  .then(r => r.ok ? r.text() : Promise.reject())
  .then(text => {
   if (window.loadBook) {
    window.loadBook(text, 'A Scandal in Bohemia');
   }
  })
  .catch(() => {
   // keep static placeholder content if fetch fails
   console.log('Using built-in placeholder content');
  });
});