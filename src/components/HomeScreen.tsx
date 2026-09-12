import type { Language } from "../types"
import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import { ChevronRight, Award, Languages } from "lucide-react"

interface Props {
  onStart: () => void
  onPlayground: () => void
}

export function HomeScreen({ onStart, onPlayground }: Props) {
  const language = useQuizStore((s) => s.language)
  const setLanguage = useQuizStore((s) => s.setLanguage)
  const highScores = useQuizStore((s) => s.highScores)

  const toggleLang = () => {
    setLanguage((language === "id" ? "jawa" : "id") as Language)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <header className="text-center">
        <div className="mb-2 text-5xl">🐒</div>
        <h1 className="font-display text-3xl font-bold text-gold-dark">
          {t(language, "appTitle")}
        </h1>
        <p className="mt-1 text-sm text-batik/60">{t(language, "appSubtitle")}</p>
      </header>

      <div className="mt-6 flex justify-center">
        <button
          onClick={toggleLang}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <Languages size={16} />
          {language === "id" ? t(language, "bahasaJawa") : t(language, "bahasaIndonesia")}
        </button>
      </div>

      <main className="mt-6 flex flex-col gap-4">
        <button onClick={onStart} className="btn-primary w-full py-4 text-lg">
          {t(language, "start")}
          <ChevronRight size={20} />
        </button>

        <button onClick={onPlayground} className="btn-ghost w-full py-3">
          {t(language, "playground")}
        </button>
      </main>

      <section className="card mt-8">
        <h2 className="flex items-center gap-2 text-sm font-bold text-batik">
          <Award size={16} className="text-gold-dark" />
          {t(language, "highScores")}
        </h2>
        {highScores.length === 0 ? (
          <p className="mt-3 text-sm text-batik/50">{t(language, "emptyScores")}</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {highScores.slice(0, 5).map((hs, i) => (
              <li
                key={hs.date + "-" + i}
                className="flex items-center justify-between rounded-lg bg-cream/60 px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="font-bold text-gold-dark">#{i + 1}</span>
                  <span>{hs.correct + "/" + hs.total}</span>
                  <span className="text-xs text-batik/40">
                    {hs.language === "id" ? "ID" : "Jw"} ·{" "}
                    {window.__jawaScoring.formatWaktu(hs.time)}
                  </span>
                </span>
                <span className="font-bold text-batik">{hs.accuracy}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-auto pt-8 text-center text-xs text-batik/40">
        Karena Jawa adalah Koentji 🔑
      </footer>
    </div>
  )
}