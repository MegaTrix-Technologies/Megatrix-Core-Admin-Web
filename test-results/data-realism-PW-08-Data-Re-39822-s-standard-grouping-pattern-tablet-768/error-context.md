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
      - button "Collapse sidebar" [ref=f1e7] [cursor=pointer]
      - link "MegaTrix Core Business Intelligence" [ref=f1e9] [cursor=pointer]:
        - /url: /
        - generic [ref=f1e80]:
          - generic [ref=f1e81]:
            - generic [ref=f1e82]: MEGATRIX
            - generic [ref=f1e83]: CORE
          - generic [ref=f1e84]: BUSINESS INTELLIGENCE
    - button "User Profile and Settings" [ref=f1e87] [cursor=pointer]:
      - generic [ref=f1e88]: M
  - generic [ref=f1e91]:
    - complementary [ref=f1e93]:
      - generic [ref=f1e94]:
        - generic [ref=f1e95]:
          - generic [ref=f1e96]: Core Navigation
          - generic [ref=f1e97]: Enterprise
        - navigation [ref=f1e98]:
          - generic [ref=f1e99]:
            - generic [ref=f1e100]: Platform
            - link "Dashboard" [ref=f1e101] [cursor=pointer]:
              - /url: /dashboard
            - generic [ref=f1e109]:
              - button "Toggle Projects group" [expanded] [ref=f1e110] [cursor=pointer]:
                - generic [ref=f1e111]: Projects
              - generic [ref=f1e117]:
                - link "School Hub" [ref=f1e118] [cursor=pointer]:
                  - /url: /projects/school-hub
                - link "Biz Manager" [ref=f1e124] [cursor=pointer]:
                  - /url: /projects/biz-manager
            - link "User Management" [ref=f1e131] [cursor=pointer]:
              - /url: /users
          - generic [ref=f1e139]:
            - generic [ref=f1e140]: System and Governance
            - link "Profile" [ref=f1e141] [cursor=pointer]:
              - /url: /settings?tab=profile
            - link "Security and Audit" [ref=f1e147] [cursor=pointer]:
              - /url: /settings?tab=security
            - link "Admin Users" [ref=f1e154] [cursor=pointer]:
              - /url: /settings?tab=admins
      - generic [ref=f1e159]:
        - generic [ref=f1e160]: Core Online
        - generic [ref=f1e163]: v1.0
    - main [ref=f1e164]:
      - generic [ref=f1e166]:
        - generic [ref=f1e168]:
          - generic [ref=f1e169]:
            - paragraph [ref=f1e170]: Biz Manager Retail ERP
            - heading "Retail and Point of Sale Command Desk" [level=1] [ref=f1e171]
            - paragraph [ref=f1e172]: Unified multi-tenant control plane for retail stores, grocery billing, merchant onboarding, subscription licensing, and real-time security audit trails.
          - generic [ref=f1e173]:
            - button "Sync telemetry data" [ref=f1e174] [cursor=pointer]:
              - generic [ref=f1e180]: Sync Telemetry
            - link "Launch Biz Manager POS system" [ref=f1e181] [cursor=pointer]:
              - /url: https://bizmanager.megatrixai.com
              - generic [ref=f1e187]: Launch Biz Manager POS
        - generic [ref=f1e192]:
          - generic [ref=f1e193]:
            - generic [ref=f1e194]: Total Active Users
            - generic [ref=f1e202]: "2"
            - generic [ref=f1e204]:
              - generic [ref=f1e205]: Active merchant stores (3 of 4)
              - generic [ref=f1e206]: 3 online
          - generic [ref=f1e207]:
            - generic [ref=f1e208]: Active Subscriptions
            - generic [ref=f1e214]: "2"
            - generic [ref=f1e216]:
              - generic [ref=f1e217]: Paid recurring & lifetime
              - generic [ref=f1e218]: 100% active
          - generic [ref=f1e219]:
            - generic [ref=f1e220]: Users On Trial
            - generic [ref=f1e226]: "0"
            - generic [ref=f1e228]:
              - generic [ref=f1e229]: Active evaluation access
              - generic [ref=f1e230]: 0 active trials
          - generic [ref=f1e231]:
            - generic [ref=f1e232]: Expired / Inactive
            - generic [ref=f1e237]: "1"
            - generic [ref=f1e239]:
              - generic [ref=f1e240]: Suspended / expired store
              - generic [ref=f1e241]: 1 account actioned
        - generic [ref=f1e242]:
          - button "View user management" [ref=f1e243] [cursor=pointer]:
            - generic [ref=f1e249]: User Management (3)
          - button "View subscription pricing and plans" [ref=f1e250] [cursor=pointer]:
            - generic [ref=f1e254]: Subscription Management
          - button "View administrative password reset" [ref=f1e255] [cursor=pointer]:
            - generic [ref=f1e259]: Reset Password
          - button "View user activity audit trail" [ref=f1e260] [cursor=pointer]:
            - generic [ref=f1e263]: User Activity
          - button "View system cryptographic credentials" [ref=f1e264] [cursor=pointer]:
            - generic [ref=f1e269]: Credentials
        - generic [ref=f1e270]:
          - generic [ref=f1e271]:
            - generic [ref=f1e272]:
              - heading "Registered Retail Merchants & Operators" [level=3] [ref=f1e273]
              - paragraph [ref=f1e280]: Filter active and non-active merchants, inspect performance profiles, and govern account permissions.
            - generic [ref=f1e281]:
              - generic [ref=f1e282]:
                - button "All (3)" [ref=f1e283] [cursor=pointer]
                - button "Active (2)" [ref=f1e284] [cursor=pointer]
                - button "On Trial (1)" [ref=f1e285] [cursor=pointer]
                - button "Non-Active / Restricted (1)" [ref=f1e286] [cursor=pointer]
              - textbox "Search phone, email, or merchant" [ref=f1e291]:
                - /placeholder: Search phone, email, or merchant...
          - table [ref=f1e293]:
            - rowgroup [ref=f1e294]:
              - row [ref=f1e295]:
                - columnheader "Merchant / Operator" [ref=f1e296]
                - columnheader "Business Outlet" [ref=f1e297]
                - columnheader "Role & Terminal" [ref=f1e298]
                - columnheader "Contact Phone & Email" [ref=f1e299]
                - columnheader "Status" [ref=f1e300]
                - columnheader "Actions" [ref=f1e301]
            - rowgroup [ref=f1e302]:
              - row [ref=f1e303] [cursor=pointer]:
                - cell "Abu Sufian 6aa1a451c28840b13feb3559" [ref=f1e304]:
                  - generic [ref=f1e305]:
                    - generic [ref=f1e306]: Abu Sufian
                    - generic [ref=f1e307]: 6aa1a451c28840b13feb3559
                - cell "Shawarma Point" [ref=f1e308]
                - cell "owner Shawarma Point POS" [ref=f1e309]:
                  - generic [ref=f1e310]:
                    - generic [ref=f1e311]: owner
                    - generic [ref=f1e312]: Shawarma Point POS
                - cell "3010915911 ranasuffyan9@gmail.com" [ref=f1e313]:
                  - generic [ref=f1e314]:
                    - generic [ref=f1e315]: "3010915911"
                    - generic [ref=f1e316]: ranasuffyan9@gmail.com
                - cell "Restricted" [ref=f1e317]
                - cell [ref=f1e321]:
                  - generic [ref=f1e322]:
                    - button "Spoof" [ref=f1e323]
                    - button "Unblock" [ref=f1e329]
                    - button "Delete merchant record" [ref=f1e334]
              - row [ref=f1e338] [cursor=pointer]:
                - cell "Demo Shop Owner 6a9adeaed6a8788d8ecfa721" [ref=f1e339]:
                  - generic [ref=f1e340]:
                    - generic [ref=f1e341]: Demo Shop Owner
                    - generic [ref=f1e342]: 6a9adeaed6a8788d8ecfa721
                - cell "Demo Grocery Store" [ref=f1e343]
                - cell "owner Demo Grocery Store POS" [ref=f1e344]:
                  - generic [ref=f1e345]:
                    - generic [ref=f1e346]: owner
                    - generic [ref=f1e347]: Demo Grocery Store POS
                - cell "9876543210 demo@bizzai.com" [ref=f1e348]:
                  - generic [ref=f1e349]:
                    - generic [ref=f1e350]: "9876543210"
                    - generic [ref=f1e351]: demo@bizzai.com
                - cell "Active" [ref=f1e352]
                - cell [ref=f1e356]:
                  - generic [ref=f1e357]:
                    - button "Spoof" [ref=f1e358]
                    - button "Block" [ref=f1e364]
                    - button "Delete merchant record" [ref=f1e369]
              - row [ref=f1e373] [cursor=pointer]:
                - cell "HASHIR FAROOQ 6a9ad01d54017a31796d9ff7" [ref=f1e374]:
                  - generic [ref=f1e375]:
                    - generic [ref=f1e376]: HASHIR FAROOQ
                    - generic [ref=f1e377]: 6a9ad01d54017a31796d9ff7
                - cell "electronics" [ref=f1e378]
                - cell "owner electronics POS" [ref=f1e379]:
                  - generic [ref=f1e380]:
                    - generic [ref=f1e381]: owner
                    - generic [ref=f1e382]: electronics POS
                - cell "3081505859 hashirfarooq48@gmail.com" [ref=f1e383]:
                  - generic [ref=f1e384]:
                    - generic [ref=f1e385]: "3081505859"
                    - generic [ref=f1e386]: hashirfarooq48@gmail.com
                - cell "Active" [ref=f1e387]
                - cell [ref=f1e391]:
                  - generic [ref=f1e392]:
                    - button "Spoof" [ref=f1e393]
                    - button "Block" [ref=f1e399]
                    - button "Delete merchant record" [ref=f1e404]
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