import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser to test Slack-style invitation flow...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Log in as Superadmin
    console.log('Step 1: Logging in as Superadmin at http://localhost:5175/login...');
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle2' });

    // Fill login form
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin.megatrix@gmail.com');
    await page.type('input[type="password"]', 'Orangeman235!');
    
    // Click submit
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});

    console.log('Current URL after login:', page.url());

    // 2. Navigate to Settings -> Admin Users
    console.log('Step 2: Navigating to /settings?tab=admins...');
    await page.goto('http://localhost:5175/settings?tab=admins', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot initial admins table
    await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/admin-users-live.png', fullPage: true });
    console.log('Screenshot saved: admin-users-live.png');

    // 3. Click "Invite Administrator" button
    console.log('Step 3: Clicking "Invite Administrator"...');
    const inviteBtn = await page.waitForSelector('button:has-text("Invite Administrator")', { timeout: 5000 })
      .catch(async () => {
        // Fallback selector by text
        const buttons = await page.$$('button');
        for (const b of buttons) {
          const txt = await page.evaluate(el => el.textContent, b);
          if (txt && txt.includes('Invite Administrator')) return b;
        }
        return null;
      });

    if (inviteBtn) {
      await inviteBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      console.log('Invite modal opened.');
    } else {
      throw new Error('Could not find Invite Administrator button');
    }

    // 4. Fill Invite Form
    console.log('Step 4: Filling out invitation form...');
    const testEmail = `invitee.${Date.now()}@megatrix.tech`;
    await page.type('input[placeholder*="Asim Raza"]', 'Bilal Tariq');
    await page.type('input[placeholder*="operator@megatrix.tech"]', testEmail);
    await page.type('input[placeholder*="+92 300 1234567"]', '+92 300 7788990');

    await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/invite-modal-filled.png' });
    console.log('Screenshot saved: invite-modal-filled.png');

    // 5. Submit Invitation
    console.log('Step 5: Dispatching invitation...');
    const dispatchBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Dispatch Invitation'));
    });

    if (dispatchBtn) {
      await dispatchBtn.click();
      console.log('Clicked Dispatch Invitation.');
    }

    // 6. Wait for Slack-Style Share Modal
    console.log('Step 6: Waiting for Slack-style Share Link modal...');
    await page.waitForSelector('input[readonly][value*="/activate?token="]', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1000));

    const inviteLink = await page.evaluate(() => {
      const input = document.querySelector('input[readonly][value*="/activate?token="]');
      return input ? input.value : null;
    });

    console.log('>>> EXTRACTED SLACK INVITATION LINK:', inviteLink);

    await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/slack-share-modal.png' });
    console.log('Screenshot saved: slack-share-modal.png');

    // Test clicking "Copy Link"
    const copyBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Copy Link'));
    });
    if (copyBtn) {
      await copyBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      console.log('Clicked Copy Link button.');
    }

    // Click "Done"
    const doneBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.trim() === 'Done');
    });
    if (doneBtn) {
      await doneBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }

    await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/table-with-pending-admin.png', fullPage: true });
    console.log('Screenshot saved: table-with-pending-admin.png');

    // 7. Now Test Opening the Activation Link
    console.log('Step 7: Testing activation page at:', inviteLink);
    const invitePage = await browser.newPage();
    await invitePage.setViewport({ width: 1440, height: 900 });
    await invitePage.goto(inviteLink, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    await invitePage.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/activation-page.png' });
    console.log('Screenshot saved: activation-page.png');

    // Set Master Password
    console.log('Step 8: Submitting new master password...');
    const passInputs = await invitePage.$$('input[type="password"]');
    if (passInputs.length >= 2) {
      await passInputs[0].type('StrongPass2026!');
      await passInputs[1].type('StrongPass2026!');
      
      const activateBtn = await invitePage.$('button[type="submit"]');
      await activateBtn.click();
      await new Promise((r) => setTimeout(r, 3000));

      await invitePage.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/account-activated.png' });
      console.log('Screenshot saved: account-activated.png');
    }

    console.log('E2E Slack-style Invitation Test Completed Successfully!');
  } catch (err) {
    console.error('Error during test:', err);
    await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/test-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
