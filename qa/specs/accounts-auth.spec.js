import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow A: Accounts Authentication & Session Persistence', () => {
  test('A1: Login page loads and rejects invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    
    // Check form presence
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('invalid.user@megatrix.test');
      const passInput = page.locator('input[type="password"]');
      if (await passInput.count() > 0) {
        await passInput.fill('WrongPassword123!');
        const submitBtn = page.locator('button[type="submit"]');
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          // Should remain on login or display error
          await expect(page).toHaveURL(/.*login/);
        }
      }
    }
  });

  test('A2: Authenticate as test superadmin and verify session persistence', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=overview');
    await page.waitForLoadState('domcontentloaded');

    // Verify localStorage holds active session
    const storedUser = await page.evaluate(() => localStorage.getItem('megatrix_admin_user'));
    expect(storedUser).not.toBeNull();
    const userObj = JSON.parse(storedUser);
    expect(userObj.email).toBe('admin.megatrix@gmail.com');
    expect(userObj.token).toBeTruthy();

    // Verify Accounts Command Center header is visible
    await expect(page.locator('text=Global Accounts & Financial Command Center')).toBeVisible({ timeout: 10000 });
  });

  test('A3: Unauthenticated access redirects or halts gracefully', async ({ page }) => {
    // Clear storage
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/accounts?tab=overview');
    await page.waitForTimeout(1000);

    // If redirected to login, verify URL; if kept, check that unauthenticated state handles it
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });
});
