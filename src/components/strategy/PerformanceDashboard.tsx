'use client'

import { StrategyProgress } from '@/hooks/useStrategy'
import { StatsCard } from '@/components/ui'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface PerformanceDashboardProps {
  progress: StrategyProgress
}

export function PerformanceDashboard({ progress }: PerformanceDashboardProps) {
  const budgetUtilization = progress.budget_total
    ? Math.round((progress.budget_spent / progress.budget_total) * 100)
    : 0

  // Calculate overall completion from actual task data (not stale DB value)
  const overallCompletion = Math.round(progress.tasks_summary.completion_rate)

  return (
    <div className="space-y-6">
      {/* Progress Ring and KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 mb-4">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallCompletion / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">
                {overallCompletion}%
              </span>
              <span className="text-sm text-slate-500">Complete</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {progress.is_on_track ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-success-500" />
                <span className="text-success-600 font-medium">On Track</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="w-5 h-5 text-warning-500" />
                <span className="text-warning-600 font-medium">Needs Attention</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            title="Current Week"
            value={`Week ${progress.current_week}`}
            variant="primary"
            icon={<CalendarIcon className="w-5 h-5" />}
            subtitle={`of ${progress.total_weeks} weeks`}
          />
          <StatsCard
            title="Days Remaining"
            value={progress.days_remaining.toString()}
            variant={progress.days_remaining < 14 ? 'warning' : 'primary'}
            icon={<ClockIcon className="w-5 h-5" />}
            subtitle={`${progress.days_elapsed} days elapsed`}
          />
          <StatsCard
            title="Tasks Completed"
            value={`${progress.tasks_summary.completed}/${progress.tasks_summary.total}`}
            variant="success"
            icon={<CheckCircleIcon className="w-5 h-5" />}
            subtitle={`${progress.tasks_summary.completion_rate.toFixed(1)}% rate`}
          />
          {progress.budget_total && (
            <>
              <StatsCard
                title="Budget Spent"
                value={`₺${progress.budget_spent.toLocaleString('tr-TR')}`}
                variant="accent"
                icon={<CurrencyDollarIcon className="w-5 h-5" />}
                subtitle={`${budgetUtilization}% utilized`}
              />
              <StatsCard
                title="Budget Remaining"
                value={`₺${(progress.budget_remaining || 0).toLocaleString('tr-TR')}`}
                variant={budgetUtilization > 80 ? 'warning' : 'success'}
                icon={<CurrencyDollarIcon className="w-5 h-5" />}
                subtitle="available"
              />
            </>
          )}
          <StatsCard
            title="In Progress"
            value={progress.tasks_summary.in_progress.toString()}
            variant="primary"
            icon={<ChartBarIcon className="w-5 h-5" />}
            subtitle={`${progress.tasks_summary.blocked} blocked`}
          />
        </div>
      </div>

      {/* KPI Metrics */}
      {progress.kpi_metrics && progress.kpi_metrics.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">KPI Targets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {progress.kpi_metrics.map((kpi, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-lg p-4 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">{kpi.name}</span>
                  {kpi.trend && (
                    <span className={`flex items-center text-sm ${
                      kpi.trend === 'up' ? 'text-success-600' :
                      kpi.trend === 'down' ? 'text-danger-600' : 'text-slate-500'
                    }`}>
                      {kpi.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4" />}
                      {kpi.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4" />}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900">
                    {kpi.current || '-'}
                  </span>
                  <span className="text-sm text-slate-500">
                    Target: {kpi.target || '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Progress Overview</h3>
        <div className="space-y-3">
          {progress.weeks_summary.map((week) => {
            // Calculate completion from task data instead of stale DB value
            const rawCompletion = week.tasks.total > 0
              ? (week.tasks.completed / week.tasks.total) * 100
              : 0
            const weekCompletion = Math.min(100, Math.max(0, Math.round(rawCompletion || 0)))

            // Determine bar color based on completion AND week status
            const getBarColor = () => {
              // Completed weeks always show success gradient
              if (weekCompletion === 100) {
                return 'bg-gradient-to-r from-success-500 to-success-400'
              }
              // Current week with progress
              if (week.week_number === progress.current_week) {
                return 'bg-gradient-to-r from-accent-400 to-accent-600 animate-pulse'
              }
              // Past weeks with partial progress
              if (week.week_number < progress.current_week && weekCompletion > 0) {
                return 'bg-gradient-to-r from-primary-500 to-accent-500'
              }
              // Future weeks with progress (user worked ahead)
              if (weekCompletion > 0) {
                return 'bg-gradient-to-r from-primary-400 to-primary-500'
              }
              // No progress (upcoming weeks)
              return 'bg-slate-300'
            }

            return (
              <div key={week.week_number} className="flex items-center gap-4">
                <div className="w-20 text-sm text-slate-600 font-medium">
                  Week {week.week_number}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getBarColor()}`}
                      style={{
                        width: `${weekCompletion}%`,
                        minWidth: weekCompletion > 0 ? '8px' : '0px',
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-slate-700">
                  {weekCompletion}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
