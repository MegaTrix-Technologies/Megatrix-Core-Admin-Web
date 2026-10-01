# MegaTrix Admin Core — Backend Structure & Architecture Context

## 1. Executive Summary & Core Role

**MegaTrix Admin Core** (`megatrix-admin`) is the central multi-tenant command-and-control plane for the entire MegaTrix enterprise software ecosystem. It provides unified orchestration across distinct SaaS platforms (including **School Hub**, **Biz Manager**, and **MailerX Relay**), governing:

1. **Enterprise Identity & Multi-Level RBAC**: Cryptographically enforced role-based access control with granular permission matrix and automatic escalation prevention.
2. **Global & Product User Lifecycle**: Centralized user provisioning, authentic transactional email invitations (via MailerX), instant account suspension/deactivation, and profile management.
3. **AES-256-GCM Secure Credential Vault**: Project-isolated encryption for critical API keys, database connection strings, JWT signing secrets, and third-party tokens with explicit reveal auditing.
4. **Proxy Governance & Dual-Tier SaaS Connectors**: Direct management of external platforms (School Hub campus directory, institutional block/reactivate, email-less password resets, cross-school activity streams) with seamless direct-database failovers.
5. **Account Impersonation & Spoof Engine**: Cryptographically signed SSO handoffs enabling superadmins to inspect downstream merchant terminals or school portals in read/write debug mode without possessing user passwords.
6. **Immutable Security Audit Trail**: Append-only tamper-proof audit logging of every administrative action, permission check, login attempt, credential reveal, and system event.

```
                                  ┌──────────────────────────────────────────────┐
                                  │         MEGATRIX ADMIN BACKEND CORE          │
                                  │            (Node.js / Express 5)             │
                                  └──────────────────────┬───────────────────────┘
                                                         │
         ┌───────────────────────────────┬───────────────┴───────────────┬───────────────────────────────┐
         ▼                               ▼                               ▼                               ▼
  ┌──────────────┐                ┌──────────────┐                ┌──────────────┐                ┌──────────────┐
  │  RBAC Engine │                │ Crypto Vault │                │ Proxy & SSO  │                │ Immutable    │
  │ & Token Auth │                │ (AES-256-GCM)│                │ Relay Service│                │ Audit Trail  │
  └──────┬───────┘                └──────┬───────┘                └──────┬───────┘                └──────┬───────┘
         │                               │                               │                               │
         ▼                               ▼                               ▼                               ▼
  [ Admin Users ]                 [ Encrypted    ]                [ School Hub   ]                [ Append-Only  ]
  [ System Roles]                 [ Credentials  ]                [ Biz Manager  ]                [ Activity Log ]
  [ Invitations ]                 [ Master Key   ]                [ MailerX SMTP ]                [ Security Warn]
```

---

## 2. Tech Stack & Server Architecture

- **Runtime & Framework**: Node.js (ES Modules syntax), Express.js (v5), Mongoose ODM.
- **Database**: MongoDB Atlas Cluster (Shared cluster hosting both `megatrix_admin` control plane and linked `school_management` / `biz_retail_db` datasets).
- **Cryptography & Security**:
  - Node.js native `crypto` module for `aes-256-gcm` authenticated encryption with 96-bit IVs and 128-bit authentication tags.
  - `bcryptjs` for salted password hashing (work factor 10).
  - `jsonwebtoken` (JWT) for stateless bearer tokens (7-day admin sessions, 30-minute spoof tokens).
  - SHA-256 hashing for invitation tokens and user-agent fingerprints.
- **Communications Relay**: `nodemailer` connecting to Brevo SMTP (`smtp-relay.brevo.com:587`).
- **HTTP Client**: `axios` with internal service secret headers (`x-megatrix-service-key`) and adaptive timeout fallbacks.

---

## 3. Directory Layout — `server/`

```
C:\MegaTrix\megatrix-admin\server\
├── config/
│   └── permissionsRegistry.js     # Canonical 4-tuple RBAC permission definitions & flat keys
├── controllers/
│   ├── auditController.js         # Querying, filtering, and exporting immutable audit trails
│   ├── authController.js          # Admin login, session issuance, profile update, invitation activation
│   ├── credentialController.js    # AES-256-GCM encrypted credential vault & single-item reveal
│   ├── overviewController.js      # Cross-platform live telemetry & ecosystem user aggregation
│   ├── roleController.js          # Role matrix CRUD, system-role protection & user assignment count
│   ├── schoolManagerAdminController.js # Proxy governance for School Hub institutional tenants & users
│   ├── spoofController.js         # Account impersonation / spoof token generator for downstream apps
│   └── userController.js          # Admin user CRUD, MailerX email dispatch, lifecycle status toggles
├── middleware/
│   └── auth.js                    # JWT verification, effective permission calculator, escalation guard
├── models/
│   ├── AdminUser.js               # Administrator accounts, scopes, status, and session tracking
│   ├── AuditLog.js                # Append-only immutable audit trail schema
│   ├── Credential.js              # AES-256-GCM encrypted project credentials schema
│   ├── Invitation.js              # Cryptographic account invitations & expiry tracking
│   └── Role.js                    # Dynamic and system RBAC roles
├── routes/
│   └── api.js                     # Master Express router with granular permission guards
├── services/
│   ├── mailerxRelay.js            # Transactional email dispatcher via Brevo SMTP
│   └── schoolManagerService.js    # Dual-tier connector to School Hub (API Gateway + Live Atlas DB)
├── utils/
│   └── encryption.js              # AES-256-GCM encryption, decryption, and secret masking utilities
└── index.js                       # Express app bootstrap, DB connection, and superadmin seeder
```

---

## 4. Server Initialization & Bootstrapping (`server/index.js`)

On startup, [server/index.js](file:///C:/MegaTrix/megatrix-admin/server/index.js) connects to MongoDB Atlas and executes `seedDefaultRolesAndSuperAdmin()` to ensure high availability and prevent lockout:

1. **System Roles Initialization**:
   - `superadmin`: Root authority (`permissions: ['*']`), unrestricted across all platforms (`global`, `bizmanager`, `schoolmanager`, `mailerx`). Cannot be deleted or modified by non-superadmins.
   - `global_admin`: Operational manager across all modules (`ALL_PERMISSION_KEYS`).
   - `platform_admin`: Scoped to specific SaaS modules (`bizmanager`, `schoolmanager`, `mailerx`), excluding global role/audit administration.
   - `user_manager`: Dedicated to user onboarding and invitation lifecycle (`global.users.*`).
   - `auditor`: Read-only compliance officer with access to immutable logs and directory inspection.
2. **Superadmin Account Provisioning**:
   - Checks for `admin.megatrix@gmail.com`.
   - If not found, deterministically creates the master Superadmin account with bcrypt-hashed credentials, assigns `accessLevel: 'full'`, `isSuperAdmin: true`, links the `superadmin` role, and records a `SUPERADMIN_INITIALIZED` audit log entry.
   - If found, continuously asserts `isSuperAdmin: true` and active lifecycle status.

---

## 5. Canonical Permission Registry (`server/config/permissionsRegistry.js`)

MegaTrix implements a structured **4-Tuple Permission Matrix**:

$$\text{Permission Key} = \text{Platform} : \text{Module} : \text{Resource} : \text{Action}$$

```javascript
// Example structure in server/config/permissionsRegistry.js
export const PERMISSION_REGISTRY = {
  global: {
    modules: {
      users: { resources: { directory: { actions: ['view', 'create', 'edit', 'suspend', 'disable', 'export', 'assign_permissions'] } } },
      roles: { resources: { role_matrix: { actions: ['view', 'create', 'edit', 'delete'] } } },
      audit: { resources: { logs: { actions: ['view', 'export'] } } },
      settings: { resources: { configuration: { actions: ['view', 'manage'] } } }
    }
  },
  bizmanager: {
    modules: {
      sales: { resources: { invoices: { actions: ['view', 'create', 'edit', 'delete', 'export'] } } },
      customers: { resources: { khata: { actions: ['view', 'create', 'edit', 'delete', 'export'] } } },
      inventory: { resources: { products: { actions: ['view', 'create', 'edit', 'delete'] } } },
      loans: { resources: { cash_desk: { actions: ['view', 'create', 'approve', 'delete'] } } }
    }
  },
  schoolmanager: {
    modules: {
      schools: { resources: { directory: { actions: ['view', 'create', 'edit', 'block', 'reactivate', 'delete', 'export'] } } },
      users: { resources: { directory: { actions: ['view', 'create', 'edit', 'block', 'reactivate', 'reset_password', 'export'] } } },
      activity: { resources: { logs: { actions: ['view', 'export'] } } },
      metrics: { resources: { telemetry: { actions: ['view', 'export'] } } },
      students: { resources: { student_records: { actions: ['view', 'create', 'edit', 'delete', 'export'] } } },
      challans: { resources: { fee_bills: { actions: ['view', 'create', 'edit', 'print'] } } }
    }
  },
  mailerx: {
    modules: {
      outbox: { resources: { messages: { actions: ['view', 'export'] } } },
      templates: { resources: { blueprints: { actions: ['view', 'edit'] } } },
      relay: { resources: { engine: { actions: ['dispatch'] } } }
    }
  }
};
```

- **`getAllPermissionKeys()`**: Dynamically flattens the nested registry into an array of string keys (e.g. `schoolmanager:schools:directory:block`) for token validation and UI capability trees.

---

## 6. Authentication & Security Middleware (`server/middleware/auth.js`)

### 6.1 `calculateEffectivePermissions(user)`
Calculates the runtime permission set of a user by combining:
1. **Superadmin / Full Access Bypass**: Returns `Set(['*'])` immediately.
2. **Inherited Role Permissions**: Aggregates permissions from all linked `Role` documents.
3. **Direct User Overrides**: Merges granular overrides defined directly on the `AdminUser` document.
4. **Platform Scope Filtering**: Filters out permissions belonging to platforms not present in the user's `platformScopes`.

### 6.2 `verifyAdminToken`
- Extracts and verifies Bearer JWT from `Authorization` header.
- Fetches active user from database with populated roles.
- Enforces lifecycle status check (rejects non-`active` users with `403 Forbidden`).
- Attaches `req.user` and `req.effectivePermissions` (`Set`) to the request.

### 6.3 `requirePermission(...args)`
- Supports shorthand string formats (`'global.users.view'`, `'schoolmanager:schools:directory:block'`) or 4-argument tuples.
- Automatically maps legacy shorthand notations to canonical 4-tuple keys.
- **Unauthorized Audit Logging**: If authorization fails, immediately writes an `UNAUTHORIZED_ATTEMPT` entry to `AuditLog` containing the attempted permission, request path, HTTP method, client IP, and User-Agent, before returning `403 Forbidden`.

### 6.4 `preventSelfEscalation`
Guards against privilege escalation attacks:
- Non-superadmins **cannot** grant `isSuperAdmin: true`.
- Partial-access admins **cannot** elevate others to `accessLevel: 'full'`.
- Admins **cannot** assign any permission or platform scope that they themselves do not possess.

### 6.5 `requireCredentialsAccess`
Strict middleware restricting access to the AES-256-GCM Credential Vault exclusively to Superadmins and Full Access administrators. All unauthorized access attempts are logged as `UNAUTHORIZED_CREDENTIALS_ACCESS_ATTEMPT`.

---

## 7. Cryptographic Credential Vault (`server/utils/encryption.js` & `server/controllers/credentialController.js`)

The credential management system ensures zero-plaintext exposure in the database for sensitive environment secrets:

### 7.1 Cryptographic Implementation (`encryption.js`)
- **Algorithm**: `AES-256-GCM` (Galois/Counter Mode) providing both confidentiality and cryptographic integrity.
- **Key Derivation**: Master 32-byte key derived from `CREDENTIALS_MASTER_KEY` via SHA-256.
- **Initialization Vector (IV)**: 12-byte cryptographically secure random bytes per encryption.
- **Authentication Tag**: 16-byte (128-bit) tag generated by GCM cipher to detect ciphertext tampering.
- **`encryptSecret(plaintext)`**: Returns `{ ciphertext, iv, authTag, algorithm }` in hex format.
- **`decryptSecret({ ciphertext, iv, authTag })`**: Reconstructs cipher with auth tag verification. Throws if corrupted.
- **`maskSecret(val)`**: Returns `'••••••••••••••••'` for safe display in lists.

### 7.2 Storage Schema (`models/Credential.js`)
```javascript
const credentialSchema = new mongoose.Schema({
  project: { type: String, enum: ['schoolhub', 'bizmanager'], required: true },
  environment: { type: String, enum: ['production', 'staging', 'development'], default: 'production' },
  category: { type: String, enum: ['database', 'api_key', 'auth_secret', 'storage', 'smtp', 'service_token', 'deployment', 'other'] },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  encryptedValue: {
    type: encryptedValueSchema,
    required: true,
    select: false  // NEVER returned in default Mongoose queries!
  },
  maskedValue: { type: String, default: '••••••••••••••••' },
  status: { type: String, enum: ['active', 'deprecated', 'revoked'], default: 'active' },
  lastRotatedAt: { type: Date, default: Date.now },
  createdBy: { id, name, email },
  updatedBy: { id, name, email }
});
```

### 7.3 Audited Single-Item Reveal (`revealCredential`)
When an administrator clicks to reveal a credential:
1. Specifically selects `+encryptedValue` for that single document ID.
2. Decrypts the secret in memory.
3. Immediately writes a `CREDENTIAL_REVEALED` record to `AuditLog` (logging the actor, timestamp, credential name, environment, and IP, but **never** the plaintext secret).
4. Returns the decrypted secret only for that specific item.

---

## 8. Multi-SaaS Proxy Connectors & Resilience (`server/services/`)

### 8.1 School Hub Governance (`schoolManagerService.js`)
Controls external educational institutions using an intelligent **Dual-Tier Resilient Architecture**:

```
                              [ School Hub Service Call ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
             Tier 1: Primary                               Tier 2: Fallback
        HTTP REST Integration API                      Direct MongoDB Atlas Link
  (https://api-schoolhub.megatrixai.com)           (mongoose.connection.useDb('school_management'))
                    │                                             │
      ┌─────────────┴─────────────┐                 ┌─────────────┴─────────────┐
      │  Passes 'x-megatrix-      │                 │  Direct collection queries: │
      │  service-key' header.     │                 │  'schools', 'students',   │
      │  Calls remote endpoints.  │                 │  'users', 'adminactivity' │
      └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                                 [ Normalized Result ]
```

- **Health & Telemetry**: Aggregates live statistics (total schools, active/blocked campuses, student count, teacher roster, recent sign-ins in 24h).
- **Tenant Management**: Real-time listing, pagination, filtering, blocking (with mandatory reason), reactivation, and soft/hard deletion.
- **Global User Governance**: View cross-school faculty and administrators, toggle account suspension, and perform **email-less administrative password resets** (`adminResetPassword`) for locked accounts.
- **Cross-School Activity Monitoring**: Aggregates event streams and security logs across all campuses.
- **SSO Deep Linking**: Generates cryptographically signed Single Sign-On tokens (`generateSSOLink`) for instant access to school management dashboards.

### 8.2 MailerX Transactional Relay (`mailerxRelay.js`)
- Configured with high-deliverability Brevo SMTP relay (`smtp-relay.brevo.com:587`).
- Formats and dispatches responsive, pure-dark branded HTML invitation emails containing cryptographically secure activation tokens (`/activate?token=...`).

---

## 9. Account Impersonation & Spoof Engine (`server/controllers/spoofController.js`)

Enables authorized Superadmins to troubleshoot downstream user issues without requesting or resetting user passwords:

1. **Initiation (`/api/spoof/initiate`)**:
   - Requires mandatory administrative reason ($\ge 10$ characters) and Superadmin/Full-Access privileges.
   - Generates a unique 64-character `spoofSessionId`.
   - **For Biz Manager**: Dispatches request to BizManager API or generates fallback JWT signed with `BIZMANAGER_JWT_SECRET` containing `isSpoof: true`, `isImpersonated: true`, shop details, and context fingerprint. Builds handoff URL: `https://bizmanager.megatrixai.com/impersonate?token=...`.
   - **For School Hub**: Dispatches request to School Hub integration gateway or generates signed `SCHOOLHUB_JWT_SECRET` and `SCHOOLHUB_REFRESH_SECRET` tokens. Builds handoff URL: `https://schoolhub.megatrixai.com/impersonate?token=...&refreshToken=...&spoof=true`.
   - Records `IMPERSONATION_STARTED` in `AuditLog` with actor ID, target user ID, reason, and handoff destination.
2. **Termination (`/api/spoof/terminate`)**:
   - Cleans up session state and logs `IMPERSONATION_ENDED` to `AuditLog`.

---

## 10. Immutable Security Audit Trail (`server/models/AuditLog.js` & `server/controllers/auditController.js`)

The audit system acts as an immutable chronological black box:
- **Schema Properties**: `actor` (ID, name, email, role), `action` (e.g. `LOGIN_SUCCESS`, `USER_CREATE`, `USER_STATUS_CHANGE`, `ROLE_UPDATE`, `CREDENTIAL_REVEALED`, `SCHOOL_BLOCKED`, `IMPERSONATION_STARTED`, `UNAUTHORIZED_ATTEMPT`), `target` (ID, type, name, email), `platform`, `details` (arbitrary metadata object), `ipAddress`, `userAgent`.
- **Immutability**: Enforced via Mongoose option `{ timestamps: { createdAt: true, updatedAt: false } }`. No update endpoints exist.
- **Query & Export**: Supports regex search across actor/target, action filtering, date ranges, and structured JSON export (up to 1,000 records).

---

## 11. Complete API Route Reference Matrix

Mounted at base route `/api` in [server/routes/api.js](file:///C:/MegaTrix/megatrix-admin/server/routes/api.js):

| Category | Method | Endpoint | Authorization Required | Controller Method |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Public | `authController.login` |
| | `GET` | `/api/auth/me` | Bearer Token | `authController.getMe` |
| | `PUT` | `/api/auth/profile` | Bearer Token | `authController.updateProfile` |
| | `GET` | `/api/auth/invitations/verify` | Public | `authController.verifyInvitation` |
| | `POST` | `/api/auth/invitations/activate` | Public | `authController.activateInvitation` |
| **Permissions**| `GET` | `/api/permissions/registry` | Bearer Token | Returns `PERMISSION_REGISTRY` & flat keys |
| **Users** | `GET` | `/api/users` | `global.users.view` | `userController.listUsers` |
| | `POST` | `/api/users` | `global.users.create` + Escalation Guard | `userController.createUser` |
| | `POST` | `/api/users/invite` | `global.users.invite` + Escalation Guard | `userController.inviteUser` |
| | `GET` | `/api/users/:id` | `global.users.view` | `userController.getUser` |
| | `PUT` | `/api/users/:id` | `global.users.edit` + Escalation Guard | `userController.updateUser` |
| | `PATCH` | `/api/users/:id/status` | `global.users.edit` + Escalation Guard | `userController.updateStatus` |
| | `DELETE` | `/api/users/:id` | `global.users.delete` + Escalation Guard | `userController.deleteUser` |
| **Roles** | `GET` | `/api/roles` | `global.roles.view` | `roleController.listRoles` |
| | `POST` | `/api/roles` | `global.roles.manage` | `roleController.createRole` |
| | `PUT` | `/api/roles/:id` | `global.roles.manage` | `roleController.updateRole` |
| | `DELETE` | `/api/roles/:id` | `global.roles.manage` | `roleController.deleteRole` |
| **Audit** | `GET` | `/api/audit` | `global.audit.view` | `auditController.getAuditLogs` |
| | `GET` | `/api/audit/export` | `global.audit.export` | `auditController.exportAuditLogs` |
| **Overview** | `GET` | `/api/overview/metrics` | Bearer Token | `overviewController.getOverviewMetrics` |
| **Credentials**| `GET` | `/api/credentials` | Superadmin / Full Access | `credentialController.listCredentials` |
| | `POST` | `/api/credentials/:id/reveal`| Superadmin / Full Access | `credentialController.revealCredential` |
| | `POST` | `/api/credentials` | Superadmin / Full Access | `credentialController.createCredential` |
| | `PUT` | `/api/credentials/:id` | Superadmin / Full Access | `credentialController.updateCredential` |
| | `DELETE`| `/api/credentials/:id` | Superadmin / Full Access | `credentialController.deleteCredential` |
| **School Hub** | `GET` | `/api/admin/schoolmanager/health` | Bearer Token | `schoolManagerAdminController.getHealth` |
| | `GET` | `/api/admin/schoolmanager/overview` | `schoolmanager.metrics.view` | `schoolManagerAdminController.getOverview` |
| | `GET` | `/api/admin/schoolmanager/schools` | `schoolmanager.schools.view` | `schoolManagerAdminController.listSchools` |
| | `GET` | `/api/admin/schoolmanager/schools/:id` | `schoolmanager.schools.view` | `schoolManagerAdminController.getSchoolDetails` |
| | `PATCH` | `/api/admin/schoolmanager/schools/:id/block` | `schoolmanager.schools.block` | `schoolManagerAdminController.blockSchool` |
| | `PATCH` | `/api/admin/schoolmanager/schools/:id/reactivate` | `schoolmanager.schools.reactivate` | `schoolManagerAdminController.reactivateSchool` |
| | `DELETE`| `/api/admin/schoolmanager/schools/:id` | `schoolmanager.schools.delete` (Superadmin) | `schoolManagerAdminController.deleteSchool` |
| | `GET` | `/api/admin/schoolmanager/users` | `schoolmanager.users.view` | `schoolManagerAdminController.listUsers` |
| | `GET` | `/api/admin/schoolmanager/users/:id` | `schoolmanager.users.view` | `schoolManagerAdminController.getUserDetails` |
| | `PATCH` | `/api/admin/schoolmanager/users/:id/block` | `schoolmanager.users.block` | `schoolManagerAdminController.blockUser` |
| | `PATCH` | `/api/admin/schoolmanager/users/:id/reactivate` | `schoolmanager.users.reactivate` | `schoolManagerAdminController.reactivateUser` |
| | `POST` | `/api/admin/schoolmanager/users/:id/reset-password` | `schoolmanager.users.reset_password` | `schoolManagerAdminController.adminResetPassword` |
| | `GET` | `/api/admin/schoolmanager/activity` | `schoolmanager.activity.view` | `schoolManagerAdminController.listActivity` |
| | `POST` | `/api/admin/schoolmanager/sso-token` | `schoolmanager.schools.view` | `schoolManagerAdminController.generateSSOLink` |
| **Spoofing** | `POST` | `/api/spoof/initiate` | Superadmin / Full Access | `spoofController.initiate` |
| | `POST` | `/api/spoof/terminate` | Superadmin / Full Access | `spoofController.terminate` |

---

## 12. Environment Variables Reference

```env
# Server Network Port
PORT=5002

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.5tchcnc.mongodb.net/megatrix_admin?retryWrites=true&w=majority

# JWT Session Key
JWT_SECRET=megatrix-global-admin-jwt-secret-2026-production

# AES-256-GCM Credential Vault Master Key (64-char hex or 32-byte string)
CREDENTIALS_MASTER_KEY=048aaac599e8efe20cf9ec23daf5275eff664f595a47d4dcc322a1dc112d7145

# Initial Superadmin Password Seed
INITIAL_SUPERADMIN_PASSWORD=Orangeman235!

# Brevo SMTP Configuration for MailerX Relay
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=80e729001@smtp-brevo.com
BREVO_SMTP_PASS=<brevo_smtp_key>
FROM_EMAIL=sales@megatrixai.com
FROM_NAME=MegaTrix Global Admin

# Connected SaaS Integration Endpoints & Secrets
SCHOOLMANAGER_INTERNAL_API_URL=https://api-schoolhub.megatrixai.com/api/admin-integration
SCHOOLMANAGER_APP_URL=https://schoolhub.megatrixai.com
BIZMANAGER_API_URL=https://bizmanager.megatrixai.com
BIZMANAGER_APP_URL=https://bizmanager.megatrixai.com
MEGATRIX_SERVICE_SECRET=megatrix_core_internal_service_key_2026

# Public App Origin (for invitation links)
FRONTEND_URL=http://localhost:5175
```

---

## 13. Development & Startup Commands

```bash
cd C:\MegaTrix\megatrix-admin

# Install dependencies
npm install

# Start Backend API server (Port 5002)
npm run server

# Start Frontend UI in development mode (Port 5175)
npm run dev

# Run Playwright QA validation tests
npm test
```
