import { useState } from "react"
import { useQuizStore } from "./store/quizStore"
import type { QuizResult } from "./types"
import { HomeScreen } from "./components/HomeScreen"
import { SetupScreen } from "./components/SetupScreen"
import { QuizScreen } from "./components/QuizScreen"
import { ResultScreen } from "./components/ResultScreen"
import { PlaygroundScreen } from "./components/PlaygroundScreen"

type Screen = "home" | "setup" | "quiz" | "result" | "playground"

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [result, setResult] = useState<QuizResult | null>(null)

  const selectedCategories = useQuizStore((s) => s.selectedCategories)
  const startQuiz = useQuizStore((s) => s.startQuiz)
  const resetQuiz = useQuizStore((s) => s.resetQuiz)

  const goSetup = () => {
    setScreen("setup")
  }

  const goHome = () => {
    resetQuiz()
    setResult(null)
    setScreen("home")
  }

  const handleStart = () => {
    startQuiz(selectedCategories.length > 0 ? selectedCategories : [])
    setScreen("quiz")
  }

  const handleFinish = (r: QuizResult) => {
    setResult(r)
    setScreen("result")
  }

  const handleRestart = () => {
    setResult(null)
    setScreen("setup")
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      {screen === "home" && (
        <HomeScreen onStart={goSetup} onPlayground={() => setScreen("playground")} />
      )}
      {screen === "setup" && (
        <SetupScreen onBack={goHome} onStart={handleStart} />
      )}
      {screen === "quiz" && <QuizScreen onFinish={handleFinish} />}
      {screen === "result" && result && (
        <ResultScreen result={result} onRestart={handleRestart} onHome={goHome} />
      )}
      {screen === "playground" && (
        <PlaygroundScreen onBack={goHome} />
      )}
    </div>
  )
}

export default App