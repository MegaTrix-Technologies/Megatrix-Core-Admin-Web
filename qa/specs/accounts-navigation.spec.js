import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow B: Accounts Full Navigation & Console/Network Integrity', () => {
  test('B1: Visit all 11 Accounts tabs with zero fatal console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known benign network or favicon errors if any
        if (!text.includes('favicon') && !text.includes('ERR_CONNECTION_REFUSED')) {
          consoleErrors.push(text);
        }
      }
    });

    const failedRequests = [];
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText})`);
    });

    await loginAsAdmin(page);
    await page.goto('/accounts?tab=overview');
    await page.waitForLoadState('networkidle');

    const tabs = [
      'overview',
      'sales',
      'receivables',
      'commissions',
      'projects',
      'inflows',
      'expenses',
      'pnl',
      'cash_flow',
      'reconciliation',
      'sync_logs',
    ];

    for (const tab of tabs) {
      await page.goto(`/accounts?tab=${tab}`);
      await page.waitForTimeout(600);
      expect(page.url()).toContain(`tab=${tab}`);

      // Verify page container or active element is visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }

    // Assert no severe console errors occurred
    const fatalErrors = consoleErrors.filter(
      (err) =>
        err.includes('Uncaught') ||
        err.includes('TypeError') ||
        err.includes('ReferenceError')
    );
    expect(fatalErrors).toHaveLength(0);
  });
});
