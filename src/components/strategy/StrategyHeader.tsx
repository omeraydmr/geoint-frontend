'use client'

import { Strategy } from '@/hooks/useStrategy'
import { Button, Badge } from '@/components/ui'
import {
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

interface StrategyHeaderProps {
  strategy: Strategy
  onGenerateAI: () => void
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
  onStatusChange?: (status: Strategy['status']) => void
  isGenerating?: boolean
}

export function StrategyHeader({
  strategy,
  onGenerateAI,
  onEdit,
  onDelete,
  onBack,
  onStatusChange,
  isGenerating = false
}: StrategyHeaderProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'success' | 'warning' | 'info' | 'danger' | 'primary'; label: string }> = {
      DRAFT: { variant: 'warning', label: 'Draft' },
      ACTIVE: { variant: 'success', label: 'Active' },
      PAUSED: { variant: 'info', label: 'Paused' },
      COMPLETED: { variant: 'primary', label: 'Completed' },
      ARCHIVED: { variant: 'danger', label: 'Archived' }
    }
    const { variant, label } = statusMap[status] || { variant: 'warning', label: status }
    return <Badge variant={variant} dot>{label}</Badge>
  }

  const isAIGenerated = !!strategy.generated_by_model

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{strategy.name}</h1>
              {getStatusBadge(strategy.status)}
              {isAIGenerated && (
                <Badge variant="primary" size="sm">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
            <p className="text-slate-600 line-clamp-2 max-w-2xl">{strategy.primary_goal}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isAIGenerated && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<SparklesIcon className="w-4 h-4" />}
              onClick={onGenerateAI}
              loading={isGenerating}
              className="bg-gradient-to-r from-accent-600 to-primary-600"
            >
              Generate AI Content
            </Button>
          )}
          {strategy.status === 'DRAFT' && isAIGenerated && onStatusChange && (
            <Button
              variant="success"
              size="sm"
              leftIcon={<PlayIcon className="w-4 h-4" />}
              onClick={() => onStatusChange('ACTIVE')}
            >
              Activate
            </Button>
          )}
          {strategy.status === 'ACTIVE' && onStatusChange && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<PauseIcon className="w-4 h-4" />}
              onClick={() => onStatusChange('PAUSED')}
            >
              Pause
            </Button>
          )}
          {strategy.status === 'PAUSED' && onStatusChange && (
            <Button
              variant="success"
              size="sm"
              leftIcon={<PlayIcon className="w-4 h-4" />}
              onClick={() => onStatusChange('ACTIVE')}
            >
              Resume
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<PencilIcon className="w-4 h-4" />}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger-600 hover:bg-danger-50"
            leftIcon={<TrashIcon className="w-4 h-4" />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-6 text-sm text-slate-600">
        <div>
          <span className="font-medium">Timeline:</span>{' '}
          {new Date(strategy.start_date).toLocaleDateString('tr-TR')} -{' '}
          {new Date(strategy.end_date).toLocaleDateString('tr-TR')}
        </div>
        {strategy.total_budget && (
          <div>
            <span className="font-medium">Budget:</span>{' '}
            ₺{strategy.total_budget.toLocaleString('tr-TR')}
          </div>
        )}
        {strategy.target_keywords && strategy.target_keywords.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="font-medium">Keywords:</span>
            <div className="flex gap-1">
              {strategy.target_keywords.slice(0, 3).map((kw, i) => (
                <Badge key={i} variant="default" size="sm">{kw}</Badge>
              ))}
              {strategy.target_keywords.length > 3 && (
                <Badge variant="default" size="sm">+{strategy.target_keywords.length - 3}</Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StrategyHeader
