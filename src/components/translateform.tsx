"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function TranslationForm({
  onTranslate,
  isLoading,
}: {
  onTranslate: (text: string, lang: string) => void;
  isLoading: boolean;
}) {
  const [text, setText] = useState("")
  const [lang, setLang] = useState("")
  const [autoDetect, setAutoDetect] = useState(true)
  const [isListening, setIsListening] = useState(false)

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return null;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Default language
    return recognition;
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      return; // Prevent multiple instances
    }

    const recognition = initializeSpeechRecognition();
    if (!recognition) return;

    try {
      setIsListening(true);

      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak now",
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please enable microphone access to use voice input",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Error occurred during voice recognition. Please try again.",
            variant: "destructive",
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        toast({
          title: "Finished",
          description: "Voice recognition completed",
        });
      };

      let finalTranscript = '';
      recognition.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the text input with either final or interim results
        setText(finalTranscript || interimTranscript);
      };

      recognition.start();

    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }
    onTranslate(text, lang);
  };

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
          className={`bg-[#5e17eb] hover:bg-[#4a11c0] ${isListening ? 'animate-pulse' : ''}`}
          disabled={isLoading || isListening}
        >
          <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
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
          <SelectValue placeholder="Select target language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="arabic">Arabic</SelectItem>
          <SelectItem value="telugu">Telugu</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
          <SelectItem value="french">French</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="german">German</SelectItem>
          <SelectItem value="japanese">Japanese</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        type="submit" 
        className="w-full bg-[#5e17eb] hover:bg-[#4a11c0]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>
    </form>
  );

}
