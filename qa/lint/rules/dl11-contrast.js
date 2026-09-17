import { contrastRatio, parseCssColor } from '../color-utils.js';

export function checkDL11(inventory, law, tokens) {
  const violations = [];

  for (const item of inventory) {
    if (!item.text || item.box.area <= 0) continue;

    const textColor = parseCssColor(item.color);
    if (textColor.isTransparent) continue;

    // Estimate background (use item.effectiveBackground, item.background or default to surface #0a0a0a)
    let bgColor = parseCssColor(item.effectiveBackground || item.background);
    if (bgColor.isTransparent) {
      bgColor = parseCssColor(tokens.color.surface);
    }

    const ratio = contrastRatio(textColor, bgColor);
    const isLarge = item.fontSize >= 18 || (item.fontSize >= 14 && item.fontWeight >= 600);
    const minRatio = isLarge ? 3.0 : 4.5;

    if (ratio < minRatio) {
      const sev = ratio < 3.0 ? 'P0' : 'P1';
      violations.push({
        id: 'DL-11',
        sev,
        name: 'Insufficient text contrast ratio',
        selector: item.selector,
        box: item.box,
        measured: `${ratio.toFixed(2)}:1 ("${item.text.slice(0, 30)}")`,
        expected: `>= ${minRatio}:1 WCAG AA`
      });
    }
  }

  return violations;
}
