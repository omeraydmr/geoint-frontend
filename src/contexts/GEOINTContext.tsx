'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { geointAPI, keywordsAPI } from '@/services/api'

interface Keyword {
  id: string
  keyword: string
  intent?: string
  is_active?: boolean
}

interface Region {
  region_id: string
  region_name: string
  geoint_score: number
  search_index?: number
  trend_direction?: string
  demographic_fit?: number
  competition_gap?: number
  trend_score?: number
}

interface Stats {
  total_regions: number
  high_potential_count: number
  avg_score: number
}

interface HeatmapFeature {
  id: string
  type: string
  geometry: {
    type: string
    coordinates: number[]
  }
  properties: {
    name: string
    [key: string]: any
  }
}

interface HeatmapData {
  type: string
  features: HeatmapFeature[]
}

interface BudgetRecommendation {
  region_name: string
  region_id: string
  geoint_score: number
  allocated_budget: number
  allocation_percentage: number
  recommended_channels?: string[]
  search_index?: number
  trend_score?: number
  demographic_fit?: number
  competition_gap?: number
}

interface RegionCompetitorData {
  region_id: string
  region_name: string
  positions: Record<string, number | null>
  your_position: number | null
  best_competitor_position: number | null
  position_gap: number | null
}

interface CompetitorComparisonSummary {
  total_regions: number
  regions_with_your_data: number
  winning_regions: number
  losing_regions: number
  tied_regions: number
  not_ranking_regions: number
  avg_position: number | null
  avg_competitor_position: number | null
}

interface CompetitorComparison {
  keyword_id: string
  keyword: string
  user_domain: string | null
  competitors: string[]
  regions: RegionCompetitorData[]
  summary: CompetitorComparisonSummary
  loading: boolean
}

interface ComparisonHistoryItem {
  id: string
  user_domain: string | null
  competitor_domains: string[]
  region_type: string
  summary: CompetitorComparisonSummary
  created_at: string
}

interface GEOINTContextType {
  // Keywords
  keywords: Keyword[]
  selectedKeyword: Keyword | null
  setSelectedKeyword: (keyword: Keyword | null) => void
  loadingKeywords: boolean
  recentKeywords: Keyword[]

  // Stats
  stats: Stats | null
  loadingStats: boolean

  // Regions
  topRegions: Region[]
  loadingRegions: boolean

  // Heatmap
  heatmapData: HeatmapData | null
  fetchHeatmapData: (keywordId: string, regionType?: string, provinceId?: string | null) => Promise<void>

  // Budget
  budget: number
  setBudget: (budget: number) => void
  budgetRecommendations: BudgetRecommendation[]

  // Actions
  refreshData: () => Promise<void>
  calculateGEOINT: () => Promise<void>
  calculateBudget: () => Promise<void>

  // Overview
  overview: any

  // Province drill-down
  highlightedProvince: string | null
  setHighlightedProvince: (provinceName: string | null) => void
  zoomToProvince: (provinceName: string) => void
  drillDownToProvince: (provinceName: string) => void
  currentDrillDownProvince: { id: string; name: string } | null
  setCurrentDrillDownProvince: (province: { id: string; name: string } | null) => void

  // Competitor Comparison
  comparisonMode: boolean
  setComparisonMode: (mode: boolean) => void
  selectedCompetitors: string[]
  setSelectedCompetitors: (competitors: string[]) => void
  userDomain: string
  setUserDomain: (domain: string) => void
  competitorComparison: CompetitorComparison | null
  fetchCompetitorComparison: (keywordId: string, competitorDomains: string[], userDomain?: string) => Promise<void>
  comparisonLoading: boolean
  comparisonHistory: ComparisonHistoryItem[]
  fetchComparisonHistory: (keywordId: string) => Promise<void>
  loadComparisonById: (comparisonId: string) => Promise<void>
  comparisonHistoryLoading: boolean
}

const GEOINTContext = createContext<GEOINTContextType | undefined>(undefined)

// Province name to ID mapping for Turkey
const PROVINCE_IDS: Record<string, string> = {
  'adana': '01', 'adiyaman': '02', 'afyonkarahisar': '03', 'agri': '04', 'amasya': '05',
  'ankara': '06', 'antalya': '07', 'artvin': '08', 'aydin': '09', 'balikesir': '10',
  'bilecik': '11', 'bingol': '12', 'bitlis': '13', 'bolu': '14', 'burdur': '15',
  'bursa': '16', 'canakkale': '17', 'cankiri': '18', 'corum': '19', 'denizli': '20',
  'diyarbakir': '21', 'edirne': '22', 'elazig': '23', 'erzincan': '24', 'erzurum': '25',
  'eskisehir': '26', 'gaziantep': '27', 'giresun': '28', 'gumushane': '29', 'hakkari': '30',
  'hatay': '31', 'isparta': '32', 'mersin': '33', 'istanbul': '34', 'izmir': '35',
  'kars': '36', 'kastamonu': '37', 'kayseri': '38', 'kirklareli': '39', 'kirsehir': '40',
  'kocaeli': '41', 'konya': '42', 'kutahya': '43', 'malatya': '44', 'manisa': '45',
  'kahramanmaras': '46', 'mardin': '47', 'mugla': '48', 'mus': '49', 'nevsehir': '50',
  'nigde': '51', 'ordu': '52', 'rize': '53', 'sakarya': '54', 'samsun': '55',
  'siirt': '56', 'sinop': '57', 'sivas': '58', 'tekirdag': '59', 'tokat': '60',
  'trabzon': '61', 'tunceli': '62', 'sanliurfa': '63', 'usak': '64', 'van': '65',
  'yozgat': '66', 'zonguldak': '67', 'aksaray': '68', 'bayburt': '69', 'karaman': '70',
  'kirikkale': '71', 'batman': '72', 'sirnak': '73', 'bartin': '74', 'ardahan': '75',
  'igdir': '76', 'yalova': '77', 'karabuk': '78', 'kilis': '79', 'osmaniye': '80', 'duzce': '81'
}

// Normalize province name for matching
function normalizeProvinceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
}

// Find province ID by name
function findProvinceId(provinceName: string): string | null {
  const normalized = normalizeProvinceName(provinceName)
  return PROVINCE_IDS[normalized] || null
}

export function GEOINTProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const keywordIdFromUrl = searchParams.get('keyword')

  // Keywords
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [selectedKeyword, setSelectedKeywordState] = useState<Keyword | null>(null)
  const [loadingKeywords, setLoadingKeywords] = useState(true)
  const [recentKeywords, setRecentKeywords] = useState<Keyword[]>([])

  // Stats
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Regions
  const [topRegions, setTopRegions] = useState<Region[]>([])
  const [loadingRegions, setLoadingRegions] = useState(false)

  // Heatmap
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null)

  // Budget
  const [budget, setBudget] = useState(50000)
  const [budgetRecommendations, setBudgetRecommendations] = useState<BudgetRecommendation[]>([])

  // Overview
  const [overview, setOverview] = useState<any>(null)

  // Province highlighting and drill-down
  const [highlightedProvince, setHighlightedProvince] = useState<string | null>(null)
  const [currentDrillDownProvince, setCurrentDrillDownProvince] = useState<{ id: string; name: string } | null>(null)

  // Competitor Comparison
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])
  const [userDomain, setUserDomain] = useState('')
  const [competitorComparison, setCompetitorComparison] = useState<CompetitorComparison | null>(null)
  const [comparisonLoading, setComparisonLoading] = useState(false)
  const [comparisonHistory, setComparisonHistory] = useState<ComparisonHistoryItem[]>([])
  const [comparisonHistoryLoading, setComparisonHistoryLoading] = useState(false)

  // Zoom to province (just highlight on Turkey map)
  const zoomToProvince = useCallback((provinceName: string) => {
    console.log('GEOINTContext.zoomToProvince called with:', provinceName)
    setHighlightedProvince(provinceName)

    // Build URL preserving existing params
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('highlight', provinceName)

    const newUrl = `/geoint/map?${currentParams.toString()}`
    console.log('Navigating to:', newUrl)

    router.push(newUrl)
  }, [router])

  // Set selected keyword and update URL
  const setSelectedKeyword = useCallback((keyword: Keyword | null) => {
    setSelectedKeywordState(keyword)
    if (keyword?.id) {
      // Update recent keywords
      setRecentKeywords(prev => {
        const filtered = prev.filter(k => k.id !== keyword.id)
        return [keyword, ...filtered].slice(0, 5)
      })

      // Update URL
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('keyword', keyword.id)
      router.replace(`?${newParams.toString()}`, { scroll: false })
    }
  }, [router, searchParams])

  // Fetch keywords
  const fetchKeywords = useCallback(async () => {
    try {
      setLoadingKeywords(true)
      const data = await keywordsAPI.getAll()
      setKeywords(data)

      // Auto-select first keyword or URL param keyword
      if (data.length > 0 && !selectedKeyword) {
        let keywordToSelect = null

        if (keywordIdFromUrl) {
          const keywordFromUrl = data.find((k: Keyword) => k.id === keywordIdFromUrl)
          keywordToSelect = keywordFromUrl || data[0]
        } else {
          keywordToSelect = data[0]
        }

        setSelectedKeyword(keywordToSelect)
      }
    } catch (error) {
      console.error('Error fetching keywords:', error)
    } finally {
      setLoadingKeywords(false)
    }
  }, [keywordIdFromUrl, selectedKeyword, setSelectedKeyword])

  // Fetch overview
  const fetchOverview = useCallback(async () => {
    try {
      const data = await geointAPI.getOverview()
      setOverview(data)
    } catch (error) {
      console.error('Error fetching overview:', error)
    }
  }, [])

  // Fetch stats
  const fetchStats = useCallback(async (keywordId: string) => {
    try {
      setLoadingStats(true)
      const data = await geointAPI.getStats(keywordId)
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }, [])

  // Fetch top regions (provinces only)
  const fetchTopRegions = useCallback(async (keywordId: string) => {
    try {
      setLoadingRegions(true)
      // Use 'il' to fetch only provinces, not districts
      const data = await geointAPI.getTopRegions(keywordId, 81, 'il')

      if (Array.isArray(data)) {
        setTopRegions(data)
      } else {
        setTopRegions([])
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
      setTopRegions([])
    } finally {
      setLoadingRegions(false)
    }
  }, [])

  // Fetch heatmap data
  const fetchHeatmapData = useCallback(async (
    keywordId: string,
    regionType: string = 'il',
    provinceId: string | null = null,
    force: boolean = false
  ) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/geoint/heatmap/${keywordId}?region_type=${regionType}&include_geometry=true`

      if (provinceId) {
        url += `&province_id=${provinceId}`
      }

      if (force) {
        url += `&force=true`
      }

      const response = await fetch(
        url,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      setHeatmapData(data)
    } catch (error) {
      console.error('Error fetching heatmap data:', error)
      setHeatmapData(null)
    }
  }, [])

  // Drill down to province districts (main function for AI agent)
  const drillDownToProvince = useCallback((provinceName: string) => {
    console.log('GEOINTContext.drillDownToProvince called with:', provinceName)

    // Find province ID
    const provinceId = findProvinceId(provinceName)
    console.log('Found province ID:', provinceId)

    if (!provinceId) {
      console.error('Province not found:', provinceName)
      // Fallback to highlight
      zoomToProvince(provinceName)
      return
    }

    // Capitalize province name properly
    const capitalizedName = provinceName.charAt(0).toUpperCase() + provinceName.slice(1).toLowerCase()

    // Set drill-down province
    setCurrentDrillDownProvince({ id: provinceId, name: capitalizedName })
    setHighlightedProvince(null)

    // Fetch district data for this province
    if (selectedKeyword?.id) {
      console.log('Fetching district data for province:', provinceId)
      fetchHeatmapData(selectedKeyword.id, 'ilce', provinceId)
    }

    // Build URL with province param
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('province', provinceId)
    currentParams.set('provinceName', capitalizedName)
    currentParams.delete('highlight')

    const newUrl = `/geoint/map?${currentParams.toString()}`
    console.log('Navigating to district view:', newUrl)

    router.push(newUrl)
  }, [router, selectedKeyword, fetchHeatmapData, zoomToProvince])

  // Refresh all data
  const refreshData = useCallback(async (force: boolean = false) => {
    if (selectedKeyword?.id) {
      await Promise.all([
        fetchStats(selectedKeyword.id),
        fetchTopRegions(selectedKeyword.id),
        fetchHeatmapData(selectedKeyword.id, 'il', null, force)
      ])
    }
  }, [selectedKeyword, fetchStats, fetchTopRegions, fetchHeatmapData])

  // Calculate GEOINT
  const calculateGEOINT = useCallback(async () => {
    if (!selectedKeyword?.id) return

    try {
      setLoadingStats(true)
      setLoadingRegions(true)

      await geointAPI.triggerCalculation(selectedKeyword.id)

      // Poll for results
      let attempts = 0
      const maxAttempts = 8

      const checkResults = async () => {
        attempts++
        const statsData = await geointAPI.getStats(selectedKeyword.id)

        if (statsData.total_regions > 0 || attempts >= maxAttempts) {
          await refreshData(true) // Force refresh after calculation
          setLoadingStats(false)
          setLoadingRegions(false)
        } else {
          setTimeout(checkResults, 2000)
        }
      }

      setTimeout(checkResults, 3000)
    } catch (error) {
      console.error('Error triggering calculation:', error)
      setLoadingStats(false)
      setLoadingRegions(false)
    }
  }, [selectedKeyword, refreshData])

  // Calculate budget
  const calculateBudget = useCallback(async () => {
    if (!selectedKeyword?.id || !budget) return

    try {
      const data = await geointAPI.getBudgetRecommendation(selectedKeyword.id, budget, 'il', 5)
      setBudgetRecommendations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error calculating budget:', error)
      setBudgetRecommendations([])
    }
  }, [selectedKeyword, budget])

  // Fetch comparison history for a keyword
  const fetchComparisonHistory = useCallback(async (keywordId: string) => {
    try {
      setComparisonHistoryLoading(true)
      const data = await (geointAPI as any).getComparisonHistory(keywordId)
      setComparisonHistory(data.comparisons || [])
    } catch (error) {
      console.error('Error fetching comparison history:', error)
      setComparisonHistory([])
    } finally {
      setComparisonHistoryLoading(false)
    }
  }, [])

  // Load a specific historical comparison by ID
  const loadComparisonById = useCallback(async (comparisonId: string) => {
    try {
      setComparisonLoading(true)
      const data = await (geointAPI as any).getComparisonById(comparisonId)
      setCompetitorComparison({
        ...data,
        loading: false
      })
      setComparisonMode(true)
    } catch (error) {
      console.error('Error loading comparison:', error)
    } finally {
      setComparisonLoading(false)
    }
  }, [])

  // Fetch competitor comparison data
  const fetchCompetitorComparison = useCallback(async (
    keywordId: string,
    competitorDomains: string[],
    domain?: string
  ) => {
    if (!keywordId || competitorDomains.length === 0) return

    try {
      setComparisonLoading(true)
      const userDomainToUse = domain || userDomain || null
      const provinceId = currentDrillDownProvince?.id || null
      const data = await (geointAPI as any).getCompetitorComparison(
        keywordId,
        competitorDomains,
        userDomainToUse,
        currentDrillDownProvince ? 'ilce' : 'il',
        provinceId
      )
      setCompetitorComparison({
        ...data,
        loading: false
      })
      // Refresh history after new comparison is saved
      if (keywordId) {
        fetchComparisonHistory(keywordId)
      }
    } catch (error) {
      console.error('Error fetching competitor comparison:', error)
      setCompetitorComparison(null)
    } finally {
      setComparisonLoading(false)
    }
  }, [userDomain, currentDrillDownProvince, fetchComparisonHistory])

  // Initial load
  useEffect(() => {
    fetchKeywords()
    fetchOverview()
  }, [])

  // Fetch data when keyword changes
  useEffect(() => {
    if (selectedKeyword?.id) {
      fetchStats(selectedKeyword.id)
      fetchTopRegions(selectedKeyword.id)
      fetchHeatmapData(selectedKeyword.id)
    }
  }, [selectedKeyword, fetchStats, fetchTopRegions, fetchHeatmapData])

  // Auto-load comparison history and latest comparison when keyword changes
  useEffect(() => {
    if (selectedKeyword?.id) {
      fetchComparisonHistory(selectedKeyword.id).then(() => {
        // After history is loaded, the panel will show the latest if available
      })
    }
  }, [selectedKeyword, fetchComparisonHistory])

  // Auto-load latest comparison when history is fetched and no current comparison
  useEffect(() => {
    if (comparisonHistory.length > 0 && !competitorComparison && !comparisonLoading) {
      const latest = comparisonHistory[0]
      loadComparisonById(latest.id)
      // Also set the user domain and competitors from the latest comparison
      if (latest.user_domain) {
        setUserDomain(latest.user_domain)
      }
      if (latest.competitor_domains.length > 0) {
        setSelectedCompetitors(latest.competitor_domains)
      }
    }
  }, [comparisonHistory, competitorComparison, comparisonLoading, loadComparisonById])

  // Load recent keywords from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentKeywords')
    if (saved) {
      try {
        setRecentKeywords(JSON.parse(saved))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save recent keywords to localStorage
  useEffect(() => {
    if (recentKeywords.length > 0) {
      localStorage.setItem('recentKeywords', JSON.stringify(recentKeywords))
    }
  }, [recentKeywords])

  const value: GEOINTContextType = {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    loadingKeywords,
    recentKeywords,
    stats,
    loadingStats,
    topRegions,
    loadingRegions,
    heatmapData,
    fetchHeatmapData,
    budget,
    setBudget,
    budgetRecommendations,
    refreshData,
    calculateGEOINT,
    calculateBudget,
    overview,
    highlightedProvince,
    setHighlightedProvince,
    zoomToProvince,
    drillDownToProvince,
    currentDrillDownProvince,
    setCurrentDrillDownProvince,
    // Competitor Comparison
    comparisonMode,
    setComparisonMode,
    selectedCompetitors,
    setSelectedCompetitors,
    userDomain,
    setUserDomain,
    competitorComparison,
    fetchCompetitorComparison,
    comparisonLoading,
    comparisonHistory,
    fetchComparisonHistory,
    loadComparisonById,
    comparisonHistoryLoading,
  }

  return (
    <GEOINTContext.Provider value={value}>
      {children}
    </GEOINTContext.Provider>
  )
}

export function useGEOINT() {
  const context = useContext(GEOINTContext)
  if (context === undefined) {
    throw new Error('useGEOINT must be used within a GEOINTProvider')
  }
  return context
}
