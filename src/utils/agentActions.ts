/**
 * Agent Actions Handler
 *
 * Maps backend agent actions to frontend functions.
 * Executes actions returned by the AI agent.
 */
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

// Action types matching backend AgentTool enum
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

export interface ActionResult {
  success: boolean
  message?: string
  data?: any
}

export interface GEOINTContextActions {
  setSelectedKeyword: (keyword: any) => void
  calculateGEOINT: () => Promise<void>
  calculateBudget: () => Promise<void>
  setBudget: (amount: number) => void
  keywords: any[]
  zoomToProvince?: (provinceName: string) => void
  drillDownToProvince?: (provinceName: string) => void
}

export interface ActionHandlerDeps {
  router: AppRouterInstance
  geointContext?: GEOINTContextActions
  onShowData?: (dataType: string, data: any) => void
  onHighlightProvince?: (provinceName: string) => void
}

/**
 * Execute a single agent action
 */
export async function executeAction(
  action: AgentAction,
  deps: ActionHandlerDeps
): Promise<ActionResult> {
  const { router, geointContext, onShowData, onHighlightProvince } = deps

  try {
    switch (action.tool) {
      case 'navigate':
        return handleNavigate(action.parameters, router)

      case 'select_keyword':
        return handleSelectKeyword(action.parameters, geointContext)

      case 'calculate_geoint':
        return await handleCalculateGEOINT(geointContext)

      case 'calculate_budget':
        return await handleCalculateBudget(action.parameters, geointContext)

      case 'show_province':
        return handleShowProvince(action.parameters, router, geointContext, onHighlightProvince)

      case 'create_keyword':
        return handleCreateKeyword(action.parameters, router)

      case 'analyze_keyword':
        return handleAnalyzeKeyword(action.parameters)

      case 'create_strategy':
        return handleCreateStrategy(router)

      case 'view_strategy':
        return handleViewStrategy(action.parameters, router)

      case 'add_competitor':
        return handleAddCompetitor(action.parameters, router)

      case 'analyze_competitor':
        return handleAnalyzeCompetitor(action.parameters)

      case 'compare_competitors':
        return handleCompareCompetitors(router)

      case 'show_data':
        return handleShowData(action.parameters, onShowData)

      case 'suggest_actions':
        // Suggestions are handled by the UI
        return { success: true }

      default:
        return { success: false, message: `Unknown action: ${action.tool}` }
    }
  } catch (error) {
    console.error(`Error executing action ${action.tool}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Execute multiple actions sequentially
 */
export async function executeActions(
  actions: AgentAction[],
  deps: ActionHandlerDeps
): Promise<ActionResult[]> {
  const results: ActionResult[] = []

  for (const action of actions) {
    const result = await executeAction(action, deps)
    results.push(result)

    // If action failed, we might want to stop
    if (!result.success) {
      console.warn(`Action ${action.tool} failed:`, result.message)
    }
  }

  return results
}

// Individual action handlers

function handleNavigate(
  params: Record<string, any>,
  router: AppRouterInstance
): ActionResult {
  const { page } = params
  if (!page) {
    return { success: false, message: 'No page specified' }
  }

  router.push(page)
  return { success: true, message: `Navigated to ${page}` }
}

function handleSelectKeyword(
  params: Record<string, any>,
  geointContext?: GEOINTContextActions
): ActionResult {
  if (!geointContext) {
    return { success: false, message: 'GEOINT context not available' }
  }

  const { keyword_id, keyword_name } = params

  // Find keyword by ID or name
  let keyword = null
  if (keyword_id) {
    keyword = geointContext.keywords.find((k: any) => k.id === keyword_id)
  } else if (keyword_name) {
    keyword = geointContext.keywords.find(
      (k: any) =>
        k.keyword?.toLowerCase() === keyword_name.toLowerCase() ||
        k.name?.toLowerCase() === keyword_name.toLowerCase()
    )
  }

  if (keyword) {
    geointContext.setSelectedKeyword(keyword)
    return { success: true, message: `Selected keyword: ${keyword.keyword || keyword.name}` }
  }

  return { success: false, message: 'Keyword not found' }
}

async function handleCalculateGEOINT(
  geointContext?: GEOINTContextActions
): Promise<ActionResult> {
  if (!geointContext) {
    return { success: false, message: 'GEOINT context not available' }
  }

  await geointContext.calculateGEOINT()
  return { success: true, message: 'GEOINT calculation started' }
}

async function handleCalculateBudget(
  params: Record<string, any>,
  geointContext?: GEOINTContextActions
): Promise<ActionResult> {
  if (!geointContext) {
    return { success: false, message: 'GEOINT context not available' }
  }

  const { amount } = params
  if (amount) {
    geointContext.setBudget(amount)
  }

  await geointContext.calculateBudget()
  return { success: true, message: 'Budget calculation completed' }
}

function handleShowProvince(
  params: Record<string, any>,
  router: AppRouterInstance,
  geointContext?: GEOINTContextActions,
  onHighlightProvince?: (name: string) => void
): ActionResult {
  const { province_name } = params
  console.log('handleShowProvince called with:', province_name)
  console.log('geointContext available:', !!geointContext)
  console.log('drillDownToProvince available:', !!geointContext?.drillDownToProvince)

  if (!province_name) {
    return { success: false, message: 'No province specified' }
  }

  // Use drillDownToProvince to show district view (preferred)
  if (geointContext?.drillDownToProvince) {
    console.log('Calling drillDownToProvince with:', province_name)
    geointContext.drillDownToProvince(province_name)
  } else if (geointContext?.zoomToProvince) {
    // Fallback to zoom/highlight
    console.log('Fallback: calling zoomToProvince with:', province_name)
    geointContext.zoomToProvince(province_name)
  } else {
    // Last resort: Navigate to map with province parameter
    console.log('Fallback: navigating to map with province param')
    // Try to find province ID
    const provinceId = findProvinceIdByName(province_name)
    if (provinceId) {
      router.push(`/geoint/map?province=${provinceId}&provinceName=${encodeURIComponent(province_name)}`)
    } else {
      router.push(`/geoint/map?highlight=${encodeURIComponent(province_name)}`)
    }
  }

  if (onHighlightProvince) {
    onHighlightProvince(province_name)
  }

  return { success: true, message: `${province_name} ilceler gosteriliyor` }
}

// Province name to ID mapping for fallback
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

function findProvinceIdByName(name: string): string | null {
  const normalized = name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
  return PROVINCE_IDS[normalized] || null
}

function handleCreateKeyword(
  params: Record<string, any>,
  router: AppRouterInstance
): ActionResult {
  const { keyword } = params
  if (keyword) {
    router.push(`/keywords?new=${encodeURIComponent(keyword)}`)
  } else {
    router.push('/keywords?action=create')
  }
  return { success: true, message: 'Navigated to keywords page' }
}

function handleAnalyzeKeyword(params: Record<string, any>): ActionResult {
  // This would trigger NLP analysis - for now just return success
  return { success: true, message: 'Keyword analysis started' }
}

function handleCreateStrategy(router: AppRouterInstance): ActionResult {
  router.push('/strategies?action=create')
  return { success: true, message: 'Navigated to strategy creation' }
}

function handleViewStrategy(
  params: Record<string, any>,
  router: AppRouterInstance
): ActionResult {
  const { strategy_id } = params
  if (!strategy_id) {
    return { success: false, message: 'No strategy ID specified' }
  }

  router.push(`/strategies/${strategy_id}`)
  return { success: true, message: 'Navigated to strategy' }
}

function handleAddCompetitor(
  params: Record<string, any>,
  router: AppRouterInstance
): ActionResult {
  const { domain } = params
  if (domain) {
    router.push(`/competitors?new=${encodeURIComponent(domain)}`)
  } else {
    router.push('/competitors?action=add')
  }
  return { success: true, message: 'Navigated to competitors page' }
}

function handleAnalyzeCompetitor(params: Record<string, any>): ActionResult {
  // This would trigger competitor analysis - for now just return success
  return { success: true, message: 'Competitor analysis started' }
}

function handleCompareCompetitors(router: AppRouterInstance): ActionResult {
  router.push('/competitors/compare')
  return { success: true, message: 'Navigated to competitor comparison' }
}

function handleShowData(
  params: Record<string, any>,
  onShowData?: (dataType: string, data: any) => void
): ActionResult {
  const { data_type, data } = params

  if (onShowData && data_type) {
    onShowData(data_type, data)
    return { success: true }
  }

  return { success: false, message: 'Cannot show data' }
}

/**
 * Get action icon for display
 */
export function getActionIcon(tool: AgentTool): string {
  const icons: Record<AgentTool, string> = {
    navigate: '🔗',
    select_keyword: '🔍',
    calculate_geoint: '📊',
    calculate_budget: '💰',
    show_province: '🗺️',
    create_keyword: '➕',
    analyze_keyword: '🔬',
    create_strategy: '📋',
    view_strategy: '👁️',
    add_competitor: '👥',
    analyze_competitor: '🔍',
    compare_competitors: '⚖️',
    show_data: '📈',
    suggest_actions: '💡'
  }
  return icons[tool] || '▶️'
}

/**
 * Get human-readable action label
 */
export function getActionLabel(tool: AgentTool): string {
  const labels: Record<AgentTool, string> = {
    navigate: 'Sayfa Yonlendirme',
    select_keyword: 'Kelime Secimi',
    calculate_geoint: 'GEOINT Hesaplama',
    calculate_budget: 'Butce Hesaplama',
    show_province: 'Il Gosterme',
    create_keyword: 'Kelime Olusturma',
    analyze_keyword: 'Kelime Analizi',
    create_strategy: 'Strateji Olusturma',
    view_strategy: 'Strateji Goruntuleme',
    add_competitor: 'Rakip Ekleme',
    analyze_competitor: 'Rakip Analizi',
    compare_competitors: 'Rakip Karsilastirma',
    show_data: 'Veri Gosterimi',
    suggest_actions: 'Oneri'
  }
  return labels[tool] || tool
}
