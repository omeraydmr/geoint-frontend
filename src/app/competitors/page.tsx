'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, StatsCard, BentoCard, BentoGrid, DataTable } from '@/components/ui'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { competitorsAPI } from '@/services/api'
import useSWR from 'swr'
import { CompetitorCard, KeywordGapTable } from '@/components/competitors'
import {
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  ShieldCheckIcon,
  ScaleIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

import type { Competitor, KeywordGap, GapAnalysis } from '@/types/competitor'

type ViewMode = 'cards' | 'table' | 'compact'

export default function CompetitorsPage() {
  const router = useRouter()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ domain: '' })
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [searchQuery, setSearchQuery] = useState('')
  const [daFilter, setDaFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const toast = useRef<any>(null)

  // Fetch competitors from API using SWR
  const { data: competitors = [], error, isLoading, mutate } = useSWR<Competitor[]>(
    '/competitors',
    competitorsAPI.getAll,
    { revalidateOnFocus: false }
  )

  // Fetch market overview
  const { data: marketOverview } = useSWR(
    competitors.length > 0 ? '/competitors/market-overview' : null,
    () => competitorsAPI.getMarketOverview(),
    { revalidateOnFocus: false }
  )

  // Show error toast if fetch fails
  if (error && toast.current) {
    toast.current.show({
      severity: 'error',
      summary: 'Hata',
      detail: 'Rakipler yüklenemedi',
      life: 3000
    })
  }

  // Filter competitors
  const filteredCompetitors = useMemo(() => {
    let result = [...competitors]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.domain.toLowerCase().includes(query) ||
        c.name?.toLowerCase().includes(query)
      )
    }

    // DA filter
    if (daFilter !== 'all') {
      result = result.filter(c => {
        const da = c.domain_authority || 0
        if (daFilter === 'high') return da >= 70
        if (daFilter === 'medium') return da >= 40 && da < 70
        return da < 40
      })
    }

    return result
  }, [competitors, searchQuery, daFilter])

  // Calculate stats
  const avgTraffic = competitors.length > 0
    ? Math.round(competitors.reduce((sum, c) => sum + (c.organic_traffic || 0), 0) / competitors.length)
    : 0
  const avgKeywords = competitors.length > 0
    ? Math.round(competitors.reduce((sum, c) => sum + (c.organic_keywords || 0), 0) / competitors.length)
    : 0
  const avgDA = competitors.length > 0
    ? Math.round(competitors.reduce((sum, c) => sum + (c.domain_authority || 0), 0) / competitors.length)
    : 0
  const totalOpportunities = marketOverview?.growth_opportunities?.length || 0

  const addCompetitor = async () => {
    if (!formData.domain.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen bir domain girin',
        life: 3000
      })
      return
    }

    setSaving(true)
    try {
      const newCompetitor = await competitorsAPI.create(formData.domain)
      mutate([...competitors, newCompetitor], false)
      toast.current?.show({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Rakip başarıyla eklendi. Analiz başlatıldı.',
        life: 3000
      })
      setDialogVisible(false)
      setFormData({ domain: '' })
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Rakip eklenemedi'
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: message,
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteCompetitor = (competitor: Competitor) => {
    confirmDialog({
      message: `"${competitor.domain}" takibini durdurmak istediğinizden emin misiniz?`,
      header: 'Silmeyi Onayla',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await competitorsAPI.delete(competitor.id)
          mutate(competitors.filter(c => c.id !== competitor.id), false)
          setSelectedForCompare(prev => prev.filter(id => id !== competitor.id))
          toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Rakip kaldırıldı',
            life: 3000
          })
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Hata',
            detail: 'Rakip silinemedi',
            life: 3000
          })
        }
      }
    })
  }

  const viewDetails = (competitor: Competitor) => {
    router.push(`/competitors/${competitor.id}`)
  }

  const toggleCompareSelection = (competitor: Competitor) => {
    setSelectedForCompare(prev => {
      if (prev.includes(competitor.id)) {
        return prev.filter(id => id !== competitor.id)
      }
      if (prev.length >= 4) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Limite Ulaşıldı',
          detail: 'En fazla 4 rakip karşılaştırabilirsiniz',
          life: 3000
        })
        return prev
      }
      return [...prev, competitor.id]
    })
  }

  const goToCompare = () => {
    if (selectedForCompare.length >= 2) {
      router.push(`/competitors/compare?ids=${selectedForCompare.join(',')}`)
    }
  }

  const refreshAll = async () => {
    setIsRefreshing(true)
    try {
      await mutate()
      toast.current?.show({
        severity: 'success',
        summary: 'Yenilendi',
        detail: 'Rakip verileri güncellendi',
        life: 3000
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getDAColor = (da?: number) => {
    if (!da) return 'default'
    if (da >= 70) return 'success'
    if (da >= 40) return 'warning'
    return 'danger'
  }

  const formatNumber = (num?: number) => {
    if (!num) return '-'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  // Table columns for table view
  const tableColumns = [
    {
      key: 'domain',
      header: 'Domain',
      sortable: true,
      render: (value: string, row: Competitor) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <GlobeAltIcon className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{row.name || value}</div>
            <div className="text-xs text-slate-500">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'organic_traffic',
      header: 'Trafik',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatNumber(value)
    },
    {
      key: 'organic_keywords',
      header: 'Kelimeler',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatNumber(value)
    },
    {
      key: 'domain_authority',
      header: 'DA',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <Badge variant={getDAColor(value) as any} size="sm">{value || '-'}</Badge>
      )
    },
    {
      key: 'total_backlinks',
      header: 'Bağlantılar',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatNumber(value)
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (_: any, row: Competitor) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => viewDetails(row)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger-600 hover:bg-danger-50"
            onClick={() => deleteCompetitor(row)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Rakip İstihbaratı
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Rakiplerinizi gerçek zamanlı takip edin ve analiz edin
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedForCompare.length >= 2 && (
              <Button
                variant="secondary"
                size="md"
                leftIcon={<ScaleIcon className="w-5 h-5" />}
                onClick={goToCompare}
              >
                Karşılaştır ({selectedForCompare.length})
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}
              disabled={competitors.length === 0}
            >
              Dışa Aktar
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusIcon className="w-5 h-5" />}
              onClick={() => setDialogVisible(true)}
            >
              Rakip Ekle
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
          <StatsCard
            title="Toplam Rakip"
            value={competitors.length.toString()}
            variant="primary"
            icon={<UserGroupIcon className="w-6 h-6" />}
            subtitle="Takip edilen"
          />
          <StatsCard
            title="Ort. Trafik"
            value={formatNumber(avgTraffic)}
            variant="success"
            icon={<ChartBarIcon className="w-6 h-6" />}
            subtitle="Aylık ziyaret"
          />
          <StatsCard
            title="Ort. Anahtar Kelime"
            value={formatNumber(avgKeywords)}
            variant="accent"
            icon={<MagnifyingGlassIcon className="w-6 h-6" />}
            subtitle="Sıralanan kelimeler"
          />
          <StatsCard
            title="Ort. Domain Otoritesi"
            value={avgDA.toString()}
            variant={avgDA >= 50 ? 'success' : 'warning'}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            }
            subtitle="Domain gücü"
          />
        </div>

        {/* Filters & View Toggle */}
        {competitors.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Card view"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Table view"
                >
                  <TableCellsIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-slate-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Compact view"
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rakip ara..."
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

              {/* DA Filter */}
              <select
                value={daFilter}
                onChange={(e) => setDaFilter(e.target.value as any)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tüm DA</option>
                <option value="high">DA 70+</option>
                <option value="medium">DA 40-69</option>
                <option value="low">DA &lt; 40</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                {filteredCompetitors.length} of {competitors.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                onClick={refreshAll}
              >
                Yenile
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && competitors.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <UserGroupIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Takip edilen rakip yok
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Rekabet istihbaratı elde etmek için rakiplerinizi takip etmeye başlayın
            </p>
            <Button
              variant="primary"
              onClick={() => setDialogVisible(true)}
              leftIcon={<PlusIcon className="w-5 h-5" />}
            >
              İlk Rakibinizi Ekleyin
            </Button>
          </div>
        )}

        {/* Card View */}
        {!isLoading && filteredCompetitors.length > 0 && viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredCompetitors.map((competitor, index) => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                onView={viewDetails}
                onDelete={deleteCompetitor}
                onCompare={toggleCompareSelection}
                isSelected={selectedForCompare.includes(competitor.id)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {!isLoading && filteredCompetitors.length > 0 && viewMode === 'table' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
            <DataTable
              data={filteredCompetitors}
              columns={tableColumns}
            />
          </div>
        )}

        {/* Compact View */}
        {!isLoading && filteredCompetitors.length > 0 && viewMode === 'compact' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 animate-fade-in-up">
            {filteredCompetitors.map((competitor) => (
              <div
                key={competitor.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedForCompare.includes(competitor.id)}
                    onChange={() => toggleCompareSelection(competitor)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {competitor.name || competitor.domain}
                    </span>
                    {competitor.name && (
                      <span className="text-sm text-slate-500 ml-2">{competitor.domain}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-slate-500">Trafik:</span>{' '}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatNumber(competitor.organic_traffic)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Kelimeler:</span>{' '}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatNumber(competitor.organic_keywords)}
                    </span>
                  </div>
                  <Badge variant={getDAColor(competitor.domain_authority) as any} size="sm">
                    DA: {competitor.domain_authority || '-'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => viewDetails(competitor)}>
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger-600 hover:bg-danger-50"
                      onClick={() => deleteCompetitor(competitor)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Market Opportunities Section */}
        {!isLoading && competitors.length > 0 && marketOverview?.growth_opportunities?.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FireIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Büyüme Fırsatları
                </h3>
                <ul className="space-y-2">
                  {marketOverview.growth_opportunities.map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Add Competitor Dialog */}
        <Dialog
          visible={dialogVisible}
          style={{ width: '500px' }}
          header="Yeni Rakip Ekle"
          modal
          onHide={() => setDialogVisible(false)}
        >
          <div className="space-y-4">
            <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-info-900 dark:text-info-100">
                  <p className="font-semibold mb-1">Rakip Takibi</p>
                  <p className="text-info-700 dark:text-info-300">
                    Organik trafik, anahtar kelimeler, geri bağlantılar ve domain otoritesini gerçek zamanlı takip edeceğiz.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Rakip Domain
              </label>
              <InputText
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full"
                placeholder="rakip.com"
                disabled={saving}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Rakibin domainini http:// veya www olmadan girin
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setDialogVisible(false)}
                disabled={saving}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={addCompetitor}
                loading={saving}
              >
                Takibe Başla
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
