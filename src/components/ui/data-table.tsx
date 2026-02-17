'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from './Icon'
import { SearchInput } from './Input'
import { Button } from './button'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor?: (row: T, index: number) => string | number
  sortable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  pageSize?: number
  emptyMessage?: string
  loading?: boolean
  className?: string
  onRowClick?: (row: T, index: number) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  sortable = true,
  searchable = true,
  searchPlaceholder = 'Ara...',
  pagination = true,
  pageSize = 10,
  emptyMessage = 'Veri bulunamadi',
  loading = false,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        if (current.direction === 'asc') {
          return { key: columnKey, direction: 'desc' }
        }
        return null
      }
      return { key: columnKey, direction: 'asc' }
    })
  }

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Search
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key]
          if (value == null) return false
          return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
      )
    }

    // Sort
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue == null) return 1
        if (bValue == null) return -1

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [data, searchQuery, sortConfig, columns])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = pagination
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="sort" size="sm" className="text-surface-400 dark:text-surface-500" />
    }

    if (sortConfig.direction === 'asc') {
      return <Icon name="chevron-up" size="sm" className="text-brand-600 dark:text-brand-400" />
    }

    return <Icon name="chevron-down" size="sm" className="text-brand-600 dark:text-brand-400" />
  }

  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-100 dark:bg-surface-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            onClear={() => {
              setSearchQuery('')
              setCurrentPage(1)
            }}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-800">
          <thead className="bg-surface-50 dark:bg-surface-800/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    'px-6 py-3 text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider',
                    {
                      'text-left': column.align === 'left' || !column.align,
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                      'cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors':
                        sortable && column.sortable !== false,
                    }
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-surface-500 dark:text-surface-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="search" size="lg" className="text-surface-300 dark:text-surface-600" />
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(row, index) : index}
                  onClick={() => onRowClick?.(row, index)}
                  className={cn(
                    'hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4 text-sm text-surface-900 dark:text-surface-100',
                        {
                          'text-left': column.align === 'left' || !column.align,
                          'text-center': column.align === 'center',
                          'text-right': column.align === 'right',
                        }
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-surface-600 dark:text-surface-400">
            {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, processedData.length)} /{' '}
            {processedData.length} sonuc
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Onceki
            </Button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span
                      key={page}
                      className="px-2 py-1 text-surface-400 dark:text-surface-500"
                    >
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
