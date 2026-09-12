import { useMemo, useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { localize, t } from "../i18n/translations"
import type { QuizResult } from "../types"
import "../engine/validate.jawa"
import "../engine/format.jawa"
import "../engine/constants.jawa"
import { RotateCcw, Home, CheckCircle2, XCircle, MinusCircle } from "lucide-react"

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
  const gradeColor = window.__jawaConstants.GRADE_WARNA[grade] ?? "from-gold to-gold-dark"

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <div className="text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-lg">
          <span className="font-display text-3xl font-bold text-white">
            {window.__jawaFormat.skorAkhir(result.correct, result.total)}
          </span>
        </div>
        <div
          className={`mt-3 inline-block rounded-full bg-gradient-to-r ${gradeColor} px-4 py-1 text-2xl font-bold text-white shadow`}
        >
          {grade}
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-batik">
          {t(language, "result")}
        </h2>
        <p className="mt-1 text-sm text-batik/60">{message}</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-xs text-batik/50">{t(language, "score")}</p>
          <p className="mt-1 text-xl font-bold text-gold-dark">
            {window.__jawaFormat.persentase(accuracy)}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-batik/50">{t(language, "correct")}</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{result.correct}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-batik/50">{t(language, "duration")}</p>
          <p className="mt-1 text-sm font-bold text-batik">{duration}</p>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={onRestart} className="btn-primary w-full py-3.5">
          <RotateCcw size={18} />
          {t(language, "playAgain")}
        </button>
        <button onClick={onHome} className="btn-ghost mt-2 w-full py-3">
          <Home size={16} />
          {t(language, "backToHome")}
        </button>
      </div>

      <div className="mt-8">
        <div className="flex rounded-xl border border-batik/10 p-1">
          {(["summary", "review"] as Tab[]).map((tk) => (
            <button
              key={tk}
              onClick={() => setTab(tk)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                tab === tk ? "bg-gold text-white shadow" : "text-batik/60"
              }`}
            >
              {tk === "summary" ? t(language, "scoreBoard") : t(language, "reviewAnswers")}
            </button>
          ))}
        </div>

        {tab === "summary" ? (
          <div className="mt-4 flex flex-col gap-2">
            {ringkasan.map((item, i) => {
              const { benar, tipe, jawabanSoal } = item
              return (
                <div
                  key={jawabanSoal.id}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm shadow-sm"
                >
                  {benar ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  ) : tipe === "timeout" || tipe === "kosong" ? (
                    <MinusCircle size={18} className="shrink-0 text-amber-500" />
                  ) : (
                    <XCircle size={18} className="shrink-0 text-red-500" />
                  )}
                  <span className="flex-1 truncate text-batik/80">
                    {localize(language, jawabanSoal.question)}
                  </span>
                  <span className="font-bold text-batik">
                    {window.__jawaFormat.nomorSoal(i + 1, questions.length)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {ringkasan.map((item, i) => {
              const { benar, tipe, jawabanSoal, jawabanUser } = item
              const status = window.__jawaValidate.labelStatus(benar, tipe, language)
              return (
                <div
                  key={jawabanSoal.id}
                  className={`card ${benar ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-batik/40">
                      {t(language, "questionLabel")} {i + 1}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        benar
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-batik">
                    {localize(language, jawabanSoal.question)}
                  </p>
                  <p className="mt-3 text-sm font-bold text-emerald-600">
                    ✓ {t(language, "correctAnswer")}:{" "}
                    {jawabanSoal.options[language][jawabanSoal.answer]}
                  </p>
                  {!benar && (
                    <p className="mt-1 text-sm font-medium text-red-500">
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