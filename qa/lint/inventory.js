/**
 * qa/lint/inventory.js
 * MegaTrix Design QA - DOM & CSSOM Harvester (runs inside page.evaluate)
 */

export function getHarvestScript() {
  return `(() => {
    function cssPath(el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return '';
      if (el.id) return '#' + el.id;
      if (el.tagName === 'BODY') return 'body';

      let path = [];
      let current = el;

      while (current && current.nodeType === Node.ELEMENT_NODE && current.tagName !== 'BODY') {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
          selector = '#' + current.id;
          path.unshift(selector);
          break;
        } else {
          let sibling = current;
          let nth = 1;
          while (sibling = sibling.previousElementSibling) {
            if (sibling.tagName === current.tagName) nth++;
          }
          if (current.className && typeof current.className === 'string') {
            const firstClass = current.className.trim().split(/\\s+/)[0];
            if (firstClass && !firstClass.includes(':') && !firstClass.includes('[') && !firstClass.includes('/')) {
              selector += '.' + firstClass;
            }
          }
          selector += ':nth-of-type(' + nth + ')';
        }
        path.unshift(selector);
        current = current.parentElement;
      }
      return path.join(' > ');
    }

    return [...document.querySelectorAll('body *')]
      .filter(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 &&
               cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
      })
      .map(el => {
        const cs = getComputedStyle(el);
        const r  = el.getBoundingClientRect();
        let effectiveBg = cs.backgroundColor;
        let p = el.parentElement;
        while (p && (effectiveBg === 'transparent' || effectiveBg === 'rgba(0, 0, 0, 0)')) {
          const pcs = getComputedStyle(p);
          if (pcs.backgroundColor && pcs.backgroundColor !== 'transparent' && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            effectiveBg = pcs.backgroundColor;
            break;
          }
          p = p.parentElement;
        }
        const textContent = el.childElementCount === 0 ? (el.textContent || '').trim() : '';

        return {
          selector: cssPath(el),
          tag: el.tagName.toLowerCase(),
          text: textContent.slice(0, 120),
          box: {
            x: Math.round(r.x),
            y: Math.round(r.y),
            w: Math.round(r.width),
            h: Math.round(r.height),
            area: Math.round(r.width * r.height)
          },
          color: cs.color,
          background: cs.backgroundColor,
          effectiveBackground: effectiveBg,
          backgroundImage: cs.backgroundImage,
          boxShadow: cs.boxShadow,
          filter: cs.filter,
          fontFamily: cs.fontFamily,
          fontSize: parseFloat(cs.fontSize) || 0,
          fontWeight: cs.fontWeight,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
          borderRadius: cs.borderRadius,
          border: \`\${cs.borderTopWidth} \${cs.borderTopStyle} \${cs.borderTopColor}\`,
          padding: [parseFloat(cs.paddingTop) || 0, parseFloat(cs.paddingRight) || 0, parseFloat(cs.paddingBottom) || 0, parseFloat(cs.paddingLeft) || 0],
          margin:  [parseFloat(cs.marginTop) || 0, parseFloat(cs.marginRight) || 0, parseFloat(cs.marginBottom) || 0, parseFloat(cs.marginLeft) || 0],
          transition: cs.transition,
          animation: cs.animation,
          isSvg: el instanceof SVGElement || el.tagName.toLowerCase() === 'svg' || !!el.closest('svg'),
          strokeWidth: el.getAttribute?.('stroke-width') ?? (el.closest('svg')?.getAttribute?.('stroke-width') ?? null),
          hasHandler: !!(el.onclick || el.getAttribute('href') || el.closest('a,button') || el.tagName === 'BUTTON' || el.tagName === 'A'),
          href: el.getAttribute('href') || (el.closest('a')?.getAttribute('href') ?? null),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label') || el.getAttribute('title') || '',
          tabIndex: el.tabIndex
        };
      });
  })()`;
}
