import "../engine/questions.jawa"
import "../engine/categories.jawa"
import type { CategoryId, Question } from "../types"

export const QUESTIONS: Question[] = window.__jawaQuestions

export const CATEGORIES = window.__jawaCategories

export const CATEGORY_LIST: CategoryId[] = [
  "kosakata",
  "ungkapan",
  "budaya",
  "angka",
]

export function getQuestionsByCategory(categories: CategoryId[]): Question[] {
  return QUESTIONS.filter((q) => categories.includes(q.category))
}