import { useEffect, useMemo, useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { localize, t } from "../i18n/translations"
import { useTimer } from "../hooks/useTimer"
import { CATEGORIES } from "../data/questions"
import type { QuizResult } from "../types"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface Props {
  onFinish: (result: QuizResult) => void
}

export function QuizScreen({ onFinish }: Props) {
  const language = useQuizStore((s) => s.language)
  const questions = useQuizStore((s) => s.questions)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const answers = useQuizStore((s) => s.answers)
  const answer = useQuizStore((s) => s.answer)
  const nextQuestion = useQuizStore((s) => s.nextQuestion)
  const finishQuiz = useQuizStore((s) => s.finishQuiz)

  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [isTimeUp, setIsTimeUp] = useState(false)

  const question = questions[currentIndex]
  const answered = answers[currentIndex] !== undefined
  const category = CATEGORIES[question.category]
  const isLast = currentIndex === questions.length - 1

  const questionText = useMemo(
    () => localize(language, question.question),
    [language, question],
  )
  const optionTexts = useMemo(
    () => question.options[language],
    [language, question],
  )

  const onTimeout = () => {
    if (!answered) {
      setIsTimeUp(true)
      setSubmitted(true)
      answer(-1)
      setSelected(null)
    }
  }

  const remaining = useTimer(window.__jawaConstants.DURASI_SABEN_PITAKON, onTimeout)

  const handleSelect = (optIdx: number) => {
    if (submitted) return
    setSelected(optIdx)
    setSubmitted(true)
    answer(optIdx)
  }

  useEffect(() => {
    const ans = answers[currentIndex]
    setIsTimeUp(ans === -1)
    setSubmitted(answered)
    setSelected(ans !== undefined && ans !== -1 ? ans : null)
  }, [currentIndex, answered, answers])

  const handleNext = () => {
    if (isLast) {
      const r = finishQuiz()
      if (r) onFinish(r)
    } else {
      nextQuestion()
    }
  }

  if (!question) return null

  const optionLabel = (i: number) => window.__jawaFormat.labelOpsi(i)
  const bgBar =
    ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-batik/60">
          <span>{category.icon}</span>
          <span>{language === "jawa" ? category.question.jawa : category.question.id}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
            remaining <= 5 ? "bg-red-100 text-red-600 animate-pulse" : "bg-gold/20 text-gold-dark"
          }`}
        >
          <Clock size={14} />
          {window.__jawaFormat.labelWktu(remaining)}
        </div>
      </header>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-batik/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
          style={{ width: `${bgBar}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs text-batik/50">
        {t(language, "questionLabel")} {currentIndex + 1} {t(language, "of")}{" "}
        {questions.length}
      </p>

      <h1 className="mt-5 font-display text-xl font-bold leading-relaxed text-batik">
        {questionText}
      </h1>

      <div className="mt-5 flex flex-col gap-3">
        {optionTexts.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === question.answer
          const showState = submitted
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`card flex items-center gap-3 text-left font-medium transition-all ${
                showState
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : isSelected
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "opacity-50"
                  : "hover:border-gold hover:bg-cream hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  showState
                    ? isCorrect
                      ? "bg-emerald-500 text-white"
                      : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-batik/10 text-batik/50"
                    : "bg-gold/20 text-gold-dark"
                }`}
              >
                {optionLabel(i)}
              </span>
              <span className="flex-1">{opt}</span>
              {showState && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
              {showState && isSelected && !isCorrect && (
                <XCircle size={20} className="text-red-500" />
              )}
            </button>
          )
        })}
      </div>

      {isTimeUp && (
        <div className="card mt-4 border-amber-300 bg-amber-50 text-center text-sm font-semibold text-amber-700">
          {t(language, "timeUp")}
          <span className="block text-xs font-normal text-amber-600/80">
            {t(language, "timeUpSub")}
          </span>
        </div>
      )}

      {submitted && (
        <button onClick={handleNext} className="btn-primary mt-5 w-full py-3.5 text-lg">
          {isLast ? t(language, "result") + " →" : t(language, "next")}
        </button>
      )}
    </div>
  )
}