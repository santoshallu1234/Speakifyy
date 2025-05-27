'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import TranslationHistory from "@/components/translatehistory"
import { useTranslation } from "@/lib/context"

export default function HistoryPage() {
  const { history } = useTranslation()

  console.log('Current history:', history) // Debug log

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Translation History</h1>
          <TranslationHistory 
            translations={history}
            onSelect={(translation) => {
              console.log('Selected:', translation)
              // You can add more functionality here
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
