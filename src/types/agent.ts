/**
 * AI Agent Types
 *
 * Type definitions for the AI assistant agent system
 */

// Tool types matching backend AgentTool enum
export type AgentTool =
  | 'navigate'
  | 'select_keyword'
  | 'calculate_geoint'
  | 'calculate_budget'
  | 'show_province'
  | 'create_keyword'
  | 'analyze_keyword'
  | 'create_strategy'
  | 'view_strategy'
  | 'add_competitor'
  | 'analyze_competitor'
  | 'compare_competitors'
  | 'show_data'
  | 'suggest_actions'

export interface AgentAction {
  tool: AgentTool
  parameters: Record<string, any>
}

export interface AgentContext {
  current_page: string
  selected_keyword_id?: string | null
  selected_keyword_name?: string | null
  keywords_list?: Array<{ id: string; keyword: string }>
  selected_competitor_id?: string | null
  selected_strategy_id?: string | null
}

export interface AgentChatRequest {
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  context: AgentContext
}

export interface AgentChatResponse {
  response: string
  actions: AgentAction[]
  suggestions: string[]
}

export interface ActionResult {
  success: boolean
  message?: string
  data?: any
}

export interface QuickAction {
  id: string
  label: string
  prompt: string
  icon?: string
}

// Page types for navigation
export type NavigablePage =
  | '/dashboard'
  | '/geoint/map'
  | '/geoint/overview'
  | '/geoint/regions'
  | '/geoint/budget'
  | '/keywords'
  | '/strategies'
  | '/competitors'
  | '/competitors/compare'
  | '/settings'
