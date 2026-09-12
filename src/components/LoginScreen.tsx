import { useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"

interface Props {
  onBack: () => void
  onLogin: (name: string, email: string) => void
}

export function LoginScreen({ onBack, onLogin }: Props) {
  const language = useQuizStore((s) => s.language)
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "register" && !name.trim()) return
    if (!email.trim() || !password.trim()) return
    onLogin(mode === "register" ? name.trim() : email.split("@")[0], email.trim())
  }

  const inputStyle = {
    width: "100%",
    background: "var(--color-cream-dark)",
    border: "2px solid var(--color-beige-dark)",
    borderRadius: "var(--radius-md)",
    padding: "12px 14px 12px 42px",
    fontSize: "15px",
    fontWeight: 500 as const,
    color: "var(--color-brown)",
    outline: "none",
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-6 top-10 flex h-10 w-10 items-center justify-center"
        style={{ borderRadius: "var(--radius-md)", background: "var(--color-cream-dark)", border: "none", cursor: "pointer" }}
      >
        <ArrowLeft size={18} style={{ color: "var(--color-brown)" }} />
      </button>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center"
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-orange-pale) 0%, var(--color-green-pale) 100%)",
              boxShadow: "0 4px 16px var(--color-shadow)",
            }}
          >
            <User size={28} style={{ color: "var(--color-orange)" }} />
          </div>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--color-brown)" }}>
            {mode === "login" ? t(language, "loginTitle") : t(language, "registerTitle")}
          </h1>
          <p className="mt-1 text-[14px] font-medium" style={{ color: "var(--color-brown-light)" }}>
            {mode === "login" ? t(language, "loginSubtitle") : t(language, "registerSubtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-brown-light)" }} />
              <input
                type="text"
                placeholder={t(language, "namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-brown-light)" }} />
            <input
              type="email"
              placeholder={t(language, "emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-brown-light)" }} />
            <input
              type={showPw ? "text" : "password"}
              placeholder={t(language, "passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "42px" }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {showPw
                ? <EyeOff size={16} style={{ color: "var(--color-brown-light)" }} />
                : <Eye size={16} style={{ color: "var(--color-brown-light)" }} />
              }
            </button>
          </div>

          <button type="submit" className="btn-primary mt-2 w-full py-3.5">
            {mode === "login" ? t(language, "loginBtn") : t(language, "registerBtn")}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-6 text-center text-[13px] font-medium" style={{ color: "var(--color-brown-light)" }}>
          {mode === "login" ? t(language, "noAccount") : t(language, "hasAccount")}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold"
            style={{ color: "var(--color-orange)", background: "none", border: "none", cursor: "pointer" }}
          >
            {mode === "login" ? t(language, "registerTitle") : t(language, "loginTitle")}
          </button>
        </p>
      </div>
    </div>
  )
}
