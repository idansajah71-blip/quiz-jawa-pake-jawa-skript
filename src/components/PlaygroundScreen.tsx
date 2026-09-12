import { useState } from "react"
import { translate } from "../jawascript/translator"
import { t } from "../i18n/translations"
import { useQuizStore } from "../store/quizStore"
import "../engine/playground-examples.jawa"
import { ArrowLeft, Play, Eraser, FileCode2, List } from "lucide-react"

interface Props {
  onBack: () => void
}

const CONTOH = window.__jawaPlayground.daftarConto()

function captureConsole(fn: () => void): { lines: string[]; error: string | null } {
  const stdout: string[] = []
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn
  const origInfo = console.info
  const origTable = console.table

  console.log = (...args) => stdout.push(args.map(stringify).join(" "))
  console.error = (...args: unknown[]) => stdout.push("ERROR: " + args.map(stringify).join(" "))
  console.warn = (...args: unknown[]) => stdout.push("WARN: " + args.map(stringify).join(" "))
  console.info = (...args: unknown[]) => stdout.push("INFO: " + args.map(stringify).join(" "))
  console.table = (data: unknown) =>
    stdout.push(JSON.parse(JSON.stringify(data ?? null)))

  let error: string | null = null
  try {
    fn()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  } finally {
    console.log = origLog
    console.error = origError
    console.warn = origWarn
    console.info = origInfo
    console.table = origTable
  }
  return { lines: stdout, error }
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value
  if (value && typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function PlaygroundScreen({ onBack }: Props) {
  const language = useQuizStore((s) => s.language)
  const [code, setCode] = useState(CONTOH[0].code)
  const [jsOut, setJsOut] = useState<string | null>(null)
  const [runOut, setRunOut] = useState<{ lines: string[]; error: string | null } | null>(
    null,
  )
  const [transpileError, setTranspileError] = useState<string | null>(null)

  const run = () => {
    setTranspileError(null)
    setRunOut(null)
    setJsOut(null)
    let js: string
    try {
      js = translate(code)
    } catch (e) {
      setTranspileError(
        e instanceof Error ? `${e.name}: ${e.message}` : String(e),
      )
      return
    }
    setJsOut(js)
    const res = captureConsole(() => {
      // eslint-disable-next-line no-new-func
      new Function(js)()
    })
    setRunOut(res)
  }

  const clear = () => {
    setCode("")
    setJsOut(null)
    setRunOut(null)
    setTranspileError(null)
  }

  const pickExample = (c: { name: string; code: string }) => {
    setCode(c.code)
    setJsOut(null)
    setRunOut(null)
    setTranspileError(null)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <button onClick={onBack} className="btn-ghost mb-4 w-fit px-3 py-2 text-sm">
        <ArrowLeft size={16} />
        {t(language, "backToHome")}
      </button>

      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-gold-dark">
        <FileCode2 size={24} />
        {t(language, "playground")}
      </h2>
      <p className="mt-1 text-sm text-batik/60">{t(language, "playgroundDesc")}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
          <List size={13} />
          {t(language, "example")}:
        </span>
        {CONTOH.map((c) => (
          <button
            key={c.name}
            onClick={() => pickExample(c)}
            className="rounded-full border border-batik/15 bg-white px-3 py-1 text-xs font-semibold text-batik/70 transition-all hover:border-gold hover:text-gold-dark"
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-bold text-batik/50">
            <span className="mr-2 rounded bg-gold/20 px-1.5 py-0.5 font-mono text-gold-dark">
              .jawa
            </span>
          </span>
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs font-medium text-batik/50 hover:text-red-500"
          >
            <Eraser size={13} />
            {t(language, "clear")}
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={12}
          className="w-full resize-y rounded-2xl border border-batik/15 bg-batik p-4 font-mono text-sm leading-relaxed text-emerald-300 shadow-inner outline-none focus:border-gold"
          placeholder="ono x = 10;"
        />
      </div>

      <button onClick={run} className="btn-primary mt-3 w-full py-3">
        <Play size={18} />
        {t(language, "run")}
      </button>

      {transpileError && (
        <div className="card mt-4 border-red-300 bg-red-50 font-mono text-sm text-red-600">
          {transpileError}
        </div>
      )}

      {jsOut && (
        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-bold text-batik/50">JavaScript</span>
          <pre className="max-h-48 overflow-auto rounded-2xl border border-batik/10 bg-batik/90 p-4 font-mono text-xs leading-relaxed text-gold">
            {jsOut}
          </pre>
        </div>
      )}

      {runOut && (
        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-bold text-batik/50">
            {t(language, "output")}
          </span>
          <pre className="max-h-48 overflow-auto rounded-2xl border border-batik/10 bg-cream p-4 font-mono text-sm text-batik">
            {runOut.lines.length === 0 && !runOut.error ? "›" : ""}
            {runOut.lines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            {runOut.error && (
              <div className="text-red-500">Error: {runOut.error}</div>
            )}
          </pre>
        </div>
      )}
    </div>
  )
}