'use client'

import { useMemo } from 'react'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface SWOTData {
  domain: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  generated_at: string
}

interface SWOTCardProps {
  data: SWOTData | null
  isLoading?: boolean
  onRegenerate?: () => void
}

interface SWOTSectionProps {
  title: string
  items: string[]
  icon: React.ReactNode
  colorClass: string
  bgClass: string
}

function SWOTSection({ title, items, icon, colorClass, bgClass }: SWOTSectionProps) {
  return (
    <div className={`rounded-xl p-4 ${bgClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-slate-400 italic">Veri bulunamadı</li>
        )}
      </ul>
    </div>
  )
}

export function SWOTCard({ data, isLoading, onRegenerate }: SWOTCardProps) {
  const generatedDate = useMemo(() => {
    if (!data?.generated_at) return null
    return new Date(data.generated_at).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [data])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div>
            <div className="h-5 w-32 bg-slate-100 dark:bg-slate-700 rounded animate-pulse mb-1" />
            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            AI Destekli Analiz
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            AI kullanarak kapsamlı bir SWOT analizi oluşturun
          </p>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Analiz Oluştur
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">SWOT Analizi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oluşturulma: {generatedDate}
            </p>
          </div>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            Yeniden Oluştur
          </button>
        )}
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SWOTSection
          title="Güçlü Yönler"
          items={data.strengths}
          icon={<ShieldCheckIcon className="w-5 h-5 text-green-600" />}
          colorClass="bg-green-100 dark:bg-green-900/30"
          bgClass="bg-green-50 dark:bg-green-900/10"
        />
        <SWOTSection
          title="Zayıf Yönler"
          items={data.weaknesses}
          icon={<ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
          colorClass="bg-red-100 dark:bg-red-900/30"
          bgClass="bg-red-50 dark:bg-red-900/10"
        />
        <SWOTSection
          title="Fırsatlar"
          items={data.opportunities}
          icon={<LightBulbIcon className="w-5 h-5 text-amber-600" />}
          colorClass="bg-amber-100 dark:bg-amber-900/30"
          bgClass="bg-amber-50 dark:bg-amber-900/10"
        />
        <SWOTSection
          title="Tehditler"
          items={data.threats}
          icon={<BoltIcon className="w-5 h-5 text-purple-600" />}
          colorClass="bg-purple-100 dark:bg-purple-900/30"
          bgClass="bg-purple-50 dark:bg-purple-900/10"
        />
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Öneriler
          </h4>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
