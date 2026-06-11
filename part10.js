// --- 10. HIGH-PERFORMANCE DEEP LEVEL DEBOUNCED SCROLL OBSERVER ---

/**
 * Spawns a background intersection watcher to map reader scrolling vectors onto the sidebar directory
 * @param {NodeList} headings - Complete array list of structural book heading elements to monitor
 */
function initializeActiveScrollObserver(headings) {
 if (window.ArchiveScrollObserver) {
  window.ArchiveScrollObserver.disconnect();
 }

 const observerOptions = {
  root: nodes.content,
  rootMargin: '0px 0px -70% 0px', // Intersection observation viewport box parameters
  threshold: 0
 };

 window.ArchiveScrollObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
   if (entry.isIntersecting) {
    const activeSlug = entry.target.id;

    // Clear older visual tracking accents across left index links
    nodes.toc.querySelectorAll('.toc-active-item').forEach(function (el) {
     el.classList.remove('toc-active-item');
    });

    // Match current scrolling location down to specific element tag keys
    const targetNavNode = nodes.toc.querySelector('[data-slug="' + activeSlug + '"], a[href="#' + activeSlug + '"]');
    if (targetNavNode) {
     targetNavNode.classList.add('toc-active-item');

     // Build ancestral path arrays mapping active tree components up to root
     const activeAncestryChain = [];
     let currentParent = targetNavNode.parentElement;
     while (currentParent && currentParent !== nodes.tocContainer) {
      if (currentParent.tagName === 'DETAILS') {
       activeAncestryChain.push(currentParent);
      }
      currentParent = currentParent.parentElement;
     }

     // DEEP AUTO-COLLAPSE SIBLINGS: Opens our exact path folders while collapsing the rest
     const allSidebarDetails = nodes.tocContainer.querySelectorAll('details');
     allSidebarDetails.forEach(function (detailsBox) {
      detailsBox.open = activeAncestryChain.includes(detailsBox);
     });

     // Smooth scroll sidebar view container to ensure active line metrics are exposed
     targetNavNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
   }
  });
 }, observerOptions);

 // Register active observer pipelines
 headings.forEach(function (heading) {
  window.ArchiveScrollObserver.observe(heading);
 });
}
