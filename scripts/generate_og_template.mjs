import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function generate() {
  console.log("Generating 1200x630 OG template...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #041f17 0%, #064e3b 45%, #0f2b23 80%, #021a13 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 55px 70px;
      position: relative;
      overflow: hidden;
    }
    /* Subtle bamboo aesthetic decoration */
    .bg-circle-1 {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%);
      top: -150px;
      right: -100px;
      pointer-events: none;
    }
    .bg-circle-2 {
      position: absolute;
      width: 450px;
      height: 450px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(5, 150, 105, 0) 70%);
      bottom: -100px;
      left: 100px;
      pointer-events: none;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    }
    .brand-text h1 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-text p {
      font-size: 13px;
      font-weight: 700;
      color: #34d399;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .badge-web3 {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 20px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 700;
      color: #a7f3d0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 50px;
      position: relative;
      z-index: 2;
      margin: 10px 0;
    }
    .profile-card {
      flex: 1.2;
    }
    .profile-eyebrow {
      font-size: 14px;
      font-weight: 800;
      color: #34d399;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .profile-name {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-bottom: 14px;
      background: linear-gradient(135deg, #ffffff 0%, #d1fae5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .profile-tagline {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.5;
      max-width: 580px;
    }
    .clusters-panel {
      flex: 1;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 24px;
      padding: 24px 28px;
    }
    .clusters-title {
      font-size: 13px;
      font-weight: 800;
      color: #6ee7b7;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    .cluster-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .cluster-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #ecfdf5;
    }
    .cluster-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 24px;
    }
    .cta-button {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      padding: 14px 34px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.45);
    }
    .website {
      font-size: 18px;
      font-weight: 700;
      color: #a7f3d0;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <div class="header">
    <div class="brand">
      <div class="brand-logo">🎋</div>
      <div class="brand-text">
        <h1>BaMbooChain</h1>
        <p>Digital Bamboo Economy</p>
      </div>
    </div>
    <div class="badge-web3">
      <span>🌿</span> Verified Green Passport
    </div>
  </div>

  <div class="main">
    <div class="profile-card">
      <div class="profile-eyebrow">
        <span>⚡</span> Profil Pegiat Ekosistem Hijau
      </div>
      <div class="profile-name">
        Kedaulatan Bambu Nusantara
      </div>
      <div class="profile-tagline">
        Platform kolaboratif ekonomi digital bambu, pemetaan rumpun lestari, dan identitas hijau Web3 lintas generasi.
      </div>
    </div>

    <div class="clusters-panel">
      <div class="clusters-title">5 Kluster Ekosistem BaMbooChain</div>
      <div class="cluster-items">
        <div class="cluster-item"><div class="cluster-dot"></div> Keseimbangan Lingkungan</div>
        <div class="cluster-item"><div class="cluster-dot"></div> Pemulihan Ekologis</div>
        <div class="cluster-item"><div class="cluster-dot"></div> Penanaman Bambu Digital</div>
        <div class="cluster-item"><div class="cluster-dot"></div> Petani Milenial</div>
        <div class="cluster-item"><div class="cluster-dot"></div> Wirausaha Milenial</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="cta-button">
      JOIN THE BAMBOO ECOSYSTEM ➔
    </div>
    <div class="website">
      www.bamboochain.id
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outDir = path.resolve('public/images');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath1 = path.join(outDir, 'bamboochain-profile-share.png');
  const outPath2 = path.join(outDir, 'bamboochain-og-template.png');

  await page.screenshot({ path: outPath1, type: 'png' });
  await page.screenshot({ path: outPath2, type: 'png' });

  console.log("Successfully generated OG templates at:", outPath1, "and", outPath2);
  await browser.close();
}

generate().catch(err => {
  console.error("Error generating OG template:", err);
  process.exit(1);
});
