// --- 2. SIDEBAR NAVIGATION & DRAWER SYSTEM CONTROLLER ---

/**
 * Toggles the visibility state of side drawers using hardware-accelerated CSS classes
 * @param {HTMLElement} el - The sidebar element container to slide
 * @param {HTMLElement} btn - The associated navigation control button
 * @param {boolean} forceClose - Explicit override flag to force-collapse a panel
 */
function toggleSidebar(el, btn, forceClose) {
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
nodes.tocToggle.onclick = function (e) { e.stopPropagation(); toggleSidebar(nodes.toc, nodes.tocToggle, false); };
nodes.libToggle.onclick = function (e) { e.stopPropagation(); toggleSidebar(nodes.lib, nodes.libToggle, false); };

if (nodes.settingsToggle) {
 nodes.settingsToggle.onclick = function (e) { e.stopPropagation(); toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, false); };
}

// Click-Away Trap: Automatically closes any open overlay panels when a user clicks the main body canvas
document.onclick = function (e) {
 if (nodes.toc.classList.contains('active') && !nodes.toc.contains(e.target) && !nodes.tocToggle.contains(e.target)) {
  toggleSidebar(nodes.toc, nodes.tocToggle, true);
 }
 if (nodes.lib.classList.contains('active') && !nodes.lib.contains(e.target) && !nodes.libToggle.contains(e.target)) {
  toggleSidebar(nodes.lib, nodes.libToggle, true);
 }
 if (nodes.settingsSidebar && nodes.settingsSidebar.classList.contains('active') && !nodes.settingsSidebar.contains(e.target) && !nodes.settingsToggle.contains(e.target)) {
  toggleSidebar(nodes.settingsSidebar, nodes.settingsToggle, true);
 }
};
