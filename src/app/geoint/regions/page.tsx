'use client'

import { useGEOINT } from '@/contexts/GEOINTContext'
import { DataTable } from '@/components/ui/data-table'

const getTrendIcon = (direction: string) => {
  if (direction === 'up')
    return (
      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
          clipRule="evenodd"
        />
      </svg>
    )
  if (direction === 'down')
    return (
      <svg className="w-4 h-4 text-error-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
          clipRule="evenodd"
        />
      </svg>
    )
  return (
    <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  )
}

export default function GEOINTRegionsPage() {
  const { topRegions, loadingRegions } = useGEOINT()

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-base font-semibold text-surface-900 mb-4">Tum Bolgeler</h2>
      <DataTable
        data={topRegions}
        columns={[
          {
            key: 'region_name',
            header: 'Bolge',
            sortable: true,
          },
          {
            key: 'geoint_score',
            header: 'GEOINT Skoru',
            sortable: true,
            align: 'center',
            render: (value) => (
              <span className={`score ${value >= 70 ? 'score-high' : value >= 40 ? 'score-mid' : 'score-low'}`}>
                {value.toFixed(1)}
              </span>
            ),
          },
          {
            key: 'search_index',
            header: 'Arama Indeksi',
            sortable: true,
            align: 'right',
            render: (value) => <span className="text-surface-600">{value?.toFixed(1) || 'N/A'}</span>,
          },
          {
            key: 'trend_direction',
            header: 'Trend',
            sortable: true,
            align: 'center',
            render: (value) => (
              <div className="flex items-center justify-center gap-1">
                {getTrendIcon(value)}
                <span className="text-xs text-surface-600">
                  {value === 'up' ? 'Yukseliyor' : value === 'down' ? 'Dusuyor' : 'Stabil'}
                </span>
              </div>
            ),
          },
          {
            key: 'demographic_fit',
            header: 'Demo Uyum',
            sortable: true,
            align: 'right',
            render: (value) => <span className="text-surface-600">{value?.toFixed(1) || 'N/A'}</span>,
          },
          {
            key: 'competition_gap',
            header: 'Rekabet Boslugu',
            sortable: true,
            align: 'right',
            render: (value) => <span className="text-surface-600">{value?.toFixed(1) || 'N/A'}</span>,
          },
        ]}
        keyExtractor={(row, index) => row.region_id || index}
        sortable
        searchable
        pagination
        pageSize={10}
        loading={loadingRegions}
        emptyMessage="Bolge verisi bulunamadi"
      />
    </div>
  )
}
