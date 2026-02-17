import useSWR from 'swr';
import { dashboardAPI } from '@/services/api';

/**
 * Hook for dashboard data
 * Uses SWR for automatic revalidation and caching
 */
export function useDashboard() {
  // Get complete dashboard overview in a single call
  const { data, error, isLoading, mutate } = useSWR(
    '/dashboard/overview',
    dashboardAPI.getOverview,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    stats: data?.stats || null,
    geointTrend: data?.geoint_trend || null,
    keywordPerformance: data?.keyword_performance || null,
    regionalDistribution: data?.regional_distribution || null,
    strategyProgress: data?.strategy_progress || null,
    activities: data?.recent_activities || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for dashboard stats only
 * Lighter weight option when you only need stats
 */
export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/dashboard/stats',
    dashboardAPI.getStats,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  );

  return {
    stats: data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for GEOINT trend data
 */
export function useGeointTrend(days: number = 30) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/dashboard/geoint-trend', days],
    () => dashboardAPI.getGeointTrend(days),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    trend: data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for keyword performance data
 */
export function useKeywordPerformance() {
  const { data, error, isLoading, mutate } = useSWR(
    '/dashboard/keyword-performance',
    dashboardAPI.getKeywordPerformance,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    performance: data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for regional distribution data
 */
export function useRegionalDistribution(regionType: string = 'il', limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/dashboard/regional-distribution', regionType, limit],
    () => dashboardAPI.getRegionalDistribution(regionType, limit),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    distribution: data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for recent activities
 */
export function useActivities(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/dashboard/activities', limit],
    () => dashboardAPI.getActivities(limit),
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  );

  return {
    activities: data?.activities || [],
    totalCount: data?.total_count || 0,
    hasMore: data?.has_more || false,
    isLoading,
    isError: error,
    mutate,
  };
}
