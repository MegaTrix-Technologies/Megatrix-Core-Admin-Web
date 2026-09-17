# MegaTrix Admin Core — Project Context & Architecture

## 1. Overview
**MegaTrix Admin Core** (`megatrix-admin`) is the unified multi-tenant control plane for all MegaTrix SaaS platforms. It governs client onboarding, role-based access control (RBAC), subscription billing tiers, cross-product user management, audit logs, and institutional device/account status.

---

## 2. Connected SaaS Platforms

### 1. School Hub (SMS)
- **Directory**: `../School-manager`
- **Type**: Institutional Multi-Campus School ERP
- **Features**: 3-Copy bank challans, student & teacher registries, timetable clash audits, fee tracking, campus management.
- **Production Endpoints**:
  - API: `https://api-schoolhub.megatrixai.com/api`
  - App: `https://schoolhub.megatrixai.com`

### 2. Biz Manager (BIZ)
- **Directory**: `../bizmanager`
- **Type**: Retail POS & Grocery Billing ERP
- **Features**: Point-of-sale invoicing, barcode scanning, debtor/creditor khata ledgers, multi-terminal device tracking.
- **Production Endpoints**:
  - App / Platform: `https://bizmanager.megatrixai.com` *(Vercel deployment)*

---

## 3. Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Icons, React Router v6.
- **Backend API**: Node.js, Express 5, Mongoose (MongoDB), JWT, Nodemailer.
- **Design Language**: MegaTrix Pure Dark Aesthetic
  - Background: `#000000` / `#0a0a0a`
  - Cards & Panels: `#141414` with `#1e1e1e` borders
  - Primary Accent: `#3b82f6` (`mx-blue`)
  - Typography: `Orbitron` / `Space Grotesk` (Tech headers) + Sans-serif body

---

## 4. Key Components & Layout

- **Header (`src/components/Header.jsx`)**:
  - Animated sidebar toggle (morphs between $\equiv$ stack when closed and $\leftarrow$ arrow when open).
  - Standalone `MT.` pixel logo (`public/megatrix-icon.svg`) with `#3b82f6` blue dot.
  - Hover expansion revealing `MegaTrix Core / Business Intelligence` in tech typography.
  - User profile menu and fast portal switcher.
- **Platform Registry (`src/config/platforms.js`)**:
  - Registry of connected platforms, subscription tiers, API URLs, and capabilities.
- **User & Subscription Services (`src/services/adminApi.js`)**:
  - Axios clients handling cross-platform user fetching, status toggles, plan updates, and audit logging.

---

## 5. Development & Build

```bash
# Start Vite development server (Port 5175)
npm run dev

# Start Node.js Express backend server (Port 5000)
npm run server

# Build production bundle
npm run build
```
