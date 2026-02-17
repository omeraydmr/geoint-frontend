'use client'

import { useState } from 'react'
import { Week, Task } from '@/hooks/useStrategy'
import { TaskItem } from './TaskItem'
import { Button, Badge } from '@/components/ui'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import {
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

interface WeekViewProps {
  week: Week | undefined
  strategyId: string
  onTaskStatusChange: (taskId: string, status: Task['status']) => void
  onTaskCreate: (weekId: string, task: Partial<Task>) => void
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export function WeekView({
  week,
  strategyId,
  onTaskStatusChange,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete
}: WeekViewProps) {
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'seo',
    priority: 'MEDIUM',
    estimated_hours: null as number | null
  })

  const priorityOptions = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Urgent', value: 'URGENT' }
  ]

  const categoryOptions = [
    { label: 'SEO', value: 'seo' },
    { label: 'Content', value: 'content' },
    { label: 'Ads', value: 'ads' },
    { label: 'Social', value: 'social' },
    { label: 'Technical', value: 'technical' }
  ]

  const handleCreateTask = () => {
    if (!week || !newTask.title.trim()) return

    onTaskCreate(week.id, {
      title: newTask.title,
      description: newTask.description || undefined,
      category: newTask.category,
      priority: newTask.priority as Task['priority'],
      estimated_hours: newTask.estimated_hours || undefined
    })

    setNewTask({
      title: '',
      description: '',
      category: 'seo',
      priority: 'MEDIUM',
      estimated_hours: null
    })
    setShowAddTask(false)
  }

  if (!week) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Week Selected</h3>
        <p className="text-slate-600">
          Select a week from the timeline above to view tasks and details.
        </p>
      </div>
    )
  }

  const completedTasks = week.tasks.filter(t => t.status === 'COMPLETED').length
  const totalTasks = week.tasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Week Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900">Week {week.week_number}</h3>
              <Badge variant={completionPercentage === 100 ? 'success' : 'primary'}>
                {completionPercentage}% Complete
              </Badge>
            </div>
            {week.focus_area && (
              <p className="text-lg text-accent-600 font-medium">{week.focus_area}</p>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setShowAddTask(true)}
          >
            Add Task
          </Button>
        </div>

        {/* Week Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              {new Date(week.week_start_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} -{' '}
              {new Date(week.week_end_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ListBulletIcon className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              {completedTasks}/{totalTasks} tasks completed
            </span>
          </div>
          {week.budget_allocated && (
            <div className="flex items-center gap-2 text-sm">
              <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">
                ₺{week.budget_allocated.toLocaleString('tr-TR')} allocated
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <ChartBarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              {week.tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0)}h estimated
            </span>
          </div>
        </div>

        {/* Objectives */}
        {week.objectives && Array.isArray(week.objectives) && week.objectives.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Objectives</h4>
            <ul className="space-y-1">
              {(week.objectives as string[]).map((obj, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-accent-500">•</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="p-6">
        {week.tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ListBulletIcon className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-4">No tasks for this week yet.</p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setShowAddTask(true)}
            >
              Add First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Group by status */}
            {['IN_PROGRESS', 'TODO', 'BLOCKED', 'COMPLETED'].map(status => {
              const tasks = week.tasks.filter(t => t.status === status)
              if (tasks.length === 0) return null

              return (
                <div key={status}>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    {status.replace('_', ' ')} ({tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStatusChange={onTaskStatusChange}
                        onEdit={onTaskEdit}
                        onDelete={onTaskDelete}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog
        visible={showAddTask}
        style={{ width: '500px' }}
        header="Add New Task"
        modal
        onHide={() => setShowAddTask(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Title <span className="text-danger-500">*</span>
            </label>
            <InputText
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <InputTextarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full"
              rows={3}
              placeholder="Optional task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <Dropdown
                value={newTask.category}
                options={categoryOptions}
                onChange={(e) => setNewTask({ ...newTask, category: e.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <Dropdown
                value={newTask.priority}
                options={priorityOptions}
                onChange={(e) => setNewTask({ ...newTask, priority: e.value })}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Hours
            </label>
            <InputNumber
              value={newTask.estimated_hours}
              onValueChange={(e) => setNewTask({ ...newTask, estimated_hours: e.value ?? null })}
              className="w-full"
              min={0}
              max={100}
              placeholder="e.g. 4"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTask}
              disabled={!newTask.title.trim()}
            >
              Create Task
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default WeekView
