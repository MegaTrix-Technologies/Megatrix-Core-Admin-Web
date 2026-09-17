import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginAsAdmin } from './auth-helper.js';

test.describe('PW-06: Automated Accessibility (axe-core)', () => {
  test('Page must have zero critical accessibility violations', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(
      criticalViolations.length,
      `Critical a11y violations found: ${JSON.stringify(criticalViolations.map(v => ({ id: v.id, impact: v.impact, description: v.description })))}`
    ).toBe(0);
  });
});
