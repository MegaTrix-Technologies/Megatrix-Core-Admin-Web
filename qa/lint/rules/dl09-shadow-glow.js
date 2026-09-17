import { parseCssColor } from '../color-utils.js';

export function checkDL09(inventory, law, tokens) {
  const violations = [];

  for (const item of inventory) {
    if (!item.box || item.box.area <= 0) continue;

    // Check box-shadow
    if (item.boxShadow && item.boxShadow !== 'none') {
      // Find all color tokens inside box-shadow string
      const rgbMatches = item.boxShadow.match(/rgba?\([^)]+\)/g);
      if (rgbMatches) {
        for (const col of rgbMatches) {
          const parsed = parseCssColor(col);
          if (!parsed.isTransparent && (parsed.r > 20 || parsed.g > 20 || parsed.b > 20)) {
            violations.push({
              id: 'DL-09',
              sev: 'P1',
              name: 'Colored box-shadow glow detected',
              selector: item.selector,
              box: item.box,
              measured: `box-shadow with ${col}`,
              expected: 'Black/transparent shadows only'
            });
          }
        }
      }
    }

    // Check filter: drop-shadow
    if (item.filter && item.filter.includes('drop-shadow')) {
      const rgbMatches = item.filter.match(/rgba?\([^)]+\)/g);
      if (rgbMatches) {
        for (const col of rgbMatches) {
          const parsed = parseCssColor(col);
          if (!parsed.isTransparent && (parsed.r > 20 || parsed.g > 20 || parsed.b > 20)) {
            violations.push({
              id: 'DL-09',
              sev: 'P1',
              name: 'Colored drop-shadow filter detected',
              selector: item.selector,
              box: item.box,
              measured: `filter: ${item.filter}`,
              expected: 'Black/transparent shadows only'
            });
          }
        }
      }
    }
  }

  return violations;
}
