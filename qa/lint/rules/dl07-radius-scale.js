export function checkDL07(inventory, law, tokens) {
  const violations = [];
  const allowedRadii = tokens.radius || [0, 6, 10, 14, 9999];

  for (const item of inventory) {
    if (!item.borderRadius || item.box.area <= 0) continue;

    // Extract pixel radius value
    const match = item.borderRadius.match(/([\d.]+)px/);
    if (match) {
      const r = Math.round(parseFloat(match[1]));
      if (r === 9999 || item.borderRadius.includes('50%')) {
        const isDot = item.box.w <= 10 && item.box.h <= 10;
        const isAvatar = item.selector.includes('avatar') || item.selector.includes('profile');
        if (!isDot && !isAvatar && item.box.w > 24) {
          violations.push({
            id: 'DL-07',
            sev: 'P2',
            name: 'Pill radius on non-dot element',
            selector: item.selector,
            box: item.box,
            measured: `border-radius: ${item.borderRadius} on ${item.box.w}x${item.box.h}px element`,
            expected: 'Radius 9999px only on elements <= 10px or avatars'
          });
        }
      } else if (r > 0 && !allowedRadii.includes(r)) {
        violations.push({
          id: 'DL-07',
          sev: 'P2',
          name: 'Off-scale border radius',
          selector: item.selector,
          box: item.box,
          measured: `${r}px`,
          expected: `One of [${allowedRadii.join(', ')}]px`
        });
      }
    }
  }

  return violations;
}
