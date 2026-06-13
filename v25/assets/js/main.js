
// LIBRUS v25 – main.js
// Clean overlay management: one at a time, click-outside to close, subtle backdrop.

document.addEventListener('DOMContentLoaded', () => {
 console.log('LIBRUS v25 initialized – built to last.');

 let currentlyOpenOverlay = null;

 // === OVERLAY MANAGEMENT ===
 window.toggleOverlay = function (id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  // Close any currently open overlay first
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

 // Close all overlays when clicking outside (on the backdrop)
 document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
   // If user clicks directly on the overlay (backdrop), close it
   if (e.target === overlay) {
    overlay.style.display = 'none';
    currentlyOpenOverlay = null;
   }
  });
 });

 // === TOOLBARS MOVE UP 50px ON SCROLL DOWN, TOPBAR HIDES ===
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
   // Scrolling DOWN
   topbar.style.transitionDuration = '0.35s';
   topbar.style.marginTop = `-${topbar.offsetHeight}px`;

   // Toolbars move up 50px
   if (mainToolbar) {
    mainToolbar.style.transitionDuration = '0.35s';
    mainToolbar.style.marginTop = '0px';
   }
   if (contextToolbar) {
    contextToolbar.style.transitionDuration = '0.35s';
    contextToolbar.style.marginTop = '0px';
   }
  }
  else if (scrollY < lastScrollY) {
   // Scrolling UP → restore everything
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
    requestAnimationFrame(handleScroll);
    ticking = true;
   }
  });
 }

 // === DARK MODE ===
 window.toggleDarkMode = function () {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
 };

 if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
 }

 // === MD LOADING ===
 window.loadBook = function (content, title = '') {
  const container = document.getElementById('main-content');
  if (!container) return;

  const cleanHTML = DOMPurify.sanitize(marked.parse(content));
  container.innerHTML = `
            ${title ? `<h1>${title}</h1>` : ''}
            <div class="main-content-body">${cleanHTML}</div>
        `;
 };

 // === PDF LOADING ===
 window.loadPdf = function (file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const iframe = document.getElementById('context-iframe');
  iframe.src = url;
 };

 // Stub for share
 window.shareCurrentBook = function () {
  alert('Share functionality coming soon...');
 };

 // Keyboard escape support
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentlyOpenOverlay) {
   currentlyOpenOverlay.style.display = 'none';
   currentlyOpenOverlay = null;
  }
 });
});
