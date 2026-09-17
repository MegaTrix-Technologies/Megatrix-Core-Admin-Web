import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './qa/specs',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['./qa/reporters/mx-progress-reporter.js'],
    ['html', { open: 'never', outputFolder: 'qa/reports/playwright-html' }],
    ['json', { outputFile: 'qa/reports/e2e-report.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5175',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop-1280',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile-390',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
    {
      name: 'tablet-768',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'ultrawide-1920',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
