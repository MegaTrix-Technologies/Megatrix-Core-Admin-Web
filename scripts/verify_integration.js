import axios from 'axios';

const ADMIN_URL = 'http://localhost:5002';
const SCHOOL_URL = 'http://localhost:5001';
const SERVICE_SECRET = 'megatrix_core_internal_service_key_2026';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   MEGATRIX ADMIN <-> SCHOOL MANAGER INTEGRATION TEST  ');
  console.log('======================================================\n');

  // Test 1: Direct School Manager Service-Auth Security Check
  console.log('1. School Manager Service Auth & Direct Endpoints:');
  try {
    // 1a: Should reject missing or invalid service key with 403
    let rejected = false;
    try {
      await axios.get(`${SCHOOL_URL}/api/admin-integration/health`, {
        headers: { 'x-megatrix-service-key': 'invalid_secret_key' },
      });
    } catch (err) {
      rejected = err.response?.status === 403;
    }
    assert(rejected, 'Rejects unauthorized requests with 403 when service key is invalid');

    // 1b: Valid service key passes health check
    const healthRes = await axios.get(`${SCHOOL_URL}/api/admin-integration/health`, {
      headers: { 'x-megatrix-service-key': SERVICE_SECRET },
    });
    assert(healthRes.status === 200 && healthRes.data.success === true, 'Valid service key returns 200 health');

    // 1c: Overview returns metrics
    const schoolOverview = await axios.get(`${SCHOOL_URL}/api/admin-integration/overview`, {
      headers: { 'x-megatrix-service-key': SERVICE_SECRET },
    });
    const totalSchools = schoolOverview.data?.metrics?.schools?.total;
    const totalStudents = schoolOverview.data?.metrics?.populations?.students;
    assert(
      schoolOverview.status === 200 && typeof totalSchools === 'number',
      `Overview returns metrics (totalSchools: ${totalSchools}, totalStudents: ${totalStudents})`
    );

    // 1d: Schools list returns array
    const schoolsRes = await axios.get(`${SCHOOL_URL}/api/admin-integration/schools`, {
      headers: { 'x-megatrix-service-key': SERVICE_SECRET },
    });
    const schoolsList = schoolsRes.data?.schools;
    assert(
      schoolsRes.status === 200 && Array.isArray(schoolsList),
      `Schools list returned ${schoolsList?.length} schools`
    );

    // 1e: Users list returns multi-model results
    const usersRes = await axios.get(`${SCHOOL_URL}/api/admin-integration/users?limit=5`, {
      headers: { 'x-megatrix-service-key': SERVICE_SECRET },
    });
    const usersList = usersRes.data?.users;
    assert(
      usersRes.status === 200 && Array.isArray(usersList),
      `Cross-model users list returned ${usersList?.length} users`
    );
  } catch (err) {
    console.error('Direct endpoint failure:', err.message);
    failed++;
  }

  // Test 2: MegaTrix Admin Core (Port 5002) Governance & RBAC:
  console.log('\n2. MegaTrix Admin Core (Port 5002) Governance & RBAC:');
  try {
    // 2a: Admin server health
    const adminHealth = await axios.get(`${ADMIN_URL}/health`);
    assert(adminHealth.status === 200 && adminHealth.data.mongo === 'connected', 'MegaTrix Admin server is healthy & connected to MongoDB Atlas');

    // 2b: Admin Login as Superadmin
    const loginRes = await axios.post(`${ADMIN_URL}/api/auth/login`, {
      email: 'admin.megatrix@gmail.com',
      password: 'Orangeman235!',
    });
    const token = loginRes.data?.token;
    assert(loginRes.status === 200 && !!token, 'Superadmin authenticated successfully with JWT');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2c: Global Overview Metrics include School Manager telemetry
    const globalOverview = await axios.get(`${ADMIN_URL}/api/overview/metrics`, {
      headers: authHeaders,
    });
    const smTele = globalOverview.data?.metrics?.schoolManager;
    assert(
      globalOverview.status === 200 && smTele?.online === true,
      `Global Overview attaches live School Manager telemetry (Online: ${smTele?.online}, Schools: ${smTele?.schools?.total}, Students: ${smTele?.populations?.students})`
    );

    // 2d: Proxied School Manager Overview through MegaTrix Admin
    const proxiedOverview = await axios.get(`${ADMIN_URL}/api/admin/schoolmanager/overview`, {
      headers: authHeaders,
    });
    assert(
      proxiedOverview.status === 200 && proxiedOverview.data?.metrics?.schools?.total !== undefined,
      `Proxied School Manager overview returned live data (Schools: ${proxiedOverview.data.metrics.schools.total})`
    );

    // 2e: Proxied Schools List through MegaTrix Admin
    const proxiedSchools = await axios.get(`${ADMIN_URL}/api/admin/schoolmanager/schools?limit=5`, {
      headers: authHeaders,
    });
    const proxiedSchoolsList = proxiedSchools.data?.schools;
    assert(
      proxiedSchools.status === 200 && Array.isArray(proxiedSchoolsList),
      `Proxied Schools API returned ${proxiedSchoolsList?.length} schools`
    );

    // 2f: Proxied Cross-School Users Directory through MegaTrix Admin
    const proxiedUsers = await axios.get(`${ADMIN_URL}/api/admin/schoolmanager/users?limit=5`, {
      headers: authHeaders,
    });
    const proxiedUsersList = proxiedUsers.data?.users;
    assert(
      proxiedUsers.status === 200 && Array.isArray(proxiedUsersList),
      `Proxied Users API returned ${proxiedUsersList?.length} users with normalized roles`
    );

    // 2g: Proxied Activity Log through MegaTrix Admin
    const proxiedActivity = await axios.get(`${ADMIN_URL}/api/admin/schoolmanager/activity?limit=5`, {
      headers: authHeaders,
    });
    const proxiedActivityList = proxiedActivity.data?.activities;
    assert(
      proxiedActivity.status === 200 && Array.isArray(proxiedActivityList),
      `Proxied Activity API returned ${proxiedActivityList?.length} activity records`
    );

    // 2h: Assisted Password Reset Security Check
    if (proxiedUsersList && proxiedUsersList.length > 0) {
      const testUser = proxiedUsersList[0];
      const resetRes = await axios.post(
        `${ADMIN_URL}/api/admin/schoolmanager/users/${testUser._id}/reset-password`,
        { role: testUser.role, reason: 'Integration verification test' },
        { headers: authHeaders }
      );
      assert(
        resetRes.status === 200 && resetRes.data?.success === true && !!resetRes.data?.temporaryPassword,
        `Assisted password reset generated one-time temp credential for user ${testUser.name} (${testUser.role})`
      );

      // 2i: Verify Audit Log in MegaTrix Global Admin
      const auditRes = await axios.get(`${ADMIN_URL}/api/audit?limit=5`, { headers: authHeaders });
      const logs = auditRes.data?.logs || auditRes.data?.data || [];
      const resetAudit = logs.find((l) => l.action === 'USER_ADMIN_PASSWORD_RESET');
      const noPasswordLogged = !resetAudit?.details?.temporaryPassword && !resetAudit?.details?.password;
      assert(
        !!resetAudit && noPasswordLogged,
        'Audit log recorded USER_ADMIN_PASSWORD_RESET without exposing passwords or hashes'
      );
    }

    // 2j: Test RBAC Protection - Unauthenticated request should return 401
    let unauthBlocked = false;
    try {
      await axios.get(`${ADMIN_URL}/api/admin/schoolmanager/overview`);
    } catch (err) {
      unauthBlocked = err.response?.status === 401;
    }
    assert(unauthBlocked, 'RBAC correctly blocks unauthenticated requests to School Manager governance');

  } catch (err) {
    console.error('Admin API failure:', err.response?.data || err.message);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
