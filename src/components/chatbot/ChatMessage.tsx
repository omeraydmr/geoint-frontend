'use client'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-slate-100 text-slate-900 rounded-bl-md'
        }`}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-600">AI Assistant</span>
          </div>
        )}

        {/* Message content */}
        <p className={`text-sm whitespace-pre-wrap ${isUser ? 'text-white' : 'text-slate-800'}`}>
          {content}
        </p>

        {/* Timestamp */}
        <div className={`text-xs mt-2 ${isUser ? 'text-primary-200' : 'text-slate-400'}`}>
          {timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
