const fs = require("fs")
const g = JSON.parse(fs.readFileSync("glyph.json", "utf8"))

// bbox terus terang
function bake(d, w) {
  return `viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#2F9B6B"/><circle cx="53" cy="12" r="6.5" fill="#F28C3C"/><g transform="translate(${tx} ${ty}) scale(${s})"><path d="${d}" fill="#FFF8EE"/></g></svg>`
}

// ja bbox: x1:78 y1:-546 x2:942 y2:0 ; ketinggian 546, lebar 864
const S = 54 / (942 - 78)
const ty = 32 - (0 - (-546)) * 0.5 * S - (0 - -546) / 2 * 0
// baseline y2=0 -> set: biar glyph mentok 22px dari bawah
const tyc = 32 + (-546) * 0.5 * S
const ja = { d: g.jp, w: g.wa, b: { x1: 78, y1: -546, x2: 942, y2: 0 } }

// hitung: muka=font units. translate supaya centered horizontal+vertikal
const sy = 44 / 546
const scl = Math.min(54 / 864, 44 / 546)
const gW = 864 * scl
const tx = 32 - (78 + 426) * scl
const tyf = 32 + 546 * scl * 0.5

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="18" fill="#2F9B6B"/><circle cx="53" cy="12" r="6.5" fill="#F28C3C"/><g transform="translate(${tx} ${tyf}) scale(${scl})"><path d="${g.jp}" fill="#FFF8EE"/></g></svg>`

fs.writeFileSync("C:/Users/User/jawa-quiz/public/favicon.svg", favicon)
console.log("favicon written ✔", favicon.length)

const comp = `export function JawaLogo({ size = 132, className }: { size?: number; className?: string }) {
  const scl = (size * 0.84) / 864
  const tx = (size - 864 * scl) / 2 - 78 * scl
  const ty = size - size * 0.84 * 0.6
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <g transform={\`translate(\${tx} \${ty}) scale(\${scl})\`}>
        <path d={JAWA_D} fill="#FFF8EE" />
      </g>
    </svg>
  )
}

const JAWA_D = ${JSON.stringify(g.jp)}
`
fs.writeFileSync("C:/Users/User/jawa-quiz/src/components/JawaLogo.tsx", comp)
console.log("JawaLogo written ✔")
