import { readFileSync, writeFileSync } from "node:fs"

const favPath = "C:/Users/User/jawa-quiz/public/favicon.svg"
const fav = readFileSync(favPath, "utf8")

// ambil path d asli (glyph ja) & info grafis dari favicon disk (single source of truth)
const m = fav.match(/d="([^"]+)"[^>]*?fill="([^"]+)/) || fav.match(/path d="([^"]+)"/)
const D = m ? m[1] : ""
if (!D) throw new Error("no glyph path in favicon")

// bbox glyph ja (dari Noto): x1:78 y1:-546 x2:942 y2:0
const G = { x1: 78, y1: -546, x2: 942, y2: 0 }
const gW = G.x2 - G.x1
const gH = G.y2 - G.y1

// ---- 1) favicon.svg : multi-warna (gradient), centered, TANPA bulatan oranye ----
const TILE = 64
const PAD = 7
const s = Math.min((TILE - PAD * 2) / gW, (TILE - PAD * 2) / gH)
// centering glyph dalam tile (tx,ty di-gunakan sebagai translate yg ditempatkan di baseline)
const tx = (TILE - gW * s) / 2 - G.x1 * s
const tyTop = (TILE - gH * s) / 2 - G.y1 * s // posisi pixel puncak glyph
const tyBase = tyTop + gH * s

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="jwg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2F9B6B" />
      <stop offset="0.45" stop-color="#2B8FA8" />
      <stop offset="1" stop-color="#3F7BC4" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="url(#jwg)" />
  <g transform="translate(${tx.toFixed(3)} ${tyBase.toFixed(3)}) scale(${s.toFixed(6)})">
    <path d="${D}" fill="#FFF8EE" />
  </g>
</svg>
`
writeFileSync(favPath, favicon)
console.log("favicon.svg ->", favicon.length, "B | orange circle:", /<circle/.test(favicon), "| grad:", /linearGradient/.test(favicon))

// ---- 2) JawaLogo.tsx : komponen, pake path D yang sama, inline svg, tanpa bulatan ----
const comp = `interface Props {
  size?: number
  className?: string
}

const D = ${JSON.stringify(D)}

// bbox glyph ꦗ di fontSize 1000 (dari Noto Sans Javanese): x 78..942, y -546..0
const G = { x1: 78, y1: -546, x2: 942, y2: 0 }

export function JawaLogo({ size = 56, className }: Props) {
  const gW = G.x2 - G.x1 // 864
  const gH = G.y2 - G.y1 // 546
  const TILE = size
  const PAD = size * 0.11
  const s = Math.min((TILE - PAD * 2) / gW, (TILE - PAD * 2) / gH)
  const tx = (TILE - gW * s) / 2 - G.x1 * s
  const tyBase = (TILE - gH * s) / 2 - G.y1 * s + gH * s
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="jwg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2F9B6B" />
          <stop offset="0.45" stop-color="#2B8FA8" />
          <stop offset="1" stop-color="#3F7BC4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#jwg)" />
      <g transform={\`translate(\${tx.toFixed(3)} \${tyBase.toFixed(3)}) scale(\${s.toFixed(6)})\`}>
        <path d={D} fill="#FFF8EE" />
      </g>
    </svg>
  )
}
`
writeFileSync("C:/Users/User/jawa-quiz/src/components/JawaLogo.tsx", comp)
console.log("JawaLogo.tsx ->", comp.length, "B | orange circle:", /<circle/.test(comp))
