'use client'

import { useState } from 'react'
import { AIRefinementResponse, AIRefinementSuggestion } from '@/hooks/useStrategy'
import { Button, Badge } from '@/components/ui'
import {
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface AIRefinementPanelProps {
  strategyId: string
  onRefine: (action: string, context?: string, specificWeek?: number) => Promise<AIRefinementResponse>
  selectedWeek?: number
}

export function AIRefinementPanel({
  strategyId,
  onRefine,
  selectedWeek
}: AIRefinementPanelProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [response, setResponse] = useState<AIRefinementResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (action: string) => {
    setLoading(action)
    setError(null)

    try {
      const result = await onRefine(action, undefined, selectedWeek)
      setResponse(result)
    } catch (err: any) {
      setError(err.message || 'Failed to get AI suggestions')
    } finally {
      setLoading(null)
    }
  }

  const getSuggestionIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />
      case 'warning':
      case 'risk':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning-500" />
      case 'opportunity':
        return <LightBulbIcon className="w-5 h-5 text-accent-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-primary-500" />
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null
    const variants: Record<string, 'danger' | 'warning' | 'info'> = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    }
    return (
      <Badge variant={variants[priority.toLowerCase()] || 'info'} size="sm">
        {priority}
      </Badge>
    )
  }

  const getImpactBadge = (impact?: string, effort?: string) => {
    if (!impact && !effort) return null
    return (
      <div className="flex gap-1">
        {impact && (
          <Badge variant={impact === 'high' ? 'success' : 'default'} size="sm">
            Impact: {impact}
          </Badge>
        )}
        {effort && (
          <Badge variant={effort === 'easy' ? 'success' : effort === 'hard' ? 'danger' : 'warning'} size="sm">
            Effort: {effort}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-accent-50 to-primary-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Strategy Assistant</h3>
            <p className="text-sm text-slate-600">Get AI-powered insights and suggestions</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChartBarIcon className="w-4 h-4" />}
            onClick={() => handleAction('analyze_progress')}
            loading={loading === 'analyze_progress'}
            disabled={!!loading}
          >
            Analyze Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<LightBulbIcon className="w-4 h-4" />}
            onClick={() => handleAction('suggest_improvements')}
            loading={loading === 'suggest_improvements'}
            disabled={!!loading}
          >
            Suggest Improvements
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CalendarDaysIcon className="w-4 h-4" />}
            onClick={() => handleAction('adjust_timeline')}
            loading={loading === 'adjust_timeline'}
            disabled={!!loading}
          >
            Adjust Timeline
          </Button>
          {response && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowPathIcon className="w-4 h-4" />}
              onClick={() => setResponse(null)}
            >
              Clear
            </Button>
          )}
        </div>
        {selectedWeek && (
          <p className="text-xs text-slate-500 mt-2">
            Focusing on Week {selectedWeek}
          </p>
        )}
      </div>

      {/* Response Area */}
      <div className="p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-600">Analyzing your strategy...</p>
          </div>
        )}

        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {response && !loading && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">Summary</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {response.generated_by}
                  </Badge>
                  <Badge variant={response.confidence_score > 0.7 ? 'success' : 'warning'} size="sm">
                    {Math.round(response.confidence_score * 100)}% confidence
                  </Badge>
                </div>
              </div>
              <p className="text-slate-700">{response.summary}</p>
            </div>

            {/* Suggestions */}
            {response.suggestions && response.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Suggestions</h4>
                <div className="space-y-3">
                  {response.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg p-4 hover:border-accent-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-slate-900">{suggestion.title}</h5>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(suggestion.priority)}
                              {suggestion.area && (
                                <Badge variant="default" size="sm">{suggestion.area}</Badge>
                              )}
                              {suggestion.week && (
                                <Badge variant="info" size="sm">Week {suggestion.week}</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                          {getImpactBadge(suggestion.impact, suggestion.effort)}
                          {suggestion.reason && (
                            <p className="text-xs text-slate-500 mt-2 italic">
                              Reason: {suggestion.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !response && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-medium text-slate-900 mb-2">Get AI Insights</h4>
            <p className="text-slate-600 max-w-md mx-auto">
              Click one of the buttons above to get AI-powered analysis, improvement suggestions,
              or timeline adjustments for your strategy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIRefinementPanel
