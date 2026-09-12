import { useState } from "react"
import { useQuizStore } from "../store/quizStore"
import { t } from "../i18n/translations"
import { ChevronRight, BookOpen, Code2, Brain, Rocket } from "lucide-react"

interface Props {
  onFinish: () => void
}

const SLIDES = [
  {
    icon: BookOpen,
    titleKey: "onboard1Title" as const,
    descKey: "onboard1Desc" as const,
    color: "var(--color-green)",
    bg: "var(--color-green-pale)",
  },
  {
    icon: Code2,
    titleKey: "onboard2Title" as const,
    descKey: "onboard2Desc" as const,
    color: "var(--color-orange)",
    bg: "var(--color-orange-pale)",
  },
  {
    icon: Brain,
    titleKey: "onboard3Title" as const,
    descKey: "onboard3Desc" as const,
    color: "#8B6FC0",
    bg: "#F0EAF8",
  },
  {
    icon: Rocket,
    titleKey: "onboard4Title" as const,
    descKey: "onboard4Desc" as const,
    color: "var(--color-orange-deep)",
    bg: "var(--color-orange-pale)",
  },
]

export function OnboardingScreen({ onFinish }: Props) {
  const language = useQuizStore((s) => s.language)
  const [current, setCurrent] = useState(0)
  const isLast = current === SLIDES.length - 1
  const slide = SLIDES[current]

  const next = () => {
    if (isLast) {
      onFinish()
    } else {
      setCurrent((c) => c + 1)
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-8"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Slide content */}
      <div className="flex flex-col items-center text-center" style={{ maxWidth: "360px" }}>
        {/* Icon */}
        <div
          className="flex h-24 w-24 items-center justify-center"
          style={{
            borderRadius: "32px",
            background: slide.bg,
            boxShadow: `0 8px 32px ${slide.color}20`,
          }}
        >
          <slide.icon size={44} style={{ color: slide.color }} />
        </div>

        {/* Title */}
        <h1
          className="mt-8 text-[24px] font-extrabold leading-tight"
          style={{ color: "var(--color-brown)" }}
        >
          {t(language, slide.titleKey)}
        </h1>

        {/* Description */}
        <p
          className="mt-3 text-[15px] font-medium leading-relaxed"
          style={{ color: "var(--color-brown-light)" }}
        >
          {t(language, slide.descKey)}
        </p>
      </div>

      {/* Bottom section */}
      <div className="mt-12 flex w-full max-w-sm flex-col items-center">
        {/* Dots */}
        <div className="flex gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === current ? slide.color : "var(--color-beige-dark)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next / Start button */}
        <button onClick={next} className="btn-primary w-full py-4 text-lg">
          {isLast ? t(language, "start") : t(language, "next")}
          <ChevronRight size={18} />
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={onFinish}
            className="mt-4 text-sm font-semibold"
            style={{ color: "var(--color-brown-light)", background: "none", border: "none", cursor: "pointer" }}
          >
            {t(language, "skip")}
          </button>
        )}
      </div>
    </div>
  )
}
