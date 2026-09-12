import { useEffect, useMemo, useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { localize, t } from "../i18n/translations"
import { useTimer } from "../hooks/useTimer"
import { CATEGORIES } from "../data/questions"
import type { QuizResult } from "../types"
import { ChevronRight, Check, Clock, AlertTriangle, SkipForward } from "lucide-react"

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
  }

  const handleVerify = () => {
    if (selected === null) return
    setSubmitted(true)
    answer(selected)
  }

  const goNext = () => {
    if (isLast) {
      const r = finishQuiz()
      if (r) onFinish(r)
    } else {
      nextQuestion()
    }
  }

  useEffect(() => {
    const ans = answers[currentIndex]
    setIsTimeUp(ans === -1)
    setSubmitted(answered)
    setSelected(ans !== undefined && ans !== -1 ? ans : null)
  }, [currentIndex, answered, answers])

  if (!question) return null

  const progress = ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100
  const optLetters = ["A", "B", "C", "D"]

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-6 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center"
          style={{
            borderRadius: "var(--radius-md)",
            background: "var(--color-cream-dark)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <SkipForward size={18} style={{ color: "var(--color-brown)" }} />
        </button>

        <h1 className="text-lg font-extrabold" style={{ color: "var(--color-brown)" }}>
          {language === "jawa" ? category.question.jawa : category.question.id}
        </h1>

        <button
          onClick={goNext}
          className="text-sm font-bold"
          style={{ color: "var(--color-orange)", background: "none", border: "none", cursor: "pointer" }}
        >
          {t(language, "next")}
        </button>
      </header>

      {/* Progress bar */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-bold" style={{ color: "var(--color-brown)" }}>
          {currentIndex + 1}/{questions.length}
        </span>
        <div
          className="flex-1 h-3 overflow-hidden"
          style={{ borderRadius: "var(--radius-full)", background: "var(--color-beige)" }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(90deg, var(--color-green) 0%, var(--color-green-deep) 100%)",
              width: `${progress}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Timer */}
      <div
        className="mt-3 flex items-center gap-1.5 self-end rounded-full px-3 py-1"
        style={{
          background: remaining <= 5 ? "var(--color-red-pale)" : "var(--color-orange-pale)",
          color: remaining <= 5 ? "var(--color-red)" : "var(--color-orange-deep)",
        }}
      >
        <Clock size={13} />
        <span className="text-xs font-bold">{window.__jawaFormat.labelWktu(remaining)}</span>
      </div>

      {/* Question */}
      <h2
        className="mt-6 text-[22px] font-extrabold leading-snug"
        style={{ color: "var(--color-brown)" }}
      >
        {questionText}
      </h2>

      {/* Options */}
      <div className="mt-6 flex flex-col gap-3">
        {optionTexts.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === question.answer
          const showState = submitted

          let bg = "var(--color-orange)"
          let textColor = "white"
          let borderColor = "transparent"
          let icon: "none" | "check" | "chevron" = "chevron"

          if (showState) {
            if (isCorrect) {
              bg = "var(--color-green)"
              textColor = "white"
              icon = "check"
            } else if (isSelected) {
              bg = "var(--color-red)"
              textColor = "white"
              icon = "chevron"
            } else {
              bg = "var(--color-orange-light)"
              textColor = "white"
              icon = "chevron"
            }
          } else if (isSelected) {
            bg = "var(--color-green)"
            textColor = "white"
            icon = "check"
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className="flex items-center gap-4 text-left transition-all duration-200"
              style={{
                borderRadius: "var(--radius-lg)",
                background: bg,
                border: `2px solid ${borderColor}`,
                padding: "16px 18px",
                color: textColor,
                boxShadow: showState && isCorrect
                  ? "0 4px 16px rgba(92, 184, 122, 0.3)"
                  : isSelected && !showState
                    ? "0 4px 16px rgba(92, 184, 122, 0.3)"
                    : "0 3px 12px rgba(232, 132, 74, 0.2)",
                cursor: submitted ? "default" : "pointer",
                opacity: showState && !isCorrect && !isSelected ? 0.6 : 1,
              }}
            >
              {/* Option letter */}
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold"
                style={{
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255,255,255,0.25)",
                }}
              >
                {optLetters[i]}
              </span>
              <span className="flex-1 text-[16px] font-bold">{opt}</span>
              {icon === "check" && (
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center"
                  style={{ borderRadius: "50%", background: "rgba(255,255,255,0.3)" }}
                >
                  <Check size={16} color="white" strokeWidth={3} />
                </div>
              )}
              {icon === "chevron" && (
                <ChevronRight size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Time up */}
      {isTimeUp && (
        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-center text-sm font-semibold"
          style={{ background: "var(--color-amber-pale)", color: "var(--color-amber)", border: "1px solid var(--color-amber-light)" }}
        >
          <AlertTriangle size={16} />
          <div>
            {t(language, "timeUp")}
            <span className="ml-1 text-xs font-normal opacity-70">
              {t(language, "timeUpSub")}
            </span>
          </div>
        </div>
      )}

      {/* Verify / Next */}
      <div className="mt-auto pt-4">
        {selected !== null && !submitted && (
          <button onClick={handleVerify} className="btn-primary w-full py-4 text-lg">
            {t(language, "verifyAnswer")}
          </button>
        )}
        {submitted && (
          <button onClick={goNext} className="btn-primary w-full py-4 text-lg">
            {isLast ? t(language, "result") + " →" : t(language, "next")}
          </button>
        )}
      </div>
    </div>
  )
}
