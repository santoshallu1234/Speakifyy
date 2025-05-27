'use client'

import Header from "@/components/header"
import Footer from "@/components/footer"
import MCQGenerator from "@/components/mcq-generator"

export default function MCQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">MCQ Generator</h1>
          <MCQGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}