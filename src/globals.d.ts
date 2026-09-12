import type { CategoryId, HighScore, Language, LocalizedText, Question } from "./types"

interface RingkasanItem {
  indeks: number
  benar: boolean
  tipe: string
  jawabanSoal: Question
  jawabanUser: number | undefined
}

declare global {
  interface Window {
    __jawaI18n: Record<string, LocalizedText>
    __jawaQuestions: Question[]
    __jawaCategories: Record<CategoryId, { id: CategoryId; icon: string; question: LocalizedText }>
    __jawaConstants: {
      DURASI_SABEN_PITAKON: number
      MAX_SKOR_SKOR: number
      SKOR_PAKET: number
      CATEGORY_IDS: CategoryId[]
      OPSI_LABEL: string[]
      VARIAN_WARNA: string[]
      GRADE_WARNA: Record<string, string>
    }
    __jawaScoring: {
      hitungAkurasi(jumlahBener: number, jumlahTotal: number): number
      formatWaktu(detik: number): string
      nilaiPesan(akurasi: number, lang: Language): string
      golGrade(akurasi: number): string
    }
    __jawaQuiz: {
      acak<T>(arr: T[]): T[]
      pilihSoal(
        semua: Question[],
        kategori: CategoryId[],
        jumlah: number,
        kuduAcak: boolean,
      ): Question[]
      itungBener(daftarSoal: Question[], daftarJawaban: number[]): number
    }
    __jawaHighscore: {
      tambahSkor(daftar: HighScore[], entri: HighScore): HighScore[]
      formatTanggal(ms: number): string
    }
    __jawaTimer: {
      hitungSisa(waktuMulai: number, durasi: number, kini: number): number
      wektuEntek(sisa: number): boolean
    }
    __jawaValidate: {
      tipeJawaban(jawaban: number | undefined): string
      apakahBener(jawaban: number, benar: number): boolean
      gaweRingkesan(daftarSoal: Question[], daftarJawaban: number[]): RingkasanItem[]
      labelOpsi(indeks: number): string
      labelStatus(bener: boolean, tipe: string, lang: Language): string
    }
    __jawaFormat: {
      persentase(nilai: number): string
      labelOpsi(indeks: number): string
      nomorSoal(skrine: number, total: number): string
      skorAkhir(bener: number, total: number): string
      judulKategori(kategori: { label: LocalizedText }, lang: Language): string
      labelWktu(sisa: number): string
      formatUrutan(nomor: number): string
    }
    __jawaPlayground: {
      contoDhasar: string
      contoKelas: string
      contoAsync: string
      contoSwitch: string
      daftarConto(): Array<{ name: string; code: string }>
    }
  }
}

export {}