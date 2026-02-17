import useSWR from 'swr';
import { useState } from 'react';
import { strategyAPI } from '@/services/api';
import { useToast } from '@/hooks/useToast';

/**
 * Hook for managing strategies
 * @returns {object} Strategies data and management functions
 */
export function useStrategies() {
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    '/strategies',
    strategyAPI.getAll,
    {
      revalidateOnFocus: false,
    }
  );

  /**
   * Create new strategy
   * @param {object} strategyData - Strategy data
   */
  const createStrategy = async (strategyData) => {
    setIsCreating(true);
    try {
      const newStrategy = await strategyAPI.create(strategyData);
      mutate([...(data || []), newStrategy], false);
      toast.success('Strateji oluşturuldu');
      return newStrategy;
    } catch (error) {
      toast.error('Strateji oluşturulurken hata oluştu');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Delete strategy
   * @param {string} strategyId - Strategy ID
   */
  const deleteStrategy = async (strategyId) => {
    try {
      await strategyAPI.delete(strategyId);
      mutate(data?.filter(s => s.id !== strategyId), false);
      toast.success('Strateji silindi');
    } catch (error) {
      toast.error('Strateji silinirken hata oluştu');
      throw error;
    }
  };

  return {
    strategies: data || [],
    isLoading,
    isError: error,
    isCreating,
    createStrategy,
    deleteStrategy,
    mutate,
  };
}

/**
 * Hook for single strategy details
 * @param {string} strategyId - Strategy ID
 * @returns {object} Strategy details and functions
 */
export function useStrategy(strategyId) {
  const toast = useToast();

  const { data, error, isLoading, mutate } = useSWR(
    strategyId ? `/strategies/${strategyId}` : null,
    () => strategyAPI.getById(strategyId)
  );

  /**
   * Update strategy
   * @param {object} updates - Update data
   */
  const updateStrategy = async (updates) => {
    try {
      const updated = await strategyAPI.update(strategyId, updates);
      mutate(updated, false);
      toast.success('Strateji güncellendi');
      return updated;
    } catch (error) {
      toast.error('Güncelleme hatası');
      throw error;
    }
  };

  return {
    strategy: data,
    isLoading,
    isError: error,
    updateStrategy,
    mutate,
  };
}
