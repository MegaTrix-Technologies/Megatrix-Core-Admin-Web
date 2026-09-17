import { parseCssColor, deltaE } from '../color-utils.js';

export function checkDL04(inventory, law, tokens) {
  const violations = [];
  const cfg = law.badges || { maxHeight: 26, maxWidth: 240, fontSize: 11, maxPerViewport: 2 };
  
  // Identify badge/pill candidates (rounded-full or small text wrappers with borders or background, excluding interactive controls and table cells)
  const badges = inventory.filter(item => {
    if (!item.box || item.box.w <= 0) return false;
    // Exclude indicator dots (<= 10px) and avatars per §3.2 geometry rules
    if (item.box.w <= 10 && item.box.h <= 10) return false;
    if (['button', 'a', 'input', 'select', 'th', 'td', 'h1', 'h2', 'h3', 'p', 'svg'].includes(item.tag)) return false;
    if (item.hasHandler && item.tag !== 'span') return false;
    const isPill = item.box.w > 10 && item.text && item.borderRadius && (item.borderRadius.includes('9999px') || item.borderRadius.includes('50%'));
    const hasBorder = item.border && !item.border.startsWith('0px') && item.border.includes('solid');
    const hasBg = item.background && item.background !== 'rgba(0, 0, 0, 0)' && item.background !== 'transparent';
    const isSmallChip = item.box.h <= 32 && item.box.w <= 600 && item.text && (hasBg || hasBorder);
    return isPill || isSmallChip;
  });

  for (const badge of badges) {
    // Check width
    if (badge.box.w > cfg.maxWidth) {
      violations.push({
        id: 'DL-04',
        sev: 'P1',
        name: 'Oversized badge width',
        selector: badge.selector,
        box: badge.box,
        measured: `width ${badge.box.w}px ("${badge.text.slice(0, 40)}")`,
        expected: `width <= ${cfg.maxWidth}px`
      });
    }

    // Check height
    if (badge.box.h > cfg.maxHeight) {
      violations.push({
        id: 'DL-04',
        sev: 'P1',
        name: 'Badge height exceeded',
        selector: badge.selector,
        box: badge.box,
        measured: `height ${badge.box.h}px`,
        expected: `height <= ${cfg.maxHeight}px`
      });
    }

    // Check font size
    if (badge.fontSize && badge.fontSize !== cfg.fontSize) {
      violations.push({
        id: 'DL-04',
        sev: 'P1',
        name: 'Badge font size off-scale',
        selector: badge.selector,
        box: badge.box,
        measured: `${badge.fontSize}px`,
        expected: `${cfg.fontSize}px`
      });
    }

    // Check background fill
    if (badge.background) {
      const parsed = parseCssColor(badge.background);
      if (!parsed.isTransparent) {
        const dEPanel = deltaE(parsed, tokens.color.panel);
        const dETransparent = deltaE(parsed, '#000000');
        if (dEPanel > 5 && dETransparent > 5) {
          violations.push({
            id: 'DL-04',
            sev: 'P1',
            name: 'Illegal badge background fill',
            selector: badge.selector,
            box: badge.box,
            measured: badge.background,
            expected: 'transparent or panel (#141414)'
          });
        }
      }
    }
  }

  if (badges.length > cfg.maxPerViewport) {
    violations.push({
      id: 'DL-04',
      sev: 'P1',
      name: 'Too many badges in viewport',
      selector: 'viewport',
      measured: `${badges.length} badges`,
      expected: `<= ${cfg.maxPerViewport} badges per viewport`
    });
  }

  return violations;
}
