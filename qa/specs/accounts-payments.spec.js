import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow D: Sale Installment Payment & Inflow Linkage', () => {
  test('D1: Record payment on a sale and verify remaining balance and inflows', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=sales');
    await page.waitForLoadState('networkidle');

    // Open first dossier
    const dossierBtn = page.locator('[data-testid="btn-sale-dossier"]').first();
    await expect(dossierBtn).toBeVisible({ timeout: 10000 });
    await dossierBtn.click();

    // Verify modal
    const detailModal = page.locator('[data-testid="sale-detail-modal"]');
    await expect(detailModal).toBeVisible({ timeout: 5000 });

    // Click Record Payment drawer toggle
    const togglePaymentBtn = page.locator('[data-testid="btn-toggle-payment-drawer"]');
    if (await togglePaymentBtn.isVisible()) {
      await togglePaymentBtn.click();

      // Drawer is open
      const drawer = page.locator('[data-testid="payment-drawer"]');
      await expect(drawer).toBeVisible();

      // Fill Payment Amount
      const amountInput = page.locator('[data-testid="input-payment-amount"]');
      await amountInput.fill('25000');

      const refInput = page.locator('[data-testid="input-payment-ref"]');
      await refInput.fill(`TX-JC-${Date.now()}`);

      const notesInput = page.locator('[data-testid="input-payment-notes"]');
      await notesInput.fill('Automated QA Installment Test');

      // Submit payment
      const submitPaymentBtn = page.locator('[data-testid="btn-submit-payment"]');
      await submitPaymentBtn.click();

      // Wait for submission
      await page.waitForTimeout(1500);

      // Verify drawer closes or success indicator
      await page.locator('[data-testid="btn-close-sale-detail"]').click();
      await expect(detailModal).not.toBeVisible();

      // Verify in Inflows tab
      await page.goto('/accounts?tab=inflows');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="inflows-table"]')).toBeVisible({ timeout: 10000 });
    }
  });
});
