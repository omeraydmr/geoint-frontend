'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Icon, type IconProps } from './Icon'
import type { IconName } from '@/lib/design-system'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'ghost'
  inputSize?: 'sm' | 'md' | 'lg'
  error?: boolean
  errorMessage?: string
  leftIcon?: IconName
  rightIcon?: IconName
  onRightIconClick?: () => void
  label?: string
  hint?: string
}

const variantStyles = {
  default: 'bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700',
  filled: 'bg-surface-100 dark:bg-surface-800 border border-transparent',
  ghost: 'bg-transparent border border-transparent hover:border-surface-300 dark:hover:border-surface-700',
}

const sizeStyles = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
}

const iconSizeMap = {
  sm: 'sm' as const,
  md: 'sm' as const,
  lg: 'md' as const,
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      inputSize = 'md',
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      onRightIconClick,
      label,
      hint,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const id = props.id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon
                name={leftIcon}
                size={iconSizeMap[inputSize]}
                className="text-surface-400 dark:text-surface-500"
              />
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg transition-all duration-200',
              'text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-400/20',
              'focus:border-brand-500 dark:focus:border-brand-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variantStyles[variant],
              sizeStyles[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error-500 dark:border-error-400 focus:ring-error-500/20 focus:border-error-500',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                onRightIconClick && 'cursor-pointer hover:text-surface-600 dark:hover:text-surface-300'
              )}
              onClick={onRightIconClick}
            >
              <Icon
                name={rightIcon}
                size={iconSizeMap[inputSize]}
                className="text-surface-400 dark:text-surface-500"
              />
            </div>
          )}
        </div>

        {(errorMessage || hint) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-surface-500 dark:text-surface-400'
            )}
          >
            {errorMessage || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * Search input with built-in search icon and clear button
 */
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, ...props }, ref) => {
    const showClear = value && String(value).length > 0

    return (
      <Input
        ref={ref}
        leftIcon="search"
        rightIcon={showClear ? 'x' : undefined}
        onRightIconClick={showClear ? onClear : undefined}
        value={value}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

/**
 * Textarea component with similar styling
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'ghost'
  error?: boolean
  errorMessage?: string
  label?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      error = false,
      errorMessage,
      label,
      hint,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const id = props.id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg px-4 py-3 min-h-[100px] transition-all duration-200',
            'text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-400/20',
            'focus:border-brand-500 dark:focus:border-brand-400',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-y',
            variantStyles[variant],
            error && 'border-error-500 dark:border-error-400 focus:ring-error-500/20 focus:border-error-500',
            className
          )}
          {...props}
        />

        {(errorMessage || hint) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-surface-500 dark:text-surface-400'
            )}
          >
            {errorMessage || hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Input
