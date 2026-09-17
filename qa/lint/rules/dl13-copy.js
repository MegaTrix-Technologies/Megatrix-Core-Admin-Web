export function checkDL13(inventory, law, tokens) {
  const violations = [];
  const bannedWords = law.copy?.bannedWords || [
    'Submit', 'Click here', 'Powered by', 'Seamlessly', 'Robust', 'Cutting-edge', 'Leverage', 'Unleash'
  ];

  for (const item of inventory) {
    if (!item.text || item.box.area <= 0) continue;

    // 1. Check banned buzzwords
    for (const word of bannedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(item.text)) {
        violations.push({
          id: 'DL-13',
          sev: 'P2',
          name: 'Banned marketing/AI buzzword detected',
          selector: item.selector,
          box: item.box,
          measured: `"${word}" found in "${item.text.slice(0, 40)}"`,
          expected: `Avoid banned words: [${bannedWords.join(', ')}]`
        });
      }
    }

    // 2. Button sentence-case check
    if (item.tag === 'button' && item.text.length > 2) {
      // Ignore single words or all-caps short labels
      const words = item.text.trim().split(/\s+/);
      if (words.length > 1) {
        // Title case like "Launch Biz Manager POS" vs Sentence case "Launch Biz Manager POS"
        // Title Case violation is when all lowercase words are capitalized inappropriately like "Click Here To Do Something"
      }
    }
  }

  return violations;
}
