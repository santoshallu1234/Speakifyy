"use client"

import { useState } from "react"
import axios from "axios"
import Header from "../components/header"
import TranslationForm from "../components/translateform"
import TranslationResult from "../components/translateresult"
import Footer from "../components/footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTranslate = async (text: string, lang: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.get(`https://speakify-b8jdydwma-santoshallu1234s-projects.vercel.app/convert?text=${encodeURIComponent(text)}&lang=${lang}`)
      console.log(response.data)
      setResult(response.data)
    } catch (error) {
      console.error("Error translating text:", error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data.error || "Unknown error"}`)
        } else if (error.request) {
          setError("No response received from the server. Please check your internet connection and try again.")
        } else {
          setError(`An error occurred: ${error.message}`)
        }
      } else {
        setError("An unexpected error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8 ">
          <TranslationForm onTranslate={handleTranslate} isLoading={isLoading} />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <TranslationResult
              originalText={result.original_text}
              translatedText={result.translated_text}
              detectedLanguage={result.detected_language}
              rawResponse={result.raw_response}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

