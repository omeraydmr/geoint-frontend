'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { getColorClasses, normalizeVariant, type ColorVariant, type ColorIntensity, type BaseColorVariant } from '@/lib/design-system'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ColorVariant | 'outline' | 'default'
  intensity?: ColorIntensity
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}

const dotColors: Record<BaseColorVariant | 'outline', string> = {
  brand: 'bg-brand-600 dark:bg-brand-400',
  accent: 'bg-accent-600 dark:bg-accent-400',
  success: 'bg-success-600 dark:bg-success-400',
  warning: 'bg-warning-600 dark:bg-warning-400',
  error: 'bg-error-600 dark:bg-error-400',
  info: 'bg-info-600 dark:bg-info-400',
  neutral: 'bg-slate-500 dark:bg-slate-400',
  outline: 'bg-slate-500 dark:bg-slate-400',
}

/**
 * Badge component using the design system
 *
 * Usage:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 * <Badge variant="brand" intensity="strong">Premium</Badge>
 */
export function Badge({
  variant = 'neutral',
  intensity = 'subtle',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors'

  // Normalize variant (handle aliases like 'primary' -> 'brand', 'danger' -> 'error')
  const normalizedVariant = variant === 'outline' ? 'outline' : normalizeVariant(variant as ColorVariant)

  // Handle outline variant specially
  const colorStyles = variant === 'outline'
    ? 'bg-transparent border border-surface-300 text-surface-700 dark:border-surface-600 dark:text-surface-300'
    : getColorClasses(variant as ColorVariant, intensity)

  return (
    <span
      className={cn(
        baseStyles,
        colorStyles,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            dotColors[normalizedVariant]
          )}
        />
      )}
      {children}
    </span>
  )
}

/**
 * Status badge - maps status strings to appropriate colors
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string
}

const statusToVariant: Record<string, ColorVariant> = {
  // Success states
  active: 'success',
  enabled: 'success',
  online: 'success',
  completed: 'success',
  approved: 'success',
  published: 'success',
  live: 'success',

  // Warning states
  pending: 'warning',
  waiting: 'warning',
  processing: 'warning',
  review: 'warning',
  draft: 'warning',
  scheduled: 'warning',

  // Error states
  error: 'error',
  failed: 'error',
  blocked: 'error',
  rejected: 'error',
  expired: 'error',
  cancelled: 'error',
  offline: 'error',

  // Info states
  info: 'info',
  new: 'info',
  updated: 'info',

  // Neutral states
  inactive: 'neutral',
  disabled: 'neutral',
  archived: 'neutral',
  paused: 'neutral',
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().trim()
  const variant = statusToVariant[normalizedStatus] || 'neutral'

  return (
    <Badge variant={variant} dot {...props}>
      {status}
    </Badge>
  )
}

/**
 * Priority badge
 */
export interface PriorityBadgeProps extends Omit<BadgeProps, 'variant'> {
  priority: 'critical' | 'high' | 'medium' | 'low' | 'none'
}

const priorityToVariant: Record<string, ColorVariant> = {
  critical: 'error',
  high: 'warning',
  medium: 'brand',
  low: 'neutral',
  none: 'neutral',
}

export function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const variant = priorityToVariant[priority] || 'neutral'

  return (
    <Badge variant={variant} {...props}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

/**
 * Score badge - shows numeric score with color based on value
 */
export interface ScoreBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  score: number
  maxScore?: number
  showPercent?: boolean
}

export function ScoreBadge({ score, maxScore = 100, showPercent = false, ...props }: ScoreBadgeProps) {
  const percentage = (score / maxScore) * 100
  let variant: ColorVariant = 'neutral'

  if (percentage >= 70) variant = 'success'
  else if (percentage >= 40) variant = 'warning'
  else variant = 'error'

  return (
    <Badge variant={variant} intensity="soft" {...props}>
      {showPercent ? `${Math.round(percentage)}%` : score}
    </Badge>
  )
}

export default Badge
