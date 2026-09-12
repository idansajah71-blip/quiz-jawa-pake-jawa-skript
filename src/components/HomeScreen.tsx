import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import type { Language } from "../types"
import { ChevronRight, Star, Trophy, Zap, Globe } from "lucide-react"

interface Props {
  onStart: () => void
}

export function HomeScreen({ onStart }: Props) {
  const language = useQuizStore((s) => s.language)
  const setLanguage = useQuizStore((s) => s.setLanguage)
  const highScores = useQuizStore((s) => s.highScores)

  const totalCorrect = highScores.reduce((sum, s) => sum + s.correct, 0)
  const lastScore = highScores.length > 0 ? highScores[0] : null

  const toggleLang = () => {
    setLanguage((language === "id" ? "jawa" : "id") as Language)
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-10 pb-28">
      {/* Greeting + language toggle */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight" style={{ color: "var(--color-brown)" }}>
            {t(language, "greeting")}
          </h1>
          <p className="mt-0.5 text-[15px] font-medium" style={{ color: "var(--color-brown-light)" }}>
            {t(language, "appSubtitle")}
          </p>
        </div>
        <button
          onClick={toggleLang}
          className="flex h-11 w-11 items-center justify-center shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            borderRadius: "14px",
            background: "var(--color-orange-pale)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={t(language, "chooseLanguage")}
        >
          <Globe size={20} style={{ color: "var(--color-orange)" }} />
        </button>
      </header>

      {/* Stats bar */}
      <div
        className="mt-5 flex items-center justify-around"
        style={{
          borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-deep) 100%)",
          padding: "16px 20px",
          boxShadow: "0 6px 24px rgba(232, 132, 74, 0.30)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center"
            style={{ borderRadius: "14px", background: "rgba(255,255,255,0.25)" }}
          >
            <Star size={20} color="white" fill="white" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-white">{totalCorrect}</p>
            <p className="text-[11px] font-semibold text-white/70">{t(language, "expPoints")}</p>
          </div>
        </div>
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.3)" }} />
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center"
            style={{ borderRadius: "14px", background: "rgba(255,255,255,0.25)" }}
          >
            <Trophy size={20} color="white" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-white">{highScores.length}</p>
            <p className="text-[11px] font-semibold text-white/70">{t(language, "totalQuiz")}</p>
          </div>
        </div>
      </div>

      {/* Start quiz CTA */}
      <button onClick={onStart} className="btn-primary mt-7 w-full py-4 text-lg">
        <Zap size={20} />
        {t(language, "start")}
        <ChevronRight size={18} />
      </button>

      {/* Last quiz result */}
      {lastScore && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-bold" style={{ color: "var(--color-brown)" }}>
            {t(language, "lastScore")}
          </p>
          <div
            style={{
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              boxShadow: "0 2px 8px var(--color-shadow)",
              border: "1px solid rgba(61,43,31,0.05)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold" style={{ color: "var(--color-brown)" }}>
                {lastScore.correct}/{lastScore.total} {t(language, "correct")}
              </span>
              <span
                className="px-3 py-0.5 text-xs font-bold text-white"
                style={{
                  borderRadius: "var(--radius-full)",
                  background: lastScore.accuracy >= 75 ? "var(--color-green)" : "var(--color-orange)",
                }}
              >
                {window.__jawaScoring.golGrade(lastScore.accuracy)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[12px] font-medium" style={{ color: "var(--color-brown-light)" }}>
              <span>{lastScore.accuracy}%</span>
              <span>·</span>
              <span>{window.__jawaScoring.formatWaktu(lastScore.time)}</span>
              <span>·</span>
              <span>{window.__jawaHighscore.formatTanggal(lastScore.date)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {highScores.length === 0 && (
        <div
          className="mt-8 flex flex-col items-center rounded-2xl py-8 text-center"
          style={{ background: "var(--color-cream-dark)" }}
        >
          <Zap size={32} style={{ color: "var(--color-brown-muted)" }} />
          <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-brown-light)" }}>
            {t(language, "emptyScores")}
          </p>
        </div>
      )}
    </div>
  )
}
