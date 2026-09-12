import { useEffect } from "react"
import { useQuizStore } from "../store/quizStore"
import { CATEGORIES } from "../data/questions"
import { t } from "../i18n/translations"
import "../engine/constants.jawa"
import { ArrowLeft, Shuffle, Play, ChevronRight, BookOpen, MessageCircle, Landmark, Hash } from "lucide-react"

interface Props {
  onBack: () => void
  onStart: () => void
}

const CATEGORY_LIST = window.__jawaConstants.CATEGORY_IDS

const CAT_ICONS: Record<string, typeof BookOpen> = {
  kosakata: BookOpen,
  ungkapan: MessageCircle,
  budaya: Landmark,
  angka: Hash,
}

const CAT_COLORS: Record<string, { bg: string; fg: string }> = {
  kosakata: { bg: "var(--color-green-pale)", fg: "var(--color-green-deep)" },
  ungkapan: { bg: "var(--color-orange-pale)", fg: "var(--color-orange-deep)" },
  budaya: { bg: "#F0EAF8", fg: "#8B6FC0" },
  angka: { bg: "#E8F4FD", fg: "#3B82F6" },
}

export function SetupScreen({ onBack, onStart }: Props) {
  const language = useQuizStore((s) => s.language)
  const selectedCategories = useQuizStore((s) => s.selectedCategories)
  const toggleCategory = useQuizStore((s) => s.toggleCategory)
  const questionCount = useQuizStore((s) => s.questionCount)
  const setQuestionCount = useQuizStore((s) => s.setQuestionCount)
  const shuffleQuestions = useQuizStore((s) => s.shuffleQuestions)
  const toggleShuffle = useQuizStore((s) => s.toggleShuffle)

  useEffect(() => {
    if (useQuizStore.getState().selectedCategories.length === 0) {
      CATEGORY_LIST.forEach(toggleCategory)
    }
  }, [])

  const canStart = selectedCategories.length > 0

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-10 pb-28">
      {/* Back */}
      <button onClick={onBack} className="btn-ghost mb-6 w-fit px-3 py-2 text-sm">
        <ArrowLeft size={16} />
        {t(language, "backToHome")}
      </button>

      {/* Header */}
      <header>
        <h1 className="text-[26px] font-extrabold leading-tight" style={{ color: "var(--color-brown)" }}>
          {t(language, "appTitle")}
        </h1>
        <p className="mt-1 text-[15px] font-medium" style={{ color: "var(--color-brown-light)" }}>
          {t(language, "chooseCategory")}
        </p>
      </header>

      {/* Category grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {CATEGORY_LIST.map((catId) => {
          const cat = CATEGORIES[catId]
          const active = selectedCategories.includes(catId)
          const Icon = CAT_ICONS[catId] ?? BookOpen
          const tones = CAT_COLORS[catId] ?? { bg: "var(--color-beige)", fg: "var(--color-brown-medium)" }
          return (
            <button
              key={catId}
              onClick={() => toggleCategory(catId)}
              className="text-left transition-all duration-200"
              style={{
                background: active ? "var(--color-white)" : "var(--color-cream-dark)",
                border: active
                  ? "2px solid var(--color-orange)"
                  : "2px solid var(--color-beige-dark)",
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                boxShadow: active
                  ? "0 4px 16px var(--color-shadow-md), 0 0 0 3px var(--color-orange-pale)"
                  : "0 1px 4px var(--color-shadow)",
                opacity: active ? 1 : 0.6,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center"
                style={{ borderRadius: "12px", background: tones.bg }}
              >
                <Icon size={20} style={{ color: tones.fg }} />
              </div>
              <span className="mt-3 block text-sm font-bold" style={{ color: "var(--color-brown)" }}>
                {language === "jawa" ? cat.question.jawa : cat.question.id}
              </span>
            </button>
          )
        })}
      </div>

      {/* Question count */}
      <label className="mt-7 block text-sm font-bold" style={{ color: "var(--color-brown)" }}>
        {t(language, "questionCount")}
      </label>
      <div className="mt-2.5 grid grid-cols-3 gap-2.5">
        {[5, 10, 15].map((n) => (
          <button
            key={n}
            onClick={() => setQuestionCount(n)}
            style={{
              background: questionCount === n ? "var(--color-orange)" : "var(--color-white)",
              color: questionCount === n ? "var(--color-white)" : "var(--color-brown-medium)",
              border: questionCount === n ? "2px solid var(--color-orange)" : "2px solid var(--color-beige-dark)",
              borderRadius: "var(--radius-md)",
              padding: "10px 8px",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: questionCount === n ? "0 3px 12px rgba(232, 132, 74, 0.25)" : "none",
              transition: "all 0.15s ease",
              cursor: "pointer",
            }}
          >
            {n} {t(language, "questions")}
          </button>
        ))}
      </div>

      {/* Shuffle toggle */}
      <button
        onClick={toggleShuffle}
        className="mt-5 flex items-center justify-between"
        style={{
          background: shuffleQuestions ? "var(--color-orange-pale)" : "var(--color-white)",
          border: shuffleQuestions ? "2px solid var(--color-orange)" : "2px solid var(--color-beige-dark)",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
          color: shuffleQuestions ? "var(--color-orange-deep)" : "var(--color-brown-medium)",
          transition: "all 0.15s ease",
          cursor: "pointer",
        }}
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <Shuffle size={16} />
          {t(language, "shuffle")}
        </span>
        <div
          style={{
            width: "44px",
            height: "26px",
            borderRadius: "13px",
            background: shuffleQuestions ? "var(--color-orange)" : "var(--color-beige-dark)",
            position: "relative",
            transition: "background 0.2s ease",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "var(--color-white)",
              position: "absolute",
              top: "3px",
              left: shuffleQuestions ? "21px" : "3px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              transition: "left 0.2s ease",
            }}
          />
        </div>
      </button>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="btn-primary w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play size={20} />
          {t(language, "start")}
          <ChevronRight size={18} />
        </button>
        {!canStart && (
          <p className="mt-2.5 text-center text-xs font-medium" style={{ color: "var(--color-brown-light)" }}>
            {t(language, "chooseAtLeastOne")}
          </p>
        )}
      </div>
    </div>
  )
}
