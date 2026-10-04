import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow E: Commissions Calculation & Attribution Tracking', () => {
  test('E1: Inspect agent commissions and rate adherence', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=commissions');
    await page.waitForLoadState('networkidle');

    // Check Scorecards
    await expect(page.locator('text=Total Commission Liability')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Active Commissionable Agents')).toBeVisible();

    // Verify container
    const container = page.locator('[data-testid="commissions-container"]');
    await expect(container).toBeVisible();

    // If agent rows exist, expand the first one
    const agentRow = page.locator('[data-testid="agent-summary-row"]').first();
    if (await agentRow.count() > 0) {
      await agentRow.click();
      await page.waitForTimeout(500);

      // Verify rate info
      await expect(page.locator('text=Lead:').first()).toBeVisible();
      await expect(page.locator('text=Closer:').first()).toBeVisible();
      await expect(page.locator('text=Dev:').first()).toBeVisible();

      // Check if View Deal button opens sale detail
      const viewDealBtn = page.locator('[data-testid="btn-view-deal"]').first();
      if (await viewDealBtn.count() > 0) {
        await viewDealBtn.click();
        const detailModal = page.locator('[data-testid="sale-detail-modal"]');
        await expect(detailModal).toBeVisible({ timeout: 5000 });
        await page.locator('[data-testid="btn-close-sale-detail"]').click();
        await expect(detailModal).not.toBeVisible();
      }
    }
  });
});
