import React from 'react'
import { cn } from '@/lib/utils'

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'bordered' | 'elevated' | 'flat' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  span?: 1 | 2 | 3 | 4 | 'full'
  rowSpan?: 1 | 2 | 3
  interactive?: boolean
  noHover?: boolean
  children?: React.ReactNode
}

export function BentoCard({
  variant = 'default',
  size = 'auto',
  span,
  rowSpan,
  interactive = false,
  noHover = false,
  className,
  children,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'bento-card',
        {
          // Variants
          'bento-card-gradient': variant === 'gradient',
          'bento-card-bordered': variant === 'bordered',
          'bento-card-elevated': variant === 'elevated',
          'bento-card-flat': variant === 'flat',
          'bento-card-primary': variant === 'primary',
          'bento-card-accent': variant === 'accent',
          'bento-card-success': variant === 'success',
          'bento-card-warning': variant === 'warning',
          'bento-card-danger': variant === 'danger',

          // Sizes
          'bento-card-xs': size === 'xs',
          'bento-card-sm': size === 'sm',
          'bento-card-md': size === 'md',
          'bento-card-lg': size === 'lg',
          'bento-card-xl': size === 'xl',
          'bento-card-auto': size === 'auto',

          // Spans
          'bento-span-2': span === 2,
          'bento-span-3': span === 3,
          'bento-span-4': span === 4,
          'bento-span-full': span === 'full',
          'bento-row-span-2': rowSpan === 2,
          'bento-row-span-3': rowSpan === 3,

          // Interactive
          'bento-card-interactive': interactive,
          'bento-no-hover': noHover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function BentoCardHeader({ className, children, ...props }: BentoCardHeaderProps) {
  return (
    <div className={cn('bento-card-header', className)} {...props}>
      {children}
    </div>
  )
}

export interface BentoCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

export function BentoCardTitle({ className, children, ...props }: BentoCardTitleProps) {
  return (
    <h3 className={cn('bento-card-title', className)} {...props}>
      {children}
    </h3>
  )
}

export interface BentoCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export function BentoCardDescription({ className, children, ...props }: BentoCardDescriptionProps) {
  return (
    <p className={cn('bento-card-description', className)} {...props}>
      {children}
    </p>
  )
}

export interface BentoCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function BentoCardBody({ className, children, ...props }: BentoCardBodyProps) {
  return (
    <div className={cn('bento-card-body', className)} {...props}>
      {children}
    </div>
  )
}

export interface BentoCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function BentoCardFooter({ className, children, ...props }: BentoCardFooterProps) {
  return (
    <div className={cn('bento-card-footer', className)} {...props}>
      {children}
    </div>
  )
}

export interface BentoCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function BentoCardIcon({ size = 'md', className, children, ...props }: BentoCardIconProps) {
  return (
    <div
      className={cn(
        'bento-card-icon',
        {
          'bento-card-icon-sm': size === 'sm',
          'bento-card-icon-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Grid container
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 'auto'
  gap?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function BentoGrid({ columns = 'auto', gap = 'md', className, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        'bento-grid',
        {
          'bento-grid-1': columns === 1,
          'bento-grid-2': columns === 2,
          'bento-grid-3': columns === 3,
          'bento-grid-4': columns === 4,
          'bento-grid-auto': columns === 'auto',
          'bento-gap-sm': gap === 'sm',
          'bento-gap-md': gap === 'md',
          'bento-gap-lg': gap === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
