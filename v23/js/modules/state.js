/**
 * LIBRUS MODULE SYSTEM - DYNAMIC WORKSPACE CORE STATE
 * File Location: /js/modules/state.js
 */
export const LibrusState = {
 theme: localStorage.getItem('archive_theme') || 'light',
 density: localStorage.getItem('archive_user_density') || 'normal',
 justify: localStorage.getItem('archive_justify') === 'true',
 fontSize: parseFloat(localStorage.getItem('archive_font_size')) || 1.0,
 serifIndex: parseInt(localStorage.getItem('archive_serif_family'), 10) || 0,
 activeSearchProvider: 'pt_wikipedia',
 serifFamilies: [
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Georgia, Times, "Times New Roman", serif',
  'Palatino Linotype, "Palatino", "Book Antiqua", serif',
  'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
 ],
 searchProviders: {
  pt_wikipedia: q => `https://pt.wikipedia.org/w/index.php?search=${q}`,
  en_wikipedia: q => `https://en.wikipedia.org/w/index.php?search=${q}`,
  pt_wiktionary: q => `https://pt.wiktionary.org/w/index.php?search=${q}`,
  infopedia: q => `https://www.infopedia.pt/dicionarios/lingua-portuguesa/${q}`,
  openstreetmap: q => `https://www.openstreetmap.org/search?query=${q}`,
  sample1: q => `https://pt.wikipedia.org/w/index.php?search=Sample1+${q}`,
  sample2: q => `https://pt.wiktionary.org/w/index.php?search=Sample2+${q}`
 },
 init() {
  this.apply('theme', this.theme);
  this.apply('density', this.density);
  this.apply('justify', String(this.justify));
  this.updateFontProperties();
 },
 set(key, value) {
  this[key] = value;
  this.apply(key, value);
 },
 apply(key, value) {
  const storageKey = (key === 'density') ? 'archive_user_density' : `archive_${key}`;
  localStorage.setItem(storageKey, value);
  document.body.setAttribute(`data-${key}`, value);
 },
 updateFontProperties() {
  document.body.style.setProperty('--size-reading', `${this.fontSize}rem`);
  document.body.style.setProperty('--font-reading', this.serifFamilies[this.serifIndex]);
  localStorage.setItem('archive_font_size', this.fontSize);
  localStorage.setItem('archive_serif_family', this.serifIndex);
 }
};
