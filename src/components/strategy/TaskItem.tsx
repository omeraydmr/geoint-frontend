'use client'

import { useState } from 'react'
import { Task } from '@/hooks/useStrategy'
import { Badge, Button } from '@/components/ui'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

interface TaskItemProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskItem({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
    await onStatusChange(task.id, newStatus)
    setIsUpdating(false)
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, { variant: 'danger' | 'warning' | 'info' | 'default'; label: string }> = {
      URGENT: { variant: 'danger', label: 'Urgent' },
      HIGH: { variant: 'warning', label: 'High' },
      MEDIUM: { variant: 'info', label: 'Medium' },
      LOW: { variant: 'default', label: 'Low' }
    }
    const { variant, label } = styles[priority] || { variant: 'default', label: priority }
    return <Badge variant={variant} size="sm">{label}</Badge>
  }

  const getCategoryBadge = (category?: string) => {
    if (!category) return null
    const colors: Record<string, string> = {
      content: 'bg-blue-100 text-blue-700',
      seo: 'bg-green-100 text-green-700',
      ads: 'bg-purple-100 text-purple-700',
      social: 'bg-pink-100 text-pink-700',
      technical: 'bg-orange-100 text-orange-700'
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[category.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
        {category}
      </span>
    )
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case 'COMPLETED':
        return <CheckCircleSolidIcon className="w-6 h-6 text-success-500" />
      case 'IN_PROGRESS':
        return <ClockIcon className="w-6 h-6 text-accent-500 animate-pulse" />
      case 'BLOCKED':
        return <ExclamationCircleIcon className="w-6 h-6 text-danger-500" />
      default:
        return <CheckCircleIcon className="w-6 h-6 text-slate-300" />
    }
  }

  const isCompleted = task.status === 'COMPLETED'

  return (
    <div
      className={`
        group flex items-start gap-4 p-4 rounded-lg border transition-all
        ${isCompleted
          ? 'bg-success-50/50 border-success-200'
          : task.status === 'BLOCKED'
          ? 'bg-danger-50/50 border-danger-200'
          : 'bg-white border-slate-200 hover:border-accent-300'
        }
      `}
    >
      {/* Status Toggle */}
      <button
        onClick={handleToggle}
        disabled={isUpdating || task.status === 'BLOCKED'}
        className={`
          flex-shrink-0 mt-0.5 transition-transform hover:scale-110
          ${isUpdating ? 'opacity-50' : ''}
          ${task.status === 'BLOCKED' ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isUpdating ? (
          <div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          getStatusIcon()
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getPriorityBadge(task.priority)}
            {getCategoryBadge(task.category)}
          </div>
        </div>

        {task.description && (
          <p className={`text-sm mb-2 ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500">
          {task.estimated_hours && (
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {task.actual_hours ? `${task.actual_hours}h / ` : ''}{task.estimated_hours}h
            </span>
          )}
          {task.assigned_to && (
            <span>Assigned to: {task.assigned_to}</span>
          )}
          {task.due_date && (
            <span>Due: {new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
          )}
          {task.completed_at && (
            <span className="text-success-600">
              Completed: {new Date(task.completed_at).toLocaleDateString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded hover:bg-danger-50 text-slate-500 hover:text-danger-600"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskItem
