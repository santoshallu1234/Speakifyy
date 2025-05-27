import { motion } from "framer-motion"
import type { GameState } from "../types"
import { Heart } from "lucide-react"

interface GameStateDisplayProps {
  gameState: GameState
}

export default function GameStateDisplay({ gameState }: GameStateDisplayProps) {
  return (
    <motion.div
      className="bg-white text-[rgb(44,39,93)] p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        {[...Array(gameState.lives)].map((_, i) => (
          <Heart key={i} className="w-6 h-6 text-red-500 mr-1" fill="currentColor" />
        ))}
      </div>
      <div className="text-2xl font-bold text-[rgb(21,142,140)]">Score: {gameState.score.toFixed(1)}</div>
      <div className="text-sm font-semibold text-[rgb(44,39,93)]">
        Streak: {gameState.streak} | Multiplier: x{gameState.multiplier.toFixed(1)}
      </div>
    </motion.div>
  )
}

