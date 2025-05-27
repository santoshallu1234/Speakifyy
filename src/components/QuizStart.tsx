import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface QuizStartProps {
  onStart: () => void;
  language: string;
  level: string;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: string) => void;
}

export default function QuizStart({
  onStart,
  language,
  level,
  onLanguageChange,
  onLevelChange
}: QuizStartProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold mb-8">Language Learning Quiz</h1>
      
      <div className="space-y-4 max-w-sm mx-auto">
        <div>
          <label className="block text-sm mb-2">Select Language</label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marathi">Marathi</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Telugu">Telugu</SelectItem>
              {/* Add more languages as needed */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-2">Select Level</label>
          <Select value={level} onValueChange={onLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onStart}
          className="w-full bg-[#5e17eb] hover:bg-[#4a11c0] mt-6"
        >
          Start Quiz
        </Button>
      </div>

      <div className="mt-8 text-sm opacity-80">
        <p>Test your language skills and track your progress!</p>
        <p>Choose your preferred language and difficulty level to begin.</p>
      </div>
    </div>
  )
};