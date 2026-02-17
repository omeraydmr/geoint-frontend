// Competitor Types

export interface Competitor {
  id: string
  user_id: string
  domain: string
  name?: string
  category?: string
  domain_authority?: number
  page_authority?: number
  trust_flow?: number
  citation_flow?: number
  organic_traffic?: number
  organic_keywords?: number
  paid_keywords?: number
  total_backlinks?: number
  referring_domains?: number
  estimated_ad_spend?: number
  estimated_ad_keywords?: number
  content_score?: number
  social_followers?: Record<string, number>
  technologies?: Record<string, any>
  social_media?: Record<string, any>
  notes?: string
  created_at: string
  updated_at: string
  last_analyzed_at?: string
}

export interface CompetitorSnapshot {
  id: string
  competitor_id: string
  domain_authority?: number
  organic_traffic?: number
  organic_keywords?: number
  total_backlinks?: number
  referring_domains?: number
  top_keywords?: KeywordRanking[]
  snapshot_date: string
}

export interface CompetitorWithSnapshots extends Competitor {
  snapshots: CompetitorSnapshot[]
}

export interface KeywordRanking {
  keyword: string
  position: number
  search_volume: number
  url?: string
}

export interface KeywordGap {
  keyword: string
  search_volume: number
  difficulty?: number
  your_position?: number
  competitor_position?: number
  estimated_traffic?: number
  opportunity?: 'high' | 'medium' | 'low'
}

export interface TrendPoint {
  date: string
  domain_authority?: number
  organic_traffic?: number
  organic_keywords?: number
  total_backlinks?: number
  referring_domains?: number
}

export interface TrendData {
  competitor_id: string
  domain: string
  time_range: string
  data_points: TrendPoint[]
  growth_rates: Record<string, number>
}

export interface Backlink {
  id: string
  source_url: string
  source_domain: string
  target_url?: string
  anchor_text?: string
  domain_authority?: number
  page_authority?: number
  link_type: string
  first_seen: string
  last_seen: string
}

export interface BacklinkProfile {
  competitor_id: string
  domain: string
  total_backlinks: number
  referring_domains: number
  dofollow_count: number
  nofollow_count: number
  top_anchor_texts: Array<{ anchor: string; count: number; percentage: number }>
  top_referring_domains: Array<{ domain: string; backlinks: number; da: number }>
  backlinks: Backlink[]
  new_backlinks_30d: number
  lost_backlinks_30d: number
}

export interface ContentGapItem {
  topic: string
  search_volume: number
  difficulty?: number
  competitor_url?: string
  content_type: string
  opportunity_score: number
}

export interface ContentGapResponse {
  competitor_id: string
  domain: string
  total_gaps: number
  content_gaps: ContentGapItem[]
  top_performing_pages: Array<{ url: string; traffic: number; keywords: number }>
}

export interface AdIntelligence {
  competitor_id: string
  domain: string
  estimated_monthly_spend?: number
  estimated_ad_keywords: number
  top_ad_keywords: Array<{ keyword: string; position: number; cpc: number; volume: number }>
  ad_copy_samples: Array<{ headline: string; description: string; url: string }>
  display_ads_detected: number
  search_ads_detected: number
}

export interface TechStack {
  competitor_id: string
  domain: string
  categories: Record<string, string[]>
  cms?: string
  ecommerce?: string
  analytics: string[]
  advertising: string[]
  hosting?: string
  cdn?: string
  frameworks: string[]
  detected_at: string
}

export interface SWOTAnalysis {
  domain: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  generated_at: string
}

export interface MarketOverview {
  total_competitors: number
  industry_benchmarks: Record<string, { avg: number; min: number; max: number; your_value?: number }>
  market_leaders: Array<{ domain: string; metric: string; value: number }>
  your_position: Record<string, number>
  growth_opportunities: string[]
}

export interface CompetitorComparison {
  user_domain?: string
  competitors: Competitor[]
  metrics_comparison: Record<string, Record<string, number>>
  rankings: Record<string, string[]>
  radar_data: Array<Record<string, any>>
}

export interface GapAnalysis {
  competitor_domain: string
  total_gap_keywords: number
  high_value_gaps: KeywordGap[]
  content_gaps: Array<{ topic: string; search_volume: number; competitor_url?: string }>
}
