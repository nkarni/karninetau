const fontkit = require('fontkit');
const f = fontkit.openSync(__dirname + '/node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf');
function widthPx(str, size) { const r = f.layout(str); return (r.advanceWidth / f.unitsPerEm) * size; }
const lines = [
  'From first idea or stalled project to shipped product.',
  'From first idea to shipped product.',
  'From idea to shipped product.',
  'From first idea or stalled project',
  'to a shipped product.',
  'Ideas and stalled projects,',
  'shipped.',
];
const usableDesktop = 896 - 48; // max-w-4xl
[48, 44, 40, 36].forEach((sz) => {
  console.log(`--- ${sz}px (desktop usable ${usableDesktop}) ---`);
  lines.forEach((l) => {
    const w = widthPx(l, sz);
    console.log(`  ${String(Math.round(w)).padStart(4)}px  ${w <= usableDesktop ? 'fits ' : 'WRAPS'}  "${l}"`);
  });
});
