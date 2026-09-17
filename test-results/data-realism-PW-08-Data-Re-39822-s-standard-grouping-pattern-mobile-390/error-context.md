# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-realism.spec.js >> PW-08: Data Realism & Edge Cases >> PKR currency formatting matches standard grouping pattern
- Location: qa\specs\data-realism.spec.js:5:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=f1e4]:
  - banner [ref=f1e5]:
    - generic [ref=f1e6]:
      - button "Toggle navigation menu" [ref=f1e7] [cursor=pointer]
      - link "MegaTrix Core Business Intelligence" [ref=f1e8] [cursor=pointer]:
        - /url: /
        - generic [ref=f1e79]:
          - generic [ref=f1e80]:
            - generic [ref=f1e81]: MEGATRIX
            - generic [ref=f1e82]: CORE
          - generic [ref=f1e83]: BUSINESS INTELLIGENCE
    - button "User Profile and Settings" [ref=f1e86] [cursor=pointer]:
      - generic [ref=f1e87]: M
  - main [ref=f1e91]:
    - generic [ref=f1e93]:
      - generic [ref=f1e95]:
        - generic [ref=f1e96]:
          - paragraph [ref=f1e97]: Biz Manager Retail ERP
          - heading "Retail and Point of Sale Command Desk" [level=1] [ref=f1e98]
          - paragraph [ref=f1e99]: Unified multi-tenant control plane for retail stores, grocery billing, merchant onboarding, subscription licensing, and real-time security audit trails.
        - generic [ref=f1e100]:
          - button "Sync telemetry data" [ref=f1e101] [cursor=pointer]:
            - generic [ref=f1e107]: Sync Telemetry
          - link "Launch Biz Manager POS system" [ref=f1e108] [cursor=pointer]:
            - /url: https://bizmanager.megatrixai.com
            - generic [ref=f1e114]: Launch Biz Manager POS
      - generic [ref=f1e119]:
        - generic [ref=f1e120]:
          - generic [ref=f1e121]: Total Active Users
          - generic [ref=f1e129]: "2"
          - generic [ref=f1e131]:
            - generic [ref=f1e132]: Active merchant stores (3 of 4)
            - generic [ref=f1e133]: 3 online
        - generic [ref=f1e134]:
          - generic [ref=f1e135]: Active Subscriptions
          - generic [ref=f1e141]: "2"
          - generic [ref=f1e143]:
            - generic [ref=f1e144]: Paid recurring & lifetime
            - generic [ref=f1e145]: 100% active
        - generic [ref=f1e146]:
          - generic [ref=f1e147]: Users On Trial
          - generic [ref=f1e153]: "0"
          - generic [ref=f1e155]:
            - generic [ref=f1e156]: Active evaluation access
            - generic [ref=f1e157]: 0 active trials
        - generic [ref=f1e158]:
          - generic [ref=f1e159]: Expired / Inactive
          - generic [ref=f1e164]: "1"
          - generic [ref=f1e166]:
            - generic [ref=f1e167]: Suspended / expired store
            - generic [ref=f1e168]: 1 account actioned
      - generic [ref=f1e169]:
        - button "View user management" [ref=f1e170] [cursor=pointer]:
          - generic [ref=f1e176]: User Management (3)
        - button "View subscription pricing and plans" [ref=f1e177] [cursor=pointer]:
          - generic [ref=f1e181]: Subscription Management
        - button "View administrative password reset" [ref=f1e182] [cursor=pointer]:
          - generic [ref=f1e186]: Reset Password
        - button "View user activity audit trail" [ref=f1e187] [cursor=pointer]:
          - generic [ref=f1e190]: User Activity
        - button "View system cryptographic credentials" [ref=f1e191] [cursor=pointer]:
          - generic [ref=f1e196]: Credentials
      - generic [ref=f1e197]:
        - generic [ref=f1e198]:
          - generic [ref=f1e199]:
            - heading "Registered Retail Merchants & Operators" [level=3] [ref=f1e200]
            - paragraph [ref=f1e207]: Filter active and non-active merchants, inspect performance profiles, and govern account permissions.
          - generic [ref=f1e208]:
            - generic [ref=f1e209]:
              - button "All (3)" [ref=f1e210] [cursor=pointer]
              - button "Active (2)" [ref=f1e211] [cursor=pointer]
              - button "On Trial (1)" [ref=f1e212] [cursor=pointer]
              - button "Non-Active / Restricted (1)" [ref=f1e213] [cursor=pointer]
            - textbox "Search phone, email, or merchant" [ref=f1e218]:
              - /placeholder: Search phone, email, or merchant...
        - table [ref=f1e220]:
          - rowgroup [ref=f1e221]:
            - row [ref=f1e222]:
              - columnheader "Merchant / Operator" [ref=f1e223]
              - columnheader "Business Outlet" [ref=f1e224]
              - columnheader "Role & Terminal" [ref=f1e225]
              - columnheader "Contact Phone & Email" [ref=f1e226]
              - columnheader "Status" [ref=f1e227]
              - columnheader "Actions" [ref=f1e228]
          - rowgroup [ref=f1e229]:
            - row [ref=f1e230] [cursor=pointer]:
              - cell "Abu Sufian 6aa1a451c28840b13feb3559" [ref=f1e231]:
                - generic [ref=f1e232]:
                  - generic [ref=f1e233]: Abu Sufian
                  - generic [ref=f1e234]: 6aa1a451c28840b13feb3559
              - cell "Shawarma Point" [ref=f1e235]
              - cell "owner Shawarma Point POS" [ref=f1e236]:
                - generic [ref=f1e237]:
                  - generic [ref=f1e238]: owner
                  - generic [ref=f1e239]: Shawarma Point POS
              - cell "3010915911 ranasuffyan9@gmail.com" [ref=f1e240]:
                - generic [ref=f1e241]:
                  - generic [ref=f1e242]: "3010915911"
                  - generic [ref=f1e243]: ranasuffyan9@gmail.com
              - cell "Restricted" [ref=f1e244]
              - cell [ref=f1e248]:
                - generic [ref=f1e249]:
                  - button "Spoof" [ref=f1e250]
                  - button "Unblock" [ref=f1e256]
                  - button "Delete merchant record" [ref=f1e261]
            - row [ref=f1e265] [cursor=pointer]:
              - cell "Demo Shop Owner 6a9adeaed6a8788d8ecfa721" [ref=f1e266]:
                - generic [ref=f1e267]:
                  - generic [ref=f1e268]: Demo Shop Owner
                  - generic [ref=f1e269]: 6a9adeaed6a8788d8ecfa721
              - cell "Demo Grocery Store" [ref=f1e270]
              - cell "owner Demo Grocery Store POS" [ref=f1e271]:
                - generic [ref=f1e272]:
                  - generic [ref=f1e273]: owner
                  - generic [ref=f1e274]: Demo Grocery Store POS
              - cell "9876543210 demo@bizzai.com" [ref=f1e275]:
                - generic [ref=f1e276]:
                  - generic [ref=f1e277]: "9876543210"
                  - generic [ref=f1e278]: demo@bizzai.com
              - cell "Active" [ref=f1e279]
              - cell [ref=f1e283]:
                - generic [ref=f1e284]:
                  - button "Spoof" [ref=f1e285]
                  - button "Block" [ref=f1e291]
                  - button "Delete merchant record" [ref=f1e296]
            - row [ref=f1e300] [cursor=pointer]:
              - cell "HASHIR FAROOQ 6a9ad01d54017a31796d9ff7" [ref=f1e301]:
                - generic [ref=f1e302]:
                  - generic [ref=f1e303]: HASHIR FAROOQ
                  - generic [ref=f1e304]: 6a9ad01d54017a31796d9ff7
              - cell "electronics" [ref=f1e305]
              - cell "owner electronics POS" [ref=f1e306]:
                - generic [ref=f1e307]:
                  - generic [ref=f1e308]: owner
                  - generic [ref=f1e309]: electronics POS
              - cell "3081505859 hashirfarooq48@gmail.com" [ref=f1e310]:
                - generic [ref=f1e311]:
                  - generic [ref=f1e312]: "3081505859"
                  - generic [ref=f1e313]: hashirfarooq48@gmail.com
              - cell "Active" [ref=f1e314]
              - cell [ref=f1e318]:
                - generic [ref=f1e319]:
                  - button "Spoof" [ref=f1e320]
                  - button "Block" [ref=f1e326]
                  - button "Delete merchant record" [ref=f1e331]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginAsAdmin } from './auth-helper.js';
  3  | 
  4  | test.describe('PW-08: Data Realism & Edge Cases', () => {
  5  |   test('PKR currency formatting matches standard grouping pattern', async ({ page }) => {
  6  |     await loginAsAdmin(page);
  7  |     await page.goto('/platforms/bizmanager');
  8  |     await page.waitForLoadState('networkidle');
  9  | 
  10 |     // Find elements containing PKR
  11 |     const pkrTexts = await page.$$eval('*', els => {
  12 |       return els
  13 |         .map(e => e.textContent?.trim() || '')
  14 |         .filter(t => t.includes('PKR') && t.length < 30);
  15 |     });
  16 | 
> 17 |     expect(pkrTexts.length).toBeGreaterThan(0);
     |                             ^ Error: expect(received).toBeGreaterThan(expected)
  18 |     // Verify grouping like PKR 342,850 or PKR 184,200
  19 |     const hasProperGrouping = pkrTexts.some(t => /PKR\s+[\d,]+/.test(t));
  20 |     expect(hasProperGrouping, 'PKR numbers must use standard thousands comma grouping').toBe(true);
  21 |   });
  22 | 
  23 |   test('Page handles long user names without container breakdown', async ({ page }) => {
  24 |     await loginAsAdmin(page);
  25 |     await page.goto('/platforms/bizmanager');
  26 |     await page.waitForLoadState('networkidle');
  27 | 
  28 |     // Check table / list cells
  29 |     const cells = await page.$$eval('td, .user-row', els => {
  30 |       return els.map(el => {
  31 |         const r = el.getBoundingClientRect();
  32 |         return { w: r.width, h: r.height };
  33 |       });
  34 |     });
  35 | 
  36 |     // Verify layout bounds
  37 |     for (const c of cells) {
  38 |       expect(c.w).toBeGreaterThan(0);
  39 |     }
  40 |   });
  41 | });
  42 | 
```