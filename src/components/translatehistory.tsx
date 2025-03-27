import { Card } from "@/components/ui/card";

interface Translation {
  originalText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
}

export default function TranslationHistory({ 
  translations,
  onSelect 
}: { 
  translations: Translation[];
  onSelect: (translation: Translation) => void;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Recent Translations</h2>
      <div className="space-y-2">
        {translations.map((translation, index) => (
          <Card 
            key={index}
            className="p-4 cursor-pointer hover:bg-gray-800"
            onClick={() => onSelect(translation)}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">{translation.originalText}</p>
                <p className="font-medium">{translation.translatedText}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(translation.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}