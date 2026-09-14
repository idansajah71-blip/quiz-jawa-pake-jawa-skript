# Basa Jawa Quiz

Kuis interaktif untuk belajar bahasa Jawa. Dibangun dengan **JawaScript** — bahasa pemrograman khusus dengan sintaks mirip bahasa Jawa.

## Fitur

- **24 soal** dalam 4 kategori: Kosakata, Ungkapan & Peribahasa, Budaya Jawa, Angka
- **Bilingual**: Bahasa Indonesia & Bahasa Jawa
- **Verifikasi jawaban**: Pilih → Verifikasi → Cek → Lanjut
- **Skoring IRT 3PL**: Grade A-D, akurasi, waktu
- **Onboarding**: Penjelasan JawaScript (bukan Java!)
- **Profil**: Donut chart akurasi, pencapaian, riwayat aktivitas
- **Peringkat**: Podium top-3, filtering per minggu/bulan/semua
- **Riwayat**: Log quiz sebelumnya dengan detail
- **Dark mode**: Warm cream palette (#FDF6EC)

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Icons | Lucide React |
| Bahasa | JawaScript (custom, transpile ke JS via Vite plugin) |

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
├── engine/                 # JawaScript files (.jawa)
├── jawascript/             # Transpiler (tokenizer → parser → emitter)
├── data/                   # Soal & kategori
├── store/                  # Zustand store
└── i18n/                   # Translasi bilingual
```

## JawaScript

Bahasa pemrograman custom dengan keywords bahasa Jawa:

| JawaScript | JavaScript |
|------------|------------|
| `fungsi` | `function` |
| `yen` | `if` |
| `ora` | `else` |
| `balekno` | `return` |
| `tampilno` | `console.log` |
| `ono` | `let` |
| `paten` | `const` |
| `nganti` | `while` |
| `kanggo` | `for` |

## License

MIT
