import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow H: Financial Integrity & Reconciliation Adjustments', () => {
  test('H1: Inspect reconciliation anomalies and record controlled adjustment', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=reconciliation');
    await page.waitForLoadState('networkidle');

    // Verify reconciliation container
    const container = page.locator('[data-testid="reconciliation-container"]');
    await expect(container).toBeVisible({ timeout: 10000 });

    // Open Adjustment Modal
    const recordAdjBtn = page.locator('[data-testid="btn-record-adjustment"]');
    await expect(recordAdjBtn).toBeVisible();
    await recordAdjBtn.click();

    // Verify modal
    const modal = page.locator('[data-testid="adjustment-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const adjTitle = `Banking Variance Offset ${Date.now()}`;
    await page.locator('[data-testid="input-adjustment-title"]').fill(adjTitle);
    await page.locator('[data-testid="input-adjustment-amount"]').fill('12500');
    await page.locator('[data-testid="input-adjustment-reason"]').fill('Reconciliation balancing offset verified by QA automation');

    // Submit
    await page.locator('[data-testid="btn-save-adjustment"]').click();

    // Modal closes
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // Verify adjustment recorded in adjustments table
    const adjTable = page.locator('[data-testid="adjustments-table"]');
    await expect(adjTable).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${adjTitle}`).first()).toBeVisible();
  });
});
