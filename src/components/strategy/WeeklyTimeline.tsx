'use client'

import { Week } from '@/hooks/useStrategy'

interface WeeklyTimelineProps {
  weeks: Week[]
  selectedWeek: number
  currentWeek: number
  onSelectWeek: (weekNumber: number) => void
}

// Helper to calculate completion percentage from tasks
const calculateCompletion = (week?: Week): number => {
  if (!week || !week.tasks || week.tasks.length === 0) return 0
  const completed = week.tasks.filter(t => t.status === 'COMPLETED').length
  return Math.round((completed / week.tasks.length) * 100)
}

export function WeeklyTimeline({
  weeks,
  selectedWeek,
  currentWeek,
  onSelectWeek
}: WeeklyTimelineProps) {
  const getWeekStatus = (weekNumber: number, week?: Week) => {
    if (!week) return 'empty'
    const completionPct = calculateCompletion(week)
    if (completionPct === 100) return 'completed'
    if (weekNumber === currentWeek) return 'current'
    if (weekNumber < currentWeek) return 'past'
    return 'upcoming'
  }

  const statusStyles = {
    completed: 'bg-success-500 text-white border-success-500',
    current: 'bg-accent-500 text-white border-accent-500 ring-4 ring-accent-200',
    past: 'bg-slate-400 text-white border-slate-400',
    upcoming: 'bg-white text-slate-600 border-slate-300 hover:border-accent-400',
    empty: 'bg-slate-100 text-slate-400 border-slate-200',
    selected: 'ring-2 ring-primary-500'
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Weekly Timeline</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500" />
            <span className="text-slate-600">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="text-slate-600">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Timeline Scroll Container */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {Array.from({ length: 13 }, (_, i) => i + 1).map((weekNum) => {
            const week = weeks.find(w => w.week_number === weekNum)
            const status = getWeekStatus(weekNum, week)
            const isSelected = weekNum === selectedWeek

            const completionPct = calculateCompletion(week)

            return (
              <button
                key={weekNum}
                onClick={() => onSelectWeek(weekNum)}
                className={`
                  relative flex flex-col items-center justify-center
                  w-16 h-16 rounded-xl border-2 transition-all
                  ${statusStyles[status]}
                  ${isSelected ? statusStyles.selected : ''}
                  ${week ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                `}
                disabled={!week}
              >
                <span className="text-xs font-medium">Week</span>
                <span className="text-lg font-bold">{weekNum}</span>
                {week && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-white rounded px-1 border">
                    {completionPct}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Week Focus Area */}
      {weeks.find(w => w.week_number === selectedWeek) && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-slate-500">Focus Area:</span>
              <span className="ml-2 font-medium text-slate-900">
                {weeks.find(w => w.week_number === selectedWeek)?.focus_area || 'Not set'}
              </span>
            </div>
            {weeks.find(w => w.week_number === selectedWeek)?.budget_allocated && (
              <div>
                <span className="text-sm text-slate-500">Budget:</span>
                <span className="ml-2 font-medium text-slate-900">
                  ₺{weeks.find(w => w.week_number === selectedWeek)?.budget_allocated?.toLocaleString('tr-TR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklyTimeline
