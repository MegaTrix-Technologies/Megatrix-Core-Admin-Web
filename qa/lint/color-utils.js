/**
 * qa/lint/color-utils.js
 * Color conversion and perceptual distance (DeltaE) utilities
 */

export function parseCssColor(colorStr) {
  if (!colorStr || colorStr === 'transparent') return { r: 0, g: 0, b: 0, a: 0, isTransparent: true };
  
  // Hex
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1, isTransparent: false };
    }
  }

  // rgb / rgba
  const match = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/);
  if (match) {
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    return {
      r: parseFloat(match[1]),
      g: parseFloat(match[2]),
      b: parseFloat(match[3]),
      a,
      isTransparent: a === 0
    };
  }

  return { r: 0, g: 0, b: 0, a: 0, isTransparent: true };
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100) / 100, l: Math.round(l * 100) / 100 };
}

// Convert sRGB to Lab for deltaE calculation
function rgbToLab(r, g, b) {
  let r1 = r / 255, g1 = g / 255, b1 = b / 255;
  r1 = r1 > 0.04045 ? Math.pow((r1 + 0.055) / 1.055, 2.4) : r1 / 12.92;
  g1 = g1 > 0.04045 ? Math.pow((g1 + 0.055) / 1.055, 2.4) : g1 / 12.92;
  b1 = b1 > 0.04045 ? Math.pow((b1 + 0.055) / 1.055, 2.4) : b1 / 12.92;

  let x = (r1 * 0.4124 + g1 * 0.3576 + b1 * 0.1805) / 0.95047;
  let y = (r1 * 0.2126 + g1 * 0.7152 + b1 * 0.0722) / 1.00000;
  let z = (r1 * 0.0193 + g1 * 0.1192 + b1 * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  return [
    (116 * y) - 16,
    500 * (x - y),
    200 * (y - z)
  ];
}

export function deltaE(c1, c2) {
  const p1 = typeof c1 === 'string' ? parseCssColor(c1) : c1;
  const p2 = typeof c2 === 'string' ? parseCssColor(c2) : c2;
  if (p1.isTransparent && p2.isTransparent) return 0;
  if (p1.isTransparent !== p2.isTransparent) return 100;

  const lab1 = rgbToLab(p1.r, p1.g, p1.b);
  const lab2 = rgbToLab(p2.r, p2.g, p2.b);

  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );
}

export function matchesTokenPalette(cssColorStr, tokens) {
  const parsed = parseCssColor(cssColorStr);
  if (parsed.isTransparent) return true;

  // Build list of valid color hexes from tokens
  const tokenHexes = [
    tokens.color.bg,
    tokens.color.surface,
    tokens.color.panel,
    tokens.color.border,
    tokens.color['border-hi'],
    tokens.color.text,
    tokens.color['text-mid'],
    tokens.color['text-low'],
    tokens.color.accent,
    tokens.color['cta-bg'],
    tokens.color['cta-fg'],
    tokens.semantic.positive,
    tokens.semantic.warning,
    tokens.semantic.danger,
    '#ffffff',
    '#000000'
  ];

  for (const hex of tokenHexes) {
    if (deltaE(parsed, hex) < 2.5) {
      return true;
    }
  }
  return false;
}

export function relativeLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrastRatio(c1, c2) {
  const p1 = typeof c1 === 'string' ? parseCssColor(c1) : c1;
  const p2 = typeof c2 === 'string' ? parseCssColor(c2) : c2;
  const l1 = relativeLuminance(p1.r, p1.g, p1.b);
  const l2 = relativeLuminance(p2.r, p2.g, p2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
