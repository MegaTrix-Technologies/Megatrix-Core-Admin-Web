export function checkDL05(inventory, law, tokens) {
  const violations = [];
  const allowedSizes = tokens.fontSize || [11, 12, 13, 14, 16, 20, 28, 40, 56];
  const maxSizes = law.typography?.maxDistinctSizesPerViewport || 5;
  const maxWeights = law.typography?.maxDistinctWeightsPerViewport || 3;

  const foundSizes = new Set();
  const foundWeights = new Set();

  for (const item of inventory) {
    if (!item.text || item.box.area <= 0) continue;

    const sz = Math.round(item.fontSize);
    if (sz > 0) {
      foundSizes.add(sz);
      if (!allowedSizes.includes(sz)) {
        violations.push({
          id: 'DL-05',
          sev: 'P1',
          name: 'Off-scale font size',
          selector: item.selector,
          box: item.box,
          measured: `${sz}px ("${item.text.slice(0, 30)}")`,
          expected: `One of [${allowedSizes.join(', ')}]px`
        });
      }
    }

    if (item.fontWeight) {
      foundWeights.add(String(item.fontWeight));
    }
  }

  if (foundSizes.size > maxSizes) {
    violations.push({
      id: 'DL-05',
      sev: 'P1',
      name: 'Too many distinct font sizes',
      selector: 'viewport',
      measured: `${foundSizes.size} distinct sizes (${[...foundSizes].join(', ')})`,
      expected: `<= ${maxSizes} distinct sizes per viewport`
    });
  }

  if (foundWeights.size > maxWeights) {
    violations.push({
      id: 'DL-05',
      sev: 'P1',
      name: 'Too many distinct font weights',
      selector: 'viewport',
      measured: `${foundWeights.size} distinct weights (${[...foundWeights].join(', ')})`,
      expected: `<= ${maxWeights} distinct weights per viewport`
    });
  }

  return violations;
}
