export async function loginAsAdmin(page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('megatrix_admin_user', JSON.stringify({
      token: 'megatrix_auth_jwt_superadmin_autonomous_session_998822',
      name: 'MegaTrix SuperAdmin',
      email: 'admin.megatrix@gmail.com',
      role: 'superadmin',
      isSuperAdmin: true,
      isAutonomous: true,
      status: 'active',
      platforms: ['schoolhub', 'bizmanager', 'global'],
      accessLevel: 'full'
    }));
    localStorage.setItem('megatrix_active_platform', 'bizmanager');
  });
}
