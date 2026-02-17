'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { iconPaths, iconSizes, type IconName, type IconSize } from '@/lib/design-system'

export interface IconProps {
  name: IconName
  size?: IconSize
  className?: string
  strokeWidth?: number
}

/**
 * Centralized Icon component using the design system icon registry
 *
 * Usage:
 * <Icon name="home" size="md" />
 * <Icon name="search" size="lg" className="text-brand-500" />
 */
export function Icon({
  name,
  size = 'md',
  className,
  strokeWidth = 1.5,
}: IconProps) {
  const path = iconPaths[name]

  if (!path) {
    console.warn(`Icon "${name}" not found in registry`)
    return null
  }

  return (
    <svg
      className={cn(iconSizes[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d={path}
      />
    </svg>
  )
}

/**
 * Animated loading spinner
 */
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: IconSize
  className?: string
}) {
  return (
    <svg
      className={cn(iconSizes[size], 'animate-spin', className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Trend indicator icon with appropriate coloring
 */
export function TrendIcon({
  trend,
  size = 'sm',
  className,
}: {
  trend: 'up' | 'down' | 'neutral'
  size?: IconSize
  className?: string
}) {
  if (trend === 'up') {
    return (
      <Icon
        name="trending-up"
        size={size}
        className={cn('text-success-600 dark:text-success-400', className)}
      />
    )
  }

  if (trend === 'down') {
    return (
      <Icon
        name="trending-down"
        size={size}
        className={cn('text-error-600 dark:text-error-400', className)}
      />
    )
  }

  return (
    <svg
      className={cn(iconSizes[size], 'text-surface-400', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 12h14"
      />
    </svg>
  )
}

export default Icon
