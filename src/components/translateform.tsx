"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function TranslationForm({
  onTranslate,
  isLoading,
}: { onTranslate: (text: string, lang: string) => void; isLoading: boolean }) {
  const [text, setText] = useState("")
  const [lang, setLang] = useState("")
  const [autoDetect, setAutoDetect] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onTranslate(text, lang)
  }

  const handleVoiceInput = () => {
    // Get the correct Speech Recognition API
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      try {
        const recognition = new SpeechRecognitionAPI();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          console.log("Speech recognition started");
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed') {
            alert("Please enable microphone access to use voice input");
          } else {
            alert("Error occurred during voice recognition. Please try again.");
          }
        };

        recognition.onend = () => {
          console.log("Speech recognition ended");
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
        };

        recognition.start();
      } catch (err) {
        console.error("Speech recognition error:", err);
        alert("Could not start speech recognition. Please try again.");
      }
    } else {
      alert("Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.");
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
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="autoDetect" 
          checked={autoDetect} 
          onCheckedChange={(checked) => setAutoDetect(checked as boolean)}
        />
        <label htmlFor="autoDetect" className="text-sm text-gray-300">
          Auto-detect source language
        </label>
      </div>
      <Select onValueChange={setLang} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {/* Indian Languages */}
          <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
          <SelectItem value="sa">Sanskrit (संस्कृतम्)</SelectItem>
          {/* Other Indian Languages */}
          <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
          <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
          <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
          <SelectItem value="mr">Marathi (मराठी)</SelectItem>
          {/* International Languages */}
          <SelectItem value="es">Spanish (Español)</SelectItem>
          <SelectItem value="fr">French (Français)</SelectItem>
          <SelectItem value="de">German (Deutsch)</SelectItem>
          <SelectItem value="it">Italian (Italiano)</SelectItem>
          <SelectItem value="ja">Japanese (日本語)</SelectItem>
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

