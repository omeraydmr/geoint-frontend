import { useRef } from 'react';

/**
 * Hook for PrimeReact Toast notifications
 * Use in conjunction with Toast component in layout
 */
export function useToast() {
  // This will be accessed via context in actual implementation
  // For now, using console as fallback

  const show = (detail, severity = 'info') => {
    console.log(`[${severity.toUpperCase()}] ${detail}`);

    // In browser, use toast from global context
    if (typeof window !== 'undefined' && window.toast) {
      window.toast.show({
        severity,
        summary: getSummary(severity),
        detail,
        life: 3000,
      });
    }
  };

  const getSummary = (severity) => {
    const summaries = {
      success: 'Başarılı',
      info: 'Bilgi',
      warn: 'Uyarı',
      error: 'Hata',
    };
    return summaries[severity] || 'Bildirim';
  };

  return {
    show,
    success: (detail) => show(detail, 'success'),
    info: (detail) => show(detail, 'info'),
    warn: (detail) => show(detail, 'warn'),
    error: (detail) => show(detail, 'error'),
  };
}
