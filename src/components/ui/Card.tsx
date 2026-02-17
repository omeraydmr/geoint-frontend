'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  gradient?: boolean
}

const variantStyles = {
  default: 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800',
  elevated: 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-card dark:shadow-dark-md',
  outlined: 'bg-transparent border-2 border-surface-200 dark:border-surface-700',
  ghost: 'bg-transparent border-transparent',
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

/**
 * Unified Card component with dark mode support
 */
export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  gradient = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:shadow-card-hover dark:hover:shadow-dark-lg hover:border-surface-300 dark:hover:border-surface-600 cursor-pointer',
        gradient && 'relative overflow-hidden',
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      {children}
    </div>
  )
}

/**
 * Card Header subcomponent
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean
}

export function CardHeader({
  border = false,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        border && 'pb-4 mb-4 border-b border-surface-200 dark:border-surface-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Title subcomponent
 */
export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-surface-900 dark:text-surface-100',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * Card Description subcomponent
 */
export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-surface-500 dark:text-surface-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * Card Body/Content subcomponent
 */
export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Footer subcomponent
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean
}

export function CardFooter({
  border = false,
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        border && 'pt-4 mt-4 border-t border-surface-200 dark:border-surface-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Premium stat card that uses the Card base
 */
export interface StatCardProps extends Omit<CardProps, 'children'> {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  change?: string
  subtitle?: string
  iconColor?: 'brand' | 'accent' | 'success' | 'warning' | 'error'
}

const iconColorStyles = {
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400',
  accent: 'bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400',
  success: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-400',
  error: 'bg-error-100 text-error-600 dark:bg-error-900 dark:text-error-400',
}

const trendColorStyles = {
  up: 'text-success-600 dark:text-success-400',
  down: 'text-error-600 dark:text-error-400',
  neutral: 'text-surface-500 dark:text-surface-400',
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  change,
  subtitle,
  iconColor = 'brand',
  className,
  ...props
}: StatCardProps) {
  return (
    <Card hover className={cn('group', className)} {...props}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {icon && (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
            iconColorStyles[iconColor]
          )}
        >
          {icon}
        </div>
      )}

      <div className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
        {title}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {value}
        </div>

        {(trend || change) && (
          <div className="flex items-center gap-1">
            {trend && (
              <svg
                className={cn('w-4 h-4', trendColorStyles[trend])}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {trend === 'up' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                )}
                {trend === 'down' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
                {trend === 'neutral' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
            )}
            {change && (
              <span className={cn('text-xs font-medium', trendColorStyles[trend || 'neutral'])}>
                {change}
              </span>
            )}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          {subtitle}
        </div>
      )}
    </Card>
  )
}
