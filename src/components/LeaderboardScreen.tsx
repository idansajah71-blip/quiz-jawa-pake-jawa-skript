import { useMemo, useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import { Crown, Medal, Trophy, Zap } from "lucide-react"

type Period = "week" | "month" | "all"

interface Player {
  id: string
  name: string
  xp: number
  accuracy: number
  quizzes: number
  grade: string
  isUser: boolean
}

const MOCK_AVATARS = [
  "bg-gradient-to-br from-orange to-orange-deep",
  "bg-gradient-to-br from-green to-green-deep",
  "bg-gradient-to-br from-orange-light to-orange",
  "bg-gradient-to-br from-brown-muted to-brown-light",
  "bg-gradient-to-br from-orange-pale to-orange-light",
  "bg-gradient-to-br from-green-pale to-green",
]

function getAvatarBg(index: number) {
  return MOCK_AVATARS[index % MOCK_AVATARS.length]
}

function PodiumCard({ player, rank, isUser }: { player: Player; rank: 1 | 2 | 3; isUser: boolean }) {
  const height = rank === 1 ? "h-40" : "h-32"
  const avatarSize = rank === 1 ? "h-16 w-16" : "h-12 w-12"
  const textSize = rank === 1 ? "text-4xl" : "text-2xl"

  return (
    <div className="flex flex-1 flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-2">
        <div
          className={`${avatarSize} flex items-center justify-center rounded-full ${getAvatarBg(rank - 1)}`}
          style={{
            border: isUser ? "3px solid var(--color-orange)" : "3px solid var(--color-white)",
            boxShadow: isUser
              ? "0 0 0 3px var(--color-orange), 0 4px 12px var(--color-shadow-md)"
              : "0 4px 12px var(--color-shadow-md)",
          }}
        >
          <span className="text-lg font-extrabold text-white">
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        {/* Crown for #1 */}
        {rank === 1 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Crown size={20} style={{ color: "#F59E0B" }} fill="#F59E0B" />
          </div>
        )}
        {/* Medal badge */}
        <div
          className={`absolute -bottom-1 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full ${
            rank === 1 ? "bg-yellow-400" : rank === 2 ? "bg-gray-300" : "bg-orange-300"
          }`}
          style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
        >
          <Medal size={12} style={{ color: rank === 1 ? "#92400E" : "#44403C" }} />
        </div>
      </div>

      {/* Podium bar */}
      <div
        className={`${height} flex w-full flex-col items-center justify-center rounded-t-xl`}
        style={{
          background: isUser
            ? "linear-gradient(180deg, var(--color-orange) 0%, var(--color-orange-deep) 100%)"
            : rank === 1
              ? "linear-gradient(180deg, var(--color-orange-pale) 0%, var(--color-orange-light) 100%)"
              : rank === 2
                ? "linear-gradient(180deg, var(--color-cream-dark) 0%, var(--color-beige) 100%)"
                : "linear-gradient(180deg, var(--color-cream-dark) 0%, var(--color-beige) 100%)",
          boxShadow: isUser ? "0 -4px 16px var(--color-orange)40" : "0 -2px 8px var(--color-shadow)",
        }}
      >
        <p className={`${textSize} font-extrabold`} style={{ color: isUser ? "white" : "var(--color-brown)" }}>
          #{rank}
        </p>
      </div>

      {/* Name + XP below */}
      <div className="mt-2 text-center">
        <p className="text-sm font-bold" style={{ color: isUser ? "var(--color-orange)" : "var(--color-brown)" }}>
          {player.name}
        </p>
        <p className="text-xs font-semibold" style={{ color: "var(--color-brown-light)" }}>
          {player.xp} XP
        </p>
      </div>
    </div>
  )
}

function RankRow({ player, rank }: { player: Player; rank: number }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: player.isUser ? "var(--color-orange-pale)" : "var(--color-white)",
        borderRadius: "var(--radius-lg)",
        padding: "12px 14px",
        boxShadow: "0 1px 4px var(--color-shadow)",
        border: player.isUser ? "1.5px solid var(--color-orange)" : "1px solid rgba(61,43,31,0.05)",
      }}
    >
      {/* Rank number */}
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold"
        style={{
          background: player.isUser ? "var(--color-orange)" : "var(--color-cream-dark)",
          color: player.isUser ? "white" : "var(--color-brown)",
        }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${getAvatarBg(rank - 1)}`}
        style={{ border: "2px solid var(--color-white)", boxShadow: "0 2px 6px var(--color-shadow)" }}
      >
        <span className="text-sm font-extrabold text-white">
          {player.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-sm font-bold" style={{ color: player.isUser ? "var(--color-orange)" : "var(--color-brown)" }}>
          {player.name} {player.isUser && <span className="text-xs font-semibold">({t("id", "you")})</span>}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium" style={{ color: "var(--color-brown-light)" }}>
            {player.quizzes} quiz
          </span>
          <span className="text-xs" style={{ color: "var(--color-brown-muted)" }}>|</span>
          <span className="text-xs font-medium" style={{ color: "var(--color-brown-light)" }}>
            {player.accuracy}%
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1.5">
        <Zap size={14} style={{ color: "var(--color-orange)" }} />
        <span className="text-sm font-extrabold" style={{ color: "var(--color-brown)" }}>
          {player.xp}
        </span>
      </div>
    </div>
  )
}

export function LeaderboardScreen() {
  const language = useQuizStore((s) => s.language)
  const highScores = useQuizStore((s) => s.highScores)
  const user = useQuizStore((s) => s.user)
  const [period, setPeriod] = useState<Period>("all")

  const filteredScores = useMemo(() => {
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    const monthMs = 30 * 24 * 60 * 60 * 1000
    return highScores.filter((h) => {
      if (period === "week") return now - h.date < weekMs
      if (period === "month") return now - h.date < monthMs
      return true
    })
  }, [highScores, period])

  const players = useMemo<Player[]>(() => {
    const list: Player[] = []

    if (user) {
      const userXp = filteredScores.reduce((sum, h) => sum + h.score, 0) * 10
      const userAcc = filteredScores.length > 0
        ? Math.round(filteredScores.reduce((sum, h) => sum + h.accuracy, 0) / filteredScores.length)
        : 0
      list.push({
        id: "user",
        name: user.name,
        xp: userXp,
        accuracy: userAcc,
        quizzes: filteredScores.length,
        grade: window.__jawaScoring.golGrade(userAcc),
        isUser: true,
      })
    }

    const fakeNames = [
      { name: "Raka Pratama", xp: 850, accuracy: 92, quizzes: 15 },
      { name: "Dewi Lestari", xp: 720, accuracy: 88, quizzes: 12 },
      { name: "Budi Santoso", xp: 680, accuracy: 85, quizzes: 11 },
      { name: "Sari Putri", xp: 590, accuracy: 82, quizzes: 9 },
      { name: "Andi Wijaya", xp: 510, accuracy: 78, quizzes: 8 },
      { name: "Maya Sari", xp: 450, accuracy: 75, quizzes: 7 },
      { name: "Fajar Nugroho", xp: 380, accuracy: 72, quizzes: 6 },
      { name: "Rina Hartati", xp: 320, accuracy: 68, quizzes: 5 },
    ]

    fakeNames.forEach((f, i) => {
      if (!user || f.name !== user.name) {
        list.push({
          id: `fake-${i}`,
          name: f.name,
          xp: f.xp,
          accuracy: f.accuracy,
          quizzes: f.quizzes,
          grade: window.__jawaScoring.golGrade(f.accuracy),
          isUser: false,
        })
      }
    })

    return list.sort((a, b) => b.xp - a.xp)
  }, [user, filteredScores])

  const top3 = players.slice(0, 3)
  const rest = players.slice(3)
  const userRank = players.findIndex((p) => p.isUser) + 1

  const periods: { key: Period; label: string }[] = [
    { key: "week", label: t(language, "thisWeek") },
    { key: "month", label: t(language, "thisMonth") },
    { key: "all", label: t(language, "allTime") },
  ]

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden px-5 pt-8 pb-28">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-30"
        style={{
          borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
          background: "linear-gradient(135deg, var(--color-orange-pale) 0%, var(--color-green-pale) 100%)",
          filter: "blur(60px)",
          transform: "translate(20%, -30%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-20 left-0 h-48 w-48 opacity-25"
        style={{
          borderRadius: "55% 45% 60% 40% / 45% 55% 45% 55%",
          background: "linear-gradient(135deg, var(--color-green-pale) 0%, var(--color-orange-pale) 100%)",
          filter: "blur(50px)",
          transform: "translate(-30%, 20%)",
        }}
      />

      {/* Header */}
      <header className="text-center">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center"
          style={{
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-deep) 100%)",
            boxShadow: "0 4px 16px var(--color-orange)40",
          }}
        >
          <Trophy size={24} style={{ color: "white" }} />
        </div>
        <h1 className="text-[22px] font-extrabold" style={{ color: "var(--color-brown)" }}>
          {t(language, "navLeaderboard")}
        </h1>
        {user && userRank > 0 && (
          <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-orange)" }}>
            {t(language, "yourPosition")}: #{userRank}
          </p>
        )}
      </header>

      {/* Period selector */}
      <div
        className="mx-auto mt-5 flex gap-2"
        style={{
          background: "var(--color-cream-dark)",
          borderRadius: "var(--radius-full)",
          padding: "4px",
        }}
      >
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="px-4 py-1.5 text-[12px] font-bold"
            style={{
              borderRadius: "var(--radius-full)",
              background: period === p.key ? "var(--color-white)" : "transparent",
              color: period === p.key ? "var(--color-orange)" : "var(--color-brown-muted)",
              boxShadow: period === p.key ? "0 2px 8px var(--color-shadow)" : "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {top3.length >= 3 && (
        <div className="mt-6 flex items-end justify-center gap-2">
          {/* #2 */}
          <PodiumCard player={top3[1]} rank={2} isUser={top3[1].isUser} />
          {/* #1 */}
          <PodiumCard player={top3[0]} rank={1} isUser={top3[0].isUser} />
          {/* #3 */}
          <PodiumCard player={top3[2]} rank={3} isUser={top3[2].isUser} />
        </div>
      )}

      {/* If less than 3 players, just show what we have */}
      {top3.length < 3 && top3.length > 0 && (
        <div className="mt-6 flex items-end justify-center gap-3">
          {top3.map((p, i) => (
            <PodiumCard key={p.id} player={p} rank={(i + 1) as 1 | 2 | 3} isUser={p.isUser} />
          ))}
        </div>
      )}

      {/* Rank list */}
      <div className="mt-6 flex flex-col gap-2">
        {rest.map((player, i) => (
          <RankRow key={player.id} player={player} rank={i + 4} />
        ))}
      </div>

      {/* Empty state */}
      {players.length === 0 && (
        <div
          className="mt-8 flex flex-col items-center py-8 text-center"
          style={{
            background: "var(--color-cream-dark)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <Trophy size={32} style={{ color: "var(--color-brown-muted)" }} />
          <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-brown-light)" }}>
            {t(language, "emptyScores")}
          </p>
        </div>
      )}
    </div>
  )
}
