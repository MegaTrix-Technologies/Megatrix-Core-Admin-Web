import { parseCssColor, deltaE, rgbToHsl } from '../color-utils.js';

export function checkDL02(inventory, law, tokens, rasterData) {
  const violations = [];
  const primaryAccent = tokens.color.accent; // #3b82f6
  let accentPixels = 0;
  let totalPixels = 1;
  const nonNeutralHues = new Set();

  const huePixelCounts = {};
  if (rasterData && rasterData.data && rasterData.width && rasterData.height) {
    totalPixels = rasterData.width * rasterData.height;
    const data = rasterData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 10) continue;

      const hsl = rgbToHsl(r, g, b);
      if (hsl.s > 0.20 && hsl.l > 0.08 && hsl.l < 0.92) {
        // Quantize hue to nearest 30 deg
        const hueBucket = Math.round(hsl.h / 30) * 30;
        huePixelCounts[hueBucket] = (huePixelCounts[hueBucket] || 0) + 1;

        if (deltaE({ r, g, b, a: 1 }, primaryAccent) < 25) {
          accentPixels++;
        }
      }
    }

    // Only count hues that occupy significant visible area (> 150px = ~0.015% of viewport, smaller than 14x14 icon)
    for (const [hue, count] of Object.entries(huePixelCounts)) {
      if (count >= 150) {
        nonNeutralHues.add(Number(hue));
      }
    }
  } else {
    // Fallback: estimate from inventory boxes
    let totalArea = 1280 * 800;
    let paintedArea = 0;
    for (const item of inventory) {
      if (!item.box || item.box.area <= 0) continue;
      if (item.background && deltaE(item.background, primaryAccent) < 20) {
        paintedArea += item.box.area;
      }
    }
    accentPixels = paintedArea;
    totalPixels = totalArea;
  }

  const accentRatio = accentPixels / totalPixels;
  const maxAllowedRatio = law.accentBudget?.maxAccentPixelRatio || 0.04;

  if (accentRatio > maxAllowedRatio) {
    violations.push({
      id: 'DL-02',
      sev: 'P0',
      name: 'Accent pixel budget exceeded',
      selector: 'viewport',
      measured: `${(accentRatio * 100).toFixed(2)}%`,
      expected: `<= ${(maxAllowedRatio * 100).toFixed(2)}% of viewport`
    });
  }

  const maxHues = law.accentBudget?.maxDistinctNonNeutralHues || 2;
  if (nonNeutralHues.size > maxHues) {
    violations.push({
      id: 'DL-02',
      sev: 'P0',
      name: 'Rainbow hues detected (exceeds allowed non-neutral hues)',
      selector: 'viewport',
      measured: `${nonNeutralHues.size} distinct hues on screen`,
      expected: `<= ${maxHues} non-neutral hues`
    });
  }

  return violations;
}
