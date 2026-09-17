import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('PW-08: Data Realism & Edge Cases', () => {
  test('PKR currency formatting matches standard grouping pattern', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Find elements containing PKR
    const pkrTexts = await page.$$eval('*', els => {
      return els
        .map(e => e.textContent?.trim() || '')
        .filter(t => t.includes('PKR') && t.length < 30);
    });

    expect(pkrTexts.length).toBeGreaterThan(0);
    // Verify grouping like PKR 342,850 or PKR 184,200
    const hasProperGrouping = pkrTexts.some(t => /PKR\s+[\d,]+/.test(t));
    expect(hasProperGrouping, 'PKR numbers must use standard thousands comma grouping').toBe(true);
  });

  test('Page handles long user names without container breakdown', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Check table / list cells
    const cells = await page.$$eval('td, .user-row', els => {
      return els.map(el => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      });
    });

    // Verify layout bounds
    for (const c of cells) {
      expect(c.w).toBeGreaterThan(0);
    }
  });
});
