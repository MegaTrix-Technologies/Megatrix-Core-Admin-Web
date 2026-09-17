export function checkDL10(inventory, law, tokens, route = '') {
  const violations = [];

  // Exception for /login
  if (route.includes('/login')) return violations;

  for (const item of inventory) {
    if (!item.box || item.box.area <= 0) continue;

    if (item.backgroundImage && (item.backgroundImage.includes('gradient') || item.backgroundImage.includes('linear-gradient') || item.backgroundImage.includes('radial-gradient'))) {
      violations.push({
        id: 'DL-10',
        sev: 'P1',
        name: 'Illegal background gradient',
        selector: item.selector,
        box: item.box,
        measured: item.backgroundImage.slice(0, 80),
        expected: 'No gradients outside /login'
      });
    }
  }

  return violations;
}
