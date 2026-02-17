'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AgentAction, executeActions, getActionIcon, getActionLabel } from '@/utils/agentActions'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: AgentAction[]
  actionResults?: { tool: string; success: boolean; message?: string }[]
}

interface QuickAction {
  id: string
  label: string
  prompt: string
  icon?: string
}

interface GEOINTContextRef {
  setSelectedKeyword: (keyword: any) => void
  calculateGEOINT: () => Promise<void>
  calculateBudget: () => Promise<void>
  setBudget: (amount: number) => void
  keywords: any[]
  selectedKeyword: any
  zoomToProvince: (provinceName: string) => void
  drillDownToProvince: (provinceName: string) => void
}

interface ChatbotContextType {
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
  isLoading: boolean
  quickActions: QuickAction[]
  suggestions: string[]
  openChatbot: () => void
  closeChatbot: () => void
  toggleChatbot: () => void
  minimizeChatbot: () => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setQuickActions: (actions: QuickAction[]) => void
  setGeointContext: (context: GEOINTContextRef | null) => void
  useSuggestion: (suggestion: string) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

// Quick actions by page
const QUICK_ACTIONS_BY_PAGE: Record<string, QuickAction[]> = {
  '/dashboard': [
    { id: 'geoint', label: "GEOINT'e Git", prompt: 'GEOINT haritasini goster', icon: '🗺️' },
    { id: 'strategy', label: 'Strateji Olustur', prompt: 'Yeni strateji olusturmak istiyorum', icon: '📋' },
    { id: 'competitors', label: 'Rakipleri Gor', prompt: 'Rakiplerimi goster', icon: '👥' }
  ],
  '/geoint': [
    { id: 'calculate', label: 'GEOINT Hesapla', prompt: 'GEOINT skorlarini hesapla', icon: '📊' },
    { id: 'budget', label: 'Butce Oner', prompt: 'Butce dagitim onerisi ver', icon: '💰' },
    { id: 'regions', label: 'Bolgeler', prompt: 'En iyi bolgeleri goster', icon: '📍' }
  ],
  '/keywords': [
    { id: 'add', label: 'Kelime Ekle', prompt: 'Yeni anahtar kelime ekle', icon: '➕' },
    { id: 'analyze', label: 'Analiz Et', prompt: 'Secili kelimeyi analiz et', icon: '🔬' },
    { id: 'geoint', label: "GEOINT'e Git", prompt: 'Bu kelime icin GEOINT hesapla', icon: '🗺️' }
  ],
  '/strategies': [
    { id: 'create', label: 'Strateji Olustur', prompt: 'Yeni strateji olustur', icon: '📋' },
    { id: 'progress', label: 'Ilerleme', prompt: 'Strateji ilerlemesini goster', icon: '📈' },
    { id: 'ai', label: 'AI Icerik', prompt: 'AI ile icerik uret', icon: '🤖' }
  ],
  '/competitors': [
    { id: 'add', label: 'Rakip Ekle', prompt: 'Yeni rakip ekle', icon: '➕' },
    { id: 'compare', label: 'Karsilastir', prompt: 'Rakipleri karsilastir', icon: '⚖️' },
    { id: 'analyze', label: 'Analiz Et', prompt: 'Rakip analizi yap', icon: '🔍' }
  ]
}

const defaultQuickActions: QuickAction[] = [
  { id: 'analyze', label: 'Analiz Et', prompt: 'GEOINT analizi baslat', icon: '📊' },
  { id: 'budget', label: 'Butce Oner', prompt: 'Butce onerisi ver', icon: '💰' },
  { id: 'map', label: 'Haritada Gor', prompt: 'Haritayi goster', icon: '🗺️' }
]

const welcomeMessage = 'Merhaba! Ben STRATYON AI asistaniyim. GEOINT analizleri, strateji olusturma, rakip takibi ve daha fazlasi icin size yardimci olabilirim. Ne yapmak istersiniz?'

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [quickActions, setQuickActions] = useState<QuickAction[]>(defaultQuickActions)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [geointContextRef, setGeointContextRef] = useState<GEOINTContextRef | null>(null)

  // Update quick actions based on current page
  useEffect(() => {
    if (pathname) {
      // Find matching quick actions
      const basePath = '/' + pathname.split('/')[1]
      const pageActions = QUICK_ACTIONS_BY_PAGE[basePath] || QUICK_ACTIONS_BY_PAGE[pathname]

      if (pageActions) {
        setQuickActions(pageActions)
      } else {
        setQuickActions(defaultQuickActions)
      }
    }
  }, [pathname])

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('chatbotState')
    if (savedState) {
      try {
        const { isOpen, isMinimized, messages: savedMessages } = JSON.parse(savedState)
        setIsOpen(isOpen)
        setIsMinimized(isMinimized)
        if (savedMessages) {
          setMessages(
            savedMessages.map((m: ChatMessage) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          )
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'chatbotState',
      JSON.stringify({
        isOpen,
        isMinimized,
        messages
      })
    )
  }, [isOpen, isMinimized, messages])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        setIsMinimized(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openChatbot = useCallback(() => {
    setIsOpen(true)
    setIsMinimized(false)

    // Add welcome message if no messages
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ])
    }
  }, [messages.length])

  const closeChatbot = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleChatbot = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      openChatbot()
    }
  }, [isOpen, openChatbot])

  const minimizeChatbot = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  const setGeointContext = useCallback((context: GEOINTContextRef | null) => {
    setGeointContextRef(context)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setSuggestions([])

      try {
        // Prepare history for API
        const history = messages
          .map((m) => ({
            role: m.role,
            content: m.content
          }))
          .slice(-10)

        // Build context
        const context = {
          current_page: pathname || '/dashboard',
          selected_keyword_id: geointContextRef?.selectedKeyword?.id || null,
          selected_keyword_name: geointContextRef?.selectedKeyword?.keyword || null,
          keywords_list:
            geointContextRef?.keywords?.map((k: any) => ({
              id: k.id,
              keyword: k.keyword || k.name
            })) || []
        }

        // Call Agent API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/ai/agent/chat`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              message: content,
              history: history,
              context: context
            })
          }
        )

        if (!response.ok) {
          throw new Error('API request failed')
        }

        const data = await response.json()

        // Execute actions
        let actionResults: { tool: string; success: boolean; message?: string }[] = []
        if (data.actions && data.actions.length > 0) {
          const results = await executeActions(data.actions, {
            router,
            geointContext: geointContextRef || undefined
          })

          actionResults = data.actions.map((action: AgentAction, idx: number) => ({
            tool: action.tool,
            success: results[idx]?.success || false,
            message: results[idx]?.message
          }))
        }

        // Add assistant message with actions
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          actions: data.actions,
          actionResults
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Update suggestions
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Uzgunum, su an baglanti hatasi yasiyorum. Lutfen tekrar deneyin.',
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, pathname, geointContextRef, router]
  )

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ])
    setSuggestions([])
  }, [])

  const useSuggestion = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion)
    },
    [sendMessage]
  )

  const value: ChatbotContextType = {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    quickActions,
    suggestions,
    openChatbot,
    closeChatbot,
    toggleChatbot,
    minimizeChatbot,
    sendMessage,
    clearMessages,
    setQuickActions,
    setGeointContext,
    useSuggestion
  }

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

// Export types for use in other components
export type { ChatMessage, QuickAction, GEOINTContextRef }
