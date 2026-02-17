import React from 'react'
import { cn } from '@/lib/utils'
import { BentoCard } from './bento-card'

export interface InsightCardProps {
  title: string
  message: string
  icon?: React.ReactNode
  severity?: 'info' | 'success' | 'warning' | 'danger'
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  onDismiss?: () => void
}

export function InsightCard({
  title,
  message,
  icon,
  severity = 'info',
  action,
  className,
  onDismiss,
}: InsightCardProps) {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          icon: 'bg-success-100 text-success-600',
          title: 'text-success-900',
          message: 'text-success-700',
        }
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          icon: 'bg-warning-100 text-warning-600',
          title: 'text-warning-900',
          message: 'text-warning-700',
        }
      case 'danger':
        return {
          bg: 'bg-danger-50',
          border: 'border-danger-200',
          icon: 'bg-danger-100 text-danger-600',
          title: 'text-danger-900',
          message: 'text-danger-700',
        }
      default:
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          icon: 'bg-primary-100 text-primary-600',
          title: 'text-primary-900',
          message: 'text-primary-700',
        }
    }
  }

  const styles = getSeverityStyles()

  const defaultIcon = () => {
    switch (severity) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'danger':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  return (
    <BentoCard
      className={cn(
        'relative border-2',
        styles.bg,
        styles.border,
        'animate-fade-in-up',
        className
      )}
      size="auto"
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', styles.icon)}>
          {icon || defaultIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-semibold mb-1', styles.title)}>{title}</h4>
          <p className={cn('text-sm leading-relaxed', styles.message)}>{message}</p>

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-3 text-sm font-medium underline hover:no-underline transition-all',
                styles.title
              )}
            >
              {action.label} →
            </button>
          )}
        </div>
      </div>
    </BentoCard>
  )
}

// Compact variant
export interface CompactInsightProps {
  message: string
  severity?: 'info' | 'success' | 'warning' | 'danger'
  className?: string
}

export function CompactInsight({ message, severity = 'info', className }: CompactInsightProps) {
  const colors = {
    info: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
  }

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg text-sm border',
        colors[severity],
        className
      )}
    >
      {message}
    </div>
  )
}
