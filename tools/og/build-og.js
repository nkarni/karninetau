// Builds the Open Graph share card (1200x630 PNG) for the site.
// Run: ASDF_NODEJS_VERSION=25.1.0 node tools/og/build-og.js
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const root = path.join(__dirname, '..', '..');
const imgPath = path.join(root, 'versions/v2/images/nk.jpg');
const outPath = path.join(root, 'versions/v2/og-image.png');

const b64 = fs.readFileSync(imgPath).toString('base64');
const dataUri = `data:image/jpeg;base64,${b64}`;

const paper = '#fbfbfa';
const ink = '#0e0e0d';
const body = '#4d4c46';
const muted = '#6b6b66';
const line = '#e4e2dd';
const accent = '#ea580c';
const ff = 'Inter';

const fontsDir = path.join(__dirname, 'node_modules/@expo-google-fonts/inter');
const fontFiles = [
  path.join(fontsDir, '400Regular/Inter_400Regular.ttf'),
  path.join(fontsDir, '500Medium/Inter_500Medium.ttf'),
  path.join(fontsDir, '600SemiBold/Inter_600SemiBold.ttf'),
  path.join(fontsDir, '700Bold/Inter_700Bold.ttf'),
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <clipPath id="round"><rect x="796" y="157" width="316" height="316" rx="28" ry="28"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${paper}"/>
  <rect x="32" y="32" width="1136" height="566" rx="24" ry="24" fill="none" stroke="${line}" stroke-width="1.5"/>

  <!-- eyebrow -->
  <circle cx="95" cy="207" r="7" fill="${accent}"/>
  <text x="116" y="215" font-family="${ff}" font-size="22" font-weight="600" letter-spacing="3" fill="${muted}">PRODUCT &amp; DELIVERY LEADERSHIP</text>

  <!-- name -->
  <text x="88" y="322" font-family="${ff}" font-size="86" font-weight="700" fill="${ink}">Nitzan Karni</text>

  <!-- tagline -->
  <text x="90" y="392" font-family="${ff}" font-size="33" font-weight="400" fill="${body}">From first idea or stalled project</text>
  <text x="90" y="436" font-family="${ff}" font-size="33" font-weight="400" fill="${body}">to shipped product.</text>

  <!-- url -->
  <circle cx="95" cy="548" r="7" fill="${accent}"/>
  <text x="116" y="556" font-family="${ff}" font-size="26" font-weight="500" fill="${ink}">karni.net.au</text>

  <!-- headshot -->
  <image href="${dataUri}" x="796" y="157" width="316" height="316" clip-path="url(#round)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="796" y="157" width="316" height="316" rx="28" ry="28" fill="none" stroke="${line}" stroke-width="1.5"/>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  background: paper,
});
fs.writeFileSync(outPath, resvg.render().asPng());
console.log('Wrote', outPath);
