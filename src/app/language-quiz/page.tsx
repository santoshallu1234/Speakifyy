'use client'

//import { Header } from "../../components/header"
import QuizMain from "@/components/quixmain"

export default function LanguageQuizPage() {
  return (
    <div className="min-h-screen bg-[rgb(44,39,93)]">
      <QuizMain apiEndpoint="http://localhost:8000/api/language-test/generate" />
    </div>
  )
}