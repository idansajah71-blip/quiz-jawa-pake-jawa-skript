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

```bash
# Install dependencies
npm install

# Jalankan dev server (port 4001)
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

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

## License

MIT
