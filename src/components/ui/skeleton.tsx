import React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'shimmer' | 'none'
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  className,
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-slate-200 rounded-md'

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: '',
  }

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton',
    none: '',
  }

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], animations[animation], className)}
      style={style}
      {...props}
    />
  )
}

// Skeleton presets for common use cases
export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 space-y-4 bg-white rounded-xl border border-slate-200', className)} {...props}>
      <Skeleton variant="rectangular" height={24} width="60%" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height={32} width={80} />
        <Skeleton variant="rectangular" height={32} width={80} />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, className, ...props }: { rows?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <Skeleton variant="rectangular" height={40} />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={60} />
      ))}
    </div>
  )
}
