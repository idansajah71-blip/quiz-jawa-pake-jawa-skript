import { useState } from "react"
import { useQuizStore } from "./store/quizStore"
import type { QuizResult } from "./types"
import { OnboardingScreen } from "./components/OnboardingScreen"
import { HomeScreen } from "./components/HomeScreen"
import { SetupScreen } from "./components/SetupScreen"
import { QuizScreen } from "./components/QuizScreen"
import { ResultScreen } from "./components/ResultScreen"
import { LeaderboardScreen } from "./components/LeaderboardScreen"
import { RiwayatScreen } from "./components/RiwayatScreen"
import { ProfileScreen } from "./components/ProfileScreen"
import { LoginScreen } from "./components/LoginScreen"
import { BottomNav, type NavItem } from "./components/BottomNav"

type Screen = "home" | "setup" | "quiz" | "result" | "login"

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [navScreen, setNavScreen] = useState<NavItem>("home")
  const [result, setResult] = useState<QuizResult | null>(null)
  const language = useQuizStore((s) => s.language)
  const hasOnboarded = useQuizStore((s) => s.hasOnboarded)
  const completeOnboarding = useQuizStore((s) => s.completeOnboarding)
  const login = useQuizStore((s) => s.login)

  const selectedCategories = useQuizStore((s) => s.selectedCategories)
  const startQuiz = useQuizStore((s) => s.startQuiz)
  const resetQuiz = useQuizStore((s) => s.resetQuiz)

  const goSetup = () => setScreen("setup")
  const goHome = () => { resetQuiz(); setResult(null); setScreen("home"); setNavScreen("home") }

  const handleStart = () => {
    startQuiz(selectedCategories.length > 0 ? selectedCategories : [])
    setScreen("quiz")
  }

  const handleFinish = (r: QuizResult) => { setResult(r); setScreen("result") }
  const handleRestart = () => { setResult(null); setScreen("setup") }

  const navigate = (item: NavItem) => {
    setNavScreen(item)
    resetQuiz(); setResult(null); setScreen("home")
  }

  const handleLogin = (name: string, email: string) => {
    login(name, email)
    setScreen("home")
    setNavScreen("profile")
  }

  const handleFinishOnboarding = () => {
    completeOnboarding()
  }

  const isFlow = screen === "setup" || screen === "quiz" || screen === "result" || screen === "login"

  // Show onboarding first
  if (!hasOnboarded) {
    return <OnboardingScreen onFinish={handleFinishOnboarding} />
  }

  return (
    <div className="min-h-screen bg-cream font-sans md:pl-[220px]">
      {navScreen === "home" && screen === "home" && <HomeScreen onStart={goSetup} />}
      {navScreen === "leaderboard" && screen === "home" && <LeaderboardScreen />}
      {navScreen === "riwayat" && screen === "home" && <RiwayatScreen />}
      {navScreen === "profile" && screen === "home" && <ProfileScreen onLogin={() => setScreen("login")} />}

      {screen === "setup" && <SetupScreen onBack={goHome} onStart={handleStart} />}
      {screen === "quiz" && <QuizScreen onFinish={handleFinish} />}
      {screen === "result" && result && (
        <ResultScreen result={result} onRestart={handleRestart} onHome={goHome} />
      )}
      {screen === "login" && (
        <LoginScreen onBack={goHome} onLogin={handleLogin} />
      )}

      {!isFlow && <BottomNav active={navScreen} language={language} onNavigate={navigate} />}
    </div>
  )
}

export default App
