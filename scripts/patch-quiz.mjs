import { readFileSync, writeFileSync } from "node:fs"

const D = "C:/Users/User/jawa-quiz"
const rd = (p) => readFileSync(`${D}/${p}`, "utf8")
const wr = (p, c) => writeFileSync(`${D}/${p}`, c)

// ---------- util acak (deterministik, tanpa dependensi) ----------
function acakArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// acak pilihan tiap soal: permutasi indeks pilihan + remap jawaban benar
function acakPilihanSoal(q) {
  const n = q.options.length
  if (n <= 1) return q
  const perm = acakArr(Array.from({ length: n }, (_, i) => i))
  return {
    ...q,
    options: perm.map((i) => q.options[i]),
    answer: perm.indexOf(q.answer),
  }
}

// ================= 1) quizStore.ts : acak pilihan saat memilih soal ================
let store = rd("src/store/quizStore.ts")

if (!store.includes("acakPilihanSoal")) {
  store = store.replace(
    /^import { create } from "zustand"$/m,
    `function acakPilihanSoal(q) {
  const n = q.options.length
  if (n <= 1) return q
  const perm = acakArr(Array.from({ length: n }, (_, i) => i))
  return { ...q, options: perm.map((i) => q.options[i]), answer: perm.indexOf(q.answer) }
}
function acakArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
import { create } from "zustand"`,
  )
}

// bungkus pool di startQuiz: pilihSoal(...) -> .map(acakPilihanSoal)
const shufAnchor = /const pool = ([A-Za-z0-9_.]+)\([^;]+\);/
if (shufAnchor.test(store) && !store.includes("acakPilihanSoal))"))
  store = store.replace(
    shufAnchor,
    (m, fn) =>
      `const rawPool = ${fn}Raw ? ${fn}Raw : ${fn}(${m.slice(m.indexOf("(") + 1, m.lastIndexOf(")"))})`,
  )

wr("src/store/quizStore.ts", store)

// ================= 2) QuizScreen.tsx : alur verifikasi =================
let quiz = rd("src/components/QuizScreen.tsx")

const HAS_VERIFY = /Verifikasi|verifikasiJawaban|button.*Lanjut|handleVerify|isVerified/.test(quiz)
wr("_quiz2.txt", quiz)
console.log("store patched? acakPilihanSoal:", store.includes("acakPilihanSoal"), "| len", store.length)
console.log("quiz len", quiz.length, "| has verify:", HAS_VERIFY)
