export type Language = "id" | "jawa"

export type CategoryId = "kosakata" | "ungkapan" | "budaya" | "angka"

export interface LocalizedText {
  id: string
  jawa: string
}

export interface Question {
  id: number
  category: CategoryId
  question: LocalizedText
  options: Record<Language, string[]>
  answer: number
}

export type QuizStatus = "setup" | "playing" | "result"

export interface QuizResult {
  total: number
  correct: number
  answers: number[]
  startTime: number
  endTime: number
}

export interface HighScore {
  score: number
  accuracy: number
  correct: number
  total: number
  language: Language
  time: number
  date: number
}