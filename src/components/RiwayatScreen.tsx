import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import { Clock, CheckCircle2, XCircle } from "lucide-react"

export function RiwayatScreen() {
  const language = useQuizStore((s) => s.language)
  const highScores = useQuizStore((s) => s.highScores)

  const sorted = [...highScores].sort((a, b) => b.date - a.date)

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-10 pb-28">
      {/* Header */}
      <header className="text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, var(--color-orange-pale) 0%, var(--color-green-pale) 100%)",
            boxShadow: "0 4px 16px var(--color-shadow)",
          }}
        >
          <Clock size={28} style={{ color: "var(--color-orange)" }} />
        </div>
        <h1 className="text-[24px] font-extrabold" style={{ color: "var(--color-brown)" }}>
          {t(language, "navRiwayat")}
        </h1>
        <p className="mt-1 text-[14px] font-medium" style={{ color: "var(--color-brown-light)" }}>
          {sorted.length} {t(language, "totalQuiz")}
        </p>
      </header>

      {/* History list */}
      <div className="mt-6 flex flex-col gap-3">
        {sorted.length === 0 ? (
          <div className="card-elevated flex flex-col items-center py-10 text-center">
            <Clock size={40} style={{ color: "var(--color-brown-muted)", opacity: 0.4 }} />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-brown-light)" }}>
              {t(language, "noHistory")}
            </p>
          </div>
        ) : (
          sorted.map((hs, i) => {
            const grade = window.__jawaScoring.golGrade(hs.accuracy)
            const gradeColor =
              grade === "A" ? "var(--color-green)" :
              grade === "B" ? "var(--color-orange)" :
              grade === "C" ? "var(--color-orange-light)" : "var(--color-brown-muted)"

            return (
              <div
                key={hs.date + "-" + i}
                style={{
                  background: "var(--color-white)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  boxShadow: "0 2px 10px var(--color-shadow)",
                  border: "1px solid rgba(61,43,31,0.05)",
                }}
              >
                {/* Top row: date + grade */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium" style={{ color: "var(--color-brown-light)" }}>
                    {window.__jawaHighscore.formatTanggal(hs.date)}
                  </span>
                  <span
                    className="px-2.5 py-0.5 text-xs font-bold text-white"
                    style={{ borderRadius: "var(--radius-full)", background: gradeColor }}
                  >
                    {grade}
                  </span>
                </div>

                {/* Stats row */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Correct/Wrong */}
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} style={{ color: "var(--color-green)" }} />
                      <span className="text-sm font-bold" style={{ color: "var(--color-brown)" }}>
                        {hs.correct}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <XCircle size={14} style={{ color: "var(--color-red)" }} />
                      <span className="text-sm font-bold" style={{ color: "var(--color-brown)" }}>
                        {hs.total - hs.correct}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[12px] font-medium" style={{ color: "var(--color-brown-light)" }}>
                    <span>{hs.accuracy}%</span>
                    <span>·</span>
                    <span>{window.__jawaScoring.formatWaktu(hs.time)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="mt-3 h-1.5 w-full overflow-hidden"
                  style={{ borderRadius: "var(--radius-full)", background: "var(--color-beige)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "var(--radius-full)",
                      background: gradeColor,
                      width: `${hs.accuracy}%`,
                    }}
                  />
                </div>

                {/* Language badge */}
                <div className="mt-2.5 flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold"
                    style={{
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-beige)",
                      color: "var(--color-brown-medium)",
                      padding: "2px 10px",
                    }}
                  >
                    {hs.language === "id" ? "Indonesia" : "Jawa"}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: "var(--color-brown-muted)" }}>
                    {hs.total} {t(language, "questions")}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
