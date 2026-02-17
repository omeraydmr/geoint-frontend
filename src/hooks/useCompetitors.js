import useSWR from 'swr';
import { useState } from 'react';
import { competitorsAPI } from '@/services/api';
import { useToast } from '@/hooks/useToast';

/**
 * Hook for managing competitors
 * @returns {object} Competitors data and management functions
 */
export function useCompetitors() {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    '/competitors',
    competitorsAPI.getAll,
    {
      revalidateOnFocus: false,
    }
  );

  /**
   * Add new competitor
   * @param {string} domain - Competitor domain
   */
  const addCompetitor = async (domain) => {
    setIsAdding(true);
    try {
      const newCompetitor = await competitorsAPI.create(domain);
      mutate([...(data || []), newCompetitor], false);
      toast.success('Rakip eklendi ve analiz ediliyor');
      return newCompetitor;
    } catch (error) {
      toast.error('Rakip eklenirken hata oluştu');
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Delete competitor
   * @param {string} competitorId - Competitor ID
   */
  const deleteCompetitor = async (competitorId) => {
    try {
      await competitorsAPI.delete(competitorId);
      mutate(data?.filter(c => c.id !== competitorId), false);
      toast.success('Rakip silindi');
    } catch (error) {
      toast.error('Rakip silinirken hata oluştu');
      throw error;
    }
  };

  return {
    competitors: data || [],
    isLoading,
    isError: error,
    isAdding,
    addCompetitor,
    deleteCompetitor,
    mutate,
  };
}

/**
 * Hook for competitor keyword gap analysis
 * @param {string} competitorId - Competitor ID
 * @returns {object} Keyword gap data
 */
export function useKeywordGap(competitorId) {
  const { data, error, isLoading } = useSWR(
    competitorId ? `/competitors/${competitorId}/keyword-gap` : null,
    () => competitorsAPI.getKeywordGap(competitorId)
  );

  return {
    keywordGap: data,
    isLoading,
    isError: error,
  };
}
