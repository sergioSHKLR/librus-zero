/**
 * LIBRUS v25 – Main System Controller Application Script
 * Clean overlay management, decoupled state tracking, performance-throttled scroll handlers.
 */

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
});