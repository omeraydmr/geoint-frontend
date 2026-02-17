'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Toast } from 'primereact/toast'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { TabView, TabPanel } from 'primereact/tabview'
import {
  useStrategy,
  useStrategyProgress,
  useAIRefinement,
  useTaskMutations,
  useStrategyMutations,
  Task,
  Strategy
} from '@/hooks/useStrategy'
import {
  StrategyHeader,
  PerformanceDashboard,
  WeeklyTimeline,
  WeekView,
  AIRefinementPanel,
  GenerateAIDialog
} from '@/components/strategy'
import {
  ChartBarIcon,
  CalendarDaysIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function StrategyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const strategyId = params.id as string
  const toast = useRef<any>(null)

  const [selectedWeek, setSelectedWeek] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Data hooks
  const { strategy, isLoading: strategyLoading, mutate: mutateStrategy } = useStrategy(strategyId)
  const { progress, isLoading: progressLoading, mutate: mutateProgress } = useStrategyProgress(strategyId)
  const { refine } = useAIRefinement()
  const { updateTask, createTask, deleteTask } = useTaskMutations()
  const { update: updateStrategy, remove: removeStrategy, generateAI } = useStrategyMutations()

  // Set current week on load
  useEffect(() => {
    if (progress) {
      setSelectedWeek(progress.current_week)
    }
  }, [progress])

  // Handle task status change
  const handleTaskStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await updateTask(taskId, { status })
      mutateStrategy()
      mutateProgress()
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated',
        life: 2000
      })
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to update task',
        life: 3000
      })
    }
  }

  // Handle task creation
  const handleTaskCreate = async (weekId: string, taskData: Partial<Task>) => {
    try {
      await createTask(strategyId, weekId, taskData)
      mutateStrategy()
      mutateProgress()
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Task created',
        life: 2000
      })
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to create task',
        life: 3000
      })
    }
  }

  // Handle task edit
  const handleTaskEdit = (task: Task) => {
    // For now, just show a toast - could open an edit dialog
    toast.current?.show({
      severity: 'info',
      summary: 'Edit Task',
      detail: `Editing: ${task.title}`,
      life: 2000
    })
  }

  // Handle task deletion
  const handleTaskDelete = async (taskId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this task?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await deleteTask(taskId)
          mutateStrategy()
          mutateProgress()
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Task deleted',
            life: 2000
          })
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete task',
            life: 3000
          })
        }
      }
    })
  }

  // Handle AI generation
  const handleGenerateAI = async (options: { industry?: string; target_audience?: string; regenerate?: boolean }) => {
    setIsGenerating(true)
    try {
      await generateAI(strategyId, options)
      mutateStrategy()
      mutateProgress()
      setShowGenerateDialog(false)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'AI content generated successfully!',
        life: 5000
      })
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to generate AI content',
        life: 3000
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle AI refinement
  const handleRefine = async (action: string, context?: string, specificWeek?: number) => {
    return await refine(strategyId, action as any, context, specificWeek)
  }

  // Handle strategy edit
  const handleEdit = () => {
    router.push(`/strategies?edit=${strategyId}`)
  }

  // Handle strategy delete
  const handleDelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete "${strategy?.name}"? This will also delete all weeks and tasks.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await removeStrategy(strategyId)
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Strategy deleted',
            life: 2000
          })
          router.push('/strategies')
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete strategy',
            life: 3000
          })
        }
      }
    })
  }

  // Handle status change
  const handleStatusChange = async (status: Strategy['status']) => {
    try {
      await updateStrategy(strategyId, { status })
      mutateStrategy()
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Strategy status changed to ${status}`,
        life: 2000
      })
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to update status',
        life: 3000
      })
    }
  }

  // Loading state
  if (strategyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading strategy...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Not found state
  if (!strategy) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Strategy Not Found</h2>
            <p className="text-slate-600 mb-4">The strategy you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/strategies')}
              className="text-accent-600 hover:underline"
            >
              Back to Strategies
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const currentWeekData = strategy.weeks?.find(w => w.week_number === selectedWeek)

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="space-y-6">
        {/* Header */}
        <StrategyHeader
          strategy={strategy}
          onGenerateAI={() => setShowGenerateDialog(true)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={() => router.push('/strategies')}
          onStatusChange={handleStatusChange}
          isGenerating={isGenerating}
        />

        {/* Main Content Tabs */}
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
          className="strategy-tabs"
        >
          {/* Performance Dashboard Tab */}
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            }
          >
            {progressLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
              </div>
            ) : progress ? (
              <PerformanceDashboard progress={progress} />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No progress data available. Generate AI content first.</p>
              </div>
            )}
          </TabPanel>

          {/* Weekly Tasks Tab */}
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Weekly Tasks</span>
              </div>
            }
          >
            {strategy.weeks && strategy.weeks.length > 0 ? (
              <div className="space-y-6">
                <WeeklyTimeline
                  weeks={strategy.weeks}
                  selectedWeek={selectedWeek}
                  currentWeek={progress?.current_week || 1}
                  onSelectWeek={setSelectedWeek}
                />

                <WeekView
                  week={currentWeekData}
                  strategyId={strategyId}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskCreate={handleTaskCreate}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDaysIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Weekly Plan Yet</h3>
                <p className="text-slate-600 mb-4">
                  Generate AI content to create a 13-week strategic plan with tasks.
                </p>
                <button
                  onClick={() => setShowGenerateDialog(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-600 to-primary-600 text-white rounded-lg hover:from-accent-700 hover:to-primary-700 transition-all"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Generate AI Content
                </button>
              </div>
            )}
          </TabPanel>

          {/* AI Assistant Tab */}
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
            }
          >
            <AIRefinementPanel
              strategyId={strategyId}
              onRefine={handleRefine}
              selectedWeek={selectedWeek}
            />
          </TabPanel>
        </TabView>
      </div>

      {/* Generate AI Dialog */}
      <GenerateAIDialog
        visible={showGenerateDialog}
        onHide={() => setShowGenerateDialog(false)}
        onGenerate={handleGenerateAI}
        strategyName={strategy.name}
        hasExistingContent={!!strategy.generated_by_model}
        isLoading={isGenerating}
      />
    </DashboardLayout>
  )
}
