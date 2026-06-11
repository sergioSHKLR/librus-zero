// --- 9. TREE-WALKER TABLE OF CONTENTS GENERATOR ---

function buildTableOfContents() {
 if (!nodes.tocContainer) return;
 nodes.tocContainer.innerHTML = '';

 const headings = nodes.content.querySelectorAll('h1, h2, h3, h4');
 const fragment = document.createDocumentFragment();
 const activeContainers = { 1: fragment, 2: null, 3: null, 4: null };

 headings.forEach(function (heading, index) {
  const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sec-' + index;
  heading.id = slug;
  const level = parseInt(heading.tagName.substring(1), 10);

  const nextHeading = headings[index + 1];
  const hasChildren = nextHeading && parseInt(nextHeading.tagName.substring(1), 10) > level;

  if (hasChildren && level < 4) {
   const details = document.createElement('details');
   details.open = (level === 1);

   const summary = document.createElement('summary');
   summary.textContent = heading.textContent;
   summary.dataset.slug = slug;

   summary.onclick = function (e) {
    if (e.offsetX > 20) {
     e.preventDefault();
     heading.scrollIntoView({ behavior: 'smooth' });
     if (window.innerWidth < 768) {
      toggleSidebar(nodes.toc, nodes.tocToggle, true);
     }
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

   link.onclick = function (e) {
    e.preventDefault();
    heading.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth < 768) {
     toggleSidebar(nodes.toc, nodes.tocToggle, true);
    }
   };

   const targetBox = activeContainers[level] || fragment;
   targetBox.appendChild(link);
  }
 });

 nodes.tocContainer.appendChild(fragment);
 initializeActiveScrollObserver(headings);
}
