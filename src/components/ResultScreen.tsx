import { useMemo, useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { localize, t } from "../i18n/translations"
import type { QuizResult } from "../types"
import "../engine/validate.jawa"
import "../engine/format.jawa"
import "../engine/constants.jawa"
import { RotateCcw, Home, CheckCircle2, XCircle, MinusCircle, ChevronRight } from "lucide-react"

interface Props {
  result: QuizResult
  onRestart: () => void
  onHome: () => void
}

type Tab = "summary" | "review"

export function ResultScreen({ result, onRestart, onHome }: Props) {
  const language = useQuizStore((s) => s.language)
  const questions = useQuizStore((s) => s.questions)
  const [tab, setTab] = useState<Tab>("summary")

  const accuracy = window.__jawaScoring.hitungAkurasi(result.correct, result.total)
  const duration = window.__jawaScoring.formatWaktu(
    Math.round((result.endTime - result.startTime) / 1000),
  )
  const grade = window.__jawaScoring.golGrade(accuracy)
  const message = window.__jawaScoring.nilaiPesan(accuracy, language)
  const ringkasan = useMemo(
    () => window.__jawaValidate.gaweRingkesan(questions, result.answers),
    [questions, result.answers],
  )
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-10 pb-8">
      {/* Score circle */}
      <div className="text-center">
        <div
          className="mx-auto flex h-32 w-32 items-center justify-center"
          style={{
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-deep) 100%)",
            boxShadow: "0 8px 32px rgba(232, 132, 74, 0.30)",
          }}
        >
          <span className="text-3xl font-extrabold text-white">
            {window.__jawaFormat.skorAkhir(result.correct, result.total)}
          </span>
        </div>
        <div
          className="mt-4 inline-block rounded-full px-5 py-1.5 text-lg font-bold text-white"
          style={{
            background: grade === "A" ? "var(--color-green)" : grade === "B" ? "var(--color-orange)" : grade === "C" ? "var(--color-orange-light)" : "var(--color-brown-muted)",
            boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
          }}
        >
          {grade}
        </div>
        <h2
          className="mt-3 text-xl font-extrabold"
          style={{ color: "var(--color-brown)" }}
        >
          {t(language, "result")}
        </h2>
        <p
          className="mt-1 text-sm font-medium"
          style={{ color: "var(--color-brown-light)" }}
        >
          {message}
        </p>
      </div>

      {/* Stats grid */}
      <div className="mt-7 grid grid-cols-3 gap-3">
        {[
          { label: t(language, "score"), value: window.__jawaFormat.persentase(accuracy), color: "var(--color-orange-deep)" },
          { label: t(language, "correct"), value: `${result.correct}`, color: "var(--color-green-deep)" },
          { label: t(language, "duration"), value: duration, color: "var(--color-brown)" },
        ].map((s) => (
          <div
            key={s.label}
            className="card text-center"
          >
            <p className="text-xs font-medium" style={{ color: "var(--color-brown-light)" }}>{s.label}</p>
            <p className="mt-1.5 text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-col gap-2.5">
        <button onClick={onRestart} className="btn-primary w-full py-4">
          <RotateCcw size={18} />
          {t(language, "playAgain")}
          <ChevronRight size={16} />
        </button>
        <button onClick={onHome} className="btn-secondary w-full py-3.5">
          <Home size={16} />
          {t(language, "backToHome")}
        </button>
      </div>

      {/* Tab switcher */}
      <div className="mt-8">
        <div
          className="flex p-1"
          style={{ background: "var(--color-cream-dark)", borderRadius: "var(--radius-md)" }}
        >
          {(["summary", "review"] as Tab[]).map((tk) => (
            <button
              key={tk}
              onClick={() => setTab(tk)}
              style={{
                flex: 1,
                borderRadius: "var(--radius-sm)",
                padding: "10px 8px",
                fontSize: "14px",
                fontWeight: 700,
                transition: "all 0.2s ease",
                background: tab === tk ? "var(--color-white)" : "transparent",
                color: tab === tk ? "var(--color-brown)" : "var(--color-brown-light)",
                boxShadow: tab === tk ? "0 2px 8px var(--color-shadow)" : "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tk === "summary" ? t(language, "scoreBoard") : t(language, "reviewAnswers")}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {tab === "summary" ? (
          <div className="mt-4 flex flex-col gap-2">
            {ringkasan.map((item, i) => {
              const { benar, tipe, jawabanSoal } = item
              return (
                <div
                  key={jawabanSoal.id}
                  className="flex items-center gap-3"
                  style={{
                    background: "var(--color-white)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    boxShadow: "0 1px 4px var(--color-shadow)",
                  }}
                >
                  {benar ? (
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: "var(--color-green)" }} />
                  ) : tipe === "timeout" || tipe === "kosong" ? (
                    <MinusCircle size={18} className="shrink-0" style={{ color: "var(--color-amber)" }} />
                  ) : (
                    <XCircle size={18} className="shrink-0" style={{ color: "var(--color-red)" }} />
                  )}
                  <span
                    className="flex-1 truncate text-sm font-medium"
                    style={{ color: "var(--color-brown)" }}
                  >
                    {localize(language, jawabanSoal.question)}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--color-brown-light)" }}
                  >
                    {window.__jawaFormat.nomorSoal(i + 1, questions.length)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          /* Review tab */
          <div className="mt-4 flex flex-col gap-3">
            {ringkasan.map((item, i) => {
              const { benar, tipe, jawabanSoal, jawabanUser } = item
              const status = window.__jawaValidate.labelStatus(benar, tipe, language)
              return (
                <div
                  key={jawabanSoal.id}
                  style={{
                    background: benar ? "var(--color-green-pale)" : "var(--color-red-pale)",
                    border: benar ? "1px solid rgba(92,184,122,0.3)" : "1px solid var(--color-red-light)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--color-brown-light)" }}
                    >
                      {t(language, "questionLabel")} {i + 1}
                    </p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: benar ? "var(--color-green-pale)" : "var(--color-red-pale)",
                        color: benar ? "var(--color-green-deep)" : "var(--color-red)",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <p
                    className="mt-1.5 font-semibold"
                    style={{ color: "var(--color-brown)" }}
                  >
                    {localize(language, jawabanSoal.question)}
                  </p>
                  <p
                    className="mt-3 text-sm font-bold"
                    style={{ color: "var(--color-green-deep)" }}
                  >
                    ✓ {t(language, "correctAnswer")}:{" "}
                    {jawabanSoal.options[language][jawabanSoal.answer]}
                  </p>
                  {!benar && (
                    <p className="mt-1 text-sm font-medium" style={{ color: "var(--color-red)" }}>
                      ✗ {t(language, "yourAnswer")}:{" "}
                      {tipe === "timeout" || tipe === "kosong" || jawabanUser === undefined
                        ? t(language, "timeUp")
                        : jawabanSoal.options[language][jawabanUser]}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
