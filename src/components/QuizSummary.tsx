import { motion } from "framer-motion"

interface Achievement {
  title: string;
  description: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

interface QuizSummaryProps {
  score: number;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  language: string;
  level: string;
}

export default function QuizSummary({
  score = 0,
  achievements = [],
  leaderboard = [],
  language = "English",
  level = "beginner"
}: QuizSummaryProps) {
  // Helper function to decode and sanitize tex
  const sanitizeText = (text: string) => {
    try {
      const decoded = decodeURIComponent(text);
      return decoded.replace(/<[^>]*>/g, '');
    } catch (e) {
      return text;
    }
  };

  // Calculate percentage score (assuming max score is 100)
  const maxScore = 100;
  const percentage = Math.round((score / maxScore) * 100);

  // Get performance message based on score
  const getPerformanceMessage = (score: number) => {
    if (score >= 80) return "Outstanding! You've mastered this level!";
    if (score >= 60) return "Great job! You're making excellent progress!";
    if (score >= 40) return "Good effort! Keep practicing to improve!";
    return "Keep practicing! You'll get better with time.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-[rgb(44,39,93)] rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-[rgb(21,142,140)]">Quiz Complete!</h2>
      
      {/* Score Display */}
      <div className="mb-8 text-center">
        <div className="text-6xl font-bold text-[rgb(21,142,140)] mb-2">
          {Math.round(score)}
        </div>
        <div className="text-xl text-gray-600">points earned</div>
      </div>

      {/* Quiz Details */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Language</p>
            <p className="font-semibold">{sanitizeText(language)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="font-semibold capitalize">{sanitizeText(level)}</p>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Performance Analysis</h3>
        <p className="text-[rgb(44,39,93)]">{getPerformanceMessage(score)}</p>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-[rgb(21,142,140)]">
            Achievements Unlocked
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-[rgba(21,142,140,0.2)]"
              >
                <p className="font-semibold text-[rgb(21,142,140)]">
                  {sanitizeText(achievement.title)}
                </p>
                {achievement.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {sanitizeText(achievement.description)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      {leaderboard.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-[rgb(21,142,140)]">
            Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="w-8 font-bold">{index + 1}.</span>
                  <span>{sanitizeText(entry.name)}</span>
                </div>
                <span className="font-bold">{Math.round(entry.score)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Retry Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-[rgb(21,142,140)] text-white py-3 px-6 rounded-lg hover:bg-[rgb(18,120,118)] transition-colors"
      >
        Try Another Quiz
      </button>
    </motion.div>
  );
}

