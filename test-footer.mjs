export default async function run(page) {
  const results = {};
  for (const w of [355, 393, 1280]) {
    await page.setViewportSize({ width: w, height: 800 });
    const el = page.locator('.site-footer .footer-bottom');
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    results['w' + w] = await page.evaluate(() => {
      const wa = document.querySelector('.footer-credit .credit-wa');
      const ig = document.querySelector('.footer-credit .credit-ig');
      const wr = wa.getBoundingClientRect();
      const ir = ig.getBoundingClientRect();
      return {
        oneLine: wr.top === ir.top,
        igRightOfWa: ir.left >= wr.right - 1,
        creditFont: getComputedStyle(document.querySelector('.footer-credit')).fontFamily.includes('DM Sans'),
        creditFontSize: getComputedStyle(document.querySelector('.footer-credit')).fontSize,
        creditColor: getComputedStyle(document.querySelector('.footer-credit')).color,
        waHref: wa.href,
        igHref: ig.href,
        copyrightVisible: [...document.querySelectorAll('.footer-bottom > span')].map(s => s.textContent.trim()),
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    await page.screenshot({ path: 'footer-w' + w + '.png' });
  }
  return results;
}
