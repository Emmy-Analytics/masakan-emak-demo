export default async function run(page, ui) {
  const results = {};
  for (const w of [355, 393]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.locator('.food-card').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.food-card')].slice(0, 6);
      return cards.map(c => {
        const name = c.querySelector('.food-name');
        const price = c.querySelector('.food-price');
        const btn = c.querySelector('.bag-button');
        const nr = name.getBoundingClientRect();
        const pr = price.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        const overlap = !(pr.bottom <= br.top || pr.top >= br.bottom) &&
                        !(pr.right <= br.left || pr.left >= br.right);
        return {
          overlap,
          nameClipped: name.scrollWidth > name.clientWidth + 1,
          priceClipped: price.scrollWidth > price.clientWidth + 1,
          name: name.textContent,
          price: price.textContent,
        };
      });
    });
    results['w' + w] = info;
    await page.screenshot({ path: 'menu-' + w + '.png' });
  }
  // Desktop check
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.locator('.food-card').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'menu-desktop.png' });
  return results;
}
