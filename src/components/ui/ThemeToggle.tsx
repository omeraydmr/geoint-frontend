'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({
  size = 'md',
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, isDark } = useTheme()

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={toggleTheme}
        className={cn(
          'relative flex items-center justify-center rounded-xl transition-all duration-300',
          'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700',
          'border border-surface-200 dark:border-surface-700',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
          sizes[size]
        )}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Sun Icon */}
        <svg
          className={cn(
            'absolute transition-all duration-300',
            iconSizes[size],
            isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100 text-warning-500'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={cn(
            'absolute transition-all duration-300',
            iconSizes[size],
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-brand-400'
              : 'opacity-0 -rotate-90 scale-0'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      {showLabel && (
        <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
          {isDark ? 'Koyu' : 'Acik'}
        </span>
      )}
    </div>
  )
}

/**
 * Compact theme toggle for header/navbar
 */
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200',
        'hover:bg-surface-100 dark:hover:bg-surface-800',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}

/**
 * Theme selector with all three options (light/dark/system)
 */
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'light' as const, label: 'Acik', icon: 'sun' },
    { value: 'dark' as const, label: 'Koyu', icon: 'moon' },
    { value: 'system' as const, label: 'Sistem', icon: 'computer' },
  ]

  return (
    <div className={cn('flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            theme === option.value
              ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          {option.icon === 'sun' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {option.icon === 'moon' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          {option.icon === 'computer' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
