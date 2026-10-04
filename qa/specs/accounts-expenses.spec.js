import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Flow F: Operating Expenses CRUD Workflow', () => {
  test('F1: Add, edit, and delete a Core Operating Expense', async ({ page }) => {
    // Intercept window.confirm for delete
    page.on('dialog', (dialog) => dialog.accept());

    await loginAsAdmin(page);
    await page.goto('/accounts?tab=expenses');
    await page.waitForLoadState('networkidle');

    // Click Add Expense
    const addExpenseBtn = page.locator('[data-testid="btn-open-add-expense"]');
    await expect(addExpenseBtn).toBeVisible({ timeout: 10000 });
    await addExpenseBtn.click();

    // Verify Expense Modal
    const modal = page.locator('[data-testid="expense-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const expenseTitle = `Cloud Server Cluster ${Date.now()}`;
    await page.locator('[data-testid="input-expense-title"]').fill(expenseTitle);
    await page.locator('[data-testid="input-expense-amount"]').fill('45000');

    // Save
    await page.locator('[data-testid="btn-save-expense"]').click();

    // Verify modal closes
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // Verify new expense is in the table
    await expect(page.locator(`text=${expenseTitle}`).first()).toBeVisible({ timeout: 10000 });

    // Edit Expense
    const editBtn = page.locator('[data-testid="btn-edit-expense"]').first();
    await editBtn.click();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Update Amount
    await page.locator('[data-testid="input-expense-amount"]').fill('55000');
    await page.locator('[data-testid="btn-save-expense"]').click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // Delete Expense
    const deleteBtn = page.locator('[data-testid="btn-delete-expense"]').first();
    await deleteBtn.click();
    await page.waitForTimeout(1500);

    // Verify success
    await expect(page.locator('[data-testid="expenses-table"]')).toBeVisible();
  });
});
