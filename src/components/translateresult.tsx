import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Copy, Share, Volume2, ChevronDown, ChevronUp, Square } from "lucide-react"

interface TranslationResultProps {
  originalText: string
  translatedText: string
  detectedLanguage: string
  rawResponse: string
  targetLanguage: string
  onFavorite?: () => void
  isFavorite?: boolean
}

export default function TranslationResult({
  originalText,
  translatedText,
  detectedLanguage,
  rawResponse,
  targetLanguage,
  onFavorite,
  isFavorite
}: TranslationResultProps) {
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Format the raw response for display
  const formatRawResponse = () => {
    try {
      // First try to parse as JSON
      const parsed = JSON.parse(rawResponse);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If not JSON, return as is
      return rawResponse;
    }
  };

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Debug voice information
      console.log('=== Voice Debug Information ===');
      console.log('Total voices available:', availableVoices.length);
      console.log('Voices by language:');
      const voicesByLang = availableVoices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push({
          name: voice.name,
          lang: voice.lang,
          default: voice.default,
          localService: voice.localService
        });
        return acc;
      }, {} as Record<string, any[]>);
      console.log(voicesByLang);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Language code mapping for speech synthesis with multiple fallbacks
  const languageCodeMap: { [key: string]: string[] } = {
    'english': ['en-US', 'en-GB', 'en'],
    'arabic': ['ar-SA', 'ar', 'en-US'],  // Added Arabic support
    'telugu': ['te-IN', 'te', 'en-IN', 'en-US'],
    'hindi': ['hi-IN', 'hi', 'en-IN', 'en-US'],
    'sanskrit': ['sa-IN', 'hi-IN', 'en-IN', 'en-US'],
    'bn': ['bn-IN', 'bn', 'en-IN', 'en-US'],
    'ta': ['ta-IN', 'ta', 'en-IN', 'en-US'],
    'marathi': ['mr-IN', 'hi-IN', 'en-IN', 'en-US'],
    'es': ['es-ES', 'es-MX', 'es', 'en-US'],
    'french': ['fr-FR', 'fr', 'en-US'],
    'de': ['de-DE', 'de', 'en-US'],
    'ja': ['ja-JP', 'ja', 'en-US'],
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
      stopSpeaking();
      setIsSpeaking(true);

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Get language code
      const langCode = isOriginal ? detectedLanguage : targetLanguage;
      console.log('Speaking with language code:', langCode);

      // Wait for voices to load if they haven't already
      let availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        await new Promise<void>((resolve) => {
          const voicesChanged = () => {
            availableVoices = window.speechSynthesis.getVoices();
            window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
            resolve();
          };
          window.speechSynthesis.addEventListener('voiceschanged', voicesChanged);
        });
      }

      // Get possible language codes for the current language
      const possibleCodes = languageCodeMap[langCode.toLowerCase()] || ['en-US'];
      console.log('Possible language codes:', possibleCodes);

      // Try to find a matching voice
      let matchingVoice = null;
      for (const code of possibleCodes) {
        // Try exact match first
        matchingVoice = availableVoices.find(v => v.lang.toLowerCase() === code.toLowerCase());
        if (matchingVoice) break;

        // Try partial match
        matchingVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith(code.split('-')[0].toLowerCase()));
        if (matchingVoice) break;
      }

      // Set voice and language
      if (matchingVoice) {
        utterance.voice = matchingVoice;
        utterance.lang = matchingVoice.lang;
        console.log('Using voice:', matchingVoice.name, matchingVoice.lang);
      } else {
        // Fallback to default
        utterance.lang = possibleCodes[0];
        console.log('No matching voice found, using default with language:', possibleCodes[0]);
      }

      // Configure speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Set up promise-based error handling
      await new Promise((resolve, reject) => {
        utterance.onend = () => {
          console.log('Speech completed successfully');
          setIsSpeaking(false);
          resolve(true);
        };

        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          setIsSpeaking(false);
          const errorDetails = {
            text,
            language: utterance.lang,
            voice: utterance.voice?.name || 'default',
            error: event.error,
            errorMessage: event.message || 'No error message available',
            timeStamp: event.timeStamp,
            type: event.type,
            target: {
              lang: utterance.lang,
              pitch: utterance.pitch,
              rate: utterance.rate,
              volume: utterance.volume,
              voice: utterance.voice?.name || 'default'
            }
          };
          

          
          let errorMessage = 'Speech synthesis failed';
          switch (event.error) {
            case 'canceled':
              errorMessage = 'Speech was canceled';
              break;
            case 'interrupted':
              errorMessage = 'Speech was interrupted';
              break;
            case 'audio-busy':
              errorMessage = 'Audio system is busy';
              break;
            case 'network':
              errorMessage = 'Network error occurred';
              break;
            case 'synthesis-unavailable':
              errorMessage = 'Speech synthesis is unavailable';
              break;
            case 'synthesis-failed':
              errorMessage = 'Speech synthesis failed';
              break;
            case 'language-unavailable':
              errorMessage = `Voice not available for language: ${utterance.lang}`;
              break;
            default:
              errorMessage = `Speech synthesis error: ${event.error || 'Unknown error'}`;
          }
          
          reject();
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
      });

    } catch (error) {
      setIsSpeaking(false);
      //console.error('Speech synthesis error:', error);
      // toast({
      //   title: "Speech Error",
      //   description: error instanceof Error ? error.message : "Failed to speak the text. Please try again.",
      //   variant: "destructive",
      // });
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

  // Helper function to clean up the response text
  const cleanupText = (text: string) => {
    return text
      .replace('Here is the translation in Hindi:', '')
      .replace('The language of the given phrase is English.', '')
      .trim();
  };

  // Helper function to extract language from response
  const getLanguageFromResponse = (text: string) => {
    const match = text.match(/The language of the given phrase is (\w+)/);
    return match ? match[1] : detectedLanguage;
  };

  const displayText = cleanupText(translatedText);
  const detectedLang = getLanguageFromResponse(detectedLanguage);

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Translation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">Original Text:</h3>
            <p className="whitespace-pre-wrap">{originalText}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => speakText(originalText, true)}
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            {isSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-red-500 hover:text-red-600"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">Translated Text:</h3>
            <p className="whitespace-pre-wrap">{displayText}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => speakText(displayText)}
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            {isSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-red-500 hover:text-red-600"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Detected Language:</h3>
            <p>{detectedLang}</p>
          </div>
          <div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => speakText(detectedLang)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          </div>
          <div>
            <h3 className="font-semibold">Target Language:</h3>
            <p>{targetLanguage}</p>
          </div>
        </div>

        {/* Raw Response Section */}
        <div className="mt-4 border-t border-gray-700 pt-4">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center"
            onClick={() => setShowRawResponse(!showRawResponse)}
          >
            <span className="font-semibold">Raw Response</span>
            {showRawResponse ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {showRawResponse && (
            <div className="mt-2 p-4 bg-gray-900 rounded-md">
              <pre className="whitespace-pre-wrap text-sm overflow-x-auto font-mono">
                {formatRawResponse()}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(rawResponse)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Raw Response
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => copyToClipboard(displayText)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Translation
          </Button>
          {navigator.share && (
            <Button
              variant="outline"
              onClick={shareTranslation}
            >
              <Share className="h-4 w-4 mr-2" />
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
