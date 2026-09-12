import { Home, Trophy, Clock, User } from "lucide-react"
import type { Language } from "../types"
import { t } from "../i18n/translations"

export type NavItem = "home" | "leaderboard" | "riwayat" | "profile"

interface Props {
  active: NavItem
  language: Language
  onNavigate: (item: NavItem) => void
}

const ITEMS: { key: NavItem; icon: typeof Home; labelKey: string }[] = [
  { key: "home", icon: Home, labelKey: "navHome" },
  { key: "leaderboard", icon: Trophy, labelKey: "navLeaderboard" },
  { key: "riwayat", icon: Clock, labelKey: "navRiwayat" },
  { key: "profile", icon: User, labelKey: "navProfile" },
]

export function BottomNav({ active, language, onNavigate }: Props) {
  return (
    <>
      {/* Mobile — bottom nav */}
      <nav
        className="fixed bottom-0 left-0 z-20 w-full md:hidden"
        style={{
          background: "rgba(255, 252, 245, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--color-beige)",
          borderRadius: "28px 28px 0 0",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -4px 30px var(--color-shadow-md)",
        }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 px-2 pt-2 pb-1">
          {ITEMS.map(({ key, icon: Icon, labelKey }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                aria-current={isActive ? "page" : undefined}
                className="flex cursor-pointer flex-col items-center gap-1.5 py-2.5 transition-all duration-200 active:scale-90 hover:bg-beige/50"
              >
                <div
                  className="flex h-10 w-12 items-center justify-center transition-all duration-200"
                  style={{
                    borderRadius: "var(--radius-md)",
                    background: isActive ? "var(--color-orange)" : "transparent",
                    color: isActive ? "var(--color-white)" : "var(--color-brown-light)",
                    boxShadow: isActive ? "0 3px 12px rgba(232, 132, 74, 0.30)" : "none",
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: isActive ? "var(--color-orange)" : "var(--color-brown-light)" }}
                >
                  {t(language, labelKey)}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop — sidebar */}
      <nav
        className="fixed left-0 top-0 z-20 hidden h-full flex-col md:flex"
        style={{
          width: "220px",
          background: "rgba(255, 252, 245, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid var(--color-beige)",
          boxShadow: "4px 0 30px var(--color-shadow)",
          padding: "32px 12px 32px 12px",
        }}
      >
        <div className="mb-8 px-3">
          <p className="text-lg font-extrabold" style={{ color: "var(--color-brown)" }}>
            {t(language, "appTitle")}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {ITEMS.map(({ key, icon: Icon, labelKey }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                aria-current={isActive ? "page" : undefined}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:bg-beige/50"
                style={{
                  background: isActive ? "var(--color-orange)" : "transparent",
                  color: isActive ? "var(--color-white)" : "var(--color-brown-medium)",
                  boxShadow: isActive ? "0 3px 12px rgba(232, 132, 74, 0.25)" : "none",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "14px",
                  border: "none",
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{t(language, labelKey)}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-auto px-3">
          <p className="text-[11px] font-medium" style={{ color: "var(--color-brown-muted)" }}>
            JawaScript v1.0
          </p>
        </div>
      </nav>
    </>
  )
}
