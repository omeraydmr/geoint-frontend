import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and ensure trailing slashes
apiClient.interceptors.request.use(
  (config) => {
    // Add trailing slash to prevent 307 redirects from FastAPI
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
      config.url = config.url + '/';
    } else if (config.url && config.url.includes('?') && !config.url.split('?')[0].endsWith('/')) {
      const [path, query] = config.url.split('?');
      config.url = path + '/?' + query;
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('access_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.patch('/auth/me', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/auth/me/change-password', passwordData);
    return response.data;
  },
};

// ============================================
// GEOINT API
// ============================================
export const geointAPI = {
  // Get heatmap data for a keyword
  getHeatmap: async (keywordId, regionType = 'il') => {
    const response = await apiClient.get(`/geoint/heatmap/${keywordId}`, {
      params: { region_type: regionType }
    });
    return response.data;
  },

  // Get top regions by GEOINT score
  // @param {string} keywordId - The keyword ID
  // @param {number} limit - Max number of regions to return
  // @param {string|null} regionType - 'il' for provinces only, 'ilce' for districts, null for all
  getTopRegions: async (keywordId, limit = 10, regionType = 'il') => {
    const params = { limit };
    if (regionType) params.region_type = regionType;
    const response = await apiClient.get(`/geoint/top-regions/${keywordId}`, { params });
    return response.data;
  },

  // Get budget recommendations
  getBudgetRecommendation: async (keywordId, totalBudget, regionType = 'il', topN = 5) => {
    const response = await apiClient.post('/geoint/budget-recommendation', {
      keyword_id: keywordId,
      total_budget: totalBudget,
      region_type: regionType,
      top_n: topN
    });
    return response.data;
  },

  // Get GEOINT score details
  getScoreDetails: async (keywordId, regionId) => {
    const response = await apiClient.get(`/geoint/score/${keywordId}/${regionId}`);
    return response.data;
  },

  // Get GEOINT stats for a keyword
  getStats: async (keywordId) => {
    const response = await apiClient.get(`/geoint/stats/${keywordId}`);
    return response.data;
  },

  // Get system overview
  getOverview: async () => {
    const response = await apiClient.get('/geoint/overview');
    return response.data;
  },

  // Trigger GEOINT calculation for a keyword
  triggerCalculation: async (keywordId) => {
    const response = await apiClient.post(`/geoint/calculate/${keywordId}`);
    return response.data;
  },

  // Get competitor comparison data for a keyword
  getCompetitorComparison: async (keywordId, competitorDomains, userDomain = null, regionType = 'il', provinceId = null, force = true) => {
    const params = new URLSearchParams();
    competitorDomains.forEach(domain => params.append('competitor_domains', domain));
    if (userDomain) params.append('user_domain', userDomain);
    params.append('region_type', regionType);
    if (provinceId) params.append('province_id', provinceId);
    params.append('force', force.toString());

    const response = await apiClient.get(`/geoint/competitor-comparison/${keywordId}?${params.toString()}`);
    return response.data;
  },

  // Get comparison history list for a keyword
  getComparisonHistory: async (keywordId, limit = 20) => {
    const response = await apiClient.get(`/geoint/competitor-comparisons/${keywordId}/history`, {
      params: { limit }
    });
    return response.data;
  },

  // Get a specific historical comparison by ID
  getComparisonById: async (comparisonId) => {
    const response = await apiClient.get(`/geoint/competitor-comparisons/history/${comparisonId}`);
    return response.data;
  },
};

// ============================================
// Keywords API
// ============================================
export const keywordsAPI = {
  // Get all keywords for current user
  getAll: async () => {
    const response = await apiClient.get('/keywords');
    return response.data;
  },

  // Add new keyword
  create: async (keyword) => {
    const response = await apiClient.post('/keywords', { keyword });
    return response.data;
  },

  // Delete keyword
  delete: async (keywordId) => {
    const response = await apiClient.delete(`/keywords/${keywordId}`);
    return response.data;
  },

  // Update keyword
  update: async (keywordId, data) => {
    const response = await apiClient.patch(`/keywords/${keywordId}`, data);
    return response.data;
  },

  // Analyze keyword with NLP
  analyze: async (keyword) => {
    const response = await apiClient.post('/keywords/analyze', { keyword });
    return response.data;
  },
};

// ============================================
// Strategy API
// ============================================
export const strategyAPI = {
  // Get all strategies
  getAll: async () => {
    const response = await apiClient.get('/strategies');
    return response.data;
  },

  // Get strategy details
  getById: async (strategyId) => {
    const response = await apiClient.get(`/strategies/${strategyId}`);
    return response.data;
  },

  // Create new strategy (draft)
  create: async (strategyData) => {
    const response = await apiClient.post('/strategies', strategyData);
    return response.data;
  },

  // Update strategy
  update: async (strategyId, data) => {
    const response = await apiClient.patch(`/strategies/${strategyId}`, data);
    return response.data;
  },

  // Delete strategy
  delete: async (strategyId) => {
    const response = await apiClient.delete(`/strategies/${strategyId}`);
    return response.data;
  },

  // Generate AI content for existing strategy
  generateAI: async (strategyId, options = {}) => {
    const response = await apiClient.post(`/strategies/${strategyId}/generate`, options);
    return response.data;
  },

  // Get all weeks with tasks
  getWeeks: async (strategyId) => {
    const response = await apiClient.get(`/strategies/${strategyId}/weeks`);
    return response.data;
  },

  // Get weekly tasks (legacy)
  getWeeklyTasks: async (strategyId, weekNumber) => {
    const response = await apiClient.get(`/strategies/${strategyId}/weeks/${weekNumber}/tasks`);
    return response.data;
  },

  // Get progress metrics
  getProgress: async (strategyId) => {
    const response = await apiClient.get(`/strategies/${strategyId}/progress`);
    return response.data;
  },

  // AI refinement
  refine: async (strategyId, request) => {
    const response = await apiClient.post(`/strategies/${strategyId}/refine`, request);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, data) => {
    const response = await apiClient.patch(`/strategies/tasks/${taskId}`, data);
    return response.data;
  },

  // Create task
  createTask: async (strategyId, weekId, data) => {
    const response = await apiClient.post(`/strategies/${strategyId}/weeks/${weekId}/tasks`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/strategies/tasks/${taskId}`);
    return response.data;
  },
};

// ============================================
// Competitors API
// ============================================
export const competitorsAPI = {
  // Get all tracked competitors
  getAll: async () => {
    const response = await apiClient.get('/competitors');
    return response.data;
  },

  // Add competitor
  create: async (domain) => {
    const response = await apiClient.post('/competitors', { domain });
    return response.data;
  },

  // Get competitor details with snapshots
  getById: async (competitorId, includeSnapshots = true) => {
    const response = await apiClient.get(`/competitors/${competitorId}`, {
      params: { include_snapshots: includeSnapshots }
    });
    return response.data;
  },

  // Update competitor
  update: async (competitorId, data) => {
    const response = await apiClient.patch(`/competitors/${competitorId}`, data);
    return response.data;
  },

  // Delete competitor
  delete: async (competitorId) => {
    const response = await apiClient.delete(`/competitors/${competitorId}`);
    return response.data;
  },

  // Trigger analysis
  analyze: async (competitorId) => {
    const response = await apiClient.post(`/competitors/${competitorId}/analyze`);
    return response.data;
  },

  // Get competitor keywords
  getKeywords: async (competitorId, limit = 100) => {
    const response = await apiClient.get(`/competitors/${competitorId}/keywords`, {
      params: { limit }
    });
    return response.data;
  },

  // Get keyword gap analysis
  getGapAnalysis: async (competitorId, userDomain) => {
    const response = await apiClient.get(`/competitors/${competitorId}/gap-analysis`, {
      params: { user_domain: userDomain }
    });
    return response.data;
  },

  // Compare multiple competitors
  compare: async (competitorIds, userDomain = null) => {
    const response = await apiClient.post('/competitors/compare', {
      competitor_ids: competitorIds,
      user_domain: userDomain
    });
    return response.data;
  },

  // Get historical trends
  getTrends: async (competitorId, timeRange = '30d') => {
    const response = await apiClient.get(`/competitors/${competitorId}/trends`, {
      params: { time_range: timeRange }
    });
    return response.data;
  },

  // Get backlink profile
  getBacklinks: async (competitorId, limit = 100) => {
    const response = await apiClient.get(`/competitors/${competitorId}/backlinks`, {
      params: { limit }
    });
    return response.data;
  },

  // Get content gaps
  getContentGaps: async (competitorId, userDomain = null) => {
    const response = await apiClient.get(`/competitors/${competitorId}/content-gap`, {
      params: { user_domain: userDomain }
    });
    return response.data;
  },

  // Get ad intelligence
  getAdIntelligence: async (competitorId) => {
    const response = await apiClient.get(`/competitors/${competitorId}/ad-intel`);
    return response.data;
  },

  // Get tech stack
  getTechStack: async (competitorId) => {
    const response = await apiClient.get(`/competitors/${competitorId}/tech-stack`);
    return response.data;
  },

  // Get AI insights (SWOT analysis)
  getAIInsights: async (competitorId, regenerate = false) => {
    const response = await apiClient.post(`/competitors/${competitorId}/ai-insights`, {
      regenerate
    });
    return response.data;
  },

  // Get market overview
  getMarketOverview: async (userDomain = null) => {
    const response = await apiClient.get('/competitors/market-overview', {
      params: { user_domain: userDomain }
    });
    return response.data;
  },
};

// ============================================
// Media API
// ============================================
export const mediaAPI = {
  // Get media mentions
  getMentions: async (params) => {
    const response = await apiClient.get('/media/mentions', { params });
    return response.data;
  },

  // Get PR opportunities
  getOpportunities: async () => {
    const response = await apiClient.get('/media/opportunities');
    return response.data;
  },

  // Check AI visibility
  checkAIVisibility: async (brand, category) => {
    const response = await apiClient.post('/media/ai-visibility', { brand, category });
    return response.data;
  },

  // Mark opportunity as contacted
  markContacted: async (opportunityId) => {
    const response = await apiClient.patch(`/media/opportunities/${opportunityId}/contacted`);
    return response.data;
  },
};

// ============================================
// Dashboard API
// ============================================
export const dashboardAPI = {
  // Get main dashboard stats
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  // Get GEOINT trend data
  getGeointTrend: async (days = 30) => {
    const response = await apiClient.get(`/dashboard/geoint-trend?days=${days}`);
    return response.data;
  },

  // Get keyword performance data
  getKeywordPerformance: async () => {
    const response = await apiClient.get('/dashboard/keyword-performance');
    return response.data;
  },

  // Get regional distribution data
  getRegionalDistribution: async (regionType = 'il', limit = 10) => {
    const response = await apiClient.get('/dashboard/regional-distribution', {
      params: { region_type: regionType, limit }
    });
    return response.data;
  },

  // Get strategy progress
  getStrategyProgress: async () => {
    const response = await apiClient.get('/dashboard/strategy-progress');
    return response.data;
  },

  // Get recent activities
  getActivities: async (limit = 10) => {
    const response = await apiClient.get(`/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  // Get complete dashboard overview (all data in one call)
  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },
};

export default apiClient;
