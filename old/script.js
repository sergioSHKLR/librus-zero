
      const toc = document.getElementById('p1'), lib = document.getElementById('p5');
      const p1Toggle = document.getElementById('p1-open'), p5Toggle = document.getElementById('p5-open');
      const fullscreenBtn = document.getElementById('p3-fullscreen');
      const shareBtn = document.getElementById('p3-share');
      const contextFrame = document.getElementById('context');
      const p3Panel = document.querySelector('.p3');

      // Helper tracking to switch state tags for assistive screen devices
      function toggleSidebar(el, btn, forceClose = false) {
        const opening = forceClose ? false : !el.classList.contains('active');
        el.classList.toggle('active', opening);
        btn.setAttribute('aria-expanded', opening);
      }

      p1Toggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(toc, p1Toggle); };
      p5Toggle.onclick = (e) => { e.stopPropagation(); toggleSidebar(lib, p5Toggle); };

      document.onclick = (e) => {
        if (toc.classList.contains('active') && !toc.contains(e.target) && !p1Toggle.contains(e.target)) toggleSidebar(toc, p1Toggle, true);
        if (lib.classList.contains('active') && !lib.contains(e.target) && !p5Toggle.contains(e.target)) toggleSidebar(lib, p5Toggle, true);
      };

      if (fullscreenBtn && p3Panel) {
        fullscreenBtn.onclick = () => {
          const isFullscreen = p3Panel.classList.toggle('fullscreen');
          fullscreenBtn.setAttribute('aria-pressed', String(isFullscreen));
          fullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen');
          fullscreenBtn.textContent = isFullscreen ? 'fullscreen_exit' : 'fullscreen';
        };
      }

      if (shareBtn) {
        shareBtn.onclick = async () => {
          const url = contextFrame?.src || window.location.href;
          if (navigator.share) {
            try {
              await navigator.share({
                title: document.title,
                text: 'Sharing the current reference page',
                url
              });
            } catch (err) {
              console.warn('Web Share canceled or failed:', err);
            }
          } else if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(url);
              alert('Share not supported. URL copied to clipboard.');
            } catch (err) {
              console.warn('Clipboard copy failed:', err);
            }
          } else {
            alert('Sharing is not supported in this browser.');
          }
        };
      }

      // IMMORTAL PIPELINE SETUP
      window.addEventListener('DOMContentLoaded', () => {
        // Explicit clean fallback closure parameter for calculation queues
        (window.requestIdleCallback || ((cb) => setTimeout(cb, 0)))(async () => {
          try {
            // Unpack dependencies using clean, fully qualified ESM endpoint coordinates
            const [markedMod, purifyMod] = await Promise.all([
              import('https://cdn.jsdelivr.net/npm/marked@5.1.1/lib/marked.esm.js'),
              import('https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.es.js')
            ]);
            const { marked } = markedMod;
            const DOMPurify = (purifyMod && (purifyMod.default || purifyMod.DOMPurify || purifyMod)) || window.DOMPurify;

            const response = await fetch('./lde.md');
            if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
            const markdownText = await response.text();

            // Fix: Secure layout strings against XSS attacks before injecting them into the DOM
            const contentArea = document.getElementById('content-area');
            const rawHTML = marked.parse(markdownText);
            contentArea.innerHTML = DOMPurify.sanitize(rawHTML);

            // Map Table of Contents links out of generated slug strings
            const tocContainer = document.getElementById('toc');
            const headings = contentArea.querySelectorAll('h1, h2');

            headings.forEach((heading) => {
              // Slugify: Convert text title spaces into URL-friendly semantic target hashes
              const slug = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              heading.id = slug;

              const link = document.createElement('a');
              link.href = '#' + slug;
              link.textContent = heading.textContent;
              if (heading.tagName === 'H2') link.style.paddingLeft = '12px';
              if (heading.tagName === 'H3') link.style.paddingLeft = '24px';
              link.onclick = () => { toggleSidebar(toc, p1Toggle, true); };
              tocContainer.appendChild(link);
            });

          } catch (err) {
            console.error("Initialization Error:", err);
            document.getElementById('content-area').innerHTML = `<p style="color:red">Failed to load markdown: ${err.message}</p>`;
          }
        });
      });
