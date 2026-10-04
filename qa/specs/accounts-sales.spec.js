import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow C: Add Sale & Contract Dossier Workflow', () => {
  test('C1: Create a new Core Sales Contract and verify in ledger', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=sales');
    await page.waitForLoadState('networkidle');

    // Click Add Sale
    const addBtn = page.locator('[data-testid="btn-open-add-sale"]').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Verify Modal
    const modal = page.locator('[data-testid="add-sale-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Fill Client Info
    const testBusiness = `Test Corp ${Date.now()}`;
    await page.locator('[data-testid="input-customer-business"]').fill(testBusiness);
    await page.locator('[data-testid="input-customer-name"]').fill('Tariq Mahmood');
    await page.locator('[data-testid="input-customer-phone"]').fill('+92 321 9876543');
    await page.locator('[data-testid="input-customer-email"]').fill('tariq@testcorp.pk');

    // Line Item
    await page.locator('[data-testid="input-item-name-0"]').fill('Custom Software License');
    await page.locator('[data-testid="input-item-qty-0"]').fill('1');
    await page.locator('[data-testid="input-item-price-0"]').fill('400000');

    // Advance
    await page.locator('[data-testid="input-advance-amount"]').fill('150000');

    // Verify calculated contract total & balance in modal summary
    await expect(page.locator('[data-testid="text-total-amount"]')).toContainText('400,000');
    await expect(page.locator('[data-testid="text-remaining-amount"]')).toContainText('250,000');

    // Sales Team Attribution
    await page.locator('[data-testid="input-closer-name"]').fill('Hamza Tariq');
    await page.locator('[data-testid="input-setter-name"]').fill('Usman Ali');

    // Save
    const submitBtn = page.locator('[data-testid="btn-submit-sale"]');
    await submitBtn.click();

    // Verify modal closes and new record is displayed in table
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // Check if new business appears in ledger table
    await expect(page.locator(`text=${testBusiness}`).first()).toBeVisible({ timeout: 10000 });

    // Open Dossier
    const dossierBtn = page.locator('[data-testid="btn-sale-dossier"]').first();
    await dossierBtn.click();

    // Verify Sale Detail Modal opens
    const detailModal = page.locator('[data-testid="sale-detail-modal"]');
    await expect(detailModal).toBeVisible({ timeout: 5000 });

    // Close dossier
    await page.locator('[data-testid="btn-close-sale-detail"]').click();
    await expect(detailModal).not.toBeVisible({ timeout: 5000 });
  });
});
