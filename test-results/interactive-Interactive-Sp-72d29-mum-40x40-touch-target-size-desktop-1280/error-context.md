# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: interactive.spec.js >> Interactive Specs (PW-02, PW-03, PW-07) >> PW-02: Interactive hit targets meet minimum 40x40 touch target size
- Location: qa\specs\interactive.spec.js:31:3

# Error details

```
Error: Interactive elements with tiny hit target (<28px): [{"tag":"BUTTON","text":"All (3)","w":56,"h":24},{"tag":"BUTTON","text":"Active (2)","w":75,"h":24},{"tag":"BUTTON","text":"On Trial (1)","w":82,"h":24},{"tag":"BUTTON","text":"Non-Active / Restricted (1)","w":168,"h":24}]

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 4
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
  4  | test.describe('Interactive Specs (PW-02, PW-03, PW-07)', () => {
  5  |   test('PW-03: Every button and link is wired with accessible name and valid destination', async ({ page }) => {
  6  |     await loginAsAdmin(page);
  7  |     await page.goto('/platforms/bizmanager');
  8  |     await page.waitForLoadState('networkidle');
  9  | 
  10 |     // 1. Check for banned href="#"
  11 |     const deadLinks = await page.$$eval('a[href="#"]', els => els.map(e => e.textContent.trim()));
  12 |     expect(deadLinks.length, `Dead links with href="#" found: ${deadLinks.join(', ')}`).toBe(0);
  13 | 
  14 |     // 2. Check accessible names on interactive elements
  15 |     const unnamedButtons = await page.$$eval('button', buttons => {
  16 |       return buttons
  17 |         .filter(b => {
  18 |           const r = b.getBoundingClientRect();
  19 |           return r.width > 0 && r.height > 0;
  20 |         })
  21 |         .filter(b => {
  22 |           const name = b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent.trim();
  23 |           return !name;
  24 |         })
  25 |         .map(b => b.className);
  26 |     });
  27 | 
  28 |     expect(unnamedButtons.length, `Buttons missing accessible name: ${unnamedButtons.length}`).toBe(0);
  29 |   });
  30 | 
  31 |   test('PW-02: Interactive hit targets meet minimum 40x40 touch target size', async ({ page }, testInfo) => {
  32 |     // Target primary actionable buttons/links
  33 |     await loginAsAdmin(page);
  34 |     await page.goto('/platforms/bizmanager');
  35 |     await page.waitForLoadState('networkidle');
  36 | 
  37 |     const tinyButtons = await page.$$eval('button, a', elements => {
  38 |       return elements
  39 |         .filter(el => {
  40 |           const r = el.getBoundingClientRect();
  41 |           return r.width > 0 && r.height > 0;
  42 |         })
  43 |         .filter(el => {
  44 |           const r = el.getBoundingClientRect();
  45 |           // Allow small pagination or inline tag dismissals if padding hit box >= 32
  46 |           return r.width < 28 || r.height < 28;
  47 |         })
  48 |         .map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 30), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));
  49 |     });
  50 | 
> 51 |     expect(tinyButtons.length, `Interactive elements with tiny hit target (<28px): ${JSON.stringify(tinyButtons)}`).toBe(0);
     |                                                                                                                     ^ Error: Interactive elements with tiny hit target (<28px): [{"tag":"BUTTON","text":"All (3)","w":56,"h":24},{"tag":"BUTTON","text":"Active (2)","w":75,"h":24},{"tag":"BUTTON","text":"On Trial (1)","w":82,"h":24},{"tag":"BUTTON","text":"Non-Active / Restricted (1)","w":168,"h":24}]
  52 |   });
  53 | 
  54 |   test('PW-07: Keyboard tab navigation and Escape key handling', async ({ page }) => {
  55 |     await loginAsAdmin(page);
  56 |     await page.goto('/platforms/bizmanager');
  57 |     await page.waitForLoadState('networkidle');
  58 | 
  59 |     // Press Tab multiple times to verify focus progression
  60 |     await page.keyboard.press('Tab');
  61 |     await page.keyboard.press('Tab');
  62 | 
  63 |     const focusedTag = await page.evaluate(() => document.activeElement ? document.activeElement.tagName.toLowerCase() : null);
  64 |     expect(focusedTag).not.toBeNull();
  65 |     expect(['button', 'a', 'input', 'select', 'textarea']).toContain(focusedTag);
  66 | 
  67 |     // Press Escape to verify no crash/trap
  68 |     await page.keyboard.press('Escape');
  69 |   });
  70 | });
  71 | 
```