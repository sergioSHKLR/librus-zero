/**
 * LIBRUS MODULE SYSTEM - HIGH-PERFORMANCE DOM TEXT REGEX MATCH ENGINE
 * File Location: /js/modules/search.js
 */
export class SearchEngine {
 constructor(contentArea, countLabel) {
  this.contentArea = contentArea;
  this.countLabel = countLabel;
  this.hits = [];
  this.currentIndex = -1;
 }
 clear() {
  this.hits = [];
  this.currentIndex = -1;
  if (this.countLabel) this.countLabel.textContent = '0 / 0';
  if (!this.contentArea) return;
  const highlights = this.contentArea.querySelectorAll('.search-highlight');
  highlights.forEach(h => {
   const parent = h.parentNode;
   if (parent) {
    parent.replaceChild(document.createTextNode(h.textContent), h);
    parent.normalize();
   }
  });
 }
 execute(query) {
  this.clear();
  const cleanQuery = query.trim();
  if (!cleanQuery) return;
  const pattern = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const walker = document.createTreeWalker(this.contentArea, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while (n = walker.nextNode()) nodes.push(n);
  nodes.forEach(node => {
   const text = node.nodeValue;
   if (!pattern.test(text)) return;
   pattern.lastIndex = 0;
   const frag = document.createDocumentFragment();
   let lastIndex = 0, match;
   while ((match = pattern.exec(text)) !== null) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    const mark = document.createElement('mark');
    mark.className = 'search-highlight';
    mark.textContent = match[0];
    frag.appendChild(mark);
    lastIndex = pattern.lastIndex;
   }
   frag.appendChild(document.createTextNode(text.slice(lastIndex)));
   node.parentNode.replaceChild(frag, node);
  });
  this.hits = Array.from(this.contentArea.querySelectorAll('.search-highlight'));
  if (this.hits.length > 0) this.activateHit(0);
 }
 activateHit(index) {
  if (!this.hits.length) return;
  this.hits.forEach((hit, idx) => hit.classList.toggle('current-search-hit', idx === index));
  this.currentIndex = index;
  if (this.countLabel) this.countLabel.textContent = `${this.currentIndex + 1} / ${this.hits.length}`;
  this.hits[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
 }
 prev() { if (this.hits.length) this.activateHit((this.currentIndex - 1 + this.hits.length) % this.hits.length); }
 next() { if (this.hits.length) this.activateHit((this.currentIndex + 1) % this.hits.length); }
}
