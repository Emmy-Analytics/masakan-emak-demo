export default async function run(page, ui) {
  const toggle = page.locator('#cartFloatToggle');
  const results = {};

  // 1. Desktop: drag keranjang ke posisi lain, lalu buka panel
  let before = await toggle.boundingBox();
  await page.mouse.move(before.x + 40, before.y + 15);
  await page.mouse.down();
  await page.mouse.move(before.x - 200, before.y - 300, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(100);
  const afterDrag = await toggle.boundingBox();
  results.dragMoved = { before: { x: before.x, y: before.y }, after: { x: afterDrag.x, y: afterDrag.y } };

  // 2. Klik membuka panel — panel harus mengikuti tombol
  await toggle.click();
  await page.waitForTimeout(200);
  const panel = await page.evaluate(() => {
    const p = document.getElementById('pesanan');
    return p.getBoundingClientRect().toJSON();
  });
  const toggleNow = await toggle.boundingBox();
  results.panel = panel;
  results.toggle = { x: toggleNow.x, y: toggleNow.y };
  results.panelFollowsToggle = panel.y + panel.height <= toggleNow.y + 5 || toggleNow.y + toggleNow.height <= panel.y + 5;
  results.panelInViewport = panel.x >= 0 && panel.x + panel.width <= 1280 && panel.y >= 0 && panel.y + panel.height <= 720;

  // 3. Panel terbuka — geser keranjang ke ujung kanan bawah desktop
  await page.mouse.move(toggleNow.x + 40, toggleNow.y + 15);
  await page.mouse.down();
  await page.mouse.move(1250, 700, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const toggleNew = await toggle.boundingBox();
  const panelNew = await page.evaluate(() => {
    const p = document.getElementById('pesanan');
    return p.getBoundingClientRect().toJSON();
  });
  results.toggleWhileOpen = { x: toggleNew.x, y: toggleNew.y };
  results.panelWhileOpen = panelNew;
  results.panelFollowsWhileOpen = panelNew.x + panelNew.width <= 1280 && panelNew.y + panelNew.height <= 720;
  results.panelFollowsToggleWhileOpen = toggleNew.y + toggleNew.height <= panelNew.y + 5 || panelNew.y + panelNew.height <= toggleNew.y + 5;

  // 4. Viewport kecil — keranjang & panel tetap terlihat
  await page.setViewportSize({ width: 393, height: 800 });
  await page.waitForTimeout(300);
  const toggleSmall = await toggle.boundingBox();
  const panelSmall = await page.evaluate(() => {
    const p = document.getElementById('pesanan');
    return p.getBoundingClientRect().toJSON();
  });
  results.toggleSmall = toggleSmall;
  results.panelSmall = panelSmall;
  results.toggleSmallVisible = toggleSmall.x >= 0 && toggleSmall.x + toggleSmall.width <= 393 && toggleSmall.y >= 0 && toggleSmall.y + toggleSmall.height <= 800;
  results.panelSmallVisible = panelSmall.x >= 0 && panelSmall.x + panelSmall.width <= 393 && panelSmall.y >= 0 && panelSmall.y + panelSmall.height <= 800;
  results.panelFollowsToggleSmall = toggleSmall.y + toggleSmall.height <= panelSmall.y + 5 || panelSmall.y + panelSmall.height <= toggleSmall.y + 5;

  // 5. Viewport 355
  await page.setViewportSize({ width: 355, height: 800 });
  await page.waitForTimeout(300);
  const toggleTiny = await toggle.boundingBox();
  const panelTiny = await page.evaluate(() => {
    const p = document.getElementById('pesanan');
    return p.getBoundingClientRect().toJSON();
  });
  results.toggleTiny = toggleTiny;
  results.panelTiny = panelTiny;
  results.toggleTinyVisible = toggleTiny.x >= 0 && toggleTiny.x + toggleTiny.width <= 355 && toggleTiny.y >= 0 && toggleTiny.y + toggleTiny.height <= 800;
  results.panelTinyVisible = panelTiny.x >= 0 && panelTiny.x + panelTiny.width <= 355 && panelTiny.y >= 0 && panelTiny.y + panelTiny.height <= 800;

  // 6. Kembali ke desktop — keranjang & panel tetap terlihat
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(300);
  const toggleBack = await toggle.boundingBox();
  const panelBack = await page.evaluate(() => {
    const p = document.getElementById('pesanan');
    return p.getBoundingClientRect().toJSON();
  });
  results.toggleBack = toggleBack;
  results.panelBack = panelBack;
  results.toggleBackVisible = toggleBack.x >= 0 && toggleBack.x + toggleBack.width <= 1280 && toggleBack.y >= 0 && toggleBack.y + toggleBack.height <= 720;
  results.panelBackVisible = panelBack.x >= 0 && panelBack.x + panelBack.width <= 1280 && panelBack.y >= 0 && panelBack.y + panelBack.height <= 720;

  await page.screenshot({ path: 'drag-test.png' });
  return results;
}
