// --- 5. AUTOMATED TOC AUTO-EXPANDING LIVE SEARCH FILTER ---

(function () {
 if (!nodes.tocFilter || !nodes.tocContainer) return;

 nodes.tocFilter.addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase().trim();

  requestAnimationFrame(function () {
   // Scenario A: If input field is completely empty, restore default sidebar tree layout
   if (query === '') {
    nodes.tocContainer.querySelectorAll('.search-hidden').forEach(function (el) {
     el.classList.remove('search-hidden');
    });
    nodes.tocContainer.querySelectorAll('details').forEach(function (box) {
     box.open = (box.parentElement === nodes.tocContainer); // Keeps H1 folders open, rest collapsed
    });
    return;
   }

   // Scenario B: User is actively typing search string keys
   // Step 1: Filter plain navigation link items
   const allLinks = nodes.tocContainer.querySelectorAll('a.toc-link-item');
   allLinks.forEach(function (link) {
    link.classList.toggle('search-hidden', !link.textContent.toLowerCase().includes(query));
   });

   // Step 2: Reverse-traverse nested details blocks from bottom-to-top to handle hierarchy dependencies
   const allDetails = Array.from(nodes.tocContainer.querySelectorAll('details')).reverse();
   allDetails.forEach(function (detailsBox) {
    const summary = detailsBox.querySelector('summary');
    const summaryText = summary ? summary.textContent.toLowerCase() : '';
    const summaryMatches = summaryText.includes(query);

    // Evaluates if any inner items are matching/visible
    const hasVisibleChildren = Array.from(detailsBox.children).some(function (child) {
     if (child.tagName === 'SUMMARY') return false;
     return !child.classList.contains('search-hidden');
    });

    if (summaryMatches || hasVisibleChildren) {
     detailsBox.classList.remove('search-hidden');
     if (hasVisibleChildren) {
      detailsBox.open = true; // Burst expand folder to show inner match targets
     }
    } else {
     detailsBox.classList.add('search-hidden');
     detailsBox.open = false;
    }
   });
  });
 });
})();
