'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Icon, LoadingSpinner } from './Icon'
import type { IconName } from '@/lib/design-system'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: IconName
  iconPosition?: 'left' | 'right'
  leftIcon?: IconName | React.ReactNode
  rightIcon?: IconName | React.ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary: cn(
    'bg-gradient-to-r from-brand-600 to-brand-700 text-white',
    'hover:from-brand-700 hover:to-brand-800',
    'focus:ring-brand-500/50',
    'shadow-sm hover:shadow-md',
    'dark:from-brand-500 dark:to-brand-600 dark:hover:from-brand-600 dark:hover:to-brand-700'
  ),
  secondary: cn(
    'bg-surface-100 text-surface-900',
    'hover:bg-surface-200',
    'focus:ring-surface-500/30',
    'dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700'
  ),
  outline: cn(
    'border-2 border-brand-600 text-brand-600 bg-transparent',
    'hover:bg-brand-50',
    'focus:ring-brand-500/30',
    'dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950'
  ),
  ghost: cn(
    'text-surface-700 bg-transparent',
    'hover:bg-surface-100',
    'focus:ring-surface-500/30',
    'dark:text-surface-300 dark:hover:bg-surface-800'
  ),
  danger: cn(
    'bg-error-600 text-white',
    'hover:bg-error-700',
    'focus:ring-error-500/50',
    'shadow-sm hover:shadow-md',
    'dark:bg-error-500 dark:hover:bg-error-600'
  ),
  success: cn(
    'bg-success-600 text-white',
    'hover:bg-success-700',
    'focus:ring-success-500/50',
    'shadow-sm hover:shadow-md',
    'dark:bg-success-500 dark:hover:bg-success-600'
  ),
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

const iconSizeMap = {
  sm: 'sm' as const,
  md: 'sm' as const,
  lg: 'md' as const,
}

/**
 * Button component with dark mode support
 *
 * Usage:
 * <Button>Click me</Button>
 * <Button variant="outline" icon="plus">Add</Button>
 * <Button variant="danger" leftIcon="trash">Delete</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'dark:focus:ring-offset-surface-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  )

  const renderIcon = (iconProp: IconName | React.ReactNode | undefined, position: 'left' | 'right') => {
    if (!iconProp) return null

    // If it's a string (IconName), render the Icon component
    if (typeof iconProp === 'string') {
      return <Icon name={iconProp as IconName} size={iconSizeMap[size]} />
    }

    // Otherwise, it's already a React node
    return iconProp
  }

  // Determine which icons to show
  const showLeftIcon = leftIcon || (icon && iconPosition === 'left')
  const showRightIcon = rightIcon || (icon && iconPosition === 'right')

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={iconSizeMap[size]} />
      ) : (
        showLeftIcon && renderIcon(leftIcon || icon, 'left')
      )}
      {children}
      {!loading && showRightIcon && renderIcon(rightIcon || icon, 'right')}
    </button>
  )
}

/**
 * Icon-only button
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'leftIcon' | 'rightIcon'> {
  icon: IconName
  'aria-label': string
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: IconButtonProps) {
  const sizeMap = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(sizeMap[size], 'aspect-square', className)}
      {...props}
    >
      <Icon name={icon} size={iconSizeMap[size]} />
    </Button>
  )
}

/**
 * Button group for related actions
 */
export function ButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg overflow-hidden',
        '[&>button]:rounded-none [&>button]:border-r [&>button]:border-white/20',
        '[&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:last-child]:border-r-0',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Button
