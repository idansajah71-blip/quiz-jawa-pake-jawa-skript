# Basa Jawa Quiz

Kuis interaktif untuk belajar bahasa Jawa. Dibangun dengan **JawaScript** — bahasa pemrograman khusus dengan sintaks mirip bahasa Jawa yang ditranspile ke JavaScript secara real-time.

> **Bukan Java.** JawaScript adalah bahasa pemrograman independen dengan keywords bahasa Jawa, bukan sekadar rename dari Java/JavaScript.

---

## JawaScript — Bahasa Pemrograman Berbasis Bahasa Jawa

JawaScript adalah heart dari proyek ini. Seluruh logika aplikasi — mulai dari mesin skoring, pengacakan soal, hingga timer — ditulis dalam file `.jawa` dan ditranspile ke JavaScript oleh Vite plugin custom.

### Kenapa JawaScript?

- **41 keywords** yang mapping langsung ke JavaScript
- **18 member names** (nama properti/method) dalam bahasa Jawa
- **Full transpiler**: Tokenizer → Parser (Pratt) → Emitter
- **Zero config**: Vite plugin otomatis transpile `.jawa` saat import
- **Hot Module Replacement**: Edit `.jawa`, langsung hot-reload di browser

### Keyword Mapping Lengkap

| JawaScript | JavaScript | Keterangan |
|------------|------------|------------|
| `fungsi` | `function` | Deklarasi fungsi |
| `ono` | `let` | Variabel mutable |
| `paten` / `tetep` | `const` | Variabel immutable |
| `yen` | `if` | Kondisional |
| `ora` | `else` | Alternatif |
| `ora yen` | `else if` | Kondisional alternatif |
| `balekno` | `return` | Mengembalikan nilai |
| `nganti` | `while` | Loop while |
| `kanggo` | `for` | Loop for |
| `mandheg` | `break` | Hentikan loop |
| `lanjutna` | `continue` | Lanjut iterasi berikutnya |
| `milih` | `switch` | Pilihan berganda |
| `kasus` | `case` | Opsi switch |
| `asale` | `default` | Default switch |
| `kelas` | `class` | Deklarasi kelas |
| `warisan` | `extends` | Pewarisan kelas |
| `anyar` | `new` | Instansiasi objek |
| `nyoba` | `try` | Error handling |
| `nompo` | `catch` | Tangkap error |
| `akhire` | `finally` | Blok finally |
| `buang` | `throw` | Lemparkan error |
| `sambil` | `async` | Async function |
| `enteni` | `await` | Tunggu promise |
| `tampilno` | `console.log` | Output ke console |
| `bener` | `true` | Boolean true |
| `salah` | `false` | Boolean false |
| `suwung` | `null` | Null value |
| `rajelas` | `undefined` | Undefined value |
| `iki` | `this` | Referensi objek sendiri |
| `saka` | `of` | Loop iterable |
| `ing` | `in` | Property check |
| `lan` | `&&` | AND logika |
| `utawa` | `||` | OR logika |
| `padhaKaro` | `===` | Strict equal |
| `oraPadha` | `!==` | Strict not equal |
| `gedhePadha` | `>=` | Greater or equal |
| `cilikPadha` | `<=` | Less or equal |
| `gedhe` | `>` | Greater than |
| `cilik` | `<` | Less than |

### Member Name Mapping

| JawaScript | JavaScript |
|------------|------------|
| `layar` | `window` |
| `dokumen` | `document` |
| `tampil` | `console` |
| `serat` | `console.log` |
| `ngadat` | `console.error` |
| `awas` | `console.warn` |
| `kabar` | `console.info` |
| `tabel` | `console.table` |
| `kirim` | `fetch` |
| `jupuk` | `querySelector` |
| `jupukKabeh` | `querySelectorAll` |
| `jupukId` | `getElementById` |
| `gawe` | `createElement` |
| `tempel` | `appendChild` |
| `rungokno` | `addEventListener` |
| `janji` | `Promise` |
| `teksDadiInteger` | `parseInt` |
| `teksDadiDesimal` | `parseFloat` |

### Contoh Kode

**Variable & Kondisional:**
```jawa
ono x = 10;
ono y = 20;

yen (x < y) {
    tampilno("x luwih cilik");
} ora {
    tampilno("x luwih gedhe");
}
```

**Fungsi & Grade:**
```jawa
fungsi golGrade(akurasi) {
    yen (akurasi >= 90) { balekno "A"; }
    yen (akurasi >= 75) { balekno "B"; }
    yen (akurasi >= 60) { balekno "C"; }
    balekno "D";
}
```

**Kelas:**
```jawa
kelas Kethek {
    constructor(jeneng) {
        iki.jeneng = jeneng;
    }

    mangan(kg) {
        tampilno(iki.jeneng + " mangan " + kg + " kg");
    }
}

ono si = anyar Kethek("Kiki");
si.mangan(2);
```

**Async & Fetch:**
```jawa
sambil fungsi ambilData() {
    ono res = enteni kirim("https://jsonplaceholder.typicode.com/todos/1");
    ono data = enteni res.json();
    tampilno(data);
}

ambilData();
```

**Switch:**
```jawa
ono dina = "Senin";

milih (dina) {
    kasus "Senin":
        tampilno("Iki Senin");
        mandheg;
    kasus "Selasa":
        tampilno("Iki Selasa");
        mandheg;
    asale:
        tampilno("Dina liya");
}
```

### Arsitektur Transpiler

```
.jawa file
    │
    ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Tokenizer│───▶│  Parser  │───▶│ Emitter  │──▶ JavaScript
│ (lexer)  │    │ (Pratt)  │    │ (codegen)│
└──────────┘    └──────────┘    └──────────┘
     │               │               │
  Scan tokens    Build AST     Generate JS
  dari source    (expressions,  (clean JS
  (strings,      statements,    code tanpa
  numbers,       classes,       dependency)
  keywords)      arrow fn)
```

### Vite Plugin Integration

Plugin custom di `plugins/vite-plugin-jawa.ts` menangani transpilasi:

```ts
export function jawaPlugin(): Plugin {
  return {
    name: "vite-plugin-jawa",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".jawa")) return null
      const js = translate(code)  // Tokenize → Parse → Emit
      return { code: js, map: null }
    },
  }
}
```

Cukup import file `.jawa` di TypeScript/React, Vite akan otomatis transpile:

```ts
import "../engine/scoring.jawa"  // ← Vite transpile ke JS
const grade = window.__jawaScoring.golGrade(95)  // "A"
```

### File .jawa dalam Proyek

| File | Fungsi | Baris |
|------|--------|-------|
| `constants.jawa` | Konstanta aplikasi (durasi, skor, kategori) | 15 |
| `scoring.jawa` | Mesin skoring (akurasi, format waktu, grade) | 38 |
| `quiz.jawa` | Mesin quiz (acak, pilih soal, hitung benar) | 53 |
| `highscore.jawa` | Pengelolaan skor tertinggi | - |
| `timer.jawa` | Countdown timer | - |
| `validate.jawa` | Validasi jawaban, generate summary | - |
| `format.jawa` | Format tampilan (persentase, opsi, skor) | - |
| `translations.jawa` | 128 kunci translasi bilingual | 128 |
| `questions.jawa` | 24 soal dalam 4 kategori | - |
| `categories.jawa` | Definisi 4 kategori | 7 |
| `playground-examples.jawa` | Contoh kode JawaScript | 15 |

---

## Fitur Aplikasi

- **24 soal** dalam 4 kategori: Kosakata, Ungkapan & Peribahasa, Budaya Jawa, Angka
- **Bilingual**: Bahasa Indonesia & Bahasa Jawa
- **Verifikasi jawaban**: Pilih → Verifikasi → Cek → Lanjut
- **Skoring IRT 3PL**: Grade A-D, akurasi, waktu
- **Onboarding**: Penjelasan JawaScript (bukan Java!)
- **Profil**: Donut chart akurasi, pencapaian, riwayat aktivitas
- **Peringkat**: Podium top-3, filtering per minggu/bulan/semua
- **Riwayat**: Log quiz sebelumnya dengan detail
- **Warm cream palette**: #FDF6EC

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 + custom `.jawa` plugin |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Icons | Lucide React |
| Bahasa | **JawaScript** (custom transpiler) |

## Getting Started

### Prerequisites

- **Node.js** v18 atau lebih baru ([download](https://nodejs.org/))
- **npm** (sudah include dengan Node.js)

Cek versi Node.js kamu:

```bash
node --version  # minimal v18.x
npm --version
```

### Clone & Install

```bash
# Clone repository
git clone https://github.com/idansajah71-blip/quiz-jawa-pake-jawa-skript.git

# Masuk ke folder project
cd quiz-jawa-pake-jawa-skript

# Install dependencies
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses:

```
http://localhost:4001
```

Dev server mendukung **Hot Module Replacement (HMR)** — setiap perubahan di file `.ts`, `.tsx`, atau `.jawa` akan langsung ter-reload di browser tanpa restart.

### Build untuk Production

```bash
# Build optimized untuk deploy
npm run build

# Preview hasil build secara lokal
npm run preview
```

Output build ada di folder `dist/`, siap di-deploy ke Vercel, Netlify, atau hosting lainnya.

### Available Scripts

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Jalankan dev server (port 4001) |
| `npm run build` | Build untuk production (TypeScript + Vite) |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan oxlint untuk cek kode |

### Cara Pakai Aplikasi

1. **Onboarding** — Saat pertama kali buka, akan muncul 4 layar penjelasan tentang JawaScript dan fitur aplikasi. Klik **Lanjut** atau **Lewati**.

2. **Pilih Bahasa** — Di beranda, klik tombol globe (🌐) untuk switch antara Bahasa Indonesia dan Bahasa Jawa.

3. **Mulai Quiz** — Klik **Mulai** di beranda, lalu:
   - Pilih kategori (Kosakata, Ungkapan & Peribahasa, Budaya Jawa, Angka)
   - Atur jumlah soal (5 / 10 / 15)
   - Aktifkan/Nonaktifkan acak soal
   - Klik **Mulai!**

4. **Jawab Soal** — Pilih salah satu opsi jawaban (A/B/C/D), lalu klik **Verifikasi Jawaban** untuk mengecek. Klik **Lanjut** untuk soal berikutnya.

5. **Lihat Hasil** — Setelah selesai, kamu akan melihat:
   - Skor dan grade (A/B/C/D)
   - Akurasi jawaban
   - Waktu pengerjaan
   - Tab **Pembahasan** untuk melihat semua jawaban

6. **Cek Profil** — Lihat statistik lengkap, pencapaian (achievements), dan riwayat quiz.

7. **Lihat Peringkat** — Cek podium top-3 dan ranking berdasarkan XP. Filter per minggu, bulan, atau sepanjang masa.

8. **Login (Opsional)** — Login untuk menyimpan progres secara persisten.

## Struktur Project

```
src/
├── App.tsx                 # Router utama
├── components/             # 10 layar UI
│   ├── HomeScreen.tsx      # Beranda
│   ├── SetupScreen.tsx     # Pilih kategori
│   ├── QuizScreen.tsx      # Layar kuis
│   ├── ResultScreen.tsx    # Hasil + review
│   ├── LeaderboardScreen.tsx
│   ├── RiwayatScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LoginScreen.tsx
│   ├── OnboardingScreen.tsx
│   └── BottomNav.tsx       # Nav responsif
├── engine/                 # 11 file .jawa (logika aplikasi)
├── jawascript/             # Transpiler (tokenizer → parser → emitter)
├── data/                   # Soal & kategori
├── store/                  # Zustand store
├── i18n/                   # Translasi bilingual
└── plugins/                # Vite plugin (.jawa transpiler)
```

## Troubleshooting

### Port 4001 sudah dipakai

```bash
# Cari process yang pakai port 4001
netstat -ano | findstr :4001

# Matikan process (ganti PID dengan angka yang muncul)
taskkill /PID <PID> /F
```

### Error "Cannot find module '.jawa'"

Pastikan `tsconfig.app.json` punya `"allowArbitraryExtensions": true` di `compilerOptions`.

### Dev server lambat / error

```bash
# Hapus node_modules dan install ulang
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Build error TypeScript

```bash
# Clear cache TypeScript
Remove-Item -Recurse -Force dist
npm run build
```

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✓ Supported |
| Firefox 90+ | ✓ Supported |
| Safari 15+ | ✓ Supported |
| Edge 90+ | ✓ Supported |

## License

MIT
