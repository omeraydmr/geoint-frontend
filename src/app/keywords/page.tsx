'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, DataTable, StatsCard, BentoCard } from '@/components/ui'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { keywordsAPI } from '@/services/api'
import useSWR from 'swr'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  MapPinIcon,
  TrashIcon,
  PencilIcon,
  CloudArrowUpIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type ViewMode = 'grid' | 'table'

interface Keyword {
  id: string
  keyword: string
  avg_monthly_searches?: number
  cpc_avg?: number
  difficulty_score?: number
  is_active: boolean
  created_at?: string
  search_volume_trend?: 'up' | 'down' | 'neutral'
}

export default function KeywordsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [dialogVisible, setDialogVisible] = useState(false)
  const [bulkDialogVisible, setBulkDialogVisible] = useState(false)
  const [filterDialogVisible, setFilterDialogVisible] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [keywordToDelete, setKeywordToDelete] = useState<Keyword | null>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [bulkKeywords, setBulkKeywords] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const toast = useRef<any>(null)

  const [formData, setFormData] = useState({
    keyword: '',
    is_active: true
  })

  // Fetch keywords from API using SWR
  const { data: keywords = [], error, isLoading, mutate } = useSWR<Keyword[]>(
    '/keywords',
    keywordsAPI.getAll,
    { revalidateOnFocus: false }
  )

  // Show error toast if fetch fails
  if (error && toast.current) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch keywords',
      life: 3000
    })
  }

  // Filter keywords based on search query and status
  const filteredKeywords = keywords.filter(k => {
    const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && k.is_active) ||
      (filterStatus === 'inactive' && !k.is_active)
    return matchesSearch && matchesStatus
  })

  const handleBulkImport = async () => {
    if (!bulkKeywords.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Lutfen en az bir keyword girin',
        life: 3000
      })
      return
    }

    setSaving(true)
    try {
      const keywordList = bulkKeywords.split('\n').filter(k => k.trim())
      let successCount = 0

      for (const keyword of keywordList) {
        try {
          await keywordsAPI.create(keyword.trim())
          successCount++
        } catch (error) {
          // Continue with other keywords if one fails
        }
      }

      mutate() // Refresh the list
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: `${successCount} keyword eklendi`,
        life: 3000
      })
      setBulkDialogVisible(false)
      setBulkKeywords('')
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Import islemi basarisiz',
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const clearFilters = () => {
    setFilterStatus('all')
    setSearchQuery('')
    setFilterDialogVisible(false)
  }

  // Calculate stats
  const activeKeywords = keywords.filter(k => k.is_active).length
  const totalSearchVolume = keywords.reduce((sum, k) => sum + (k.avg_monthly_searches || 0), 0)
  const avgDifficulty = keywords.length > 0
    ? Math.round(keywords.reduce((sum, k) => sum + (k.difficulty_score || 0), 0) / keywords.length)
    : 0

  const openNew = () => {
    setFormData({ keyword: '', is_active: true })
    setSelectedKeyword(null)
    setDialogVisible(true)
  }

  const editKeyword = (keyword: Keyword) => {
    setFormData({ keyword: keyword.keyword, is_active: keyword.is_active })
    setSelectedKeyword(keyword)
    setDialogVisible(true)
  }

  const saveKeyword = async () => {
    if (!formData.keyword.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a keyword',
        life: 3000
      })
      return
    }

    setSaving(true)
    try {
      if (selectedKeyword) {
        // Update existing keyword
        const updated = await keywordsAPI.update(selectedKeyword.id, {
          keyword: formData.keyword,
          is_active: formData.is_active
        })
        // Optimistic update
        mutate(keywords.map(k => k.id === selectedKeyword.id ? updated : k), false)
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Keyword updated',
          life: 3000
        })
      } else {
        // Create new keyword
        const newKeyword = await keywordsAPI.create(formData.keyword)
        // Optimistic update
        mutate([...keywords, newKeyword], false)
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Keyword created',
          life: 3000
        })
      }
      setDialogVisible(false)
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to save keyword'
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteKeyword = (keyword: Keyword) => {
    setKeywordToDelete(keyword)
    setDeleteDialogVisible(true)
  }

  const confirmDeleteKeyword = async () => {
    if (!keywordToDelete) return

    setDeleting(true)
    try {
      await keywordsAPI.delete(keywordToDelete.id)
      // Optimistic update
      mutate(keywords.filter(k => k.id !== keywordToDelete.id), false)
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Keyword silindi',
        life: 3000
      })
      setDeleteDialogVisible(false)
      setKeywordToDelete(null)
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Keyword silinemedi'
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: message,
        life: 3000
      })
    } finally {
      setDeleting(false)
    }
  }

  const getDifficultyColor = (score: number | undefined) => {
    if (!score) return 'default'
    if (score < 30) return 'success'
    if (score < 60) return 'warning'
    return 'danger'
  }

  const getDifficultyLabel = (score: number | undefined) => {
    if (!score) return 'Unknown'
    if (score < 30) return 'Easy'
    if (score < 60) return 'Medium'
    return 'Hard'
  }

  return (
    <DashboardLayout>
      <Toast ref={toast} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">Anahtar Kelimeler</h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Hedef anahtar kelimelerinizi takip edin ve analiz edin</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBulkDialogVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 border-2 border-surface-300 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 hover:border-surface-400 dark:hover:border-surface-600 transition-all"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              Toplu Ekle
            </button>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 rounded-xl hover:from-brand-700 hover:to-brand-800 dark:hover:from-brand-600 dark:hover:to-brand-700 transition-all shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Keyword Ekle
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
          <StatsCard
            title="Total Keywords"
            value={keywords.length.toString()}
            variant="primary"
            icon={<MagnifyingGlassIcon className="w-6 h-6" />}
            trend={keywords.length > 50 ? 'up' : 'neutral'}
            change={keywords.length > 50 ? '+12%' : undefined}
          />
          <StatsCard
            title="Active Keywords"
            value={activeKeywords.toString()}
            variant="success"
            icon={<ChartBarIcon className="w-6 h-6" />}
            subtitle={`${keywords.length - activeKeywords} inactive`}
          />
          <StatsCard
            title="Total Search Volume"
            value={totalSearchVolume.toLocaleString()}
            variant="accent"
            icon={<ArrowUpIcon className="w-6 h-6" />}
            subtitle="Monthly searches"
          />
          <StatsCard
            title="Avg Difficulty"
            value={avgDifficulty.toString()}
            variant={avgDifficulty < 40 ? 'success' : 'warning'}
            subtitle={avgDifficulty < 40 ? 'Easy to rank' : 'Moderate'}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-surface-900 rounded-xl border-2 border-surface-200 dark:border-surface-800 p-4 shadow-sm dark:shadow-dark-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
                <input
                  type="text"
                  placeholder="Keyword ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 border-2 border-surface-300 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterDialogVisible(true)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  filterStatus !== 'all'
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-200 dark:border-brand-800'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 border-2 border-transparent'
                }`}
              >
                <FunnelIcon className="w-4 h-4" />
                Filtre {filterStatus !== 'all' && '(1)'}
              </button>
              <div className="h-6 w-px bg-surface-300 dark:bg-surface-700" />
              <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-lg p-1 border border-surface-200 dark:border-surface-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-brand-400 shadow-sm border border-surface-200 dark:border-surface-600'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-brand-400 shadow-sm border border-surface-200 dark:border-surface-600'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                  }`}
                >
                  <TableCellsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Grid or Table View */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-brand-400" />
          </div>
        ) : filteredKeywords.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-xl border-2 border-surface-200 dark:border-surface-800">
            <MagnifyingGlassIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">Keyword bulunamadi</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchQuery ? 'Arama sorgunuzu degistirmeyi deneyin' : 'Baslamak icin ilk keywordunuzu ekleyin'}
            </p>
            {!searchQuery && (
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 rounded-xl hover:from-brand-700 hover:to-brand-800 dark:hover:from-brand-600 dark:hover:to-brand-700 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Keyword Ekle
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredKeywords.map((keyword, index) => (
              <div
                key={keyword.id}
                className="bg-white dark:bg-surface-900 rounded-xl border-2 border-surface-200 dark:border-surface-800 p-5 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg dark:hover:shadow-dark-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">{keyword.keyword}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                      keyword.is_active
                        ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${keyword.is_active ? 'bg-success-500' : 'bg-surface-400 dark:bg-surface-500'}`} />
                      {keyword.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  {keyword.search_volume_trend && (
                    <div className={`p-2 rounded-lg ${
                      keyword.search_volume_trend === 'up' ? 'bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800' :
                      keyword.search_volume_trend === 'down' ? 'bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800' :
                      'bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700'
                    }`}>
                      {keyword.search_volume_trend === 'up' && <ArrowUpIcon className="w-5 h-5 text-success-600 dark:text-success-400" />}
                      {keyword.search_volume_trend === 'down' && <ArrowDownIcon className="w-5 h-5 text-error-600 dark:text-error-400" />}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Arama Hacmi</span>
                    <span className="font-semibold text-surface-900 dark:text-surface-100">
                      {keyword.avg_monthly_searches?.toLocaleString() || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Ort. CPC</span>
                    <span className="font-semibold text-surface-900 dark:text-surface-100">
                      {keyword.cpc_avg ? `₺${(keyword.cpc_avg / 100).toFixed(2)}` : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Zorluk</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      !keyword.difficulty_score ? 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400' :
                      keyword.difficulty_score < 30 ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400' :
                      keyword.difficulty_score < 60 ? 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400' :
                      'bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                    }`}>
                      {getDifficultyLabel(keyword.difficulty_score)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-4 border-t border-surface-200 dark:border-surface-800">
                  <button
                    onClick={() => router.push(`/geoint?keyword=${keyword.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-all"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    GEOINT
                  </button>
                  <button
                    onClick={() => editKeyword(keyword)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-all"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Duzenle
                  </button>
                  <button
                    onClick={() => deleteKeyword(keyword)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-surface-900 rounded-xl border-2 border-surface-200 dark:border-surface-800 overflow-hidden animate-fade-in-up">
            <DataTable
              data={filteredKeywords}
              columns={[
                {
                  key: 'keyword',
                  header: 'Keyword',
                  sortable: true,
                  render: (value, row) => (
                    <div>
                      <div className="font-semibold text-surface-900 dark:text-surface-100">{value}</div>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                        row.is_active
                          ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-success-500' : 'bg-surface-400 dark:bg-surface-500'}`} />
                        {row.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  )
                },
                {
                  key: 'avg_monthly_searches',
                  header: 'Arama Hacmi',
                  sortable: true,
                  align: 'right',
                  render: (value) => value?.toLocaleString() || '-'
                },
                {
                  key: 'cpc_avg',
                  header: 'Ort. CPC',
                  sortable: true,
                  align: 'right',
                  render: (value) => value ? `₺${(value / 100).toFixed(2)}` : '-'
                },
                {
                  key: 'difficulty_score',
                  header: 'Zorluk',
                  sortable: true,
                  align: 'center',
                  render: (value) => (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      !value ? 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400' :
                      value < 30 ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400' :
                      value < 60 ? 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400' :
                      'bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                    }`}>
                      {getDifficultyLabel(value)}
                    </span>
                  )
                },
                {
                  key: 'created_at',
                  header: 'Olusturulma',
                  sortable: true,
                  render: (value) => value ? new Date(value).toLocaleDateString('tr-TR') : '-'
                },
                {
                  key: 'actions',
                  header: 'Islemler',
                  align: 'center',
                  render: (_, row) => (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => router.push(`/geoint?keyword=${row.id}`)}
                        className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                        title="GEOINT"
                      >
                        <MapPinIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editKeyword(row)}
                        className="p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                        title="Duzenle"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteKeyword(row)}
                        className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog
          visible={dialogVisible}
          style={{ width: '480px' }}
          modal
          onHide={() => setDialogVisible(false)}
          header={null}
          closable={false}
          className="keyword-edit-dialog"
          pt={{
            root: { className: 'border-0 shadow-xl rounded-2xl' },
            content: { className: 'p-0' }
          }}
        >
          <div className="p-6 bg-white dark:bg-surface-900">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                {selectedKeyword ? 'Keyword Duzenle' : 'Yeni Keyword'}
              </h2>
              <button
                onClick={() => setDialogVisible(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="keyword" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Keyword
                </label>
                <input
                  id="keyword"
                  type="text"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="w-full px-4 py-3 text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border-2 border-surface-300 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500"
                  placeholder="Keyword girin"
                  disabled={saving}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={() => setDialogVisible(false)}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  Iptal
                </button>
                <button
                  onClick={saveKeyword}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 hover:from-brand-700 hover:to-brand-800 dark:hover:from-brand-600 dark:hover:to-brand-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog
          visible={bulkDialogVisible}
          style={{ width: '560px' }}
          modal
          onHide={() => setBulkDialogVisible(false)}
          header={null}
          closable={false}
          className="bulk-import-dialog"
          pt={{
            root: { className: 'border-0 shadow-xl rounded-2xl' },
            content: { className: 'p-0' }
          }}
        >
          <div className="p-6 bg-white dark:bg-surface-900">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                Toplu Keyword Ekleme
              </h2>
              <button
                onClick={() => {
                  setBulkDialogVisible(false)
                  setBulkKeywords('')
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-200 dark:border-brand-800 rounded-xl p-4 mb-5">
              <p className="text-sm text-brand-800 dark:text-brand-300">
                Her satira bir keyword yazin. Keywordler otomatik olarak sisteme eklenecektir.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Keywords (her satira bir tane)
                </label>
                <textarea
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border-2 border-surface-300 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all resize-y placeholder:text-surface-400 dark:placeholder:text-surface-500"
                  placeholder="dijital pazarlama&#10;seo hizmetleri&#10;web tasarim&#10;sosyal medya yonetimi"
                  disabled={saving}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setBulkDialogVisible(false)
                    setBulkKeywords('')
                  }}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  Iptal
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 hover:from-brand-700 hover:to-brand-800 dark:hover:from-brand-600 dark:hover:to-brand-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <CloudArrowUpIcon className="w-4 h-4" />
                  )}
                  Import Et
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog
          visible={filterDialogVisible}
          style={{ width: '400px' }}
          modal
          onHide={() => setFilterDialogVisible(false)}
          header={null}
          closable={false}
          pt={{
            root: { className: 'border-0 shadow-xl rounded-2xl' },
            content: { className: 'p-0' }
          }}
        >
          <div className="p-6 bg-white dark:bg-surface-900">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Filtrele</h2>
              <button
                onClick={() => setFilterDialogVisible(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                  Durum
                </label>
                <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    filterStatus === 'all' ? 'border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/30' : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filterStatus === 'all'}
                      onChange={() => setFilterStatus('all')}
                      className="w-4 h-4 text-brand-600 dark:text-brand-400 border-2 border-surface-300 dark:border-surface-600"
                    />
                    <span className="text-surface-700 dark:text-surface-300 font-medium">Tumunu Goster</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    filterStatus === 'active' ? 'border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/30' : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filterStatus === 'active'}
                      onChange={() => setFilterStatus('active')}
                      className="w-4 h-4 text-brand-600 dark:text-brand-400 border-2 border-surface-300 dark:border-surface-600"
                    />
                    <span className="text-surface-700 dark:text-surface-300 font-medium">Sadece Aktif</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    filterStatus === 'inactive' ? 'border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/30' : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filterStatus === 'inactive'}
                      onChange={() => setFilterStatus('inactive')}
                      className="w-4 h-4 text-brand-600 dark:text-brand-400 border-2 border-surface-300 dark:border-surface-600"
                    />
                    <span className="text-surface-700 dark:text-surface-300 font-medium">Sadece Pasif</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Temizle
                </button>
                <button
                  onClick={() => setFilterDialogVisible(false)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 hover:from-brand-700 hover:to-brand-800 dark:hover:from-brand-600 dark:hover:to-brand-700 rounded-xl transition-colors"
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          visible={deleteDialogVisible}
          style={{ width: '420px' }}
          modal
          onHide={() => {
            setDeleteDialogVisible(false)
            setKeywordToDelete(null)
          }}
          header={null}
          closable={false}
          className="delete-confirm-dialog"
          pt={{
            root: { className: 'border-0 shadow-xl rounded-2xl' },
            content: { className: 'p-0' }
          }}
        >
          <div className="p-6 bg-white dark:bg-surface-900">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                Silmeyi Onayla
              </h2>
              <button
                onClick={() => {
                  setDeleteDialogVisible(false)
                  setKeywordToDelete(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            {/* Warning Content */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-error-50 dark:bg-error-900/30 border-2 border-error-200 dark:border-error-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <p className="text-surface-700 dark:text-surface-300 mb-1">
                  <span className="font-semibold">"{keywordToDelete?.keyword}"</span> keywordunu silmek istediginizden emin misiniz?
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Bu islem geri alinamaz ve tum iliskili veriler silinecektir.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setDeleteDialogVisible(false)
                  setKeywordToDelete(null)
                }}
                disabled={deleting}
                className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors disabled:opacity-50"
              >
                Iptal
              </button>
              <button
                onClick={confirmDeleteKeyword}
                disabled={deleting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-error-600 dark:bg-error-500 hover:bg-error-700 dark:hover:bg-error-600 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <TrashIcon className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
