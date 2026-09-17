import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginAsAdmin } from './auth-helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');

test.describe('Visual Suite (PW-05, PW-12)', () => {
  test('PW-12: Capture full-page and section screenshots for evidence', async ({ page }, testInfo) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    const viewportName = testInfo.project.name || 'default';
    const shotsDir = path.join(ROOT_DIR, 'qa/baselines/shots');
    if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

    const shotPath = path.join(shotsDir, `bizmanager-${viewportName}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });

    expect(fs.existsSync(shotPath)).toBe(true);
  });
});
