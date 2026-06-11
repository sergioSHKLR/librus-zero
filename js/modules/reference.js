/**
 * LIBRUS MODULE SYSTEM - DYNAMIC ROUTING & ANNOTATION PIPELINES
 * File Location: /js/modules/reference.js
 */
import { LibrusState } from './state.js';
export class ReferenceRouter {
 constructor(iframe, loader, shade, workspace) {
  this.iframe = iframe; this.loader = loader; this.shade = shade; this.workspace = workspace;
 }
 query(id) {
  const selection = window.getSelection().toString().trim();
  if (!selection) { alert("No text selection discovered! Highlight a word inside the reading panel first."); return; }
  if (this.loader) this.loader.classList.add('active');
  let providerKey = LibrusState.activeSearchProvider;
  if (id === 'ctx-encyclopaedia') {
   const checkedRadio = document.querySelector('input[name="encyclopedia-provider"]:checked');
   providerKey = checkedRadio ? checkedRadio.value : 'pt_wikipedia';
  } else if (id === 'ctx-dictionary') {
   const checkedRadio = document.querySelector('input[name="dictionary-provider"]:checked');
   providerKey = checkedRadio ? checkedRadio.value : 'pt_wiktionary';
  }
  const builder = LibrusState.searchProviders[providerKey] || LibrusState.searchProviders.pt_wikipedia;
  let encodedQuery = encodeURIComponent(selection);
  if (providerKey === 'infopedia') encodedQuery = encodedQuery.toLowerCase();
  if (this.iframe) this.iframe.src = builder(encodedQuery);
 }
 toggleFocusShade() { if (this.shade) this.shade.classList.toggle('active'); }
 toggleMaximizePlane() { if (this.workspace) this.workspace.classList.toggle('drawer-expand'); }
 injectHypothesisEngine() {
  if (document.getElementById('hypothesis-script')) {
   if (window.annotator && typeof window.annotator.initialize === 'function') { window.annotator.initialize(); }
   return;
  }
  const script = document.createElement('script');
  script.id = 'hypothesis-script'; script.async = true; script.src = 'https://hypothes.is/embed.js';
  window.hypothesisConfig = function () { return { showHighlights: 'always', appDest: '#content-area', theme: LibrusState.theme }; };
  document.head.appendChild(script);
 }
}
