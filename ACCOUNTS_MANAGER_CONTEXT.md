# MegaTrix Core Admin — Accounts & Financial Command Center
## Comprehensive System Context, Architecture, UI/UX & Backend Specification

---

## 1. Executive Overview & Architectural Evolution

### 1.1 Purpose & Mission
The **MegaTrix Core Accounts & Financial Command Center** is an enterprise-grade, dual-basis corporate treasury and accounting system built natively into the **MegaTrix Core Admin Portal** (`megatrix-admin`). It provides total financial governance, unit economics, receivables aging, commission liabilities, expense management, and automated discrepancy reconciliation for all business divisions.

### 1.2 Evolution: From Fragile External CRM Coupling to 100% Standalone Native
- **Legacy Architecture**: Originally, the admin portal attempted to synchronize financial records across HTTP/LAN from an external CRM (`leadhunter`). This created severe network vulnerabilities in production (timeouts, DNS failures, 502/504 errors on serverless Vercel runtimes, and read-only locks on external records).
- **Current Standalone Architecture**:
  1. **Decoupled**: All dependencies on external LeadHunter API gateways and services have been dismantled.
  2. **Native Persistence**: Financial data (Sales, Inflows, Expenses, Projects, Adjustments, Commissions, Snapshots, and Audit Logs) resides directly in the primary `megatrix_global` MongoDB Atlas database.
  3. **Unrestricted Modification**: All historical and CRM-migrated expenses are now native `CoreExpense` records. Any administrator with permissions can edit (<kbd>✎</kbd>) or delete (<kbd>🗑</kbd>) any transaction without "CRM Managed" locks or third-party badges.
  4. **Autonomous Fallback**: If the backend database is unreachable during extreme network anomalies, the frontend utilizes an integrated browser-side autonomous cache engine (`autonomousEngine.js`) so the command center never crashes into an unhandled blank screen.

### 1.3 Pakistan Localization (PKR)
The accounting engine is calibrated for the Pakistani corporate and fintech ecosystem:
- **Primary Currency**: **PKR** (Pakistani Rupee).
- **Number Formatting**: Formatted via a centralized `fmtPKR` utility (e.g., `PKR 35,000`, `-PKR 24,830`, `Rs 1,400`).
- **Authentic Payment Rails**: Replaced US rails (`Direct ACH`, `PayPal`, `Bank Wire Transfer`) with native Pakistani rails:
  1. `Bank Transfer (IBFT / Raast)` *(Default)*
  2. `JazzCash`
  3. `EasyPaisa`
  4. `SadaPay`
  5. `NayaPay`
  6. `Cash`
  7. `Cheque / Pay Order`
  8. `Debit / Credit Card`

### 1.4 Backblaze B2 Cloud Media Integration
- Integrated an S3-compatible cloud storage bucket (`megatrix-core-admin`) powered by **Backblaze B2**.
- Uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.
- Supports **Presigned Direct Uploads** (browser uploads directly to B2, bypassing Vercel's 4.5 MB serverless payload limits) for receipt images, IBFT payment screenshots, bank deposit slips, contracts, and avatars.

---

## 2. Complete File & Directory Map

```
C:\MegaTrix\megatrix-admin\
├── .env                                              # Environment configuration (Mongo, JWT, B2 credentials)
├── package.json                                      # Dependencies (@aws-sdk/client-s3, exceljs, pdfkit, etc.)
│
├── server\
│   ├── config\
│   │   └── permissionsRegistry.js                    # RBAC permissions definitions
│   │
│   ├── controllers\
│   │   ├── accountsController.js                     # 19 Account actions (Overview, P&L, Ledger, Excel, PDF, etc.)
│   │   └── mediaController.js                        # Backblaze B2 media upload/presign/delete endpoints
│   │
│   ├── middleware\
│   │   └── auth.js                                   # verifyAdminToken & requirePermission RBAC guards
│   │
│   ├── models\
│   │   ├── AccountSale.js                            # Sales contracts, terms, installments, commissions
│   │   ├── AccountInflow.js                          # Cash received, installment tracking, payment rails
│   │   ├── CoreExpense.js                            # Direct operational expenses, recurrence, categories
│   │   ├── AccountProject.js                         # Project unit economics & delivery financials
│   │   ├── AccountAdjustment.js                      # Controlled administrative adjustments & audit trail
│   │   ├── AccountCommission.js                      # Commission liabilities & agent records
│   │   ├── AccountSnapshot.js                        # Immutable periodic financial summary snapshots
│   │   ├── AccountSyncLog.js                         # Ledger calculation & refresh audit trail
│   │   ├── AuditLog.js                               # Global financial & administrative audit logs
│   │   └── AdminUser.js                              # Platform user profiles, sales reps, dev roles
│   │
│   ├── routes\
│   │   ├── api.js                                    # Primary API route mounter (/accounts, /media, etc.)
│   │   ├── accountsRoutes.js                         # All accounts routes with permission middleware
│   │   └── mediaRoutes.js                            # Backblaze B2 routes (/media/presign, /upload-base64, etc.)
│   │
│   ├── services\
│   │   ├── accounts\
│   │   │   ├── standaloneAccountsService.js          # Native data aggregation & commission engine
│   │   │   ├── financialCalculationService.js        # Dual-basis accounting, P&L, Aging & Reconciliation
│   │   │   └── accountExportService.js               # ExcelJS multi-tab generator & PDFKit dossier engine
│   │   └── media\
│   │       └── b2StorageService.js                   # Backblaze B2 S3 client with path-style access
│   │
│   └── scripts\
│       ├── migrate-expenses-to-core.js               # One-time database migration of CRM expenses to Core
│       ├── test-b2-connection.js                     # B2 S3 connectivity test
│       └── test-b2-endpoints.js                      # Full media REST endpoint test
│
└── src\
    ├── config\
    │   └── currency.js                               # Centralized PKR currency formatting & payment methods
    │
    ├── components\
    │   └── common\
    │       ├── DarkDateRangePicker.jsx               # Dark-mode preset & custom range calendar selector
    │       └── DarkDatePicker.jsx                    # Single date picker for modals
    │
    ├── services\
    │   ├── adminApi.js                               # Axios client & accountsApi / mediaApi SDK
    │   └── autonomousEngine.js                       # Autonomous offline caching & mock data generator
    │
    └── pages\
        └── accounts\
            ├── AccountsCommandCenter.jsx             # Master Viewport, header controls, tab routing
            │
            ├── tabs\
            │   ├── AccountsOverviewTab.jsx           # High-level KPIs, dual-basis cards, quick actions
            │   ├── SalesLedgerTab.jsx                # Complete contract revenue ledger & deal value
            │   ├── ReceivablesAgingTab.jsx           # Aging buckets (0-30, 31-60, 61-90, 90+ days)
            │   ├── CommissionsTab.jsx                # Agent leaderboard & commission liability tracking
            │   ├── ProjectFinancialsTab.jsx          # Project unit economics & delivery profit margins
            │   ├── InflowsLedgerTab.jsx              # Chronological cash receipts & installment proofs
            │   ├── ExpensesLedgerTab.jsx             # Operational expense management (Add/Edit/Delete)
            │   ├── ProfitLossTab.jsx                 # Dual P&L statement (Cash Realized vs Accrual Booked)
            │   ├── CashFlowTab.jsx                   # Direct cash flow statement & net cash position
            │   ├── ReconciliationTab.jsx             # Discrepancy audits & administrative adjustments
            │   └── SyncLogsTab.jsx                   # Snapshot generation history & duration telemetry
            │
            └── modals\
                ├── ExpenseModal.jsx                  # Add / Edit operating expense modal
                ├── AdjustmentModal.jsx               # Post administrative adjustment modal
                └── SaleDetailModal.jsx               # Full contract dossier & installment ledger drawer
```

---

## 3. UI/UX Architecture & Layout Specifications

### 3.1 Design Tokens & Theming
The UI adheres strictly to the MegaTrix Obsidian Dark theme:
- **Panels & Surfaces**: `bg-mx-panel` (`#111827` / `#0B0F19`), `bg-mx-surface` (`#1F2937` / `#161E2E`).
- **Borders & Dividers**: `border-mx-border` (`#374151` / `rgba(255,255,255,0.08)`).
- **Brand Accent**: `text-mx-blue` / `bg-mx-blue` (`#2563EB` / `#3B82F6`).
- **Typography**: Clean sans-serif for titles; high-precision monospace (`font-mono`) for all financial amounts, percentages, transaction IDs, dates, and badges.
- **Micro-Interactions**: Smooth hover fades (`hover:bg-mx-surface/60 transition-colors`), spring modals (`animate-fadeIn`), spin loaders on sync/refresh.

### 3.2 Master Command Center (`AccountsCommandCenter.jsx`)
The command center acts as the single orchestrator for the entire accounts section.

#### Header Controls:
1. **Title & Mode Indicator**:
   - `Global Financial Command Center`
   - Header Badges:
     - `STANDALONE CORE NATIVE`: Confirms native database architecture.
     - `PKR (Rs)`: Confirms Pakistani localization.
2. **Date Range Filter (`DarkDateRangePicker`)**:
   - Presets: `All Time`, `This Month`, `Last Month`, `This Quarter`, `This Year`, `Last 30 Days`, `Last 90 Days`, `Custom`.
   - Propagates `startDate` and `endDate` ISO strings to every active tab.
3. **Basis View Selector**:
   - **Dual Basis** (Default): Compares cash flows side-by-side with accrual revenues.
   - **Cash Basis**: Focuses exclusively on realized cash in hand.
   - **Accrual**: Focuses on contracted revenues and earned liabilities.
4. **Refresh Ledger Button**:
   - Icon: `<RefreshCw size={13} />`.
   - Triggers `accountsApi.triggerSync()`, executing a live recalculation across all native records and saving an immutable snapshot in `AccountSnapshot`.
5. **Export Dropdown**:
   - **Download Excel Dossier (.xlsx)**: Triggers `accountsApi.exportExcel()`, streaming an 8-tab workbook.
   - **Executive PDF Summary (.pdf)**: Triggers `accountsApi.exportPdf()`, streaming an executive presentation dossier.

---

### 3.3 The 11 Command Center Tabs

#### Tab 1: Accounts Overview (`AccountsOverviewTab.jsx`)
- **Key Metrics Grid**:
  - `Realized Net Cash Flow`: Total cash inflow minus cash expenses and commission costs.
  - `Accrued Projected Profit`: Booked contract sales minus total operating expenses and total commission liability.
  - `Realized Sales Inflows`: Cash actually received to date.
  - `Outstanding Receivables`: Contracted sales amount remaining unpaid.
- **Profitability Gauges**:
  - Realized Cash Margin % vs Accrued Contract Margin %.
- **Dual Basis Breakdown Cards**:
  - Compares Cash Inflows vs Booked Sales, Expenses vs Commitments.
- **Quick Action Bar**:
  - Record New Core Expense.
  - Post Controlled Financial Adjustment.
  - Jump directly to Receivables Aging or P&L.

#### Tab 2: Sales Ledger (`SalesLedgerTab.jsx`)
- **Filters**: Search by deal number, client business name, or closer name; filter by deal status (`contract_signed`, `partial_payment`, `payment_completed`, `defaulted`).
- **Data Columns**:
  - `Sale ID`: Monospace hex/number badge.
  - `Customer / Business`: Name & company.
  - `Status`: Colored badge (Emerald for Completed, Amber for Partial/Pending).
  - `Deal Value`: Total contract value in PKR.
  - `Inflow Paid`: Amount realized to date.
  - `Remaining`: Balance due.
  - `Closer / Setter`: Assigned team members.
  - `Est. Comm`: Commission liability for this deal.
  - `Date`: Date closed.
  - `Actions`: Clickable eye button (<kbd>👁</kbd>) opening the comprehensive [SaleDetailModal.jsx](file:///C:/MegaTrix/megatrix-admin/src/pages/accounts/modals/SaleDetailModal.jsx).

#### Tab 3: Receivables Aging (`ReceivablesAgingTab.jsx`)
- Categorizes overdue client balances into standard accounting aging buckets based on contract close date:
  1. **Current (0–30 Days)**: Low risk.
  2. **Delinquent (31–60 Days)**: Moderate risk.
  3. **Critical (61–90 Days)**: High collection priority.
  4. **Severely Overdue (90+ Days)**: Bad-debt risk / default alert.
- Summary cards display total outstanding rupees and invoice count per aging bucket.
- Datagrid highlights the debtor's business name, contact telephone, total contract, paid amount, days overdue, and assigned closer.

#### Tab 4: Commissions & Liabilities (`CommissionsTab.jsx`)
- **Summary**:
  - `Total Commission Liability`: Total earned by all agents.
  - `Pending Payouts`: Unsettled liability awaiting disbursement.
  - `Active Earning Agents`: Total sales setters, closers, and developers.
- **Agent Leaderboard**:
  - Agent Name & Email.
  - Assigned Roles (`Lead Generator`, `Sales Closer`, `Developer`).
  - Total Deals Closed & Total Direct Earnings (PKR).
  - Referral Earnings (PKR).
  - Itemized Deal Breakdown: Expanding an agent card reveals every deal, commission rate applied (e.g. 10%, 15%, 20%), and payment realization status.

#### Tab 5: Project Unit Economics (`ProjectFinancialsTab.jsx`)
- Measures gross margin and delivery costs per project.
- Data tracked per project:
  - Contract Value vs Realized Cash Inflows.
  - Allocated Direct Operating Expenses.
  - Net Project Margin (PKR and %).
  - Status (`in_progress`, `delivered`, `maintenance`).

#### Tab 6: Inflows Ledger (`InflowsLedgerTab.jsx`)
- Chronological timeline of all cash receipts entering the company.
- Supports 3 Inflow Types:
  1. `sale_payment`: Installment on an existing client contract.
  2. `other_income`: Ad revenue, consultancy, affiliate income.
  3. `investment`: Capital injections, shareholder loans.
- Displays Payment Method (`Bank Transfer (IBFT / Raast)`, `JazzCash`, etc.), Reference Number / IBFT Transaction ID, and payer identity.

#### Tab 7: Expenses Ledger (`ExpensesLedgerTab.jsx`)
- **Summary Cards**:
  - `Total Operating OpEx`: Sum of all company expenses.
  - `Software & Cloud Tools`: Hosting, OpenAI API, AWS, domain purchases.
  - `Operations & Marketing`: Campaign ad spend, compliance, overheads.
- **Search & Filtering**: Real-time keyword filter, category dropdown, dark date range filter.
- **Actions**:
  - <kbd>+ Add Core Expense</kbd>: Launches `ExpenseModal.jsx`.
  - <kbd>✎ Edit</kbd>: Opens `ExpenseModal.jsx` prefilled with existing data for immediate updating.
  - <kbd>🗑 Delete</kbd>: Confirms and deletes the expense record permanently from the database.
- **Origin Badge**: Clean `MEGATRIX CORE` badge (all CRM restrictions eliminated).

#### Tab 8: Profit & Loss Statement (`ProfitLossTab.jsx`)
- Dual columnar presentation contrasting:
  - **Cash Basis (Realized Flows)**: Realized Sales + Other Income − Realized Expenses − Commission Costs = **Realized Net Profit**.
  - **Accrual Basis (Contracted)**: Total Booked Sales + Other Income − Total Operating Expenses − Commission Liability = **Accrued Net Profit**.
- Computes Operating Profit Margin % and Break-Even delta.

#### Tab 9: Direct Cash Flow (`CashFlowTab.jsx`)
- Direct method cash flow analysis:
  - Operating Cash Inflows (Realized).
  - Operating Cash Outflows (Disbursed).
  - Financing & Capital Inflows.
  - Net Cash Flow Position.

#### Tab 10: Reconciliation & Discrepancies (`ReconciliationTab.jsx`)
- Automated audit engine that detects:
  1. Negative remaining amounts (`remainingAmount < 0`).
  2. Inflow payments exceeding contract value (`totalInflow > totalAmount`).
  3. Orphan inflows without matching contracts.
  4. Calculation mismatches between sub-ledgers.
- Lists all Controlled Administrative Adjustments posted by authorized admins.
- Features <kbd>+ Record Adjustment</kbd> button triggering `AdjustmentModal.jsx`.

#### Tab 11: Sync & Snapshot Logs (`SyncLogsTab.jsx`)
- Provides transparency into the ledger recalculation engine:
  - Last Snapshot Timestamp & Duration in milliseconds.
  - Engine Mode: `Standalone Core Native`.
  - Audit Trail of historical recalculation runs, records processed, and triggering administrator.

---

### 3.4 Operational Modals

#### 1. Expense Modal (`ExpenseModal.jsx`)
- **Modes**: Create New Expense or Edit Existing Expense.
- **Fields**:
  - `Title / Description *`: Text input.
  - `Category *`: Dropdown (`Software, AI & SaaS Tools`, `Payroll & Core Compensation`, `Marketing & Ad Spend`, `Office & Infrastructure`, `Contractors & Freelancers`, `Legal & Compliance`, `Travel & Client Relations`, `General Overhead & Miscellaneous`).
  - `Amount (PKR) *`: Positive integer input with step=1.
  - `Date *`: Using `DarkDatePicker`.
  - `Payment Method`: Dropdown populated with `PAKISTAN_PAYMENT_METHODS` (default: `Bank Transfer (IBFT / Raast)`).
  - `Vendor`: Text input (e.g. `Namecheap`, `SECP`, `Meta Ads`).
  - `Reference / Invoice #`: Text input.
  - `Recurring Checkbox`: Toggle recurring status (`daily`, `weekly`, `monthly`, `quarterly`, `yearly`).
- Submits to `POST /api/accounts/expenses/core` or `PUT /api/accounts/expenses/core/:id`.

#### 2. Adjustment Modal (`AdjustmentModal.jsx`)
- Posts an audited correction to the financial ledger.
- **Fields**:
  - `Adjustment Title *`
  - `Type *`: `write_off`, `credit_adjustment`, `debit_adjustment`, `commission_override`, `manual_correction`.
  - `Amount (PKR) *`: Numeric adjustment amount.
  - `Impact Category`: `cash_flow`, `sales_revenue`, `commission_liability`, `operating_expense`.
  - `Reason / Audit Justification *`: Mandatory explanation required for accounting integrity.
- Submits to `POST /api/accounts/adjustments`.

#### 3. Sale Detail Dossier (`SaleDetailModal.jsx`)
- Comprehensive deal dossier drawer displaying:
  - Contract Overview (Value, Advance Paid, Remaining, Status).
  - Sales Team Attribution (Closer, Lead Setter, Assigned Developers).
  - Deliverables & Scope list (Products, quantity, rate, total in PKR).
  - Linked Installments: Lists all payments realized against this specific contract with dates, payment rails, and reference IDs.

---

## 4. Backend Architecture, Endpoints & RBAC Security

### 4.1 Authentication & Permissions
All routes are guarded by `verifyAdminToken` and granular RBAC permissions via `requirePermission`:

| Resource | Route | Method | Required Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Overview** | `/api/accounts/overview` | `GET` | `global:accounts:overview:view` | Returns complete dual-basis financial metrics, aging, and summaries |
| **Sales** | `/api/accounts/sales` | `GET` | `global:accounts:sales:view` | Lists sales contracts with pagination and search |
| **Sales** | `/api/accounts/sales` | `POST` | `global:accounts:sales:view` | Creates a new native sales contract |
| **Sales** | `/api/accounts/sales/:id` | `GET` | `global:accounts:sales:view` | Returns sale contract dossier and linked payments |
| **Sales** | `/api/accounts/sales/:id` | `PUT` | `global:accounts:sales:view` | Updates a sales contract |
| **Sales Payments** | `/api/accounts/sales/:id/payments`| `POST` | `global:accounts:sales:view` | Records installment payment against sale |
| **Projects** | `/api/accounts/projects` | `GET` | `global:accounts:projects:view` | Returns project unit economics and delivery margins |
| **Commissions**| `/api/accounts/commissions` | `GET` | `global:accounts:commissions:view` | Computes agent commission leaderboards & liabilities |
| **Receivables**| `/api/accounts/receivables` | `GET` | `global:accounts:receivables:view` | Computes 0-30, 31-60, 61-90, 90+ days aging buckets |
| **Inflows** | `/api/accounts/inflows` | `GET` | `global:accounts:inflows:view` | Chronological list of cash receipts |
| **Inflows** | `/api/accounts/inflows` | `POST` | `global:accounts:inflows:view` | Records an inflow |
| **Inflows** | `/api/accounts/inflows/:id` | `DELETE`| `global:accounts:inflows:view` | Deletes an inflow |
| **Expenses** | `/api/accounts/expenses` | `GET` | `global:accounts:expenses:view` | Returns filtered operational expenses list |
| **Core Expense**| `/api/accounts/expenses/core` | `POST` | `global:accounts:expenses:create` | Creates a new Core expense in PKR |
| **Core Expense**| `/api/accounts/expenses/core/:id`| `PUT` | `global:accounts:expenses:edit` | Updates existing Core expense |
| **Core Expense**| `/api/accounts/expenses/core/:id`| `DELETE`| `global:accounts:expenses:delete` | Deletes Core expense permanently |
| **P&L** | `/api/accounts/pnl` | `GET` | `global:accounts:pnl:view` | Dual-basis Profit & Loss statement |
| **Cash Flow** | `/api/accounts/cash-flow` | `GET` | `global:accounts:cash_flow:view` | Direct cash flow statement |
| **Reconcile** | `/api/accounts/reconciliation` | `GET` | `global:accounts:reconciliation:view` | Runs anomaly & discrepancy integrity audit |
| **Adjustments**| `/api/accounts/adjustments` | `GET` | `global:accounts:reconciliation:view` | Lists historical adjustments |
| **Adjustments**| `/api/accounts/adjustments` | `POST` | `global:accounts:reconciliation:adjust`| Records an administrative financial adjustment |
| **Refresh** | `/api/accounts/sync` | `POST` | `global:accounts:sync:execute` | Recalculates ledgers and creates immutable snapshot |
| **Sync Logs** | `/api/accounts/sync/logs` | `GET` | `global:accounts:sync:view` | Audit history of recalculation runs |
| **Export Excel**| `/api/accounts/export/excel` | `GET` | `global:accounts:reports:export` | Streams multi-sheet .xlsx workbook |
| **Export PDF** | `/api/accounts/export/pdf` | `GET` | `global:accounts:reports:export` | Streams executive .pdf financial dossier |
| **Media Presign**| `/api/media/presign` | `POST` | *Admin Auth* | Generates S3 presigned PUT URL for Backblaze B2 |
| **Media Upload**| `/api/media/upload-base64` | `POST` | *Admin Auth* | Direct base64 receipt/media upload to B2 |
| **Media List** | `/api/media/list` | `GET` | *Admin Auth* | Lists assets stored in B2 bucket |
| **Media Delete**| `/api/media` | `DELETE` | *Admin Auth* | Deletes an asset from Backblaze B2 |

---

### 4.2 Audit Logging (`logFinancialAudit`)
Every state-mutating operation (`createCoreExpense`, `updateCoreExpense`, `deleteCoreExpense`, `createAdjustment`, `triggerSync`, `exportExcel`, `exportPdf`) writes an immutable entry to `AuditLog`:
- **Actor**: `id`, `name`, `email`, `role`.
- **Action**: Event name (e.g. `EXPENSE_CREATED`, `EXPENSE_DELETED`, `ADJUSTMENT_POSTED`).
- **Target**: Type and target ID.
- **Details**: Payload diff, monetary values, timestamps.
- **Client Metadata**: IP address and User-Agent.

---

## 5. Database Models & Schema Specifications

### 5.1 `CoreExpense` (`server/models/CoreExpense.js`)
Stores all operational costs, overheads, software licenses, and contractor fees:
```javascript
{
  title: { type: String, required: true, trim: true },
  reason: { type: String, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'software_saas', 'payroll', 'marketing_ads', 'office_infra',
      'contractor', 'legal_compliance', 'travel_client', 'miscellaneous'
    ],
    default: 'software_saas',
    index: true
  },
  amount: { type: Number, required: true, min: 0, index: true },
  currency: { type: String, default: 'PKR' },
  expenseDate: { type: Date, required: true, default: Date.now, index: true },
  date: { type: Date, index: true },
  paymentMethod: { type: String, default: 'Bank Transfer (IBFT / Raast)' },
  vendor: { type: String, default: '', trim: true },
  referenceNumber: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  status: { type: String, enum: ['pending', 'approved', 'paid', 'rejected'], default: 'approved', index: true },
  isRecurring: { type: Boolean, default: false, index: true },
  recurringInterval: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one_time'], default: 'monthly' },
  tags: { type: [String], default: [] },
  sourcePlatform: { type: String, default: 'core', index: true },
  createdBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    name: { type: String, default: 'Admin' },
    email: { type: String }
  }
}
```

### 5.2 `AccountSale` (`server/models/AccountSale.js`)
Stores customer contracts, scope of work, and commission splits:
- `saleNumber`: Unique contract reference (e.g. `SALE-1024`).
- `customer`: Subdocument containing `businessName`, `contactPerson`, `email`, `phone`.
- `totalAmount`: Contract value in PKR.
- `advanceAmount`: Upfront inflow realized.
- `remainingAmount`: Due balance (`totalAmount - advanceAmount`).
- `status`: `contract_signed`, `partial_payment`, `payment_completed`, `defaulted`.
- `products`: Array of items with `name`, `quantity`, `price`, `total`.
- `leadGeneratedBy`: Team member who prospected the client.
- `closedBy`: Closer who finalized the deal.
- `assignedDevelopers`: Array of developers executing the project.
- `commissionRates`: Configurable percentages (`leadGenPercent: 10`, `closerPercent: 15`, `developerPercent: 20`).
- `closedAt`: Date contract was executed.

### 5.3 `AccountInflow` (`server/models/AccountInflow.js`)
Tracks all cash receipts entering company accounts:
- `amount`: Cash received in PKR.
- `currency`: Default `'PKR'`.
- `date`: Transaction realization date.
- `source`: `sale_payment`, `other_income`, `investment`.
- `saleId`: Reference to `AccountSale` (if linked).
- `paymentMethod`: e.g. `Bank Transfer (IBFT / Raast)`, `JazzCash`, `EasyPaisa`.
- `referenceNumber`: Bank transaction / RRN / IBFT ID.
- `notes`: Description or payer name.

### 5.4 `AccountAdjustment` (`server/models/AccountAdjustment.js`)
Maintains an immutable paper trail for ledger corrections:
- `title`: Short description.
- `adjustmentType`: `write_off`, `credit_adjustment`, `debit_adjustment`, `commission_override`, `manual_correction`.
- `amount`: Adjustment value.
- `reason`: Justification for audit compliance.
- `impactCategory`: `cash_flow`, `sales_revenue`, `commission_liability`, `operating_expense`.
- `effectiveDate`: Accounting period date.
- `status`: `applied`.
- `approvedBy`: Admin user who authorized the adjustment.

### 5.5 `AccountSnapshot` (`server/models/AccountSnapshot.js`)
Captures point-in-time financial summaries on every recalculation:
- `syncId`: Unique execution identifier.
- `metrics`: Frozen JSON of Dual-Basis Summary (Realized profit, Accrued profit, Margins, OpEx).
- `recordCounts`: Count of sales, inflows, expenses, and projects at snapshot time.
- `createdAt`: Snapshot creation timestamp.

---

## 6. Financial Calculation Engine & Mathematical Logic

The business formulas are encapsulated in `server/services/accounts/financialCalculationService.js`:

### 6.1 Dual-Basis Accounting Logic
$$\text{Realized Sales Inflows} = \sum \text{Inflows where source} = \text{'sale\_payment'}$$
$$\text{Realized Net Profit (Cash Basis)} = \text{Operating Inflows} - \text{Total Operating OpEx} - \text{Paid Commissions}$$
$$\text{Realized Profit Margin} = \left(\frac{\text{Realized Net Profit}}{\text{Operating Inflows}}\right) \times 100$$

$$\text{Booked Sales Revenue} = \sum \text{AccountSale.totalAmount}$$
$$\text{Accrued Projected Profit} = \text{Booked Sales} + \text{Other Income} - \text{Total Operating OpEx} - \text{Total Commission Liability}$$
$$\text{Projected Profit Margin} = \left(\frac{\text{Accrued Projected Profit}}{\text{Total Booked Revenue}}\right) \times 100$$

### 6.2 Receivables Aging Calculation
For every unpaid sale ($\text{remainingAmount} > 0$):
$$\text{Days Overdue} = \left\lfloor \frac{\text{Current Date} - \text{Sale Closed Date}}{86,400,000 \text{ ms}} \right\rfloor$$
- **0 to 30 Days**: Current
- **31 to 60 Days**: 30-Day Delinquent
- **61 to 90 Days**: 60-Day Critical
- **91+ Days**: Severely Overdue / Bad Debt

### 6.3 Commission Attribution Model
- **Lead Generator**: $10\%$ of Deal Total Amount.
- **Sales Closer**: $15\%$ of Deal Total Amount.
- **Assigned Developers**: $20\%$ split equally across assigned developers.
- **Referral Partner**: $5\%$ (if applicable).

---

## 7. Backblaze B2 Storage Architecture

### 7.1 Configuration & S3 Client
Implemented in `server/services/media/b2StorageService.js`:
- Endpoint: `https://s3.eu-central-003.backblazeb2.com`
- Region: `eu-central-003`
- Bucket Name: `megatrix-core-admin`
- `forcePathStyle: true` is **mandatory** for Backblaze B2 S3 compatibility to prevent virtual-host subdomain signature mismatch errors.

### 7.2 Presigned Direct Upload Pipeline
1. **Frontend Request**: Client requests an upload token:
   ```http
   POST /api/media/presign
   {
     "filename": "ibft_receipt_1024.png",
     "contentType": "image/png",
     "prefix": "receipts"
   }
   ```
2. **Backend Generation**: Server generates a time-limited (15-minute) pre-signed PUT URL using `@aws-sdk/s3-request-presigner`.
3. **Direct Browser Upload**: Browser uploads the binary file directly to Backblaze B2 via standard HTTP `PUT`, bypassing Vercel request limits.
4. **Public CDN Link**: The permanent public URL is returned:
   `https://s3.eu-central-003.backblazeb2.com/megatrix-core-admin/receipts/<timestamp>-<hash>.png`

---

## 8. Export Engines (Excel & PDF)

### 8.1 Multi-Tab Excel Workbook (`accountExportService.js`)
Built with `exceljs`. Exports an 8-tab workbook with corporate navy styling (`#1E3A8A` / `#0F172A`), auto-calculated columns, and Pakistani rupee currency formatting (`PKR #,##0`):
1. **Financial Summary**: Dual-basis side-by-side executive ledger.
2. **Sales Ledger**: All client contracts, terms, and collections.
3. **Commissions**: Agent liabilities and itemized earnings.
4. **Receivables Aging**: Overdue invoices grouped into 0-30, 31-60, 61-90, 90+ buckets.
5. **Operating Expenses**: Itemized list of expenses, categories, payment methods, and vendors.
6. **Cash Inflows**: Itemized cash receipts with IBFT reference numbers.
7. **Project Financials**: Project profitability and unit economics.
8. **Discrepancy Audit**: Reconciliation checks and balance verifications.

### 8.2 Executive PDF Dossier (`accountExportService.js`)
Built with `pdfkit`. Generates a vector PDF report featuring:
- MegaTrix corporate headers and metadata.
- Dual-basis P&L table.
- Receivables aging matrix.
- Top earning agent liabilities.
- Itemized operating cost breakdown.

---

## 9. Environment Variables & Production Deployment

### 9.1 Required Environment Variables
Add the following variables to `.env` (locally) and in **Vercel Project Settings > Environment Variables** (production):

```env
# MongoDB Atlas Primary Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.5tchcnc.mongodb.net/megatrix_global?retryWrites=true&w=majority

# Security
JWT_SECRET=megatrix-global-admin-jwt-secret-2026-production

# Backblaze B2 Cloud Media Storage
B2_BUCKET_NAME=megatrix-core-admin
B2_BUCKET_ID=d26ddc1c7eb40a07a814071c
B2_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
B2_REGION=eu-central-003
B2_KEY_ID=0032dcce4a7847c0000000004
B2_APPLICATION_KEY=K003c2VUjv+EQe41e4MyGd4MtYCvKWo
```

### 9.2 Production Build Verification
The frontend compiles cleanly using Vite with zero errors:
```bash
npm run build
# Output: dist/index.html, dist/assets/index.css, dist/assets/index.js
# Build time: ~5 seconds
```

---

## 10. Summary Checklist for Developers & Operators

- [x] **Decoupled**: Zero reliance on external CRM APIs.
- [x] **Native Persistence**: All records live in `megatrix_global` MongoDB.
- [x] **PKR Localized**: Formats currency as `PKR #,##0` across all 11 tabs, 3 modals, and export files.
- [x] **Pakistani Payment Rails**: IBFT/Raast, JazzCash, EasyPaisa, SadaPay, NayaPay.
- [x] **Unrestricted OpEx**: All expenses can be added, edited, or deleted without third-party locks.
- [x] **Cloud Storage**: Backblaze B2 S3 storage ready for receipt and invoice media uploads.
- [x] **Dual-Basis Engine**: Cash basis and accrual basis computed in parallel.
- [x] **Audited**: Every financial mutation is captured in `AuditLog`.
