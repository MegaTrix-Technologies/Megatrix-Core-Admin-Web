import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow G: Multi-Format Reports Export Workflow', () => {
  test('G1: Export Excel and PDF Dossiers successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/accounts?tab=overview');
    await page.waitForLoadState('networkidle');

    // Click Export Reports dropdown
    const exportBtn = page.locator('button:has-text("Export Reports")');
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
    await exportBtn.click();

    // Verify dropdown menu opens
    const excelBtn = page.locator('button:has-text("Export Multi-Tab Excel")');
    const pdfBtn = page.locator('button:has-text("Export Executive PDF")');
    await expect(excelBtn).toBeVisible({ timeout: 5000 });
    await expect(pdfBtn).toBeVisible({ timeout: 5000 });

    // Test Excel Download Trigger
    const [downloadExcel] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      excelBtn.click(),
    ]);
    const excelName = downloadExcel.suggestedFilename();
    expect(excelName).toContain('.xlsx');

    // Re-open dropdown for PDF
    await exportBtn.click();
    const [downloadPdf] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      pdfBtn.click(),
    ]);
    const pdfName = downloadPdf.suggestedFilename();
    expect(pdfName).toContain('.pdf');
  });
});
