import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-helper.js';

test.describe('Motion & Stability Specs (PW-09, PW-10, PW-11)', () => {
  test('PW-09: Motion budget enforces transition durations <= 400ms', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    const slowTransitions = await page.$$eval('*', elements => {
      const slow = [];
      for (const el of elements) {
        const cs = getComputedStyle(el);
        const dur = parseFloat(cs.transitionDuration) || 0;
        if (dur > 0.4 && !cs.animationName?.includes('spin') && !cs.animationName?.includes('pulse')) {
          slow.push({ tag: el.tagName, duration: dur });
        }
      }
      return slow;
    });

    expect(slowTransitions.length, `Elements with transitions > 400ms: ${slowTransitions.length}`).toBe(0);
  });

  test('PW-10: Layout stability CLS is within threshold < 0.05', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/platforms/bizmanager');
    await page.waitForLoadState('networkidle');

    // Cumulative layout shift check
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 1000);
      });
    });

    expect(cls).toBeLessThan(0.05);
  });
});
