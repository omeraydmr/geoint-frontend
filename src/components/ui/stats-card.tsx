'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'
import { Icon, TrendIcon } from './Icon'
import { getIconBgClasses, type ColorVariant } from '@/lib/design-system'

export interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  change?: string
  subtitle?: string
  variant?: ColorVariant
  size?: 'xs' | 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const trendColorStyles = {
  up: 'text-success-600 dark:text-success-400',
  down: 'text-error-600 dark:text-error-400',
  neutral: 'text-surface-500 dark:text-surface-400',
}

/**
 * Stats Card component with dark mode support
 * Uses the Card base component and design system utilities
 */
export function StatsCard({
  title,
  value,
  icon,
  trend,
  change,
  subtitle,
  variant = 'brand',
  size = 'sm',
  className,
  style,
  onClick,
}: StatsCardProps) {
  return (
    <Card
      hover={!!onClick}
      className={cn(
        'group relative overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* Gradient accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center mb-4 border',
            getIconBgClasses(variant),
            variant === 'brand' && 'border-brand-200 dark:border-brand-800',
            variant === 'accent' && 'border-accent-200 dark:border-accent-800',
            variant === 'success' && 'border-success-200 dark:border-success-800',
            variant === 'warning' && 'border-warning-200 dark:border-warning-800',
            variant === 'error' && 'border-error-200 dark:border-error-800',
            variant === 'info' && 'border-info-200 dark:border-info-800',
            variant === 'neutral' && 'border-surface-200 dark:border-surface-700'
          )}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <div className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
        {title}
      </div>

      {/* Value & Trend */}
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {value}
        </div>
        {(trend || change) && (
          <div className="flex items-center gap-1">
            {trend && <TrendIcon trend={trend} />}
            {change && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trendColorStyles[trend || 'neutral']
                )}
              >
                {change}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          {subtitle}
        </div>
      )}
    </Card>
  )
}

/**
 * Mini stats card variant
 */
export interface MiniStatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: ColorVariant
  className?: string
}

export function MiniStatsCard({
  label,
  value,
  icon,
  color = 'brand',
  className,
}: MiniStatsCardProps) {
  return (
    <Card
      hover
      padding="sm"
      className={cn('flex items-center gap-3', className)}
    >
      {icon && (
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            getIconBgClasses(color)
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-surface-500 dark:text-surface-400 truncate">
          {label}
        </div>
        <div className="text-lg font-bold text-surface-900 dark:text-surface-100 truncate">
          {value}
        </div>
      </div>
    </Card>
  )
}

/**
 * Compact inline stat
 */
export interface InlineStatProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function InlineStat({ label, value, trend, className }: InlineStatProps) {
  return (
    <div className={cn('flex items-center justify-between py-2', className)}>
      <span className="text-sm text-surface-500 dark:text-surface-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
          {value}
        </span>
        {trend && <TrendIcon trend={trend} size="xs" />}
      </div>
    </div>
  )
}
