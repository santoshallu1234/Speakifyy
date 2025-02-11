"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Loader2 } from "lucide-react"

export default function TranslationForm({
  onTranslate,
  isLoading,
}: { onTranslate: (text: string, lang: string) => void; isLoading: boolean }) {
  const [text, setText] = useState("")
  const [lang, setLang] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onTranslate(text, lang)
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = "en-US"
      recognition.start()

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setText(transcript)
      }
    } else {
      alert("Speech recognition is not supported in your browser.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate"
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={handleVoiceInput}
          className="bg-[#5e17eb] hover:bg-[#4a11c0]"
          disabled={isLoading}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      <Select onValueChange={setLang} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
          <SelectItem value="it">Italian</SelectItem>
          <SelectItem value="ja">Japanese</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full bg-[#5e17eb] hover:bg-[#4a11c0]" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          "Translate"
        )}
      </Button>
    </form>
  )
}

