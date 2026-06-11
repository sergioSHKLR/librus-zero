// --- 4. NON-BLOCKING LIVE TYPE INPUT SIDEBAR FILTERS ---

/**
 * Simple live text-matching query engine designed to filter sidebar contents
 * @param {HTMLElement} inputElement - The active input text tag field to observe
 * @param {string} elementsSelector - Target items to hide or reveal
 * @param {HTMLElement} textLookupContainer - Parent boundary containing target items
 */
function applyLiveFilter(inputElement, elementsSelector, textLookupContainer) {
 if (!inputElement || !textLookupContainer) return;
 inputElement.addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase().trim();
  requestAnimationFrame(function () {
   const items = textLookupContainer.querySelectorAll(elementsSelector);
   items.forEach(function (item) {
    const matchTarget = item.textContent.toLowerCase();
    item.classList.toggle('search-hidden', !matchTarget.includes(query));
   });
  });
 });
}

applyLiveFilter(nodes.tocFilter, 'a', nodes.toc);
applyLiveFilter(nodes.libFilter, '.book-card', nodes.lib);
