import { readFileSync, writeFileSync } from "node:fs"

const R = "C:/Users/User/jawa-quiz"
const rd = (p) => readFileSync(`${R}/${p}`, "utf8")
const wr = (p, c) => writeFileSync(`${R}/${p}`, c)

// ---------- 1) JawaLogo.tsx : GAMBAR ULANG dari favicon.svg (path asli Noto) ----------
const fav = rd("public/favicon.svg")
const m = fav.match(/d="([^"]+)"/)
if (!m) throw new Error("favicon: no path d")
const D = m[1]
// geometry glyph asli (bbox Noto): x:78..942, y:-546..0 (fontsize 1000)
const GX1 = 78, GX2 = 942, GY1 = -546, GY2 = 0
const gW = GX2 - GX1, gH = GY2 - GY1

const logo = `interface Props { size?: number; className?: string }

const D = ${JSON.stringify(D)}

export function JawaLogo({ size = 64, className }: Props) {
  const gW = ${gW}
  const gH = ${gH}
  const PAD = size * 0.1
  const s = Math.min((size - PAD * 2) / gW, (size - PAD * 2) / gH)
  const tx = (size - gW * s) / 2 - ${GX1} * s
  const ty = (size - gH * s) / 2 - ${GY1} * s
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden role="img" aria-label="Logo Jawa">
      <defs>
        <linearGradient id="jlg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F9B6B" />
          <stop offset="0.5" stopColor="#2B8F8F" />
          <stop offset="1" stopColor="#3F7BC4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#jlg)" />
      <g transform={\`translate(\${tx.toFixed(3)} \${ty.toFixed(3)}) scale(\${s.toFixed(4)})\`}>
        <path d={D} fill="#FFF8EE" />
      </g>
    </svg>
  )
}
`
wr("src/components/JawaLogo.tsx", logo)

// ---------- 2) HomeScreen : pakai JawaLogo (hapus LogoMark/Mascot apapun) ----------
let home = rd("src/components/HomeScreen.tsx")
const hadLogoMark = /LogoMark/.test(home)
home = home
  .replace(/import\s*\{?[^}]*\bLogoMark\b[^}]*\}?\s*from\s*"[^"]+"/gi, "")
  .replace(/\bLogoMark\b/g, "JawaLogo")
  .replace(/import\b([^;]*)JawaLogo\b/g, "import$1JawaLogo")
if (!/from\s*"\.\/JawaLogo"/.test(home))
  home = home.replace(/(\nimport) [^\n]*?from "\.\/CategoryIcon"/, '$1 { JawaLogo } from "./JawaLogo"\n  $&')
wr("src/components/HomeScreen.tsx", home)

// ---------- 3) store: acak soal + acak posisi pilihan tiap soal ----------
let store = rd("src/store/quizStore.ts")
const storePatch = `
function acakUnsur<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function acakPilihan(question: Question): Question {
  const langs = Object.keys(question.options) as Language[]
  const idx = acakUnsur(question.options[langs[0]].map((_, i) => i))
  const options = {} as Record<Language, string[]>
  for (const l of langs) options[l] = idx.map((i) => question.options[l][i])
  return { ...question, options, answer: idx.indexOf(question.answer) }
}
`
if (!/function acakPilihan/.test(store)) {
  store = store.replace(
    /const QUESTIONS_PER_QUIZ|export const QUESTIONS_PER_QUIZ|const QUESTIONS\b/,
    `${storePatch}\n$&`,
  )
  // startQuiz: acak urutan soal (pool sudah dipilih) + acak posisi pilihan
  store = store.replace(
    /questions:\s*([A-Za-z_.\[\]]+)/,
    "questions: acakUnsur($1).map(acakPilihan)",
  )
  wr("src/store/quizStore.ts", store)
}

// ---------- 4) QuizScreen: alur VERIFIKASI ----------
let qz = rd("src/components/QuizScreen.tsx")

// a) handleSelect: jgn auto-answer; hanya pilih
qz = qz.replace(
  /const handleSelect = \(optIdx: number\) => \{\s*(?:if \(submitted\) return\s*)?\s*setSelected\(optIdx\)\s*setSubmitted\(true\)\s*answer\(optIdx\)\s*\}/,
  `const handleSelect = (optIdx: number) => {
    if (submitted) return
    setSelected(optIdx)
  }`,
)

// b) tambah tombol Verifikasi ketika ada pilihan belum di-submit
qz = qz.replace(
  /<section className="mt-4 px-5">\s*<div className="card p-6">/,
  `<section className="mt-4 px-5">
        {!submitted && selected !== null && (
          <button
            onClick={() => { setSubmitted(true); if (selected !== null) answer(selected) }}
            className="btn-primary w-full py-4"
          >
            Verifikasi Jawaban <ArrowRight size={20} />
          </button>
        )}
        <div className="card p-6">`,
)

// c) jika sudah submit, tombol Lanjut
qz = qz.replace(
  /<section className="mt-4 px-5">(\s*<button[\s\S]*?Verifikasi[\s\S]*?<\/button>\s*)?<div className="card p-6">/,
  `<section className="mt-4 px-5">
        {submitted && (
          <button onClick={handleNext} className="btn-primary w-full py-4">
            {isLast ? "Lihat Hasil" : "Soal Berikutnya"} <ArrowRight size={20} />
          </button>
        )}
        <div className="card p-6">`,
)

wr("src/components/QuizScreen.tsx", qz)

// ---------- verify ----------
console.log("favicon  ok : grad", /linearGradient/.test(fav), "| orange", /F28C3C/i.test(fav), "| len", fav.length)
console.log("JawaLogo  ok : grad", /linearGradient/.test(logo), "| orange", /F28C3C/.test(logo), "| Dlen", D.length)
console.log("HomeScreen ok : LogoMark->", hadLogoMark ? "removed" : "n/a", "| JawaLogo import", /JawaLogo/.test(home))
console.log("store     ok : shuffle", /function acakPilihan/.test(store), "| acak", /acakUnsur\(.*\):\.map\(acakPilihan\)/.test(store))
console.log("QuizScreen ok : verify btn", /Verifikasi Jawaban/.test(qz), "| next btn", /Soal Berikutnya/.test(qz))
