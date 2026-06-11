// --- 3. DYNAMIC INTERFACE ENVIRONMENT CUSTOMIZERS ---

const densities = ['compact', 'normal', 'loose'];
let currentDensityIndex = 1;

const cachedDensity = localStorage.getItem('archive_user_density') || 'normal';
currentDensityIndex = densities.indexOf(cachedDensity) === -1 ? 1 : densities.indexOf(cachedDensity);
nodes.body.setAttribute('data-density', densities[currentDensityIndex]);

nodes.densityToggle.onclick = function () {
 currentDensityIndex = (currentDensityIndex + 1) % densities.length;
 const nextDensity = densities[currentDensityIndex];
 requestAnimationFrame(function () {
  nodes.body.setAttribute('data-density', nextDensity);
  localStorage.setItem('archive_user_density', nextDensity);
 });
};

let isJustified = localStorage.getItem('archive_justify') === 'true';
nodes.body.setAttribute('data-justify', isJustified);

nodes.justifyToggle.onclick = function () {
 isJustified = !isJustified;
 requestAnimationFrame(function () {
  nodes.body.setAttribute('data-justify', isJustified);
  localStorage.setItem('archive_justify', isJustified);
 });
};

let baseFontSize = parseFloat(localStorage.getItem('archive_font_scale')) || 1.0;
nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);

nodes.fontInc.onclick = function () {
 baseFontSize = Math.min(baseFontSize + 0.05, 1.4);
 requestAnimationFrame(function () {
  nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
  localStorage.setItem('archive_font_scale', baseFontSize);
 });
};

nodes.fontDec.onclick = function () {
 baseFontSize = Math.max(baseFontSize - 0.05, 0.85);
 requestAnimationFrame(function () {
  nodes.body.style.setProperty('--size-reading', `${baseFontSize}rem`);
  localStorage.setItem('archive_font_scale', baseFontSize);
 });
};

nodes.themeToggle.onclick = function () {
 const isDark = nodes.body.getAttribute('data-theme') === 'dark';
 const targetTheme = isDark ? 'light' : 'dark';
 requestAnimationFrame(function () {
  nodes.body.setAttribute('data-theme', targetTheme);
  localStorage.setItem('archive_theme', targetTheme);
 });
};

const serifFamilies = [
 'Georgia, Times, "Times New Roman", serif',
 'Palatino Linotype, "Palatino", "Book Antiqua", serif',
 'Roboto Slab, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
];
let serifIndex = parseInt(localStorage.getItem('archive_serif_family'), 10) || 0;

function updateSerifFamily() {
 nodes.body.style.setProperty('--font-reading', serifFamilies[serifIndex]);
 localStorage.setItem('archive_serif_family', serifIndex);
}

updateSerifFamily();

if (nodes.fontFamily) {
 nodes.fontFamily.onclick = function () {
  serifIndex = (serifIndex + 1) % serifFamilies.length;
  requestAnimationFrame(updateSerifFamily);
 };
}
