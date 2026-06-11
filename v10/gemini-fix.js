// ==========================================================================
// IMMORTAL ARCHIVE WORKSPACE LOGIC ENGINE (v10.2 - Production Stable)
// Fully Optimized for Layout Performance, Live Filters, and Variable Text Spacing
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
 // DOM Cache Mapping Pointers
 const nodes = {
  body: document.body,
  toc: document.getElementById('toc-sidebar'),
  lib: document.getElementById('library-sidebar'),
  ctxPanel: document.getElementById('context-panel'),
  iframe: document.getElementById('context'),
  content: document.getElementById('content-area'),
  tocContainer: document.getElementById('toc-links-container'),

  // Triggers
  tocToggle: document.getElementById('toc-open'),
  libToggle: document.getElementById('library-open'),
  themeToggle: document.getElementById('theme-toggle'),
  ctxToggle: document.getElementById('ctx-toggle'),

  // Live Type Inputs
  tocFilter: document.getElementById('toc-filter'),
  panelFilter: document.getElementById('panel-filter'),
  searchButton: document.getElementById('btn-search'),
  searchPrev: document.getElementById('btn-search-prev'),
  searchNext: document.getElementById('btn-search-next'),
  searchCount: document.getElementById('search-count'),
  libFilter: document.getElementById('library-filter'),

  // Interface Customizers
  fontInc: document.getElementById('btn-font-inc'),
  fontDec: document.getElementById('btn-font-dec'),
  fontFamily: document.getElementById('btn-font-family'),
  densityToggle: document.getElementById('btn-density'),
  justifyToggle: document.getElementById('btn-justify'),
  settingsToggle: document.getElementById('settings-open'),
  settingsSidebar: document.getElementById('settings-sidebar')
 };

 // --- 1. DRAWER EXPANSION HANDLERS ---
 function toggleSidebar(el, btn, forceClose = false) {
  if (!el || !btn) return;
  const isOpening = forceClose ? false : !el.classList.contains('active');
  el.classList.toggle('active', isOpening);
  btn.setAttribute('aria-expanded', isOpening);

  // Auto-close overlapping panels to preserve baseline mobile layout space
  if (isOpening) {
   if (el !== nodes.toc) toggleSidebar(nodes.toc, nodes.tocToggle, true);
   if (el !== nodes.lib) toggleSidebar(nodes.lib, nodes.libToggle, true);
   if (el !== nodes.settingsSidebar) toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, true);
  }
 }

 if (nodes.tocToggle && nodes.toc) {
  nodes.tocToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.toc, nodes.tocToggle); };
 }
 if (nodes.libToggle && nodes.lib) {
  nodes.libToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.lib, nodes.libToggle); };
 }
 if (nodes.settingsToggle && nodes.settingsSidebar) {
  nodes.settingsToggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle); };
 }

 document.onclick = (e) => {
  if (nodes.toc && nodes.toc.classList.contains('active') && !nodes.toc.contains(e.target) && !nodes.tocToggle.contains(e.target)) toggleSidebar(nodes.toc, nodes.tocToggle, true);
  if (nodes.lib && nodes.lib.classList.contains('active') && !nodes.lib.contains(e.target) && !nodes.libToggle.contains(e.target)) toggleSidebar(nodes.lib, nodes.libToggle, true);
  if (nodes.settingsSidebar && nodes.settingsSidebar.classList.contains('active') && !nodes.settingsSidebar.contains(e.target) && !nodes.settingsToggle.contains(e.target)) toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, true);
 };

 // --- 2. ASYNC LIVE TYPE FILTERS (NON-BLOCKING) ---
 function applyLiveFilter(inputElement, elementsSelector, textLookupContainer) {
  if (!inputElement || !textLookupContainer) return;

  inputElement.addEventListener('input', (e) => {
   const query = e.target.value.toLowerCase().trim();

   requestAnimationFrame(() => {
    const items = textLookupContainer.querySelectorAll(elementsSelector);
    items.forEach(item => {
     const matchTarget = item.textContent.toLowerCase();
     if (matchTarget.includes(query)) {
      item.classList.remove('search-hidden');
     } else {
      item.classList.add('search-hidden');
     }
    });
   });
  });
 }

 applyLiveFilter(nodes.tocFilter, 'a', nodes.toc);
 applyLiveFilter(nodes.libFilter, '.book-card', nodes.lib);

 // --- 3. TEXT TUNERS AND CONFIGURATION ATTRIBUTES ---
 const densities = ['compact', 'normal', 'loose'];
 let currentDensityIndex = 1;

 if (nodes.densityToggle) {
  nodes.densityToggle.onclick = () => {
   currentDensityIndex = (currentDensityIndex + 1) % densities.length;
   const nextDensity = densities[currentDensityIndex];
   nodes.body.setAttribute('data-density', nextDensity);
   localStorage.setItem('archive_density', nextDensity);
  };
 }

 let isJustified = false;
 if (nodes.justifyToggle) {
  nodes.justifyToggle.onclick = () => {
   isJustified = !isJustified;
   nodes.body.setAttribute('data-justify', isJustified);
   localStorage.setItem('archive_justify', isJustified);
  };
 }

 let baseFontSize = 1.0;
 if (nodes.fontInc) {
  nodes.fontInc.onclick = () => {
   baseFontSize = Math.min(baseFontSize + 0.05, 1.4);
   nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
  };
 }
 if (nodes.fontDec) {
  nodes.fontDec.onclick = () => {
   baseFontSize = Math.max(baseFontSize - 0.05, 0.85);
   nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
  };
 }

 if (nodes.themeToggle) {
  nodes.themeToggle.onclick = () => {
   const isDark = nodes.body.getAttribute('data-theme') === 'dark';
   const targetTheme = isDark ? 'light' : 'dark';
   nodes.body.setAttribute('data-theme', targetTheme);
   localStorage.setItem('archive_theme', targetTheme);
  };
 }

 const serifFamilies = [
  'Georgia, Times, "Times New Roman", serif',
  'Palatino Linotype, "Palatino", "Book Antiqua", serif',
  'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
 ];
 let serifIndex = 0;

 function updateSerifFamily() {
  const family = serifFamilies[serifIndex];
  nodes.body.style.setProperty('--font-reading', family);
  localStorage.setItem('archive_serif_family', serifIndex);
 }

 if (window.localStorage) {
  const storedFamily = localStorage.getItem('archive_serif_family');
  if (storedFamily !== null) {
   const index = Number(storedFamily);
   if (!Number.isNaN(index) && index >= 0 && index < serifFamilies.length) {
    serifIndex = index;
   }
  }
 }

 updateSerifFamily();

 if (nodes.fontFamily) {
  nodes.fontFamily.onclick = () => {
   serifIndex = (serifIndex + 1) % serifFamilies.length;
   updateSerifFamily();
  };
 }

 // --- 4. SPLIT SEARCH IFRAME ROUTING HANDLERS ---
 let activeSearchProvider = 'encyclopaedia';
 const ctxFullscreenBtn = document.getElementById('ctx-fullscreen');
 const ctxShadeToggleBtn = document.getElementById('ctx-toggle');
 const ctxShade = document.getElementById('ctx-blur-shade');

 const searchProviders = {
  encyclopaedia: (query) => `https://pt.wikipedia.org/w/index.php?search=${query}`,
  dictionary: (query) => `https://pt.wiktionary.org/w/index.php?search=${query}`,
  map: (query) => `https://www.openstreetmap.org/search?query=${query}`
 };

 if (ctxShadeToggleBtn && ctxShade) {
  const blurIcon = ctxShadeToggleBtn.querySelector('img');
  ctxShadeToggleBtn.onclick = () => {
   const isActive = ctxShade.classList.toggle('active');
   ctxShadeToggleBtn.setAttribute('aria-pressed', String(isActive));
   ctxShadeToggleBtn.setAttribute('aria-label', isActive ? 'Hide iframe content' : 'Show iframe content');
   if (blurIcon) {
    // FIXED: Patched root file pointer directory reference 
    blurIcon.src = isActive ? './icons/blur_off.svg' : './icons/blur_on.svg';
    blurIcon.alt = isActive ? 'Blur off' : 'Blur on';
   }
  };
 }

 function getSelectionText() {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
 }

 function isSelectionInContent() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !nodes.content) return false;
  const range = selection.getRangeAt(0);
  return nodes.content.contains(range.commonAncestorContainer);
 }

 function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
 }

 let searchHits = [];
 let currentSearchIndex = -1;

 function updateSearchCounter() {
  if (!nodes.searchCount) return;
  const total = searchHits.length;
  nodes.searchCount.textContent = total > 0 ? `${currentSearchIndex + 1} / ${total}` : '0 / 0';
 }

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

 function moveSearchHit(offset) {
  if (!searchHits.length) return;
  const nextIndex = (currentSearchIndex + offset + searchHits.length) % searchHits.length;
  activateSearchHit(nextIndex);
 }

 function clearHighlights() {
  searchHits = [];
  currentSearchIndex = -1;
  updateSearchCounter();
  if (!nodes.content) return;
  const highlights = nodes.content.querySelectorAll('.search-highlight');
  highlights.forEach((highlight) => {
   const parent = highlight.parentNode;
   if (!parent) return;
   parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
   parent.normalize();
  });
 }

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
  while ((node = walker.nextNode())) {
   textNodes.push(node);
  }

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

 if (nodes.searchButton) {
  nodes.searchButton.onclick = () => {
   highlightPanelSearch(nodes.panelFilter?.value || '');
  };
 }

 if (nodes.searchPrev) nodes.searchPrev.onclick = () => moveSearchHit(-1);
 if (nodes.searchNext) nodes.searchNext.onclick = () => moveSearchHit(1);

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

 if (ctxFullscreenBtn && nodes.ctxPanel) {
  const fullscreenIcon = ctxFullscreenBtn.querySelector('img');
  ctxFullscreenBtn.onclick = () => {
   const isFullscreen = nodes.ctxPanel.classList.toggle('fullscreen');
   ctxFullscreenBtn.setAttribute('aria-pressed', String(isFullscreen));
   ctxFullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Toggle reference frame fullscreen');
   if (fullscreenIcon) {
    // FIXED: Patched root file path pointers
    fullscreenIcon.src = isFullscreen ? './icons/fullscreen_exit.svg' : './icons/fullscreen.svg';
    fullscreenIcon.alt = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
   }
  };
 }

 // --- 5. INITIAL ASYNC PROCESSING TIMELINE ---
 (window.requestIdleCallback || ((cb) => setTimeout(cb, 0)))(async () => {
  try {
   const [markedMod, purifyMod] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/marked@18.0.5/lib/marked.esm.js'),
    import('https://cdn.jsdelivr.net/npm/dompurify@2.4.5/dist/purify.es.js')
   ]);
   const { marked } = markedMod;
   const DOMPurify = (purifyMod && (purifyMod.default || purifyMod.DOMPurify || purifyMod)) || window.DOMPurify;

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

   // FIXED: Changed relative path directory target from '../lde.md' to root reference location './lde.md'
   const response = await fetch('./lde.md');
   if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
   const markdownText = await response.text();

   const rawHTML = marked.parse(markdownText);
   const cleanHTML = DOMPurify.sanitize(rawHTML);

   requestAnimationFrame(() => {
    if (nodes.content) {
     nodes.content.innerHTML = cleanHTML;
     buildTableOfContents();
    }
   });

  } catch (err) {
   console.warn("Target archive down or renamed. Custom parser engine offline.", err.message);
   if (nodes.content) {
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
  }
 });

 function buildTableOfContents() {
  if (!nodes.tocContainer || !nodes.content) return;
  nodes.tocContainer.innerHTML = '';

  const headings = nodes.content.querySelectorAll('h1, h2, h3, h4');
  const fragment = document.createDocumentFragment();

  let activeContainers = {
   1: fragment,
   2: null,
   3: null,
   4: null
  };

  headings.forEach((heading, index) => {
   const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `sec-${index}`;
   heading.id = slug;

   const level = parseInt(heading.tagName.substring(1));
   const nextHeading = headings[index + 1];
   const hasChildren = nextHeading && parseInt(nextHeading.tagName.substring(1)) > level;

   if (hasChildren && level < 4) {
    const details = document.createElement('details');
    details.open = (level === 1);

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

 // --- HIGH-PERFORMANCE DEEP TRACKING ENGINE ---
 function initializeActiveScrollObserver(headings) {
  if (window.ArchiveScrollObserver) window.ArchiveScrollObserver.disconnect();

  const observerOptions = {
   root: nodes.content,
   rootMargin: '0px 0px -70% 0px',
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
       if (currentParent.tagName === 'DETAILS') {
        activeAncestryChain.push(currentParent);
       }
       currentParent = currentParent.parentElement;
      }

      // FIXED: Only open ancestors, completely skipping destructive sibling collapse rules
      activeAncestryChain.forEach(detailsBox => {
       if (!detailsBox.open) detailsBox.open = true;
      });

      targetNavNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
     }
    }
   });
  }, observerOptions);

  headings.forEach(heading => window.ArchiveScrollObserver.observe(heading));
 }

 // --- MODULE: DYNAMIC 3-TIER LINE HEIGHT SPACING ENGINE ---
 (function () {
  const densityBtn = document.getElementById('btn-density');
  if (!densityBtn) return;

  const densityTiers = ['compact', 'normal', 'loose'];
  const cachedDensity = localStorage.getItem('archive_user_density') || 'normal';
  let activeTierIndex = densityTiers.indexOf(cachedDensity);
  if (activeTierIndex === -1) activeTierIndex = 1;

  document.body.setAttribute('data-density', densityTiers[activeTierIndex]);

  densityBtn.addEventListener('click', (e) => {
   e.preventDefault();
   activeTierIndex = (activeTierIndex + 1) % densityTiers.length;
   const targetDensity = densityTiers[activeTierIndex];

   requestAnimationFrame(() => {
    document.body.setAttribute('data-density', targetDensity);
    localStorage.setItem('archive_user_density', targetDensity);
   });
  });
 })();

 // --- MODULE: TOC AUTO-EXPANDING LIVE SEARCH FILTER ---
 (function () {
  const tocInput = document.getElementById('toc-filter');
  const tocLinksBox = document.getElementById('toc-links-container');
  if (!tocInput || !tocLinksBox) return;

  tocInput.addEventListener('input', (e) => {
   const query = e.target.value.toLowerCase().trim();

   requestAnimationFrame(() => {
    if (query === '') {
     tocLinksBox.querySelectorAll('.search-hidden').forEach(el => el.classList.remove('search-hidden'));
     const allDetails = tocLinksBox.querySelectorAll('details');
     allDetails.forEach(box => {
      box.open = (box.parentElement === tocLinksBox);
     });
     return;
    }

    const allLinks = tocLinksBox.querySelectorAll('a.toc-link-item');
    allLinks.forEach(link => {
     const text = link.textContent.toLowerCase();
     link.classList.toggle('search-hidden', !text.includes(query));
    });

    const allDetails = Array.from(tocLinksBox.querySelectorAll('details')).reverse();
    allDetails.forEach(detailsBox => {
     const summary = detailsBox.querySelector('summary');
     const summaryText = summary ? summary.textContent.toLowerCase() : '';
     const summaryMatches = summaryText.includes(query);

     const hasVisibleChildren = Array.from(detailsBox.children).some(child => {
      if (child.tagName === 'SUMMARY') return false;
      return !child.classList.contains('search-hidden');
     });

     if (summaryMatches || hasVisibleChildren) {
      detailsBox.classList.remove('search-hidden');
      if (hasVisibleChildren) detailsBox.open = true;
     } else {
      detailsBox.classList.add('search-hidden');
      detailsBox.open = false;
     }
    });
   });
  });
 })();

 // --- FIXED & UNIFIED MODULE: RESEARCH RADAR ENGINE & LOADER OVERLAY ---
 (function () {
  const tabs = {
   'ctx-encyclopaedia': 'https://pt.wikipedia.org/w/index.php?search=',
   'ctx-dictionary': 'https://pt.wiktionary.org/w/index.php?search=',
   'ctx-map': 'https://www.openstreetmap.org/search?query='
  };

  const contextIframe = document.getElementById('context');
  const contextPanel = document.getElementById('context-panel');
  const loaderOverlay = document.getElementById('iframe-loader');

  if (!contextIframe) return;

  // Global Iframe loading lifecycle completion target hook
  contextIframe.addEventListener('load', () => {
   if (loaderOverlay) {
    requestAnimationFrame(() => {
     loaderOverlay.classList.remove('active');
    });
   }
  });

  // Single cleanly integrated event loop binding sequence to eliminate memory leak execution triggers
  Object.entries(tabs).forEach(([buttonId, baseUrl]) => {
   const btn = document.getElementById(buttonId);
   if (!btn) return;

   btn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeSelection = getSelectionText();

    if (activeSelection === '') {
     alert("Nenhum texto selecionado! Por favor, selecione uma palavra ou frase no texto para realizar a busca.");
     return;
    }

    requestAnimationFrame(() => {
     if (loaderOverlay) loaderOverlay.classList.add('active');

     if (contextPanel && window.getComputedStyle(contextPanel).display === 'none') {
      contextPanel.style.display = 'flex';
     }

     let targetQuery = encodeURIComponent(activeSelection);
     if (baseUrl.includes('infopedia.pt')) {
      targetQuery = targetQuery.toLowerCase();
     }

     contextIframe.src = baseUrl + targetQuery;
    });
   });
  });
 })();
});