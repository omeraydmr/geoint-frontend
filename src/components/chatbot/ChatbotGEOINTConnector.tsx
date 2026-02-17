'use client'

import { useEffect } from 'react'
import { useGEOINT } from '@/contexts/GEOINTContext'
import { useChatbot } from '@/contexts/ChatbotContext'

/**
 * Connects GEOINTContext to ChatbotContext
 * Place this component inside GEOINTProvider to enable agent actions
 */
export default function ChatbotGEOINTConnector() {
  const geointContext = useGEOINT()
  const chatbotContext = useChatbot()

  useEffect(() => {
    // Register GEOINT context with chatbot
    chatbotContext.setGeointContext({
      setSelectedKeyword: geointContext.setSelectedKeyword,
      calculateGEOINT: geointContext.calculateGEOINT,
      calculateBudget: geointContext.calculateBudget,
      setBudget: geointContext.setBudget,
      keywords: geointContext.keywords,
      selectedKeyword: geointContext.selectedKeyword,
      zoomToProvince: geointContext.zoomToProvince,
      drillDownToProvince: geointContext.drillDownToProvince
    })

    // Cleanup on unmount
    return () => {
      chatbotContext.setGeointContext(null)
    }
  }, [
    geointContext.setSelectedKeyword,
    geointContext.calculateGEOINT,
    geointContext.calculateBudget,
    geointContext.setBudget,
    geointContext.keywords,
    geointContext.selectedKeyword,
    geointContext.zoomToProvince,
    geointContext.drillDownToProvince,
    chatbotContext.setGeointContext
  ])

  return null
}
