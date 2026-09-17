export function checkDL12(inventory, law, tokens) {
  const violations = [];
  const maxCaps = law.exceptions?.maxAllCapsEyebrows || 4;
  let capsCount = 0;
  let arrowCount = 0;

  // Middle-dot regex: • (\u2022), · (\u00B7), ● (\u25CF)
  const middleDotRegex = /[•·●]/;

  for (const item of inventory) {
    if (!item.text || item.box.area <= 0) continue;

    // 1. Middle-dot check (banned outright in UI strings)
    if (middleDotRegex.test(item.text) && !item.selector.includes('password')) {
      violations.push({
        id: 'DL-12',
        sev: 'P2',
        name: 'Middle-dot meta string detected (Banned AI pattern)',
        selector: item.selector,
        box: item.box,
        measured: `"${item.text.slice(0, 50)}"`,
        expected: 'Zero middle-dot meta strings (use structured layouts)'
      });
    }

    // 2. All-caps micro-label count
    const isAllCaps = item.text.length > 3 && item.text === item.text.toUpperCase() && !item.text.match(/^[\d\s\W]+$/);
    if (isAllCaps && item.fontSize <= 12) {
      capsCount++;
    }

    // 3. Trailing arrow on CTA
    if (item.hasHandler && (item.text.includes('→') || item.text.includes('->'))) {
      arrowCount++;
    }
  }

  if (capsCount > maxCaps) {
    violations.push({
      id: 'DL-12',
      sev: 'P2',
      name: 'Too many ALL-CAPS micro-labels',
      selector: 'viewport',
      measured: `${capsCount} all-caps labels`,
      expected: `<= ${maxCaps} per viewport`
    });
  }

  if (arrowCount > 1) {
    violations.push({
      id: 'DL-12',
      sev: 'P2',
      name: 'Excessive trailing arrows on CTAs',
      selector: 'viewport',
      measured: `${arrowCount} arrows on interactive elements`,
      expected: '<= 1 per viewport'
    });
  }

  // 4. Card-kit monotony: no more than 6 sibling elements sharing identical border-radius + border + padding + background
  const signatureGroups = new Map();
  for (const item of inventory) {
    if (['td', 'tr', 'th', 'table', 'tbody', 'thead'].includes(item.tag)) continue;
    const hasBorder = item.border && !item.border.startsWith('0px') && item.border.includes('solid');
    const hasBg = item.background && item.background !== 'rgba(0, 0, 0, 0)' && item.background !== 'transparent';
    if (item.box.area > 2000 && item.box.w > 100 && item.box.h > 60 && (hasBorder || hasBg)) {
      const sig = `${item.borderRadius}|${item.border}|${(item.padding || []).join(',')}|${item.background}`;
      const list = signatureGroups.get(sig) || [];
      list.push(item);
      signatureGroups.set(sig, list);
    }
  }

  for (const [sig, items] of signatureGroups.entries()) {
    if (items.length > 6) {
      violations.push({
        id: 'DL-12',
        sev: 'P2',
        name: 'Card-kit monotony: identical style signature run > 6',
        selector: items[0].selector,
        box: items[0].box,
        measured: `${items.length} elements with signature [${sig}]`,
        expected: '<= 6 identical cards without hierarchy'
      });
    }
  }

  return violations;
}
