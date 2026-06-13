/**
 * LIBRUS MODULE SYSTEM - SIDEBAR DRAWER & OVERLAY INTERFACES
 * File Location: /js/modules/ui.js
 */
export class UIManager {
 constructor(domElements) { this.DOM = domElements; }
 closeAllSidebars() {
  [this.DOM.toc, this.DOM.library, this.DOM.settings].forEach(el => el && el.classList.remove('active'));
  if (this.DOM.backdrop) this.DOM.backdrop.classList.remove('active');
 }
 openSidebar(sidebarEl) {
  this.closeAllSidebars();
  if (sidebarEl) {
   sidebarEl.classList.add('active');
   if (this.DOM.backdrop) this.DOM.backdrop.classList.add('active');
  }
 }
 toggleTypographyMenu(toggleBtn, menuEl) { menuEl.classList.toggle('active'); }
 filterLibrary(query) {
  const cleanQuery = query.toLowerCase().trim();
  const cards = document.querySelectorAll('#library-shelf-container .paperback-card');
  cards.forEach(card => {
   const title = card.getAttribute('data-title').toLowerCase();
   card.style.display = title.includes(cleanQuery) ? 'flex' : 'none';
  });
 }
}
