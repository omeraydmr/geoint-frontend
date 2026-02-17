import useSWR from 'swr'
import { strategyAPI } from '@/services/api'

// Types
export interface Task {
  id: string
  week_id: string
  title: string
  description?: string
  category?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  estimated_hours?: number
  actual_hours?: number
  estimated_cost?: number
  assigned_to?: string
  due_date?: string
  completed_at?: string
}

export interface Week {
  id: string
  strategy_id: string
  week_number: number
  week_start_date: string
  week_end_date: string
  focus_area?: string
  objectives?: Record<string, unknown>
  budget_allocated?: number
  completion_percentage: number
  notes?: string
  tasks: Task[]
}

export interface Strategy {
  id: string
  user_id: string
  name: string
  primary_goal: string
  target_keywords: string[]
  target_regions: string[]
  start_date: string
  end_date: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
  total_budget?: number
  budget_spent: number
  executive_summary?: string
  opportunities?: Record<string, unknown>[]
  threats?: Record<string, unknown>[]
  kpi_targets?: Record<string, unknown>
  current_kpis?: Record<string, unknown>
  completion_percentage: number
  generated_by_model?: string
  generation_timestamp?: string
  created_at: string
  updated_at: string
  weeks?: Week[]
}

export interface TaskProgressSummary {
  total: number
  completed: number
  in_progress: number
  todo: number
  blocked: number
  completion_rate: number
}

export interface WeekProgressSummary {
  week_number: number
  focus_area?: string
  completion_percentage: number
  budget_allocated?: number
  budget_spent?: number
  tasks: TaskProgressSummary
}

export interface KPIMetric {
  name: string
  target?: string
  current?: string
  progress_percentage?: number
  trend?: 'up' | 'down' | 'stable'
}

export interface StrategyProgress {
  strategy_id: string
  overall_completion: number
  budget_total?: number
  budget_spent: number
  budget_remaining?: number
  days_elapsed: number
  days_remaining: number
  current_week: number
  total_weeks: number
  weeks_summary: WeekProgressSummary[]
  kpi_metrics: KPIMetric[]
  tasks_summary: TaskProgressSummary
  is_on_track: boolean
  ai_generated: boolean
}

export interface AIRefinementSuggestion {
  type?: string
  area?: string
  title: string
  description: string
  priority?: string
  impact?: string
  effort?: string
  week?: number
  reason?: string
}

export interface AIRefinementResponse {
  action: string
  suggestions: AIRefinementSuggestion[]
  summary: string
  confidence_score: number
  generated_by: string
}

// Hook: Get single strategy with weeks
export function useStrategy(strategyId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Strategy>(
    strategyId ? `/strategies/${strategyId}` : null,
    () => strategyAPI.getById(strategyId!),
    { revalidateOnFocus: false }
  )

  return {
    strategy: data,
    isLoading,
    isError: error,
    mutate
  }
}

// Hook: Get all strategies
export function useStrategies() {
  const { data, error, isLoading, mutate } = useSWR<Strategy[]>(
    '/strategies',
    strategyAPI.getAll,
    { revalidateOnFocus: false }
  )

  return {
    strategies: data || [],
    isLoading,
    isError: error,
    mutate
  }
}

// Hook: Get strategy weeks
export function useStrategyWeeks(strategyId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Week[]>(
    strategyId ? `/strategies/${strategyId}/weeks` : null,
    () => strategyAPI.getWeeks(strategyId!),
    { revalidateOnFocus: false }
  )

  return {
    weeks: data || [],
    isLoading,
    isError: error,
    mutate
  }
}

// Hook: Get strategy progress
export function useStrategyProgress(strategyId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<StrategyProgress>(
    strategyId ? `/strategies/${strategyId}/progress` : null,
    () => strategyAPI.getProgress(strategyId!),
    { revalidateOnFocus: false }
  )

  return {
    progress: data,
    isLoading,
    isError: error,
    mutate
  }
}

// Hook: AI Refinement (not SWR, manual call)
export function useAIRefinement() {
  const refine = async (
    strategyId: string,
    action: 'analyze_progress' | 'suggest_improvements' | 'adjust_timeline',
    context?: string,
    specificWeek?: number
  ): Promise<AIRefinementResponse> => {
    return await strategyAPI.refine(strategyId, {
      action,
      context,
      specific_week: specificWeek
    })
  }

  return { refine }
}

// Hook: Task mutations
export function useTaskMutations() {
  const updateTask = async (taskId: string, data: Partial<Task>) => {
    return await strategyAPI.updateTask(taskId, data)
  }

  const createTask = async (strategyId: string, weekId: string, data: Partial<Task>) => {
    return await strategyAPI.createTask(strategyId, weekId, data)
  }

  const deleteTask = async (taskId: string) => {
    return await strategyAPI.deleteTask(taskId)
  }

  return { updateTask, createTask, deleteTask }
}

// Hook: Strategy mutations
export function useStrategyMutations() {
  const create = async (data: Partial<Strategy>) => {
    return await strategyAPI.create(data)
  }

  const update = async (strategyId: string, data: Partial<Strategy>) => {
    return await strategyAPI.update(strategyId, data)
  }

  const remove = async (strategyId: string) => {
    return await strategyAPI.delete(strategyId)
  }

  const generateAI = async (
    strategyId: string,
    options: { industry?: string; target_audience?: string; regenerate?: boolean } = {}
  ) => {
    return await strategyAPI.generateAI(strategyId, options)
  }

  return { create, update, remove, generateAI }
}
