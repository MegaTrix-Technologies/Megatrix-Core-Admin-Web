export function checkDL08(inventory, law, tokens) {
  const violations = [];

  for (const item of inventory) {
    if (!item.box || item.box.area <= 0) continue;

    const spaces = [...(item.padding || []), ...(item.margin || [])];
    for (const s of spaces) {
      if (s > 0 && Math.round(s) % 4 !== 0) {
        violations.push({
          id: 'DL-08',
          sev: 'P3',
          name: 'Off-grid spacing value',
          selector: item.selector,
          box: item.box,
          measured: `${s}px`,
          expected: 'Multiple of 4px'
        });
        break; // one per element
      }
    }
  }

  // Allowed tolerance threshold <= 2
  return violations.length > 2 ? violations : [];
}
