import { writeFileSync, readFileSync, unlinkSync, existsSync } from "node:fs"

let favicon = readFileSync("public/favicon.svg", "utf8")
let logo = readFileSync("src/components/JawaLogo.tsx", "utf8")
let home = readFileSync("src/components/HomeScreen.tsx", "utf8")

function ensureGrad(svg, id) {
  if (svg.includes(`id="${id}"`)) return svg
  const marker = `<defs>`
  if (svg.includes(marker)) {
    return svg.replace(marker, `${marker}\n    <linearGradient id="${id}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#2F9B6B"/><stop offset=".5" stop-color="#2B8F8F"/><stop offset="1" stop-color="#3F7BC4"/></linearGradient>`)
  }
  return svg.replace(`<svg`, `<svg>\n  <defs>\n    <linearGradient id="${id}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#2F9B6B"/><stop offset=".5" stop-color="#2B8F8F"/><stop offset="1" stop-color="#3F7BC4"/></linearGradient>\n  </defs>`)
}
function forceGrad(svg, id) {
  return svg.replace(/fill="#2F9B6B"\s*\/>|fill="#2F9B6B"/g, `fill="url(#${id})"`)
}
function removeOrange(svg) {
  return svg
    .replace(/<circle[^>]*F28C3C[^>]*\/>|\s*<circle[^>]*fill="#?F28?C?3?C?"[^>]*\/>/gi, "")
    .replace(/<circle[^>]*\/>/g, "")
}

const GID = "jwg"
favicon = ensureGrad(favicon, GID)
favicon = forceGrad(favicon, GID)
favicon = removeOrange(favicon)
favicon = favicon.replace(/<svg/, `<svg role="img" aria-label="Jawa"`)
favicon = favicon.replace(/<svg([^>]*?)>/, `<svg$1 height="64" width="64">`)

logo = ensureGrad(logo, GID)
logo = forceGrad(logo, GID)
logo = removeOrange(logo)

// centering: pastikan viewBox 64 & transform ada; sisakan math lama bila ada (bukan rx) — biarkan logo center via transform yang sudah dibaket di favicon dgn koordinat asli
// normalisasi: replace <svg> props duplikat (tinggal ukuran) — pastikan ada width/height
logo = logo.replace(/(<svg[^>]*?)(width|height)="\d+"/g, "$1").replace(/<svg([^>]*?)viewBox/, "<svg$1 viewBox")

home = home.replace(/aria-label="LogoMark"/, `aria-label="Jawa"`)
home = home.replace(/aria-label="Logo asli"/, `aria-label="Jawa"`)

writeFileSync("public/favicon.svg", favicon)
writeFileSync("src/components/JawaLogo.tsx", logo)
writeFileSync("src/components/HomeScreen.tsx", home)
console.log("favicon.svg", favicon.length, "B | grad:", /id="jwg"/.test(favicon), "| orange:", /F28C3C/i.test(favicon), "| circle:", /<circle/.test(favicon))
console.log("JawaLogo.tsx", logo.length, "B | grad:", /id="jwg"/.test(logo), "| orange:", /F28C3C/i.test(logo), "| circle:", /<circle/.test(logo))
