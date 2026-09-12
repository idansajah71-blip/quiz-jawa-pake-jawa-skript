const fs = require("fs")
const g = JSON.parse(fs.readFileSync("jawa-glyph/glyph.json", "utf8"))

// bbox glyph ꦗ: x 78..942, y 0..-546 (baseline 0). Lebar 864, tinggi 546 (font units)
const GX2 = 942, GX1 = 78, GY2 = 0, GY1 = -546
const S = 0.0495
const W = (GX2 - GX1) * S
const H = (GX2 - GX1) * 0.4 * S

function tx() { return (64 - W) / 2 - GX1 * S }
function ty() { return (64 + (GY2 - GY1) * S) / 2 + GY1 * S }

const fav = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="18" fill="#2F9B6B"/>
  <circle cx="53.5" cy="12" r="6.5" fill="#F28C3C"/>
  <g transform="translate(${tx().toFixed(2)} ${ty().toFixed(2)}) scale(${S})">
    <path d="${g.jp}" fill="#FFF8EE"/>
    <path d="${g.wp}" transform="translate(${g.jadvr} 0)" fill="#FFF8EE"/>
  </g>
</svg>
`
fs.writeFileSync("C:/Users/User/jawa-quiz/public/favicon.svg", fav)
console.log("favicon.svg written:", fav.length, "| g.jp len:", g.jp.length)