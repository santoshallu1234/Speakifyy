'use client'

import React, { createContext, useContext, useState } from 'react'

type TranslationContextType = {
  history: any[]
  favorites: any[]
  addToHistory: (translation: any) => void
  addToFavorites: (translation: any) => void
  removeFromFavorites: (id: string) => void
}

const TranslationContext = React.createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])

  const addToHistory = (translation: any) => {
    setHistory(prev => [translation, ...prev])
  }

  const addToFavorites = (translation: any) => {
    setFavorites(prev => [translation, ...prev])
  }

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id))
  }

  return (
    <TranslationContext.Provider 
      value={{ 
        history, 
        favorites, 
        addToHistory, 
        addToFavorites, 
        removeFromFavorites 
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}