// --- 6. CORE TEXT CANVAS HIGHLIGHTS & KEYWORD SEARCH SYSTEM ---

/** Escapes string regular expression syntax operators safely */
function escapeRegExp(value) {
 return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Refreshes the structural toolbar matching index metrics readout indicator */
function updateSearchCounter() {
 if (!nodes.searchCount) return;
 const total = searchHits.length;
 nodes.searchCount.textContent = total > 0 ? (currentSearchIndex + 1) + ' / ' + total : '0 / 0';
}

/** Hones viewport canvas scrolling focus down to target highlighted item index coordinates */
function activateSearchHit(index) {
 if (!searchHits.length) return;
 searchHits.forEach(function (hit, idx) {
  hit.classList.toggle('current-search-hit', idx === index);
 });
 currentSearchIndex = index;
 updateSearchCounter();
 requestAnimationFrame(function () {
  const target = searchHits[currentSearchIndex];
  if (target) {
   target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
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
 highlights.forEach(function (highlight) {
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
  acceptNode: function (node) {
   if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
   if (node.parentNode.closest('.search-highlight')) return NodeFilter.FILTER_REJECT;
   return NodeFilter.FILTER_ACCEPT;
  }
 });

 const textNodes = [];
 let node = walker.nextNode();
 while (node) {
  textNodes.push(node);
  node = walker.nextNode();
 }

 textNodes.forEach(function (textNode) {
  const text = textNode.nodeValue;
  let lastIndex = 0;
  let match = pattern.exec(text);
  const frag = document.createDocumentFragment();
  pattern.lastIndex = 0;

  while (match !== null) {
   const before = text.slice(lastIndex, match.index);
   if (before) {
    frag.appendChild(document.createTextNode(before));
   }

   const mark = document.createElement('mark');
   mark.className = 'search-highlight';
   mark.textContent = match[0];
   frag.appendChild(mark);

   lastIndex = match.index + match[0].length;
   match = pattern.exec(text);
  }

  const after = text.slice(lastIndex);
  if (!frag.childNodes.length) return;
  if (after) {
   frag.appendChild(document.createTextNode(after));
  }
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
 nodes.searchButton.onclick = function () {
  highlightPanelSearch(nodes.panelFilter ? nodes.panelFilter.value : '');
 };
}
if (nodes.searchPrev) {
 nodes.searchPrev.onclick = function () { moveSearchHit(-1); };
}
if (nodes.searchNext) {
 nodes.searchNext.onclick = function () { moveSearchHit(1); };
}

// Structural Input clear fields button actions mapper
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
