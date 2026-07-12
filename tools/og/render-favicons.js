const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../../versions/v2/favicon.svg');
const outDir = path.join(__dirname, '../../versions/v2');
const svg = fs.readFileSync(svgPath);

const targets = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-16x16.png', size: 16 },
];

for (const { file, size } of targets) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true },
    background: '#0e0e0d',
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(path.join(outDir, file), png);
  console.log(`wrote ${file} (${size}x${size}, ${png.length} bytes)`);
}
