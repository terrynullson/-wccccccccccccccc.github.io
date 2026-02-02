const { chromium } = require("playwright");

const PORT = Number(process.env.PORT) || 55173;
const BASE = `http://127.0.0.1:${PORT}`;

async function setTheme(page, theme) {
  await page.addInitScript(({ themeName }) => {
    localStorage.setItem("wcc-theme", themeName);
  }, { themeName: theme });
}

async function setZoom(page, zoom) {
  await page.evaluate((z) => {
    document.body.style.zoom = String(z);
  }, zoom);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await setTheme(page, "light");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate((themeName) => {
    document.documentElement.dataset.theme = themeName;
  }, "light");
  await page.waitForTimeout(80);
  await page.screenshot({ path: "wcc_collapsed_1920.png" });
  await setZoom(page, 1.25);
  await page.waitForTimeout(80);
  await page.screenshot({ path: "wcc_collapsed_1920_zoom.png" });
  await setZoom(page, 1);

  // volume popover
  await page.click('[data-popover-trigger="volume"] button');
  await page.waitForTimeout(150);
  await page.screenshot({ path: "wcc_volume_1920.png" });
  await page.click('[data-popover-trigger="volume"] button');

  // dialer popover
  await page.click('[data-popover-trigger="dial"] button');
  await page.waitForTimeout(150);
  await page.screenshot({ path: "wcc_dialer_1920.png" });
  await page.click('[data-popover-trigger="dial"] button');

  // pause reasons popover
  await page.click(".wcc-shiftToggle");
  await page.waitForTimeout(150);
  await page.click(".wcc-shiftPause");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "wcc_pause_1920.png" });
  await page.click(".wcc-shiftPause");

  // profile menu + settings modal
  await page.click(".wcc-profile");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "wcc_profile_menu_1920.png" });
  await page.click(".wcc-profileMenu__item");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "wcc_settings_modal_1920.png" });
  const settingsOk = page.locator(".wcc-settingsModal .wcc-action-btn").first();
  if (await settingsOk.count()) {
    await settingsOk.click({ force: true });
  } else {
    await page.locator(".wcc-modal__backdrop").click({ force: true });
  }
  await page.waitForSelector(".wcc-settingsModal", { state: "detached" });

  // order modal
  const orderBtn = page.getByText("Оформить");
  if (await orderBtn.count()) {
    await orderBtn.first().click({ force: true });
    await page.waitForSelector(".wcc-orderModal", { timeout: 2000 });
    await page.screenshot({ path: "wcc_order_modal_1920.png" });
    const orderClose = page.locator(".wcc-orderModal__close");
    if (await orderClose.count()) {
      await orderClose.click({ force: true });
    } else {
      await page.locator(".wcc-modal__backdrop").click({ force: true });
    }
    await page.waitForSelector(".wcc-orderModal", { state: "detached" });
  }

  await page.click(".wcc-side__burger");
  await page.waitForSelector(".wcc-side.is-open", { timeout: 2000 });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: "wcc_expanded_1920.png" });
  await setZoom(page, 1.25);
  await page.waitForTimeout(80);
  await page.screenshot({ path: "wcc_expanded_1920_zoom.png" });
  await setZoom(page, 1);

  await page.close();
  const pageDark = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await setTheme(pageDark, "dark");
  await pageDark.goto(BASE, { waitUntil: "networkidle" });
  await pageDark.evaluate((themeName) => {
    document.documentElement.dataset.theme = themeName;
  }, "dark");
  await pageDark.waitForTimeout(80);
  await pageDark.screenshot({ path: "wcc_collapsed_1920_dark.png" });
  await setZoom(pageDark, 1.25);
  await pageDark.waitForTimeout(80);
  await pageDark.screenshot({ path: "wcc_collapsed_1920_dark_zoom.png" });
  await setZoom(pageDark, 1);
  await pageDark.click(".wcc-side__burger");
  await pageDark.waitForSelector(".wcc-side.is-open", { timeout: 2000 });
  await new Promise((r) => setTimeout(r, 200));
  await pageDark.screenshot({ path: "wcc_expanded_1920_dark.png" });
  await setZoom(pageDark, 1.25);
  await pageDark.waitForTimeout(80);
  await pageDark.screenshot({ path: "wcc_expanded_1920_dark_zoom.png" });

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
