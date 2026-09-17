import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'admin.megatrix@gmail.com');
  await page.type('input[type="password"]', 'Orangeman235!');
  const btn = await page.$('button[type="submit"]');
  await btn.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.goto('http://localhost:5175/settings?tab=admins', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/ranas/.gemini/antigravity/brain/bce66bd8-f9d3-42d6-a9eb-0b40db656804/admin-users-live-final.png', fullPage: true });
  console.log('Saved admin-users-live-final.png');
  await browser.close();
})();
