'use client'

import { useRef, useEffect, useState } from 'react'
import { useChatbot, ChatMessage } from '@/contexts/ChatbotContext'
import { getActionIcon, getActionLabel, AgentAction } from '@/utils/agentActions'

export default function ChatbotSidebar() {
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    quickActions,
    suggestions,
    closeChatbot,
    minimizeChatbot,
    sendMessage,
    clearMessages,
    useSuggestion
  } = useChatbot()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isMinimized])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim())
      setInput('')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700 z-50 flex flex-col transition-transform duration-300 ease-premium ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '380px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">AI Agent</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400">STRATYON Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={minimizeChatbot}
            className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </button>
          <button
            onClick={closeChatbot}
            className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="px-4 py-2 border-t border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
              <p className="text-[10px] text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2">
                Oneriler
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => useSuggestion(suggestion)}
                    disabled={isLoading}
                    className="px-2.5 py-1 text-xs bg-brand-50 dark:bg-brand-900/30 hover:bg-brand-100 dark:hover:bg-brand-800/40 text-brand-600 dark:text-brand-400 rounded-lg border border-brand-200 dark:border-brand-700 transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-700">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => sendMessage(action.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg border border-surface-200 dark:border-surface-600 transition-colors disabled:opacity-50"
                >
                  {action.icon && <span>{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Mesajinizi yazin..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:opacity-50 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={clearMessages}
                className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                Sohbeti temizle
              </button>
              <span className="text-[10px] text-surface-300 dark:text-surface-500">Ctrl+K</span>
            </div>
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={minimizeChatbot}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
          >
            Genislet
          </button>
        </div>
      )}
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? '' : 'space-y-2'}`}>
        {/* Message Content */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-brand-500 text-white rounded-br-md'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/60' : 'text-surface-400 dark:text-surface-500'}`}>
            {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Badges */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {message.actions.map((action: AgentAction, idx: number) => {
              const result = message.actionResults?.[idx]
              const isSuccess = result?.success !== false

              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full ${
                    isSuccess
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700'
                  }`}
                >
                  <span>{getActionIcon(action.tool)}</span>
                  <span>{getActionLabel(action.tool)}</span>
                  {isSuccess ? (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading Indicator Component
function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <span className="text-xs text-surface-500 dark:text-surface-400">Islem yapiliyor...</span>
        </div>
      </div>
    </div>
  )
}
