// ==========================================================================
// LIBRUS ZERO: WORKSPACE OPERATIONS ENGINE (CHUNK 1/4)
// Fully Optimized Vanilla JS Architecture for Generational Longevity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

 // --- 1. DOM CACHE REGISTRY MATRIX ---
 // Caches element references globally to minimize DOM querying overhead
 const nodes = {
  body: document.body,
  toc: document.getElementById('toc-sidebar'),
  lib: document.getElementById('library-sidebar'),
  ctxPanel: document.getElementById('context-panel'),
  iframe: document.getElementById('context'),
  content: document.getElementById('content-area'),
  tocContainer: document.getElementById('toc-links-container'),
  loaderOverlay: document.getElementById('iframe-loader'),

  // Interactive Sidebar Control Triggers
  tocToggle: document.getElementById('toc-open'),
  libToggle: document.getElementById('library-open'),
  themeToggle: document.getElementById('theme-toggle'),
  ctxToggle: document.getElementById('ctx-toggle'),
  settingsToggle: document.getElementById('settings-open'),
  settingsSidebar: document.getElementById('settings-sidebar'),

  // Global Document Search Elements
  panelFilter: document.getElementById('panel-filter'),
  searchButton: document.getElementById('btn-search'),
  searchPrev: document.getElementById('btn-search-prev'),
  searchNext: document.getElementById('btn-search-next'),
  searchCount: document.getElementById('search-count'),

  // Real-Time Input Filtering Controls
  tocFilter: document.getElementById('toc-filter'),
  libFilter: document.getElementById('library-filter'),

  // Typography and Spacing Customizers
  fontInc: document.getElementById('btn-font-inc'),
  fontDec: document.getElementById('btn-font-dec'),
  fontFamily: document.getElementById('btn-font-family'),
  densityToggle: document.getElementById('btn-density'),
  justifyToggle: document.getElementById('btn-justify')
 };

 // Shared State Cache for Local Search Results
 let searchHits = [];
 let currentSearchIndex = -1;

 // Stable URL Generation Rules for External Research Tools
 const searchProviders = {
  public: (query) => `https://wikipedia.org{query}`,
  dictionary: (query) => `https://wiktionary.org{query.toLowerCase()}`, // Wiktionary matches strictly on lowercase keys
  map: (query) => `https://openstreetmap.org{query}`
 };


 // --- 2. SIDEBAR NAVIGATION & DRAWER SYSTEM CONTROLLER ---

 /**
  * Toggles the visibility state of side drawers using hardware-accelerated CSS classes
  * @param {HTMLElement} el - The sidebar element container to slide
  * @param {HTMLElement} btn - The associated navigation control button
  * @param {boolean} forceClose - Explicit override flag to force-collapse a panel
  */
 function toggleSidebar(el, btn, forceClose = false) {
  if (!el || !btn) return;
  const isOpening = forceClose ? false : !el.classList.contains('active');
  el.classList.toggle('active', isOpening);
  btn.setAttribute('aria-expanded', isOpening);

  // Bypasses overlap artifacts by closing conflicting sidebars when opening a new one
  if (isOpening) {
   if (el !== nodes.toc) toggleSidebar(nodes.toc, nodes.tocToggle, true);
   if (el !== nodes.lib) toggleSidebar(nodes.lib, nodes.libToggle, true);
   if (nodes.settingsSidebar && el !== nodes.settingsSidebar) toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, true);
  }
 }

 // Bind individual overlay clicks to their drawer toggles
 nodes.tocToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.toc, nodes.tocToggle); };
 nodes.libToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.lib, nodes.libToggle); };

 if (nodes.settingsToggle) {
  nodes.settingsToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle); };
 }

 // Click-Away Trap: Automatically closes any open overlay panels when a user clicks the main body canvas
 document.onclick = (e) => {
  if (nodes.toc.classList.contains('active') && !nodes.toc.contains(e.target) && !nodes.tocToggle.contains(e.target)) toggleSidebar(nodes.toc, nodes.tocToggle, true);
  if (nodes.lib.classList.contains('active') && !nodes.lib.contains(e.target) && !nodes.libToggle.contains(e.target)) toggleSidebar(nodes.lib, nodes.libToggle, true);
  if (nodes.settingsSidebar && nodes.settingsSidebar.classList.contains('active') && !nodes.settingsSidebar.contains(e.target) && !nodes.settingsToggle.contains(e.target)) {
   toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, true);
  }
 };
 // --- 3. DYNAMIC INTERFACE ENVIRONMENT CUSTOMIZERS (CHUNK 2/4) ---

 // Spacing Density Matrix
 const densities = ['compact', 'normal', 'loose'];
 let currentDensityIndex = 1;

 // Restore stored spacing parameter configuration from memory on initialization
 const cachedDensity = localStorage.getItem('archive_user_density') || 'normal';
 currentDensityIndex = densities.indexOf(cachedDensity) === -1 ? 1 : densities.indexOf(cachedDensity);
 nodes.body.setAttribute('data-density', densities[currentDensityIndex]);

 // Cycles the paragraph layout rendering heights across compact, normal, and loose settings
 nodes.densityToggle.onclick = () => {
  currentDensityIndex = (currentDensityIndex + 1) % densities.length;
  const nextDensity = densities[currentDensityIndex];
  requestAnimationFrame(() => {
   nodes.body.setAttribute('data-density', nextDensity);
   localStorage.setItem('archive_user_density', nextDensity);
  });
 };

 // Text Layout Alignment Justification Modulator
 let isJustified = localStorage.getItem('archive_justify') === 'true';
 nodes.body.setAttribute('data-justify', isJustified);

 nodes.justifyToggle.onclick = () => {
  isJustified = !isJustified;
  requestAnimationFrame(() => {
   nodes.body.setAttribute('data-justify', isJustified);
   localStorage.setItem('archive_justify', isJustified);
  });
 };

 // Typography Sizing Incrementor Logic Loop
 let baseFontSize = parseFloat(localStorage.getItem('archive_font_scale')) || 1.0;
 nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);

 nodes.fontInc.onclick = () => {
  baseFontSize = Math.min(baseFontSize + 0.05, 1.4);
  requestAnimationFrame(() => {
   nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
   localStorage.setItem('archive_font_scale', baseFontSize);
  });
 };

 nodes.fontDec.onclick = () => {
  baseFontSize = Math.max(baseFontSize - 0.05, 0.85);
  requestAnimationFrame(() => {
   nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
   localStorage.setItem('archive_font_scale', baseFontSize);
  });
 };

 // High-Contrast Dark Appearance Switcher
 nodes.themeToggle.onclick = () => {
  const isDark = nodes.body.getAttribute('data-theme') === 'dark';
  const targetTheme = isDark ? 'light' : 'dark';
  requestAnimationFrame(() => {
   nodes.body.setAttribute('data-theme', targetTheme);
   localStorage.setItem('archive_theme', targetTheme);
  });
 };

 // Typography Family Cycle List
 const serifFamilies = [
  'Georgia, Times, "Times New Roman", serif',
  'Palatino Linotype, "Palatino", "Book Antiqua", serif',
  'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
 ];
 let serifIndex = parseInt(localStorage.getItem('archive_serif_family')) || 0;

 /** Updates the font-family variable inside CSS variables space */
 function updateSerifFamily() {
  nodes.body.style.setProperty('--font-reading', serifFamilies[serifIndex]);
  localStorage.setItem('archive_serif_family', serifIndex);
 }

 // Set default reading typography family on boot
 updateSerifFamily();

 if (nodes.fontFamily) {
  nodes.fontFamily.onclick = () => {
   serifIndex = (serifIndex + 1) % serifFamilies.length;
   requestAnimationFrame(updateSerifFamily);
  };
 };
 // --- 4. NON-BLOCKING LIVE TYPE INPUT SIDEBAR FILTERS (CHUNK 3/4) ---

 /**
  * Simple live text-matching query engine designed to filter sidebar contents
  * @param {HTMLElement} inputElement - The active input text tag field to observe
  * @param {string} elementsSelector - Target items to hide or reveal
  * @param {HTMLElement} textLookupContainer - Parent boundary containing target items
  */
 function applyLiveFilter(inputElement, elementsSelector, textLookupContainer) {
  if (!inputElement || !textLookupContainer) return;
  inputElement.addEventListener('input', (e) => {
   const query = e.target.value.toLowerCase().trim();
   requestAnimationFrame(() => {
    const items = textLookupContainer.querySelectorAll(elementsSelector);
    items.forEach(item => {
     const matchTarget = item.textContent.toLowerCase();
     item.classList.toggle('search-hidden', !matchTarget.includes(query));
    });
   });
  });
 }

 applyLiveFilter(nodes.tocFilter, 'a', nodes.toc);
 applyLiveFilter(nodes.libFilter, '.book-card', nodes.lib);


 // --- 5. AUTOMATED TOC AUTO-EXPANDING LIVE SEARCH FILTER ---

 (function () {
  if (!nodes.tocFilter || !nodes.tocContainer) return;

  nodes.tocFilter.addEventListener('input', (e) => {
   const query = e.target.value.toLowerCase().trim();

   requestAnimationFrame(() => {
    // Scenario A: If input field is completely empty, restore default sidebar tree layout
    if (query === '') {
     nodes.tocContainer.querySelectorAll('.search-hidden').forEach(el => el.classList.remove('search-hidden'));
     nodes.tocContainer.querySelectorAll('details').forEach(box => {
      box.open = (box.parentElement === nodes.tocContainer); // Keeps H1 folders open, rest collapsed
     });
     return;
    }

    // Scenario B: User is actively typing search string keys
    // Step 1: Filter plain navigation link items
    const allLinks = nodes.tocContainer.querySelectorAll('a.toc-link-item');
    allLinks.forEach(link => {
     link.classList.toggle('search-hidden', !link.textContent.toLowerCase().includes(query));
    });

    // Step 2: Reverse-traverse nested details blocks from bottom-to-top to handle hierarchy dependencies
    const allDetails = Array.from(nodes.tocContainer.querySelectorAll('details')).reverse();
    allDetails.forEach(detailsBox => {
     const summary = detailsBox.querySelector('summary');
     const summaryText = summary ? summary.textContent.toLowerCase() : '';
     const summaryMatches = summaryText.includes(query);

     // Evaluates if any inner items are matching/visible
     const hasVisibleChildren = Array.from(detailsBox.children).some(child => {
      if (child.tagName === 'SUMMARY') return false;
      return !child.classList.contains('search-hidden');
     });

     if (summaryMatches || hasVisibleChildren) {
      detailsBox.classList.remove('search-hidden');
      if (hasVisibleChildren) detailsBox.open = true; // Burst expand folder to show inner match targets
     } else {
      detailsBox.classList.add('search-hidden');
      detailsBox.open = false;
     }
    });
   });
  });
 })();
 // --- 6. CORE TEXT CANVAS HIGHLIGHTS & KEYWORD SEARCH SYSTEM ---

 /** Escapes string regular expression syntax operators safely */
 function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
 }

 /** Refreshes the structural toolbar matching index metrics readout indicator */
 function updateSearchCounter() {
  if (!nodes.searchCount) return;
  const total = searchHits.length;
  nodes.searchCount.textContent = total > 0 ? `${currentSearchIndex + 1} / ${total}` : '0 / 0';
 }

 /** Hones viewport canvas scrolling focus down to target highlighted item index coordinates */
 function activateSearchHit(index) {
  if (!searchHits.length) return;
  searchHits.forEach((hit, idx) => {
   hit.classList.toggle('current-search-hit', idx === index);
  });
  currentSearchIndex = index;
  updateSearchCounter();
  requestAnimationFrame(() => {
   const target = searchHits[currentSearchIndex];
   if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
 }

 /** Step jumps matching positions sequentially forwards or backwards */
 function moveSearchHit(offset) {
  if (!searchHits.length) return;
  const nextIndex = (currentSearchIndex + offset + searchHits.length) % searchHits.length;
  activateSearchHit(nextIndex);
 }

 /** Recursively strips away custom mark highlight tags from the content layout area text nodes */
 function clearHighlights() {
  searchHits = [];
  currentSearchIndex = -1;
  updateSearchCounter();
  const highlights = nodes.content.querySelectorAll('.search-highlight');
  highlights.forEach((highlight) => {
   const parent = highlight.parentNode;
   if (!parent) return;
   parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
   parent.normalize();
  });
 }

 /** Performs a high-speed tree-walker scan to inject custom canvas matching highlight elements */
 function highlightPanelSearch(query) {
  clearHighlights();
  const trimmed = query.trim();
  if (!trimmed || !nodes.content) return;

  const pattern = new RegExp(escapeRegExp(trimmed), 'gi');
  const walker = document.createTreeWalker(nodes.content, NodeFilter.SHOW_TEXT, {
   acceptNode(node) {
    if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
    if (node.parentNode.closest('.search-highlight')) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
   }
  });

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) { textNodes.push(node); }

  textNodes.forEach((textNode) => {
   const text = textNode.nodeValue;
   let lastIndex = 0;
   let match;
   const frag = document.createDocumentFragment();
   pattern.lastIndex = 0;

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

  searchHits = Array.from(nodes.content.querySelectorAll('.search-highlight'));
  if (searchHits.length > 0) {
   activateSearchHit(0);
  } else {
   currentSearchIndex = -1;
   updateSearchCounter();
  }
 }

 // Bind input element buttons to operational search functions
 if (nodes.searchButton) {
  nodes.searchButton.onclick = () => highlightPanelSearch(nodes.panelFilter?.value || '');
 }
 if (nodes.searchPrev) nodes.searchPrev.onclick = () => moveSearchHit(-1);
 if (nodes.searchNext) nodes.searchNext.onclick = () => moveSearchHit(1);

 // Structural Input clear fields button actions mapper
 document.querySelectorAll('.input-clear-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
   const input = btn.previousElementSibling;
   if (input && input.tagName === 'INPUT') {
    input.value = '';
    if (input.id === 'panel-filter') clearHighlights();
    input.focus();
   }
  });
 });

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
  // BUG FIX: Cleans string whitespace, removes internal newlines, strips curly smart quotes
  let cleanQuery = query
   .replace(/[\r\n\t]+/g, ' ')
   .replace(/[‘’“”]/g, "'")
   .trim();

  if (cleanQuery.length === 0) return;

  // Encodes string safely into URL parameters, forces lowercase if routing to dictionary
  let processedQuery = encodeURIComponent(cleanQuery);
  if (activeSearchProvider === 'dictionary') {
   processedQuery = processedQuery.toLowerCase();
  }

  const builder = searchProviders[activeSearchProvider] || searchProviders.public;
  const targetUrl = builder(processedQuery);

  requestAnimationFrame(() => {
   // Activates the spinning visual indicator loader overlay shield over the frame block
   if (nodes.loaderOverlay) nodes.loaderOverlay.classList.add('active');

   // Automatically reveals research side panel if it was hidden out of view
   if (nodes.ctxPanel && window.getComputedStyle(nodes.ctxPanel).display === 'none') {
    nodes.ctxPanel.style.display = 'flex';
   }

   if (nodes.iframe) nodes.iframe.src = targetUrl;
   console.log(`Research Panel Routing Engine executed -> Provider: [${activeSearchProvider}], URL: [${targetUrl}]`);
  });
 }

 // Automated loading state overlay checker clearing indicator rings on page layout paint returns
 if (nodes.iframe && nodes.loaderOverlay) {
  nodes.iframe.addEventListener('load', () => {
   requestAnimationFrame(() => nodes.loaderOverlay.classList.remove('active'));
  });
 }

 /** Maps individual element link triggers up to search providers definitions */
 const mapContextTab = (buttonId, providerKey) => {
  const el = document.getElementById(buttonId);
  if (el) {
   el.onclick = () => {
    const selectionText = getSelectionText();

    // INTERCEPT ALERT: Throws notice prompt if click occurs without an active selection
    if (!selectionText || !isSelectionInContent()) {
     alert("Nenhum texto selecionado! Por favor, selecione uma palavra ou frase no texto para realizar a busca.");
     return;
    }

    activeSearchProvider = providerKey;
    updateContextFrame(selectionText);
   };
  }
 };

 mapContextTab('ctx-public', 'public');
 mapContextTab('ctx-dictionary', 'dictionary');
 mapContextTab('ctx-map', 'map');

 // Automatic Mouse Selection listener monitoring textual context lookup pipelines
 document.addEventListener('mouseup', () => {
  const text = getSelectionText();
  if (text && text.length > 1 && text.length < 40 && isSelectionInContent()) {
   updateContextFrame(text);
  }
 });

 // Structural Panel View Shading Blur toggles
 if (ctxShadeToggleBtn && ctxShade) {
  const blurIcon = ctxShadeToggleBtn.querySelector('img');
  ctxShadeToggleBtn.onclick = () => {
   const isActive = ctxShade.classList.toggle('active');
   ctxShadeToggleBtn.setAttribute('aria-pressed', String(isActive));
   ctxShadeToggleBtn.setAttribute('aria-label', isActive ? 'Hide iframe content' : 'Show iframe content');
   if (blurIcon) {
    blurIcon.src = isActive ? './icons/visibility.svg' : './icons/visibility_off.svg';
    blurIcon.alt = isActive ? 'Visibility on' : 'Visibility off';
   }
  };
 }

 // Fullscreen Iframe Panel expander layout controls modulators
 if (ctxFullscreenBtn && nodes.ctxPanel) {
  const fullscreenIcon = ctxFullscreenBtn.querySelector('img');
  ctxFullscreenBtn.onclick = () => {
   const isFullscreen = nodes.ctxPanel.classList.toggle('fullscreen');
   ctxFullscreenBtn.setAttribute('aria-pressed', String(isFullscreen));
   ctxFullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Toggle reference frame fullscreen');
   if (fullscreenIcon) {
    fullscreenIcon.src = isFullscreen ? './icons/fullscreen_exit.svg' : './icons/fullscreen.svg';
    fullscreenIcon.alt = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
   }
  };
 }

 // --- 8. INITIAL SYSTEM PIPELINE ASYNC INITIALIZER ---

 (window.requestIdleCallback || ((cb) => setTimeout(cb, 0)))(async () => {
  try {
   const [markedMod, purifyMod] = await Promise.all([
    import('https://jsdelivr.net'),
    import('https://jsdelivr.net')
   ]);
   const { marked } = markedMod;
   const DOMPurify = (purifyMod && (purifyMod.default || purifyMod.DOMPurify || purifyMod)) || window.DOMPurify;

   // Custom Markdown Admonition Lexer Block Extension Syntax Array
   const admonitionExtension = {
    name: 'admonition',
    level: 'block',
    start(src) { return src.match(/^:::/)?.index; },
    tokenizer(src) {
     const rule = /^:::\s*([a-zA-Z0-9_-]+)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::\s*(?:\n|$)/;
     const match = rule.exec(src);
     if (match) {
      return {
       type: 'admonition',
       raw: match[0],
       admType: match[1],
       admTitle: match[2] ? match[2].trim() : match[1].toUpperCase(),
       text: match[3],
       tokens: this.lexer.blockTokens(match[3], [])
      };
     }
    },
    renderer(token) {
     return `
            <div class="admonition-box ${token.admType.toLowerCase()}">
              <div class="admonition-title">${token.admTitle}</div>
              <div class="admonition-body">${this.parser.parse(token.tokens)}</div>
            </div>
          `;
    }
   };

   marked.use({ extensions: [admonitionExtension] });

   const response = await fetch('./lde.md');
   if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
   const markdownText = await response.text();

   const rawHTML = marked.parse(markdownText);
   const cleanHTML = DOMPurify.sanitize(rawHTML);

   requestAnimationFrame(() => {
    nodes.content.innerHTML = cleanHTML;
    buildTableOfContents();
   });

  } catch (err) {
   console.warn("Server archive database offline. Mounting sandbox fallback workspace layouts.", err.message);
   nodes.content.innerHTML = `
        <article>
          <h1>Immortal Archive</h1>
          <p>Fallback content loaded. Use the drawer and search tools to explore this sample material.</p>
          <h2>Sample Chapter One</h2>
          <p>This page demonstrates TOC generation when the archive markdown is unavailable.</p>
          <h3>Fallback Navigation</h3>
          <p>Headings are scanned and indexed by the table of contents.</p>
          <h2>Sample Chapter Two</h2>
          <p>Library thumbnails are available in the left drawer as book samples.</p>
        </article>
      `;
   buildTableOfContents();
  }
 });


 // --- 9. TREE-WALKER TABLE OF CONTENTS GENERATOR ---

 function buildTableOfContents() {
  if (!nodes.tocContainer) return;
  nodes.tocContainer.innerHTML = '';

  const headings = nodes.content.querySelectorAll('h1, h2, h3, h4');
  const fragment = document.createDocumentFragment();

  let activeContainers = { 1: fragment, 2: null, 3: null, 4: null };

  headings.forEach((heading, index) => {
   const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `sec-${index}`;
   heading.id = slug;
   const level = parseInt(heading.tagName.substring(1));

   const nextHeading = headings[index + 1];
   const hasChildren = nextHeading && parseInt(nextHeading.tagName.substring(1)) > level;

   if (hasChildren && level < 4) {
    const details = document.createElement('details');
    details.open = (level === 1); // Keeps H1 open, sections lower collapsed initial state

    const summary = document.createElement('summary');
    summary.textContent = heading.textContent;
    summary.dataset.slug = slug;

    summary.onclick = (e) => {
     if (e.offsetX > 20) {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth < 768) toggleSidebar(nodes.toc, nodes.tocToggle, true);
     }
    };

    details.appendChild(summary);
    const parentContainer = activeContainers[level] || fragment;
    parentContainer.appendChild(details);
    activeContainers[level + 1] = details;
   } else {
    const link = document.createElement('a');
    link.href = '#' + slug;
    link.textContent = heading.textContent;
    link.className = 'toc-link-item';
    link.dataset.slug = slug;

    link.onclick = (e) => {
     e.preventDefault();
     heading.scrollIntoView({ behavior: 'smooth' });
     if (window.innerWidth < 768) toggleSidebar(nodes.toc, nodes.tocToggle, true);
    };

    let targetBox = activeContainers[level] || fragment;
    targetBox.appendChild(link);
   }
  });

  nodes.tocContainer.appendChild(fragment);
  initializeActiveScrollObserver(headings);
 }


 // --- 10. HIGH-PERFORMANCE DEEP LEVEL DEBOUNCED SCROLL OBSERVER ---

 function initializeActiveScrollObserver(headings) {
  if (window.ArchiveScrollObserver) window.ArchiveScrollObserver.disconnect();

  const observerOptions = {
   root: nodes.content,
   rootMargin: '0px 0px -70% 0px', // Intersection observation hits top 30% view index coordinates
   threshold: 0
  };

  window.ArchiveScrollObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     const activeSlug = entry.target.id;
     nodes.toc.querySelectorAll('.toc-active-item').forEach(el => el.classList.remove('toc-active-item'));

     const targetNavNode = nodes.toc.querySelector(`[data-slug="${activeSlug}"], a[href="#${activeSlug}"]`);
     if (targetNavNode) {
      targetNavNode.classList.add('toc-active-item');

      const activeAncestryChain = [];
      let currentParent = targetNavNode.parentElement;
      while (currentParent && currentParent !== nodes.tocContainer) {
       if (currentParent.tagName === 'DETAILS') activeAncestryChain.push(currentParent);
       currentParent = currentParent.parentElement;
      }

      // Sync structural folder open states with reader layout shifts automatically
      const allSidebarDetails = nodes.tocContainer.querySelectorAll('details');
      allSidebarDetails.forEach(detailsBox => {
       detailsBox.open = activeAncestryChain.includes(detailsBox);
      });

      targetNavNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
     }
    }
   });
  }, observerOptions);

  headings.forEach(heading => window.ArchiveScrollObserver.observe(heading));
 }

});

