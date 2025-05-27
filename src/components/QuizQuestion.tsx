import type { Question } from "../types"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Zap } from "lucide-react"

interface QuestionType {
  question_id: number;
  english_text: string;
  context: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
}

interface QuizQuestionProps {
  question: QuestionType;
  onAnswer: (answer: string) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  onUsePowerUp: (type: string) => void;
  powerUpsAvailable: Record<string, number>;
}

export default function QuizQuestion({
  question,
  onAnswer,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  onUsePowerUp,
  powerUpsAvailable,
}: QuizQuestionProps) {
  const [shuffledOptions, setShuffledOptions] = useState<[string, string][]>([])

  useEffect(() => {
    if (question && question.options) {
      const optionEntries = Object.entries(question.options)
      setShuffledOptions([...optionEntries].sort(() => Math.random() - 0.5))
    }
  }, [question])

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  if (!question || !question.options) {
    return <div>Loading question...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="text-sm text-gray-400">
          Time left: {timeLeft}s
        </div>
      </div>

      <div className="h-2 bg-gray-700 rounded-full">
        <div
          className="h-full bg-[#5e17eb] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{question.english_text}</h3>
        <div className="space-y-3">
          {shuffledOptions.map(([key, value]) => (
            <button
              key={key}
              onClick={() => onAnswer(key)}
              className="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              {key}. {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

