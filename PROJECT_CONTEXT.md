# MegaTrix Admin Core — Full Project Context & Architecture

> **Repository Path**: `D:\MegaTrix\megatrix-admin`  
> **Package Name**: `megatrix-admin-core`  
> **Version**: `1.0.0`  
> **Platform Standard**: MegaTrix Technologies Unified Multi-SaaS Architecture Standard  

---

## 1. Executive Summary & Vision

**MegaTrix Admin Core** is the central, enterprise-grade administrative command center and governance portal for the entire **MegaTrix SaaS Ecosystem**.

Instead of individual, disconnected administration panels for each SaaS product, MegaTrix Admin Core unifies:
- **Identity & Access Management (IAM)**: Meta Business Manager-style Granular Role-Based Access Control (RBAC).
- **Tenant & User Lifecycle**: Cryptographic invite links, self-onboarding activation, and role assignments.
- **Cross-Platform Governance**: Unified metric telemetry, subscription tier limits, and platform registry.
- **Compliance & Security**: Immutable, tamper-evident audit logging for all mutations.
- **Operational Module Administration**: Direct oversight into connected platforms including **BizManager** (Retail/POS ERP), **SchoolManager** (Campus ERP), and **MailerX** (Transactional Email Engine).

---

## 2. System Architecture & Runtime Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MEGATRIX ADMIN CORE FRONTEND (Vite + React)              │
│  • React 18 SPA              • Tailwind CSS + Dark Mode (mx-*)              │
│  • React Router v6           • Orbitron (Tech Brand) + Plus Jakarta Sans UI  │
│  • Context API (Auth State)  • React-Toastify Notifications                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                        adminApi.js / Unified HTTP Client
                                       │
              ┌────────────────────────┴────────────────────────┐
              ▼                                                 ▼
   [Live Gateway Available]                        [Server Offline / Standalone]
┌──────────────────────────────────────┐       ┌───────────────────────────────┐
│     Express 5 Backend (:5002)        │       │   Autonomous Core Engine      │
│  • Node.js ESM REST API              │       │   (autonomousEngine.js)       │
│  • JWT + bcryptjs Auth               │       │  • localStorage Persistence   │
│  • Granular RBAC Middleware          │       │  • Complete In-Browser DB     │
│  • Nodemailer / MailerX Relay        │       │  • Full RBAC & Audit Mock     │
└──────────────────┬───────────────────┘       └───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│     MongoDB Atlas (megatrix_global)  │
│  • AdminUsers  • Roles               │
│  • Invitations • AuditLogs           │
└──────────────────────────────────────┘
```

### Dual Runtime Capabilities:
1. **Live Gateway Mode**: Communicates directly with the Express backend on port `5002` connected to MongoDB Atlas.
2. **Autonomous Core Mode**: If the backend server is unreachable or deployed in isolated offline environments, the frontend automatically falls back to an integrated client-side storage engine (`autonomousEngine.js`). Admins can test, manage roles, create users, and inspect modules without losing progress.

---

## 3. Directory Structure

```
D:\MegaTrix\megatrix-admin\
├── .env                              # Environment configuration (Mongo URI, JWT Secret, Ports)
├── package.json                      # Dependencies and run scripts
├── index.html                        # HTML entry point, Google Fonts preconnect (Orbitron, Plus Jakarta)
├── tailwind.config.js                # Custom design system tokens, fonts, and keyframes
├── vite.config.js                    # Vite bundling configuration
├── PROJECT_CONTEXT.md                # Full project documentation (this file)
│
├── public/
│   ├── megatrix-icon.svg             # Pixel-art MT monogram icon mark
│   └── icon.svg                      # Browser favicon
│
├── scripts/
│   ├── qa_global_platform.cjs        # Headless Chrome / Puppeteer automated E2E & visual QA
│   ├── qa_global_platform.js         # ESM QA runner
│   ├── test_rbac_production.cjs      # Granular permission verification suite
│   └── screenshots/                  # Output directory for automated visual audits
│
├── server/                           # Node.js + Express REST API Backend
│   ├── index.js                      # App bootstrap, MongoDB Atlas connection, seed roles & admin
│   ├── config/
│   │   └── permissionsRegistry.js    # Universal dictionary of all platform permissions
│   ├── controllers/
│   │   ├── authController.js         # Login, JWT issuing, activation token validation
│   │   ├── userController.js         # User CRUD, role assignments, direct permission overrides
│   │   ├── roleController.js         # Role creation, system role protections, permission editor
│   │   ├── auditController.js        # Audit log streaming, filtering, and export
│   │   └── overviewController.js     # Cross-platform ecosystem KPI aggregation
│   ├── middleware/
│   │   └── auth.js                   # JWT bearer token verification & permission check guards
│   ├── models/
│   │   ├── AdminUser.js              # Admin schema (credentials, assigned roles, permissions)
│   │   ├── Role.js                   # RBAC Role schema (slug, permissions list, platform scopes)
│   │   ├── Invitation.js             # Crypto token invitations with 48-hour expiration
│   │   └── AuditLog.js               # Immutable audit trail schema
│   ├── routes/
│   │   └── api.js                    # Express router mapping routes to controllers
│   └── services/
│       └── mailerxRelay.js           # Transactional invitation email dispatch via SMTP / MailerX
│
└── src/                              # Frontend Source (React 18 + Tailwind CSS)
    ├── main.jsx                      # Application entrypoint
    ├── App.jsx                       # Routing tree, public/protected route guards
    ├── index.css                     # Tailwind directives, custom scrollbars, glow utilities
    │
    ├── config/
    │   └── platforms.js              # Connected SaaS product registry & platform manifests
    │
    ├── context/
    │   └── AdminAuthContext.jsx      # Global authentication provider, session validation
    │
    ├── services/
    │   ├── adminApi.js               # Central Axios client with token injection & error interceptors
    │   └── autonomousEngine.js       # Standalone in-browser fallback engine & state store
    │
    ├── components/
    │   ├── AdminLayout.jsx           # Dashboard shell: responsive sidebar, gateway mode indicator
    │   ├── GranularPermissionBuilder.jsx # Tree-based permission checkbox matrix
    │   ├── MetricCard.jsx            # High-contrast KPI visual card
    │   ├── StatusPill.jsx            # Color-coded badges for status tags
    │   ├── ConfirmationModal.jsx     # Accessible destructive action confirmation dialog
    │   ├── UserDetailModal.jsx       # Inspector for user properties & assigned RBAC privileges
    │   ├── SubscriptionModal.jsx     # SaaS tier configuration modal
    │   └── ParticleNetwork.jsx       # Interactive HTML5 Canvas particle network animation
    │
    └── pages/
        ├── AdminLogin.jsx            # Unified Command Center sign-in screen
        ├── AccountActivation.jsx     # Token-verified account onboarding & password setup
        ├── DashboardOverview.jsx     # High-level ecosystem health, metrics, and audit stream
        ├── UserManagement.jsx        # Admin user directory, invitations, and access toggles
        ├── RolesManagement.jsx       # Meta-style role and permission matrix management
        ├── AuditLogViewer.jsx        # Searchable and exportable security ledger
        ├── SubscriptionManagement.jsx# SaaS subscription plans and tenant limits
        ├── PlatformRegistry.jsx      # Microservice registry & endpoint configuration
        ├── modules/
        │   ├── BizManagerModule.jsx  # Retail POS, inventory, orders, and customer ledger
        │   └── SchoolManagerModule.jsx # Multi-campus student management, fees, and staff payroll
        └── services/
            └── MailerXModule.jsx     # Transactional email queue, SMTP relays, template editor
```

---

## 4. Security & Role-Based Access Control (RBAC)

### Permission Hierarchy Standard
All permissions in MegaTrix use standardized dot-notation syntax:  
`<platform>.<domain>.<action>`

#### Core Permission Scopes:
- **Global Governance (`global.*`)**:
  - `global.users.view`, `global.users.create`, `global.users.invite`, `global.users.edit`, `global.users.delete`
  - `global.roles.view`, `global.roles.create`, `global.roles.edit`, `global.roles.delete`
  - `global.audit.view`, `global.audit.export`
  - `global.subscriptions.manage`
  - `global.platforms.manage`
- **BizManager Scope (`bizmanager.*`)**:
  - `bizmanager.dashboard.view`, `bizmanager.stores.manage`, `bizmanager.inventory.audit`
  - `bizmanager.orders.refund`, `bizmanager.finance.view`
- **SchoolManager Scope (`schoolmanager.*`)**:
  - `schoolmanager.dashboard.view`, `schoolmanager.admissions.approve`
  - `schoolmanager.fees.collect`, `schoolmanager.payroll.manage`
- **MailerX Scope (`mailerx.*`)**:
  - `mailerx.overview.view`, `mailerx.dispatch.trigger`, `mailerx.templates.edit`

### Pre-Seeded System Roles
| Role Slug | Name | Scope | Permissions |
| :--- | :--- | :--- | :--- |
| `superadmin` | Superadmin | Global | `['*']` (Full unrestricted root access) |
| `global_admin` | Global Administrator | Global | All system permissions across all modules |
| `platform_admin`| Platform Administrator | Scoped | All permissions except global role/audit administration |
| `user_manager` | User Manager | Global | User lifecycle management (view, create, invite, edit) |
| `auditor` | Security & Compliance Auditor | Global | Read-only inspection of audit logs, users, and roles |

---

## 5. Connected Ecosystem Platforms

| Platform Key | Display Name | Category | Primary Functionality |
| :--- | :--- | :--- | :--- |
| `bizmanager` | **BizManager** | Enterprise ERP | Retail & wholesale operations: Multi-store inventory, point of sale (POS), customer credit ledger, order dispatching, supplier purchase orders. |
| `schoolmanager`| **SchoolManager** | EdTech ERP | Multi-campus educational ERP: Student profiles, monthly fee voucher reconciliation, attendance, faculty records, payroll. |
| `mailerx` | **MailerX** | Core Infra Service | High-deliverability transactional email dispatcher, outbox queue monitor, bounce telemetry, dynamic HTML template manager. |
| `autoposting` | **AutoPosting MegaTrix**| Marketing Automation| Multi-network social media scheduler and auto-distribution engine. |
| `registry` | **Platform Registry** | System Infrastructure| API connector catalog exposing JWT-standard endpoints for plugging new microservices into the core. |

---

## 6. Authentication & User Onboarding Flow

1. **Invitation Generation**:
   - An administrator with `global.users.invite` triggers an invitation from `/users`.
   - The backend creates an `Invitation` record with an unhashed cryptographic token (SHA-256) valid for 48 hours.
2. **Email Delivery**:
   - `mailerxRelay.js` dispatches an activation link:  
     `http://<host>:5175/activate?token=<cryptographic_token>`
3. **Account Activation**:
   - The user opens the link on `/activate`.
   - The system verifies the token's validity and expiration.
   - The user enters their full name, sets a secure password, and completes onboarding.
   - The backend creates the `AdminUser` profile with assigned roles and marks the invitation as redeemed.
4. **Session Management**:
   - Authentication yields a signed JWT with 7-day expiration containing the user ID and role metadata.
   - The JWT is stored in `localStorage` (`megatrix_admin_token`) and injected into all outgoing Axios requests.

---

## 7. Technology Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.2, Vite 5.1 |
| **Styling & Theme** | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| **Typography** | Orbitron (Futuristic Technology Headings), Plus Jakarta Sans (Body & UI) |
| **Routing** | React Router DOM 6.22 (with route guards) |
| **Icons & UI Extras** | React Icons (Feather Icons `fi`), Canvas Particle Network, React Toastify |
| **Backend Runtime** | Node.js (ESM), Express 5.2 |
| **Database & ODM** | MongoDB Atlas, Mongoose 9.10 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken` 9.0), `bcryptjs` 3.0 |
| **Email Transport** | Nodemailer 10.0 / MailerX Transactional Relay |
| **Automated Testing** | Puppeteer Core (Headless Chrome E2E and visual regression auditing) |

---

## 8. Common Run & Build Commands

All commands should be executed from `D:\MegaTrix\megatrix-admin`:

```powershell
# Install dependencies
npm install

# Start the Frontend Development Server (Port 5175)
npm run dev

# Start the Backend Express Server (Port 5002)
npm run server

# Build for Production
npm run build

# Preview Production Build locally (Port 5175)
npm run preview

# Execute Autonomous E2E QA Verification & Screenshots
node scripts/qa_global_platform.cjs
```
