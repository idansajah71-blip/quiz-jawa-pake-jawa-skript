import { useEffect } from "react"
import { useQuizStore } from "../store/quizStore"
import { CATEGORIES } from "../data/questions"
import { t } from "../i18n/translations"
import "../engine/constants.jawa"
import { ArrowLeft, Shuffle, Play } from "lucide-react"

interface Props {
  onBack: () => void
  onStart: () => void
}

const CATEGORY_LIST = window.__jawaConstants.CATEGORY_IDS

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canStart = selectedCategories.length > 0

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <button onClick={onBack} className="btn-ghost mb-6 w-fit px-3 py-2 text-sm">
        <ArrowLeft size={16} />
        {t(language, "backToHome")}
      </button>

      <h2 className="font-display text-2xl font-bold text-batik">
        {t(language, "appTitle")}
      </h2>
      <p className="mt-1 text-sm text-batik/60">{t(language, "chooseCategory")}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CATEGORY_LIST.map((catId) => {
          const cat = CATEGORIES[catId]
          const active = selectedCategories.includes(catId)
          return (
            <button
              key={catId}
              onClick={() => toggleCategory(catId)}
              className={`card text-left transition-all ${
                active
                  ? "border-gold-dark bg-gradient-to-br from-gold/20 to-cream ring-2 ring-gold/60"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="mt-2 block font-semibold text-batik">
                {language === "jawa" ? cat.question.jawa : cat.question.id}
              </span>
            </button>
          )
        })}
      </div>

      <label className="mt-6 block text-sm font-semibold text-batik">
        {t(language, "questionCount")}
      </label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[5, 10, 15].map((n) => (
          <button
            key={n}
            onClick={() => setQuestionCount(n)}
            className={`card py-2 text-center font-bold transition-all ${
              questionCount === n
                ? "border-gold-dark bg-gold/20 text-gold-dark"
                : "text-batik/70 hover:border-gold/50"
            }`}
          >
            {n} {t(language, "questions")}
          </button>
        ))}
      </div>

      <button
        onClick={toggleShuffle}
        className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
          shuffleQuestions
            ? "border-gold-dark bg-gold/15 text-gold-dark"
            : "border-batik/15 bg-white text-batik/60"
        }`}
      >
        <span className="flex items-center gap-2">
          <Shuffle size={16} />
          {t(language, "shuffle")}
        </span>
        <span className={`h-5 w-5 rounded-full border-2 ${shuffleQuestions ? "border-gold-dark bg-gold" : "border-batik/30"}`}>
          {shuffleQuestions && <span className="block h-2 w-2 translate-x-[5px] translate-y-[4px] rounded-full bg-white" />}
        </span>
      </button>

      <button
        onClick={onStart}
        disabled={!canStart}
        className="btn-primary mt-6 w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Play size={20} />
        {t(language, "start")}
      </button>
      {!canStart && (
        <p className="mt-2 text-center text-xs text-batik/50">
          {t(language, "chooseAtLeastOne")}
        </p>
      )}
    </div>
  )
}