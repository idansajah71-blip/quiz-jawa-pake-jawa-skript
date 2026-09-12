import { create } from "zustand"
import { persist } from "zustand/middleware"
import { QUESTIONS } from "../data/questions"
import "../engine/constants.jawa"
import "../engine/scoring.jawa"
import "../engine/quiz.jawa"
import "../engine/highscore.jawa"
import type { CategoryId, HighScore, Language, Question, QuizResult } from "../types"

export const SECOND_PER_QUESTION = window.__jawaConstants.DURASI_SABEN_PITAKON
const QUESTIONS_PER_QUIZ = window.__jawaConstants.SKOR_PAKET
const MAX_HIGH_SCORES = window.__jawaConstants.MAX_SKOR_SKOR

interface QuizState {
  language: Language
  selectedCategories: CategoryId[]
  questionCount: number
  shuffleQuestions: boolean

  quizRunning: boolean
  questions: Question[]
  currentIndex: number
  answers: number[]
  startTime: number | null
  currentStart: number

  highScores: HighScore[]

  setLanguage: (lang: Language) => void
  toggleCategory: (cat: CategoryId) => void
  setQuestionCount: (n: number) => void
  toggleShuffle: () => void

  startQuiz: (categories: CategoryId[]) => void
  answer: (optionIndex: number) => void
  nextQuestion: () => void
  finishQuiz: () => QuizResult | null
  resetQuiz: () => void

  continueWithLang: (lang: Language) => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      language: "id",
      selectedCategories: [],
      questionCount: QUESTIONS_PER_QUIZ,
      shuffleQuestions: true,

      quizRunning: false,
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: null,
      currentStart: 0,

      highScores: [],

      setLanguage: (lang) => set({ language: lang }),

      toggleCategory: (cat) =>
        set((s) => ({
          selectedCategories: s.selectedCategories.includes(cat)
            ? s.selectedCategories.filter((c) => c !== cat)
            : [...s.selectedCategories, cat],
        })),

      setQuestionCount: (n) => set({ questionCount: n }),

      toggleShuffle: () => set((s) => ({ shuffleQuestions: !s.shuffleQuestions })),

      continueWithLang: (lang) => {
        get().setLanguage(lang)
      },

      startQuiz: (categories) =>
        set((s) => {
          const pool = window.__jawaQuiz.pilihSoal(
            QUESTIONS,
            categories,
            s.questionCount,
            s.shuffleQuestions,
          )
          return {
            quizRunning: true,
            questions: pool,
            currentIndex: 0,
            answers: [],
            startTime: Date.now(),
            currentStart: Date.now(),
            selectedCategories: categories,
          }
        }),

      answer: (optionIndex) =>
        set((s) => {
          if (!s.quizRunning) return s
          const newAnswers = [...s.answers]
          newAnswers[s.currentIndex] = optionIndex
          return { answers: newAnswers }
        }),

      nextQuestion: () =>
        set((s) => ({
          currentIndex: s.currentIndex + 1,
          currentStart: Date.now(),
        })),

      finishQuiz: () => {
        const s = get()
        const endTime = Date.now()
        const correct = window.__jawaQuiz.itungBener(s.questions, s.answers)
        const result: QuizResult = {
          total: s.questions.length,
          correct,
          answers: [...s.answers],
          startTime: s.startTime ?? endTime,
          endTime,
        }
        const accuracy = window.__jawaScoring.hitungAkurasi(correct, result.total)

        const highScore: HighScore = {
          score: correct,
          accuracy,
          correct,
          total: result.total,
          language: s.language,
          time: Math.round((endTime - (s.startTime ?? endTime)) / 1000),
          date: endTime,
        }
        const updated = window.__jawaHighscore.tambahSkor(
          [...get().highScores],
          highScore,
        ) as HighScore[]
        set(() => ({
          highScores:
            updated.length > MAX_HIGH_SCORES
              ? updated.slice(0, MAX_HIGH_SCORES)
              : updated,
        }))
        return result
      },

      resetQuiz: () =>
        set({
          quizRunning: false,
          questions: [],
          currentIndex: 0,
          answers: [],
          startTime: null,
          currentStart: 0,
        }),
    }),
    {
      name: "jawa-quiz-storage",
      partialize: (s) => ({
        language: s.language,
        highScores: s.highScores,
      }),
    },
  ),
)

export { QUESTIONS_PER_QUIZ }