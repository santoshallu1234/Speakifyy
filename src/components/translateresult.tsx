import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TranslationResultProps {
  originalText: string
  translatedText: string
  detectedLanguage: string
  rawResponse: string
}

export default function TranslationResult({
  originalText,
  translatedText,
  detectedLanguage,
  rawResponse,
}: TranslationResultProps) {
  
  // Function to speak the translated text
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = rawResponse // Try setting language dynamically
      speechSynthesis.speak(utterance)
    } else {
      alert("Your browser does not support text-to-speech.")
    }
  }

  // Automatically speak when translation is updated
  useEffect(() => {
    if (rawResponse) {
      speakText(rawResponse)
    }
  }, [rawResponse])

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Translation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Original Text:</h3>
          <p>{originalText}</p>
        </div>
        <div>
          <h3 className="font-semibold">Detected Language:</h3>
          <p>{detectedLanguage}</p>
        </div>
        <div>
          <h3 className="font-semibold">Raw Response:</h3>
          <pre className="bg-gray-900 p-2 rounded-md overflow-x-auto">
            {rawResponse}
          </pre>
        </div>
        
        {/* Button to manually trigger speech */}
        <Button onClick={() => speakText(rawResponse)}>🔊 Speak</Button>
      </CardContent>
    </Card>
  )
}
