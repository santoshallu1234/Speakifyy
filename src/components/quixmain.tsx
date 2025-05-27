"use client"
import { Header } from "./header"
import { useState, useEffect } from "react"
import QuizStart from "./QuizStart"
import QuizQuestion from "./QuizQuestion"
import QuizSummary from "./QuizSummary"
import GameStateDisplay from "./GameStateDisplay"
import type { QuizData, GameState, LeaderboardEntry } from "../types"

const INITIAL_LIVES = 3
const INITIAL_POWER_UPS = 2

interface QuizMainProps {
  apiEndpoint: string;
}

export default function QuizMain({ apiEndpoint }: QuizMainProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState("Marathi")
  const [selectedLevel, setSelectedLevel] = useState("intermediate")
  const [gameState, setGameState] = useState<GameState>({
    lives: INITIAL_LIVES,
    score: 0,
    streak: 0,
    multiplier: 1,
    achievements: [],
  })
  const [powerUpsAvailable, setPowerUpsAvailable] = useState(INITIAL_POWER_UPS)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const fetchQuizData = async (language: string, level: string) => {
    setLoading(true)
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, level }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data')
      }
      
      const data = await response.json()
      setQuizData(data)
    } catch (err) {
      console.error("Failed to load quiz data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizStarted && !quizEnded && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizStarted && !quizEnded) {
      handleAnswer(null)
    }
  }, [quizStarted, quizEnded, timeLeft])

  const startQuiz = async () => {
    await fetchQuizData(selectedLanguage, selectedLevel)
    setQuizStarted(true)
    setUserAnswers(new Array(quizData?.questions?.length || 0).fill(null))
    setTimeLeft(30)
    setGameState({
      lives: INITIAL_LIVES,
      score: 0,
      streak: 0,
      multiplier: 1,
      achievements: [],
    })
    setPowerUpsAvailable(INITIAL_POWER_UPS)
  }

  const handleAnswer = (answerIndex: number | null) => {
    if (!quizData) return

    const currentQuestion = quizData.questions[currentQuestionIndex]
    const isCorrect = answerIndex !== null && currentQuestion.options[answerIndex]?.is_correct

    setUserAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = answerIndex
      return newAnswers
    })

    setGameState((prev) => {
      let newLives = prev.lives
      const newStreak = isCorrect ? prev.streak + 1 : 0
      const newMultiplier = Math.min(2, 1 + newStreak * 0.1)
      let newScore = prev.score

      if (isCorrect) {
        newScore += 10 * newMultiplier // Points for correct answer
      } else {
        newLives--
        newScore -= 5 // Penalty for wrong answer
      }

      const newAchievements = [...prev.achievements]
      if (newStreak === 3 && !newAchievements.some((a) => a.id === "streak3")) {
        newAchievements.push({
          id: "streak3",
          name: "On Fire!",
          description: "Answer 3 questions correctly in a row",
          unlocked: true,
        })
      }

      return {
        lives: newLives,
        score: Math.max(0, newScore),
        streak: newStreak,
        multiplier: newMultiplier,
        achievements: newAchievements,
      }
    })

    if (currentQuestionIndex < quizData.questions.length - 1 && gameState.lives > 0) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeLeft(30)
    } else {
      endQuiz()
    }
  }

  const endQuiz = () => {
    setQuizEnded(true)
    setLeaderboard((prev) => {
      const newLeaderboard = [...prev, { name: "Player", score: gameState.score }]
      return newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 10)
    })
  }

  const usePowerUp = () => {
    if (powerUpsAvailable > 0) {
      setPowerUpsAvailable((prev) => prev - 1)
      setTimeLeft((prev) => prev + 10)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(44,39,93)] text-white flex justify-center items-center">
        <div className="text-xl">Loading quiz...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(44,39,93)] text-white flex justify-center items-center">
      <div className="container mx-auto px-4 py-8 pb-12 max-w-4xl">
        {!quizStarted && (
          <QuizStart 
            onStart={startQuiz}
            language={selectedLanguage}
            level={selectedLevel}
            onLanguageChange={setSelectedLanguage}
            onLevelChange={setSelectedLevel}
          />
        )}
        {quizStarted && !quizEnded && quizData && (
          <>
            <GameStateDisplay gameState={gameState} />
            <QuizQuestion
              question={quizData.questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={quizData.questions.length}
              timeLeft={timeLeft}
              onUsePowerUp={usePowerUp}
              powerUpsAvailable={powerUpsAvailable}
            />
          </>
        )}
        {quizEnded && (
          <QuizSummary
            score={gameState.score}
            achievements={gameState.achievements}
            leaderboard={leaderboard}
            language={selectedLanguage}
            level={selectedLevel}
          />
        )}
      </div>
    </div>
  )
}

