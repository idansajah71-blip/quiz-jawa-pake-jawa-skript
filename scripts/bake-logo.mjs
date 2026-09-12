const fs = require("fs")

// ---- premiumHijau.tsx + favicon + JawaLogo bake (pat setengah: glyph ꦗ asli Noto) ----
const D = "M240-68L222 0Q155-8 116.50-44Q78-80 78-150L78-388Q78-546 238-546Q396-546 396-393L396-131Q396-68 455-68L599-68Q489-116 489-271L489-297Q489-536 720-536L942-536L942-439L611-254L707-254Q819-254 878.50-212Q938-170 938-93L938 0L851 0L851-72Q851-137 813.50-165Q776-193 714-193L569-193Q585-117 732-68L732 0L450 0Q310 0 310-133L310-394Q310-470 238-470Q165-470 165-391L165-154Q165-80 240-68M569-332L569-300L846-473L715-473Q645-473 607-433.50Q569-394 569-332"

const gW = 864, gH = 546
const S = 64, PAD = 6
const s = Math.min((S - PAD * 2) / gW, (S - PAD * 2) / gH) // ~0.095
const tx = (S - gW * s) / 2 - 78 * s
const ty = (S - gH * s) / 2 + 546 * s // baseline y2=0 -> terjemah ke bawah Sb
// tinjau: y1=-546 (atas), y2=0 (bawah glyph). Setelah scale, atas = -gH*s.
const tyTop = (S - gH * s) / 2
const tyBase = tyTop + gH * s
const fy = tyBase

const grad = `<linearGradient id="jwg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2F9B6B"/><stop offset="0.55" stop-color="#2B8FA8"/><stop offset="1" stop-color="#3A77C4"/></linearGradient>`

// ===== public/favicon.svg ===== (64x64 tile hijau-hijau/toska) =====
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <defs>${grad}</defs>
  <rect width="64" height="64" rx="18" fill="url(#jwg)"/>
  <g transform="translate(${tx.toFixed(3)} ${fy.toFixed(3)}) scale(${s.toFixed(5)})">
    <path d="${D}" fill="#FFF8EE"/>
  </g>
</svg>
`
fs.writeFileSync("public/favicon.svg", favicon)

// ===== src/components/JawaLogo.tsx ===== (inline, size prop, tanpa variabel tak terdefinisi) =====
const comp = `interface Props {
  size?: number
  className?: string
}

const D = ${JSON.stringify(D)}

export function JawaLogo({ size = 56, className }: Props) {
  const gW = 864
  const gH = 546
  const s = Math.min((64 - 12) / gW, (64 - 12) / gH) * (size / 56)
  const tx = (64 - gW * 0.0601) / 2 - 78 * 0.0601
  const ty = (64 - gH * 0.0601) / 2 + gH * 0.0601
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="jwg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2F9B6B" />
          <stop offset="0.55" stopColor="#2B8FA8" />
          <stop offset="1" stopColor="#3A77C4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#jwg)" />
      <g transform={\`translate(\${tx.toFixed(3)} \${ty.toFixed(3)}) scale(\${s.toFixed(5)})\`}>
        <path d={D} fill="#FFF8EE" />
      </g>
    </svg>
  )
}
`
fs.writeFileSync("src/components/JawaLogo.tsx", comp)

// ===== HomeScreen: ganti LogoMark -> JavaLogo =====
let home = fs.readFileSync("src/components/HomeScreen.tsx", "utf8")
home = home
  .replace('import { LogoMark } from "./LogoMark"', 'import { JawaLogo } from "./JawaLogo"')
home = home.replace(/<LogoMark([^/]*)\/>/g, "<JawaLogo$1/>")
fs.writeFileSync("src/components/HomeScreen.tsx", home)

// hapus LogoMark.tsx kalau ada
if (fs.existsSync("src/components/LogoMark.tsx")) fs.unlinkSync("src/components/LogoMark.tsx")

console.log("favicon.svg", favicon.length, "B")
console.log("JawaLogo.tsx", comp.length, "B")
console.log("HomeScreen LogoMark->JawaLogo:", /JawaLogo/.test(home), "| LogoMark tersisa:", /LogoMark/.test(home))
console.log("D path len:", D.length)
