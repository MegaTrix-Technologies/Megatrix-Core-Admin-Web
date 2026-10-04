import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginAsAdmin } from './auth-helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const SHOTS_DIR = path.join(ROOT_DIR, 'qa/baselines/shots/accounts');

test.describe('Visual Suite: Accounts Manager Screenshot Checkpoints', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SHOTS_DIR)) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
    }
  });

  test('V1: Capture baseline screenshots for all 11 tabs and major modals', async ({ page }) => {
    await loginAsAdmin(page);

    const tabs = [
      { id: 'overview', file: 'accounts-overview.png' },
      { id: 'sales', file: 'sales-ledger.png' },
      { id: 'receivables', file: 'receivables.png' },
      { id: 'commissions', file: 'commissions.png' },
      { id: 'projects', file: 'projects.png' },
      { id: 'inflows', file: 'inflows.png' },
      { id: 'expenses', file: 'expenses.png' },
      { id: 'pnl', file: 'pnl.png' },
      { id: 'cash_flow', file: 'cash-flow.png' },
      { id: 'reconciliation', file: 'reconciliation.png' },
      { id: 'sync_logs', file: 'sync-logs.png' },
    ];

    for (const tab of tabs) {
      await page.goto(`/accounts?tab=${tab.id}`);
      await page.waitForTimeout(800);
      const outPath = path.join(SHOTS_DIR, tab.file);
      await page.screenshot({ path: outPath, fullPage: true });
      expect(fs.existsSync(outPath)).toBe(true);
    }

    // Modal screenshot: Add Sale Modal
    await page.goto('/accounts?tab=sales');
    await page.waitForTimeout(600);
    const addBtn = page.locator('[data-testid="btn-open-add-sale"]').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      const addModalPath = path.join(SHOTS_DIR, 'sales-add-modal.png');
      await page.screenshot({ path: addModalPath });
      expect(fs.existsSync(addModalPath)).toBe(true);

      // Close modal
      await page.locator('[data-testid="btn-close-add-sale"]').click();
      await page.waitForTimeout(300);
    }

    // Modal screenshot: Sale Detail & Payment Form
    const dossierBtn = page.locator('[data-testid="btn-sale-dossier"]').first();
    if (await dossierBtn.isVisible()) {
      await dossierBtn.click();
      await page.waitForTimeout(600);
      const detailPath = path.join(SHOTS_DIR, 'sale-detail.png');
      await page.screenshot({ path: detailPath });
      expect(fs.existsSync(detailPath)).toBe(true);

      // Open payment drawer
      const paymentDrawerBtn = page.locator('[data-testid="btn-toggle-payment-drawer"]');
      if (await paymentDrawerBtn.isVisible()) {
        await paymentDrawerBtn.click();
        await page.waitForTimeout(400);
        const paymentPath = path.join(SHOTS_DIR, 'sale-payment.png');
        await page.screenshot({ path: paymentPath });
        expect(fs.existsSync(paymentPath)).toBe(true);
      }

      await page.locator('[data-testid="btn-close-sale-detail"]').click();
    }
  });
});
