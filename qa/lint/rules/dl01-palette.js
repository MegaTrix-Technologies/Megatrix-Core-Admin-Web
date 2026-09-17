import { matchesTokenPalette } from '../color-utils.js';

export function checkDL01(inventory, law, tokens) {
  const violations = [];

  for (const item of inventory) {
    if (item.tag === 'script' || item.tag === 'style' || item.tag === 'noscript') continue;

    // Check text color if there's text
    if (item.text && item.color && !matchesTokenPalette(item.color, tokens)) {
      violations.push({
        id: 'DL-01',
        sev: 'P1',
        name: 'Off-token text color',
        selector: item.selector,
        box: item.box,
        measured: item.color,
        expected: 'Resolves to tokens.json (dE < 2)'
      });
    }

    // Check background color if not transparent
    if (item.background && !matchesTokenPalette(item.background, tokens)) {
      violations.push({
        id: 'DL-01',
        sev: 'P1',
        name: 'Off-token background color',
        selector: item.selector,
        box: item.box,
        measured: item.background,
        expected: 'Resolves to tokens.json (dE < 2)'
      });
    }
  }

  return violations;
}
