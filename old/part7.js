// --- 7. SPLIT RESEARCH PANEL IFRAME ENGINE (p3) ---

let activeSearchProvider = 'public';
const ctxFullscreenBtn = document.getElementById('ctx-fullscreen');
const ctxShadeToggleBtn = document.getElementById('ctx-toggle');
const ctxShade = document.getElementById('ctx-blur-shade');

/** Extracts valid cursor text ranges selection from viewport */
function getSelectionText() {
 const selection = window.getSelection();
 return selection ? selection.toString().trim() : '';
}

/** Evaluates if the current browser text focus bounding range lives inside reader container bounds */
function isSelectionInContent() {
 const selection = window.getSelection();
 if (!selection || selection.rangeCount === 0) return false;
 const range = selection.getRangeAt(0);
 return nodes.content.contains(range.commonAncestorContainer);
}

/** Sanitizes, builds, and asynchronously routes clean search strings down to the target provider frame */
function updateContextFrame(query) {
 // FIX: Cleans string whitespace, removes internal newlines, strips curly smart quotes
 const cleanQuery = query
  .replace(/[\r\n\t]+/g, ' ')
  .replace(/[‘’区域“”]/g, "'")
  .trim();

 if (cleanQuery.length === 0) return;

 let processedQuery = encodeURIComponent(cleanQuery);
 if (activeSearchProvider === 'dictionary') {
  processedQuery = processedQuery.toLowerCase();
 }

 const builder = searchProviders[activeSearchProvider] || searchProviders.public;
 const targetUrl = builder(processedQuery);

 requestAnimationFrame(function () {
  if (nodes.loaderOverlay) nodes.loaderOverlay.classList.add('active');
  if (nodes.ctxPanel && window.getComputedStyle(nodes.ctxPanel).display === 'none') {
   nodes.ctxPanel.style.display = 'flex';
  }
  if (nodes.iframe) nodes.iframe.src = targetUrl;
 });
}

if (nodes.iframe && nodes.loaderOverlay) {
 nodes.iframe.addEventListener('load', function () {
  requestAnimationFrame(function () { nodes.loaderOverlay.classList.remove('active'); });
 });
}

/** Maps individual element link triggers up to search providers definitions */
function mapContextTab(buttonId, providerKey) {
 const el = document.getElementById(buttonId);
 if (el) {
  el.onclick = function () {
   const selectionText = getSelectionText();
   if (!selectionText || !isSelectionInContent()) {
    alert("Nenhum texto selecionado! Por favor, selecione uma palavra ou frase no texto para realizar a busca.");
    return;
   }
   activeSearchProvider = providerKey;
   updateContextFrame(selectionText);
  };
 }
}

mapContextTab('ctx-public', 'public');
mapContextTab('ctx-dictionary', 'dictionary');
mapContextTab('ctx-map', 'map');

// Automatic Mouse Selection listener monitoring textual context lookup pipelines
document.addEventListener('mouseup', function () {
 const text = getSelectionText();
 if (text && text.length > 1 && text.length < 40 && isSelectionInContent()) {
  updateContextFrame(text);
 }
});

// Structural Panel View Shading Blur toggles
if (ctxShadeToggleBtn && ctxShade) {
 const blurIcon = ctxShadeToggleBtn.querySelector('img');
 ctxShadeToggleBtn.onclick = function () {
  const isActive = ctxShade.classList.toggle('active');
  ctxShadeToggleBtn.setAttribute('aria-pressed', String(isActive));
  if (blurIcon) {
   blurIcon.src = isActive ? './icons/visibility.svg' : './icons/visibility_off.svg';
  }
 };
}

// Fullscreen Iframe Panel expander layout controls modulators
if (ctxFullscreenBtn && nodes.ctxPanel) {
 const fullscreenIcon = ctxFullscreenBtn.querySelector('img');
 ctxFullscreenBtn.onclick = function () {
  const isFullscreen = nodes.ctxPanel.classList.toggle('fullscreen');
  ctxFullscreenBtn.setAttribute('aria-pressed', String(isFullscreen));
  if (fullscreenIcon) {
   fullscreenIcon.src = isFullscreen ? './icons/fullscreen_exit.svg' : './icons/fullscreen.svg';
  }
 };
}
