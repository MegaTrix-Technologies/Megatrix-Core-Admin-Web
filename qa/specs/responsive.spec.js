import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('PW-01: Responsive Layout Integrity', () => {
  test('No horizontal scroll overflow on target pages', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Check horizontal scroll
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(overflow, 'Page has horizontal overflow causing unintended scrolling').toBe(false);
  });

  test('Main content container is visible and not clipped', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const box = await heading.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(100);
  });
});
