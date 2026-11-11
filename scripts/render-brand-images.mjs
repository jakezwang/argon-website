// Renders the share image and icons from the same tokens the site uses.
// Run after a brand change:  node scripts/render-brand-images.mjs
// Needs network access for the two Google Fonts families.
import { chromium } from "playwright";

const fonts =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500&display=block";
const head = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${fonts}">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Archivo, sans-serif; -webkit-font-smoothing: antialiased; }
  .tile { position: relative; display: flex; align-items: center; justify-content: center;
    background: #5140d8; color: #fff; font-weight: 600; letter-spacing: -0.02em; }
  .tile small { position: absolute; font-weight: 500; opacity: .8; line-height: 1; }
</style>`;

const tile = (
  size,
) => `${head}<body style="width:${size}px;height:${size}px;background:transparent">
<div class="tile" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.22)}px;font-size:${size * 0.5}px;padding-top:${size * 0.12}px">
  <small style="top:${size * 0.11}px;left:${size * 0.14}px;font-size:${size * 0.2}px">18</small>Ar
</div></body>`;

const share = `${head}<body style="width:1200px;height:630px;background:#f5f5f8;color:#14142a;padding:56px 72px;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;gap:16px">
  <div class="tile" style="width:56px;height:56px;border-radius:12px;font-size:27px;padding-top:7px">
    <small style="top:6px;left:8px;font-size:11px">18</small>Ar
  </div>
  <div style="font-size:32px;font-weight:600;font-stretch:112%;letter-spacing:-0.02em">argon</div>
</div>
<h1 style="margin-top:36px;font-size:82px;line-height:1;font-weight:560;font-stretch:114%;letter-spacing:-0.036em">Git for MongoDB,<br>built for AI agents</h1>
<p style="margin-top:22px;font-size:28px;line-height:1.4;color:#4a4d66;max-width:900px">Give each agent its own database branch. Review what to merge.</p>
<div style="margin-top:auto;height:138px;border-radius:18px;background:#15141f;border:1px solid #2b2a3c;display:flex;align-items:center;padding:0 40px;gap:28px;box-shadow:0 28px 60px -32px rgb(20 20 42 / .55)">
  <div style="font:400 18px/1 'IBM Plex Mono',monospace;color:#abaabf;flex:0 0 auto;display:flex;flex-direction:column;gap:33px"><span>main</span><span style="color:#b5a8ff">agent</span></div>
  <svg viewBox="0 0 900 104" preserveAspectRatio="none" style="flex:1 1 0;min-width:0;height:84px;overflow:visible">
    <path d="M 20 20 H 880 M 20 20 C 150 20 120 84 260 84 H 620 C 760 84 730 20 880 20" fill="none" stroke="#424158" stroke-width="2"/>
    <g style="filter:drop-shadow(0 0 6px rgb(181 168 255 / .75))" fill="none" stroke="#b5a8ff" stroke-width="3">
      <path d="M 20 20 C 150 20 120 84 260 84 H 620"/>
    </g>
    <circle cx="20" cy="20" r="8" fill="#b5a8ff"/><circle cx="260" cy="84" r="8" fill="#b5a8ff"/>
    <circle cx="620" cy="84" r="8" fill="#b5a8ff"/><circle cx="620" cy="84" r="17" fill="none" stroke="#b5a8ff" stroke-width="1.5"/>
    <circle cx="880" cy="20" r="8" fill="#15141f" stroke="#424158" stroke-width="2"/>
  </svg>
  <div style="flex:0 0 auto;white-space:nowrap;font:400 20px/1.5 'IBM Plex Mono',monospace;color:#ecebf5;text-align:right"><span style="color:#8b8aa0">price</span> 49 <span style="color:#8b8aa0">→</span> <span style="color:#b5a8ff">44</span><br><span style="font:400 16px Archivo,sans-serif;color:#8b8aa0">ready for review</span></div>
</div>
</body>`;

const browser = await chromium.launch();
async function render(html, width, height, path, transparent = false) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path, omitBackground: transparent });
  await page.close();
}
await render(share, 1200, 630, "public/og.png");
await render(tile(64), 64, 64, "public/icon-64.png", true);
await render(tile(180), 180, 180, "public/apple-touch-icon.png", true);
await render(tile(256), 256, 256, "public/argon-logo.png", true);
await browser.close();
console.log(
  "rendered og.png, icon-64.png, apple-touch-icon.png, argon-logo.png",
);
