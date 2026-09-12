import { useState, useMemo } from "react"
import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import type { Language } from "../types"
import {
  User, Trophy, CheckCircle2, XCircle, Clock, Globe, RotateCcw,
  Info, LogIn, LogOut, Star, Zap, Target, Award, BookOpen, Flame,
  ChevronRight, TrendingUp
} from "lucide-react"

interface Props {
  onLogin: () => void
}

function DonutChart({ percent, size = 120, strokeWidth = 10 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-cream-dark)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-extrabold" style={{ color: "var(--color-brown)" }}>
          {percent}%
        </span>
        <span className="text-[10px] font-semibold" style={{ color: "var(--color-brown-light)" }}>
          {t("id", "accuracy")}
        </span>
      </div>
    </div>
  )
}

function AchievementBadge({ icon: Icon, label, color, bg }: { icon: typeof Star; label: string; color: string; bg: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 80 }}>
      <div
        className="flex h-14 w-14 items-center justify-center"
        style={{
          borderRadius: "var(--radius-lg)",
          background: bg,
          boxShadow: `0 4px 12px ${color}25`,
        }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-[11px] font-bold text-center" style={{ color: "var(--color-brown)" }}>
        {label}
      </span>
    </div>
  )
}

export function ProfileScreen({ onLogin }: Props) {
  const language = useQuizStore((s) => s.language)
  const setLanguage = useQuizStore((s) => s.setLanguage)
  const highScores = useQuizStore((s) => s.highScores)
  const user = useQuizStore((s) => s.user)
  const logout = useQuizStore((s) => s.logout)
  const [showReset, setShowReset] = useState(false)

  const totalQuizzes = highScores.length
  const totalCorrect = highScores.reduce((sum, h) => sum + h.correct, 0)
  const totalAll = highScores.reduce((sum, h) => sum + h.total, 0)
  const totalWrong = totalAll - totalCorrect
  const avgAccuracy = totalQuizzes > 0
    ? Math.round(highScores.reduce((sum, h) => sum + h.accuracy, 0) / totalQuizzes)
    : 0
  const totalTime = highScores.reduce((sum, h) => sum + h.time, 0)
  const grade = window.__jawaScoring.golGrade(avgAccuracy)
  const bestScore = totalQuizzes > 0 ? Math.max(...highScores.map((h) => h.score)) : 0

  const gradeColor =
    grade === "A" ? "var(--color-green)" :
    grade === "B" ? "var(--color-orange)" :
    grade === "C" ? "var(--color-orange-light)" : "var(--color-brown-muted)"

  const totalXp = totalCorrect * 10
  const level = totalXp < 100 ? "Pemula" : totalXp < 500 ? "Pelajar" : totalXp < 1000 ? "Mahir" : "Ahli"

  const achievements = useMemo(() => {
    const list: { icon: typeof Star; label: string; color: string; bg: string }[] = []
    if (totalQuizzes >= 1) list.push({ icon: Star, label: t(language, "pemula"), color: "var(--color-orange)", bg: "var(--color-orange-pale)" })
    if (totalQuizzes >= 5) list.push({ icon: Flame, label: t(language, "rajinBelajar"), color: "var(--color-red)", bg: "var(--color-red-pale)" })
    if (avgAccuracy >= 80) list.push({ icon: Target, label: t(language, "akurat"), color: "var(--color-green)", bg: "var(--color-green-pale)" })
    if (totalQuizzes >= 10) list.push({ icon: Award, label: t(language, "quizMaster"), color: "var(--color-orange-deep)", bg: "var(--color-orange-pale)" })
    if (list.length === 0) list.push({ icon: BookOpen, label: t(language, "pemula"), color: "var(--color-brown-muted)", bg: "var(--color-cream-dark)" })
    return list
  }, [totalQuizzes, avgAccuracy, language])

  const recentActivity = useMemo(() => {
    return highScores.slice(-5).reverse().map((h, i) => ({
      id: i,
      accuracy: h.accuracy,
      score: h.score,
      total: h.total,
      time: window.__jawaScoring.formatWaktu(h.time),
      date: window.__jawaHighscore.formatTanggal(h.date),
      status: h.accuracy >= 60 ? "done" : "failed",
    }))
  }, [highScores])

  const handleReset = () => {
    useQuizStore.setState({ highScores: [] })
    setShowReset(false)
  }

  const toggleLang = () => {
    setLanguage((language === "id" ? "jawa" : "id") as Language)
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden pb-28">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-30"
        style={{
          borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
          background: "linear-gradient(135deg, var(--color-orange-pale) 0%, var(--color-green-pale) 100%)",
          filter: "blur(60px)",
          transform: "translate(15%, -25%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-40 left-0 h-56 w-56 opacity-20"
        style={{
          borderRadius: "55% 45% 60% 40% / 45% 55% 45% 55%",
          background: "linear-gradient(135deg, var(--color-green-pale) 0%, var(--color-orange-pale) 100%)",
          filter: "blur(50px)",
          transform: "translate(-25%, 15%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-10 top-1/2 h-32 w-32 opacity-15"
        style={{
          borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
          background: "var(--color-orange-light)",
          filter: "blur(40px)",
          transform: "translateY(-50%)",
        }}
      />

      {/* Profile Header with gradient background */}
      <div
        className="relative px-5 pt-10 pb-16"
        style={{
          background: "linear-gradient(180deg, var(--color-orange) 0%, var(--color-orange-deep) 60%, var(--color-cream) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full opacity-15" style={{ background: "white" }} />
        <div className="pointer-events-none absolute left-8 top-12 h-12 w-12 rounded-full opacity-10" style={{ background: "white" }} />

        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          <div
            className="mb-3 flex h-24 w-24 items-center justify-center"
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-orange-light) 0%, var(--color-orange) 100%)",
              border: "4px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 32px rgba(212,112,58,0.4)",
            }}
          >
            {user ? (
              <span className="text-3xl font-extrabold text-white">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={40} style={{ color: "white" }} />
            )}
          </div>

          {/* Name */}
          <h1 className="text-[22px] font-extrabold text-white">
            {user ? user.name : t(language, "navProfile")}
          </h1>
          {user && (
            <p className="mt-0.5 text-[13px] font-medium text-white/75">
              {user.email}
            </p>
          )}

          {/* Level badge */}
          <div
            className="mt-3 flex items-center gap-1.5"
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-full)",
              padding: "5px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <Zap size={14} style={{ color: "#FDE68A" }} />
            <span className="text-[12px] font-bold text-white">
              {t(language, "level")} {level}
            </span>
            <span className="text-[11px] font-semibold text-white/60">
              | {totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative -mt-10 flex flex-col gap-5 px-5">
        {/* Grade + Accuracy hero row */}
        <div className="flex gap-3">
          {/* Grade card */}
          <div
            className="flex flex-1 flex-col items-center justify-center py-5"
            style={{
              borderRadius: "var(--radius-xl)",
              background: "var(--color-white)",
              boxShadow: "0 4px 20px var(--color-shadow-md)",
              border: "1px solid rgba(61,43,31,0.05)",
            }}
          >
            <div
              className="mb-2 flex h-12 w-12 items-center justify-center"
              style={{
                borderRadius: "var(--radius-sm)",
                background: gradeColor,
              }}
            >
              <p className="text-[22px] font-extrabold text-white leading-none">{grade}</p>
            </div>
            <p className="text-[11px] font-bold" style={{ color: "var(--color-brown-light)" }}>{t(language, "grade")}</p>
          </div>

          {/* Accuracy donut card */}
          <div
            className="flex flex-1 flex-col items-center justify-center py-4"
            style={{
              borderRadius: "var(--radius-xl)",
              background: "var(--color-white)",
              boxShadow: "0 4px 20px var(--color-shadow-md)",
              border: "1px solid rgba(61,43,31,0.05)",
            }}
          >
            <DonutChart percent={avgAccuracy} size={100} strokeWidth={9} />
          </div>
        </div>

        {/* Stats row - varied treatments */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Kuis - orange accent */}
          <div
            className="flex items-center gap-3"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "var(--color-orange-pale)",
              padding: "14px",
              border: "1px solid var(--color-orange-light)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center"
              style={{
                borderRadius: "var(--radius-sm)",
                background: "var(--color-orange)",
              }}
            >
              <BookOpen size={18} style={{ color: "white" }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "var(--color-orange-deep)" }}>
                {t(language, "totalQuizzes")}
              </p>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--color-brown)" }}>
                {totalQuizzes}
              </p>
            </div>
          </div>

          {/* Jawaban Benar - green accent */}
          <div
            className="flex items-center gap-3"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "var(--color-green-pale)",
              padding: "14px",
              border: "1px solid var(--color-green-light)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center"
              style={{
                borderRadius: "var(--radius-sm)",
                background: "var(--color-green)",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "white" }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "var(--color-green-deep)" }}>
                {t(language, "correctAnswers")}
              </p>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--color-brown)" }}>
                {totalCorrect}/{totalAll}
              </p>
            </div>
          </div>

          {/* Skor Tertinggi - amber accent */}
          <div
            className="flex items-center gap-3"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "var(--color-amber-pale)",
              padding: "14px",
              border: "1px solid var(--color-amber-light)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center"
              style={{
                borderRadius: "var(--radius-sm)",
                background: "var(--color-amber)",
              }}
            >
              <Trophy size={18} style={{ color: "white" }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "var(--color-amber)" }}>
                {t(language, "bestScore")}
              </p>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--color-brown)" }}>
                {bestScore}
              </p>
            </div>
          </div>

          {/* Waktu Belajar - brown accent */}
          <div
            className="flex items-center gap-3"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "var(--color-cream-dark)",
              padding: "14px",
              border: "1px solid var(--color-beige-dark)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center"
              style={{
                borderRadius: "var(--radius-sm)",
                background: "var(--color-brown-medium)",
              }}
            >
              <Clock size={18} style={{ color: "white" }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "var(--color-brown-medium)" }}>
                {t(language, "studyTime")}
              </p>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--color-brown)" }}>
                {window.__jawaScoring.formatWaktu(totalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress visualization bar */}
        {totalAll > 0 && (
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              background: "var(--color-white)",
              padding: "18px",
              boxShadow: "0 4px 20px var(--color-shadow-md)",
              border: "1px solid rgba(61,43,31,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-extrabold" style={{ color: "var(--color-brown)" }}>
                {t(language, "progress")}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-green)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--color-brown-light)" }}>
                    {t(language, "correct")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-red)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--color-brown-light)" }}>
                    {t(language, "wrong")}
                  </span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="relative h-4 w-full overflow-hidden"
              style={{
                borderRadius: "var(--radius-full)",
                background: "var(--color-red-pale)",
              }}
            >
              <div
                className="absolute inset-y-0 left-0 h-full"
                style={{
                  width: `${totalAll > 0 ? (totalCorrect / totalAll) * 100 : 0}%`,
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(90deg, var(--color-green) 0%, var(--color-green-deep) 100%)",
                  transition: "width 0.8s ease-out",
                }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[12px] font-bold" style={{ color: "var(--color-green)" }}>
                {totalCorrect} {t(language, "correct")}
              </span>
              <span className="text-[12px] font-bold" style={{ color: "var(--color-red)" }}>
                {totalWrong} {t(language, "wrong")}
              </span>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div>
          <p className="mb-3 text-[14px] font-extrabold" style={{ color: "var(--color-brown)" }}>
            {t(language, "achievements")}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {achievements.map((a, i) => (
              <AchievementBadge key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="mb-3 text-[14px] font-extrabold" style={{ color: "var(--color-brown)" }}>
            {t(language, "recentActivity")}
          </p>
          {recentActivity.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-white)",
                    padding: "12px 14px",
                    boxShadow: "0 1px 4px var(--color-shadow)",
                    border: "1px solid rgba(61,43,31,0.05)",
                  }}
                >
                  {/* Status indicator */}
                  <div
                    className="flex h-10 w-10 items-center justify-center shrink-0"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      background: a.status === "done" ? "var(--color-green-pale)" : "var(--color-red-pale)",
                    }}
                  >
                    {a.status === "done" ? (
                      <CheckCircle2 size={18} style={{ color: "var(--color-green)" }} />
                    ) : (
                      <XCircle size={18} style={{ color: "var(--color-red)" }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold" style={{ color: "var(--color-brown)" }}>
                        {t(language, "score")}: {a.score}/{a.total}
                      </span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          borderRadius: "var(--radius-full)",
                          background: a.status === "done" ? "var(--color-green-pale)" : "var(--color-red-pale)",
                          color: a.status === "done" ? "var(--color-green-deep)" : "var(--color-red)",
                        }}
                      >
                        {a.accuracy}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium" style={{ color: "var(--color-brown-light)" }}>
                        {a.time}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-brown-muted)" }}>|</span>
                      <span className="text-[11px] font-medium" style={{ color: "var(--color-brown-light)" }}>
                        {a.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center py-6 text-center"
              style={{
                borderRadius: "var(--radius-xl)",
                background: "var(--color-cream-dark)",
              }}
            >
              <TrendingUp size={28} style={{ color: "var(--color-brown-muted)" }} />
              <p className="mt-2 text-[13px] font-medium" style={{ color: "var(--color-brown-light)" }}>
                {t(language, "noActivity")}
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div>
          <p className="mb-3 text-[14px] font-extrabold" style={{ color: "var(--color-brown)" }}>
            {t(language, "settings")}
          </p>
          <div className="flex flex-col gap-2">
            {/* Login / Logout */}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-3"
                style={{
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-white)",
                  padding: "13px 16px",
                  boxShadow: "0 1px 4px var(--color-shadow)",
                  border: "1px solid rgba(61,43,31,0.05)",
                  cursor: "pointer",
                }}
              >
                <LogOut size={17} color="var(--color-red)" />
                <span className="flex-1 text-left text-[13px] font-bold" style={{ color: "var(--color-red)" }}>
                  {t(language, "logout")}
                </span>
                <ChevronRight size={16} style={{ color: "var(--color-brown-muted)" }} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-3"
                style={{
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-white)",
                  padding: "13px 16px",
                  boxShadow: "0 1px 4px var(--color-shadow)",
                  border: "1px solid rgba(61,43,31,0.05)",
                  cursor: "pointer",
                }}
              >
                <LogIn size={17} style={{ color: "var(--color-orange)" }} />
                <span className="flex-1 text-left text-[13px] font-bold" style={{ color: "var(--color-brown)" }}>
                  {t(language, "loginTitle")}
                </span>
                <ChevronRight size={16} style={{ color: "var(--color-brown-muted)" }} />
              </button>
            )}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-3"
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--color-white)",
                padding: "13px 16px",
                boxShadow: "0 1px 4px var(--color-shadow)",
                border: "1px solid rgba(61,43,31,0.05)",
                cursor: "pointer",
              }}
            >
              <Globe size={17} style={{ color: "var(--color-orange)" }} />
              <span className="flex-1 text-left text-[13px] font-bold" style={{ color: "var(--color-brown)" }}>
                {t(language, "language")}
              </span>
              <span
                className="px-3 py-0.5 text-[11px] font-bold"
                style={{
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-orange-pale)",
                  color: "var(--color-orange-deep)",
                }}
              >
                {language === "id" ? "Indonesia" : "Jawa"}
              </span>
            </button>

            {/* Reset */}
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-3"
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--color-white)",
                padding: "13px 16px",
                boxShadow: "0 1px 4px var(--color-shadow)",
                border: "1px solid rgba(61,43,31,0.05)",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={17} style={{ color: "var(--color-red)" }} />
              <span className="flex-1 text-left text-[13px] font-bold" style={{ color: "var(--color-red)" }}>
                {t(language, "resetData")}
              </span>
              <ChevronRight size={16} style={{ color: "var(--color-brown-muted)" }} />
            </button>

            {/* About */}
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--color-white)",
                padding: "13px 16px",
                boxShadow: "0 1px 4px var(--color-shadow)",
                border: "1px solid rgba(61,43,31,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <Info size={17} style={{ color: "var(--color-brown-light)" }} />
                <span className="flex-1 text-[13px] font-bold" style={{ color: "var(--color-brown)" }}>
                  {t(language, "about")}
                </span>
              </div>
              <p className="mt-1.5 ml-[29px] text-[11px] font-medium" style={{ color: "var(--color-brown-muted)" }}>
                Basa Jawa Quiz — {t(language, "version")} 1.0
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* Reset modal */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowReset(false)}
        >
          <div
            className="w-full max-w-sm"
            style={{
              background: "var(--color-white)",
              borderRadius: "var(--radius-xl)",
              padding: "24px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold" style={{ color: "var(--color-brown)" }}>
              {t(language, "resetData")}
            </h3>
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--color-brown-light)" }}>
              {t(language, "resetConfirm")}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="btn-secondary flex-1 py-2.5"
              >
                {t(language, "cancel")}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-full py-2.5 text-sm font-bold text-white"
                style={{
                  background: "var(--color-red)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
