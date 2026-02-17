import useSWR from 'swr';
import { geointAPI } from '@/services/api';

/**
 * Hook for fetching GEOINT heatmap data
 * @param {string} keywordId - Keyword ID
 * @returns {object} SWR response with heatmap data
 */
export function useHeatmap(keywordId) {
  const { data, error, isLoading, mutate } = useSWR(
    keywordId ? `/geoint/heatmap/${keywordId}` : null,
    () => geointAPI.getHeatmap(keywordId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    heatmap: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching top regions by GEOINT score
 * @param {string} keywordId - Keyword ID
 * @param {number} limit - Number of top regions to fetch
 * @returns {object} SWR response with top regions data
 */
export function useTopRegions(keywordId, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    keywordId ? `/geoint/top-regions/${keywordId}?limit=${limit}` : null,
    () => geointAPI.getTopRegions(keywordId, limit),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    topRegions: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching budget recommendations
 * @param {string} keywordId - Keyword ID
 * @param {number} totalBudget - Total budget amount
 * @returns {object} SWR response with budget recommendations
 */
export function useBudgetRecommendation(keywordId, totalBudget) {
  const shouldFetch = keywordId && totalBudget > 0;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/geoint/budget/${keywordId}/${totalBudget}` : null,
    () => geointAPI.getBudgetRecommendation(keywordId, totalBudget),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    recommendations: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching GEOINT score details
 * @param {string} keywordId - Keyword ID
 * @param {string} regionId - Region ID
 * @returns {object} SWR response with score details
 */
export function useScoreDetails(keywordId, regionId) {
  const shouldFetch = keywordId && regionId;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/geoint/score/${keywordId}/${regionId}` : null,
    () => geointAPI.getScoreDetails(keywordId, regionId)
  );

  return {
    scoreDetails: data,
    isLoading,
    isError: error,
  };
}
