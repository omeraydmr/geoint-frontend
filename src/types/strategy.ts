export interface Strategy {
  id: string
  name: string
  primary_goal: string
  target_keywords?: string[]
  total_budget?: number
  budget_spent?: number
  status?: 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED'
  completion_percentage?: number
  start_date?: string
  end_date?: string
  created_at?: string
  generated_by_model?: string
}
