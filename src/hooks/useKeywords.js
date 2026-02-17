import useSWR from 'swr';
import { useState } from 'react';
import { keywordsAPI } from '@/services/api';
import { useToast } from '@/hooks/useToast';

/**
 * Hook for managing keywords
 * @returns {object} Keywords data and management functions
 */
export function useKeywords() {
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    '/keywords',
    keywordsAPI.getAll,
    {
      revalidateOnFocus: false,
    }
  );

  /**
   * Add new keyword
   * @param {string} keyword - Keyword text
   */
  const addKeyword = async (keyword) => {
    setIsCreating(true);
    try {
      const newKeyword = await keywordsAPI.create(keyword);

      // Optimistic update
      mutate([...(data || []), newKeyword], false);

      toast.success('Anahtar kelime eklendi');
      return newKeyword;
    } catch (error) {
      toast.error('Anahtar kelime eklenirken hata oluştu');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Delete keyword
   * @param {string} keywordId - Keyword ID
   */
  const deleteKeyword = async (keywordId) => {
    setIsDeleting(true);
    try {
      await keywordsAPI.delete(keywordId);

      // Optimistic update
      mutate(
        data?.filter(k => k.id !== keywordId),
        false
      );

      toast.success('Anahtar kelime silindi');
    } catch (error) {
      toast.error('Anahtar kelime silinirken hata oluştu');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Update keyword
   * @param {string} keywordId - Keyword ID
   * @param {object} updates - Update data
   */
  const updateKeyword = async (keywordId, updates) => {
    try {
      const updated = await keywordsAPI.update(keywordId, updates);

      // Optimistic update
      mutate(
        data?.map(k => k.id === keywordId ? updated : k),
        false
      );

      toast.success('Anahtar kelime güncellendi');
      return updated;
    } catch (error) {
      toast.error('Anahtar kelime güncellenirken hata oluştu');
      throw error;
    }
  };

  /**
   * Analyze keyword with NLP
   * @param {string} keyword - Keyword text
   */
  const analyzeKeyword = async (keyword) => {
    try {
      const analysis = await keywordsAPI.analyze(keyword);
      return analysis;
    } catch (error) {
      toast.error('Analiz yapılırken hata oluştu');
      throw error;
    }
  };

  return {
    keywords: data || [],
    isLoading,
    isError: error,
    isCreating,
    isDeleting,
    addKeyword,
    deleteKeyword,
    updateKeyword,
    analyzeKeyword,
    mutate,
  };
}
