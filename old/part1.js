/* jshint esversion: 11 */
/* global Promise */

// ==========================================================================
// LIBRUS ZERO: WORKSPACE OPERATIONS ENGINE (SECTION 1/11)
// Fully Lint-Compliant ES11 Architecture for Generational Longevity
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

 // --- 1. DOM CACHE REGISTRY MATRIX ---
 // Caches element references globally to minimize DOM querying overhead
 const nodes = {
  body: document.body,
  toc: document.getElementById('toc-sidebar'),
  lib: document.getElementById('library-sidebar'),
  ctxPanel: document.getElementById('context-panel'),
  iframe: document.getElementById('context'),
  content: document.getElementById('content-area'),
  tocContainer: document.getElementById('toc-links-container'),
  loaderOverlay: document.getElementById('iframe-loader'),

  // Interactive Sidebar Control Triggers
  tocToggle: document.getElementById('toc-open'),
  libToggle: document.getElementById('library-open'),
  themeToggle: document.getElementById('theme-toggle'),
  ctxToggle: document.getElementById('ctx-toggle'),
  settingsToggle: document.getElementById('settings-open'),
  settingsSidebar: document.getElementById('settings-sidebar'),

  // Global Document Search Elements
  panelFilter: document.getElementById('panel-filter'),
  searchButton: document.getElementById('btn-search'),
  searchPrev: document.getElementById('btn-search-prev'),
  searchNext: document.getElementById('btn-search-next'),
  searchCount: document.getElementById('search-count'),

  // Real-Time Input Filtering Controls
  tocFilter: document.getElementById('toc-filter'),
  libFilter: document.getElementById('library-filter'),

  // Typography and Spacing Customizers
  fontInc: document.getElementById('btn-font-inc'),
  fontDec: document.getElementById('btn-font-dec'),
  fontFamily: document.getElementById('btn-font-family'),
  densityToggle: document.getElementById('btn-density'),
  justifyToggle: document.getElementById('btn-justify')
 };

 // Shared State Cache for Local Search Results
 let searchHits = [];
 let currentSearchIndex = -1;

 // Search Gateway Configuration Mapper
 const searchProviders = {
  public: (query) => `https://wikipedia.org{query}`,
  dictionary: (query) => `https://wiktionary.org{query.toLowerCase()}`,
  map: (query) => `https://openstreetmap.org{query}`
 };
