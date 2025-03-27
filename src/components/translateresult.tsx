import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Copy, Share, Volume2 } from "lucide-react"

interface TranslationResultProps {
  originalText: string
  translatedText: string
  detectedLanguage: string
  rawResponse: string
  targetLanguage: string // Add this prop
  onFavorite?: () => void
  isFavorite?: boolean
}

export default function TranslationResult({
  originalText,
  translatedText,
  detectedLanguage,
  rawResponse,
  targetLanguage, // Add this prop
  onFavorite,
  isFavorite
}: TranslationResultProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const debugVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('=== Voice Debug Information ===');
      console.log('Total voices available:', voices.length);
      console.log('Voices by language:');
      const voicesByLang = voices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push({
          name: voice.name,
          lang: voice.lang,
          default: voice.default,
          localService: voice.localService
        });
        return acc;
      }, {});
      console.log(voicesByLang);
    };

    // Check voices on mount and when voices change
    debugVoices();
    window.speechSynthesis.onvoiceschanged = debugVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    })));
  }, [voices]);

  // Language code mapping for speech synthesis with multiple fallbacks
  const languageCodeMap: { [key: string]: string[] } = {
    'te': ['te-IN', 'te', 'en-IN', 'en-US'], // Telugu with fallbacks
    'hi': ['hi-IN', 'hi', 'en-IN', 'en-US'], // Hindi
    'sa': ['sa-IN', 'hi-IN', 'en-IN', 'en-US'], // Sanskrit
    'bn': ['bn-IN', 'bn', 'en-IN', 'en-US'], // Bengali
    'ta': ['ta-IN', 'ta', 'en-IN', 'en-US'], // Tamil
    'mr': ['mr-IN', 'hi-IN', 'en-IN', 'en-US'], // Marathi
    'es': ['es-ES', 'es', 'en-US'],
    'fr': ['fr-FR', 'fr', 'en-US'],
    'de': ['de-DE', 'de', 'en-US'],
    'it': ['it-IT', 'it', 'en-US'],
    'ja': ['ja-JP', 'ja', 'en-US'],
    'en': ['en-US', 'en-GB', 'en'],
  };

  const findBestVoice = (langCode: string, availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // Get array of possible language codes for the given language
    const possibleCodes = languageCodeMap[langCode] || ['en-US'];
    
    // Try each possible code in order
    for (const code of possibleCodes) {
      // Try exact match first
      const exactMatch = availableVoices.find(voice => voice.lang.toLowerCase() === code.toLowerCase());
      if (exactMatch) return exactMatch;

      // Try starts with match
      const startsWithMatch = availableVoices.find(voice => 
        voice.lang.toLowerCase().startsWith(code.split('-')[0].toLowerCase())
      );
      if (startsWithMatch) return startsWithMatch;
    }

    // Final fallback: return any available voice
    return availableVoices[0] || null;
  };

  const speakText = async (text: string, isOriginal: boolean = false) => {
    if (!("speechSynthesis" in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Get language code
      const langCode = isOriginal ? detectedLanguage : targetLanguage;

      // Wait for voices to load if they haven't already
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        await new Promise<void>((resolve) => {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve();
          };
        });
      }

      // Log available voices
      console.log('Available voices:', voices.map(v => ({
        name: v.name,
        lang: v.lang
      })));

      // Try to find a matching voice
      let matchingVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
        v.lang.toLowerCase().includes(langCode.toLowerCase())
      );

      // If no matching voice found, try fallbacks
      if (!matchingVoice) {
        const fallbacks = {
          'te': ['te-IN', 'hi-IN', 'en-IN'],
          'hi': ['hi-IN', 'en-IN'],
          'ta': ['ta-IN', 'en-IN'],
          'mr': ['mr-IN', 'hi-IN', 'en-IN'],
          'bn': ['bn-IN', 'en-IN'],
        };

        const possibleLangs = fallbacks[langCode] || ['en-US'];
        for (const lang of possibleLangs) {
          matchingVoice = voices.find(v => v.lang.startsWith(lang));
          if (matchingVoice) break;
        }
      }

      // Set voice and language
      if (matchingVoice) {
        utterance.voice = matchingVoice;
        utterance.lang = matchingVoice.lang;
        console.log('Using voice:', matchingVoice.name, matchingVoice.lang);
      } else {
        // Fallback to default
        utterance.lang = 'en-US';
        console.log('No matching voice found, using default');
      }

      // Configure speech parameters
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Set up promise-based error handling
      await new Promise((resolve, reject) => {
        utterance.onend = () => {
          console.log('Speech completed successfully');
          resolve(true);
        };

        utterance.onerror = (event) => {
          const errorDetails = {
            text,
            language: utterance.lang,
            voice: utterance.voice?.name,
            error: event.error,
            message: event.message
          };
          console.error('Speech synthesis error details:', errorDetails);
          reject(new Error(`Speech synthesis failed: ${event.error || 'Unknown error'}`));
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
      });

    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: "Speech Error",
        description: error instanceof Error ? error.message : "Failed to speak the text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareTranslation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translation',
          text: `${originalText}\n${translatedText}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Translation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Original Text:</h3>
            <p>{originalText}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => speakText(originalText, true)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Translated Text:</h3>
            <p>{translatedText}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => speakText(translatedText)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Detected Language:</h3>
            <p>{detectedLanguage}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => speakText(detectedLanguage)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => copyToClipboard(translatedText)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          {navigator.share && (
            <Button
              variant="outline"
              onClick={shareTranslation}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          {onFavorite && (
            <Button
              variant="ghost"
              onClick={onFavorite}
            >
              {isFavorite ? "★" : "☆"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
