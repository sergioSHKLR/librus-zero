// --- 8. INITIAL SYSTEM PIPELINE ASYNC INITIALIZER ---

(window.requestIdleCallback || function (cb) { setTimeout(cb, 0); })(async function () {
 try {
  const [markedMod, purifyMod] = await Promise.all([
   import('https://jsdelivr.net'),
   import('https://jsdelivr.net')
  ]);
  const marked = markedMod.marked;
  const DOMPurify = purifyMod.DOMPurify || purifyMod;

  // Custom Markdown Admonition Lexer Block Extension Syntax Array
  const admonitionExtension = {
   name: 'admonition',
   level: 'block',
   start: function (src) { return src.match(/^:::/)?.index; },
   tokenizer: function (src) {
    const rule = /^:::\s*([a-zA-Z0-9_-]+)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::\s*(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
     return {
      type: 'admonition',
      raw: match,
      admType: match[1],
      admTitle: match[2] ? match[2].trim() : match[1].toUpperCase(),
      text: match[3],
      tokens: this.lexer.blockTokens(match[3], [])
     };
    }
   },
   renderer: function (token) {
    return '<div class="admonition-box ' + token.admType.toLowerCase() + '">' +
     '<div class="admonition-title">' + token.admTitle + '</div>' +
     '<div class="admonition-body">' + this.parser.parse(token.tokens) + '</div>' +
     '</div>';
   }
  };

  marked.use({ extensions: [admonitionExtension] });

  const response = await fetch('./lde.md');
  if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
  const markdownText = await response.text();

  const rawHTML = marked.parse(markdownText);
  const cleanHTML = DOMPurify.sanitize(rawHTML);

  requestAnimationFrame(function () {
   nodes.content.innerHTML = cleanHTML;
   buildTableOfContents();
  });

 } catch (err) {
  console.warn("Offline fallback activation.", err.message);
  nodes.content.innerHTML = '<article><h1>Immortal Archive</h1><p>Fallback content loaded.</p></article>';
  buildTableOfContents();
 }
});
