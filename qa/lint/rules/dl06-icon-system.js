export function checkDL06(inventory, law, tokens) {
  const violations = [];
  const allowedSizes = [14, 16, 18, 20];
  const emojiRegex = /\p{Extended_Pictographic}/u;

  for (const item of inventory) {
    // 1. Emoji check in rendered text
    if (item.text && emojiRegex.test(item.text)) {
      violations.push({
        id: 'DL-06',
        sev: 'P0',
        name: 'Emoji detected in UI text',
        selector: item.selector,
        box: item.box,
        measured: item.text,
        expected: 'Zero emoji codepoints in rendered text'
      });
    }

    // 2. Raster icon check
    if (item.tag === 'img' && item.box.w <= 32 && item.box.h <= 32 && !item.selector.includes('avatar')) {
      violations.push({
        id: 'DL-06',
        sev: 'P1',
        name: 'Raster <img> icon detected',
        selector: item.selector,
        box: item.box,
        measured: `<img src="${item.text}">`,
        expected: 'lucide-react vector SVG only'
      });
    }

    // 3. SVG icon library & attributes check
    if (item.tag === 'svg') {
      // Check dimensions
      const maxDim = Math.max(item.box.w, item.box.h);
      if (maxDim > 0 && maxDim <= 32 && !allowedSizes.includes(maxDim) && !item.selector.includes('logo')) {
        violations.push({
          id: 'DL-06',
          sev: 'P1',
          name: 'Icon size off-system',
          selector: item.selector,
          box: item.box,
          measured: `${maxDim}px`,
          expected: 'Size in {14, 16, 18, 20}'
        });
      }

      // Check stroke-width
      if (item.strokeWidth && item.strokeWidth !== '1.5' && item.strokeWidth !== 1.5 && !item.selector.includes('logo')) {
        violations.push({
          id: 'DL-06',
          sev: 'P1',
          name: 'Inconsistent icon stroke-width',
          selector: item.selector,
          box: item.box,
          measured: `stroke-width="${item.strokeWidth}"`,
          expected: 'stroke-width="1.5"'
        });
      }
    }
  }

  return violations;
}
