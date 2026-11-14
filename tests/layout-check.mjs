// Responsive layout guard: no horizontal overflow and header controls stay inside the viewport.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = process.env.PREVIEW_URL || 'http://localhost:4173/hocsieuvui/';
const sizes = [
  ['phone-small', 320, 640], ['phone', 360, 740], ['phone-large', 412, 915], ['phone-landscape', 740, 360],
  ['tablet-portrait', 768, 1024], ['tablet-air', 820, 1180], ['tablet-landscape', 1024, 768],
  ['laptop', 1280, 720], ['laptop-hd', 1366, 768], ['desktop', 1536, 864], ['desktop-fhd', 1920, 1080], ['wide', 2560, 1080]
];
const browser = await chromium.launch();
let failed = 0;
for (const [name, w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // Simulate a very long display name to make sure the profile chip truncates instead of overflowing.
  await page.evaluate(() => {
    const el = document.querySelector('[title="Hồ sơ & Đăng nhập"] .truncate');
    if (el) el.textContent = 'Thần Đồng Tính Nhẩm Siêu Cấp Vô Địch Thiên Hạ';
  });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('header button, header nav, header a').forEach((e) => {
      const b = e.getBoundingClientRect();
      if (b.width > 0 && (b.right > vw + 0.5 || b.left < -0.5)) bad.push((e.getAttribute('title') || e.textContent || e.tagName).trim().slice(0, 30) + ` [${Math.round(b.left)}..${Math.round(b.right)}]`);
    });
    const wide = [];
    document.querySelectorAll('body *').forEach((e) => {
      const b = e.getBoundingClientRect();
      if (b.width > 0 && b.right > vw + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[class*="overflow-x-auto"],[class*="overflow-hidden"],[class*="overflow-x-hidden"]')) wide.push(e.tagName + '.' + String(e.className).slice(0, 50));
    });
    return { vw, sw: document.documentElement.scrollWidth, bad, wide: wide.slice(0, 5) };
  });
  const ok = r.sw <= r.vw && r.bad.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${w}x${h} scrollWidth=${r.sw} viewport=${r.vw}`, r.bad.length ? 'header-out=' + JSON.stringify(r.bad) : '', !ok && r.wide.length ? 'wide=' + JSON.stringify(r.wide) : '');
  if (!ok) failed++;
  await ctx.close();
}
await browser.close();
assert.equal(failed, 0, `${failed} viewport(s) overflow`);
