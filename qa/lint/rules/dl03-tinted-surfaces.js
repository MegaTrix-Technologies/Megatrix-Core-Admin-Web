import { parseCssColor, rgbToHsl } from '../color-utils.js';

export function checkDL03(inventory, law, tokens) {
  const violations = [];
  const maxSat = law.surfaces?.maxSaturationThreshold || 0.08;
  const maxArea = law.surfaces?.maxSaturatedArea || 256;

  for (const item of inventory) {
    if (item.box && item.box.area > maxArea && item.background) {
      const parsed = parseCssColor(item.background);
      if (!parsed.isTransparent && parsed.a > 0.05) {
        const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
        if (hsl.s > maxSat && hsl.l > 0.05 && hsl.l < 0.95) {
          violations.push({
            id: 'DL-03',
            sev: 'P0',
            name: 'Tinted surface detected',
            selector: item.selector,
            box: item.box,
            measured: `${item.background} (saturation: ${(hsl.s * 100).toFixed(0)}%, area: ${item.box.area}px²)`,
            expected: `background saturation <= ${(maxSat * 100).toFixed(0)}% for elements > ${maxArea}px²`
          });
        }
      }
    }
  }

  return violations;
}
