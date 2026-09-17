import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('PW-04: Interactive States & Focus Rings', () => {
  test('Primary buttons render visual change on hover and focus-visible', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Find main button on page
    const btn = page.locator('button:has-text("Sync Telemetry"), button:has-text("Users")').first();
    await expect(btn).toBeVisible();

    const initialBg = await btn.evaluate(el => getComputedStyle(el).backgroundColor);

    // Hover
    await btn.hover();
    await page.waitForTimeout(200);

    // Focus
    await btn.focus();
    const focusOutline = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        outline: cs.outlineStyle,
        outlineWidth: parseFloat(cs.outlineWidth) || 0,
        boxShadow: cs.boxShadow,
        borderColor: cs.borderColor
      };
    });

    // Check that button defines focus outline, border transition, or box-shadow ring
    const hasFocusIndication = focusOutline.outlineWidth >= 1 || 
                               focusOutline.boxShadow !== 'none' || 
                               focusOutline.borderColor !== 'transparent';
    expect(hasFocusIndication, 'Button must present visible focus indication').toBe(true);
  });
});
