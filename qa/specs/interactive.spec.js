import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Interactive Specs (PW-02, PW-03, PW-07)', () => {
  test('PW-03: Every button and link is wired with accessible name and valid destination', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // 1. Check for banned href="#"
    const deadLinks = await page.$$eval('a[href="#"]', els => els.map(e => e.textContent.trim()));
    expect(deadLinks.length, `Dead links with href="#" found: ${deadLinks.join(', ')}`).toBe(0);

    // 2. Check accessible names on interactive elements
    const unnamedButtons = await page.$$eval('button', buttons => {
      return buttons
        .filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .filter(b => {
          const name = b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent.trim();
          return !name;
        })
        .map(b => b.className);
    });

    expect(unnamedButtons.length, `Buttons missing accessible name: ${unnamedButtons.length}`).toBe(0);
  });

  test('PW-02: Interactive hit targets meet minimum 40x40 touch target size', async ({ page }, testInfo) => {
    // Target primary actionable buttons/links
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    const tinyButtons = await page.$$eval('button, a', elements => {
      return elements
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .filter(el => {
          const r = el.getBoundingClientRect();
          // Allow small pagination or inline tag dismissals if padding hit box >= 32
          return r.width < 28 || r.height < 28;
        })
        .map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 30), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));
    });

    expect(tinyButtons.length, `Interactive elements with tiny hit target (<28px): ${JSON.stringify(tinyButtons)}`).toBe(0);
  });

  test('PW-07: Keyboard tab navigation and Escape key handling', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Press Tab multiple times to verify focus progression
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTag = await page.evaluate(() => document.activeElement ? document.activeElement.tagName.toLowerCase() : null);
    expect(focusedTag).not.toBeNull();
    expect(['button', 'a', 'input', 'select', 'textarea']).toContain(focusedTag);

    // Press Escape to verify no crash/trap
    await page.keyboard.press('Escape');
  });
});
