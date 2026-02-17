'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Toast } from 'primereact/toast'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  LightBulbIcon,
  PlusIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, StatsCard } from '@/components/ui'
import StrategyWizard from '@/components/strategies/StrategyWizard'
import EditStrategyDialog from '@/components/strategies/EditStrategyDialog'
import { strategyAPI } from '@/services/api'
import { Strategy } from '@/types/strategy'

export default function StrategiesPage() {
  const router = useRouter()
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const [editDialogVisible, setEditDialogVisible] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const toast = useRef<any>(null)

  // Fetch strategies
  const { data: strategies = [], isLoading, mutate } = useSWR<Strategy[]>(
    '/strategies',
    strategyAPI.getAll,
    { revalidateOnFocus: false }
  )

  // Stats calculation
  const activeStrategies = strategies.filter(s => s.status === 'ACTIVE').length
  const totalBudget = strategies.reduce((sum, s) => sum + (s.total_budget || 0), 0)
  const budgetSpent = strategies.reduce((sum, s) => sum + (s.budget_spent || 0), 0)
  const avgCompletion = strategies.length > 0
    ? Math.round(strategies.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / strategies.length)
    : 0

  // Actions
  const handleGenerateAI = async (strategy: Strategy) => {
    setGeneratingId(strategy.id)
    try {
      await strategyAPI.generateAI(strategy.id, {})
      mutate()
      toast.current?.show({ severity: 'success', summary: 'Basarili', detail: 'AI icerik basariyla olusturuldu!', life: 5000 })
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'AI icerik olusturulamadi', life: 3000 })
    } finally {
      setGeneratingId(null)
    }
  }

  const deleteStrategy = (strategy: Strategy) => {
    confirmDialog({
      message: `"${strategy.name}" stratejisini silmek istediginizden emin misiniz?`,
      header: 'Silme Onayi',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await strategyAPI.delete(strategy.id)
          mutate(strategies.filter(s => s.id !== strategy.id), false)
          toast.current?.show({ severity: 'success', summary: 'Basarili', detail: 'Strateji silindi', life: 3000 })
        } catch (error) {
          toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Strateji silinemedi', life: 3000 })
        }
      }
    })
  }

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'TL0'
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'ACTIVE': return { label: 'Aktif', variant: 'success' as const, icon: PlayIcon }
      case 'COMPLETED': return { label: 'Tamamlandi', variant: 'info' as const, icon: CheckCircleIcon }
      case 'PAUSED': return { label: 'Durduruldu', variant: 'warning' as const, icon: PauseIcon }
      case 'ARCHIVED': return { label: 'Arsivlendi', variant: 'error' as const, icon: ClockIcon }
      default: return { label: 'Taslak', variant: 'neutral' as const, icon: ClockIcon }
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return 'from-success-500 to-success-400'
    if (percentage >= 40) return 'from-warning-500 to-warning-400'
    return 'from-brand-500 to-brand-400'
  }

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="space-y-8 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Strateji Merkezi</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">AI destekli pazarlama stratejilerinizi yonetin.</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setCreateDialogVisible(true)}
          >
            Yeni Strateji
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Toplam Strateji"
            value={strategies.length.toString()}
            variant="brand"
            icon={<RocketLaunchIcon className="w-5 h-5" />}
            subtitle="Tum zamanlar"
          />
          <StatsCard
            title="Aktif Kampanya"
            value={activeStrategies.toString()}
            variant="success"
            icon={<CheckCircleIcon className="w-5 h-5" />}
            subtitle="Suanda calisan"
          />
          <StatsCard
            title="Toplam Butce"
            value={formatCurrency(totalBudget)}
            variant="accent"
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            subtitle={`${formatCurrency(budgetSpent)} kullanildi`}
          />
          <StatsCard
            title="Ort. Tamamlanma"
            value={`%${avgCompletion}`}
            variant={avgCompletion > 50 ? 'success' : 'warning'}
            icon={<ChartBarIcon className="w-5 h-5" />}
            subtitle="Performans takibi"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 dark:border-brand-400 mb-4" />
            <p className="text-surface-500 dark:text-surface-400 font-medium">Stratejiler yukleniyor...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && strategies.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LightBulbIcon className="w-10 h-10 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">Henuz strateji yok</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md mx-auto">
              AI ile ilk kapsamli pazarlama stratejinizi olusturun.
            </p>
            <Button
              variant="primary"
              leftIcon={<SparklesIcon className="w-5 h-5" />}
              onClick={() => setCreateDialogVisible(true)}
            >
              Strateji Olustur
            </Button>
          </div>
        )}

        {/* Strategy Cards Grid */}
        {!isLoading && strategies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => {
              const statusConfig = getStatusConfig(strategy.status)
              const completion = strategy.completion_percentage || 0

              return (
                <div
                  key={strategy.id}
                  className="group bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 hover:shadow-xl hover:shadow-surface-200/50 dark:hover:shadow-black/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header with Status Indicator */}
                  <div className="relative px-6 pt-6 pb-4">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {strategy.generated_by_model && (
                        <Badge variant="brand" size="sm" className="flex items-center gap-1">
                          <SparklesIcon className="w-3 h-3" />
                          AI
                        </Badge>
                      )}
                      <Badge variant={statusConfig.variant} size="sm" dot>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Strategy Icon & Title */}
                    <div className="flex items-start gap-4 pr-24">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        strategy.status === 'ACTIVE'
                          ? 'bg-success-100 dark:bg-success-900/30'
                          : 'bg-brand-100 dark:bg-brand-900/30'
                      }`}>
                        <RocketLaunchIcon className={`w-6 h-6 ${
                          strategy.status === 'ACTIVE'
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-brand-600 dark:text-brand-400'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {strategy.name}
                        </h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1 mt-0.5">
                          {strategy.primary_goal || 'Hedef belirlenmedi'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-surface-500 dark:text-surface-400 font-medium">Ilerleme</span>
                      <span className="font-semibold text-surface-700 dark:text-surface-300">%{completion}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(completion)} rounded-full transition-all duration-700`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-px bg-surface-100 dark:bg-surface-800 mx-6 rounded-xl overflow-hidden mb-4">
                    <div className="bg-white dark:bg-surface-900 p-3">
                      <div className="flex items-center gap-1.5 text-surface-400 dark:text-surface-500 mb-1">
                        <CurrencyDollarIcon className="w-3.5 h-3.5" />
                        <span className="text-2xs font-medium uppercase tracking-wider">Butce</span>
                      </div>
                      <div className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                        {formatCurrency(strategy.total_budget)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-surface-900 p-3">
                      <div className="flex items-center gap-1.5 text-surface-400 dark:text-surface-500 mb-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="text-2xs font-medium uppercase tracking-wider">Baslangic</span>
                      </div>
                      <div className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                        {formatDate(strategy.start_date)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 bg-surface-50 dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-surface-700 dark:text-surface-300 hover:text-brand-700 dark:hover:text-brand-400"
                        leftIcon={<EyeIcon className="w-4 h-4" />}
                        onClick={() => router.push(`/strategies/${strategy.id}`)}
                      >
                        Detay
                      </Button>

                      {!strategy.generated_by_model && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/50 px-3"
                          onClick={() => handleGenerateAI(strategy)}
                          loading={generatingId === strategy.id}
                          disabled={generatingId !== null}
                          title="AI ile Icerik Olustur"
                        >
                          <SparklesIcon className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface-100 dark:hover:bg-surface-800 px-2.5"
                        onClick={() => {
                          setSelectedStrategy(strategy)
                          setEditDialogVisible(true)
                        }}
                        title="Duzenle"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-surface-400 dark:text-surface-500 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 px-2.5"
                        onClick={() => deleteStrategy(strategy)}
                        title="Sil"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Dialogs */}
        <StrategyWizard
          visible={createDialogVisible}
          onHide={() => setCreateDialogVisible(false)}
          onSuccess={(newStrategy) => {
            mutate([...strategies, newStrategy], false)
            setCreateDialogVisible(false)
            toast.current?.show({ severity: 'success', summary: 'Basarili', detail: 'Strateji basariyla olusturuldu!', life: 5000 })
          }}
          toast={toast}
        />

        <EditStrategyDialog
          visible={editDialogVisible}
          onHide={() => setEditDialogVisible(false)}
          strategy={selectedStrategy}
          onSuccess={(updatedStrategy) => {
            mutate(strategies.map(s => s.id === updatedStrategy.id ? updatedStrategy : s), false)
            setEditDialogVisible(false)
            toast.current?.show({ severity: 'success', summary: 'Basarili', detail: 'Strateji guncellendi!', life: 3000 })
          }}
          toast={toast}
        />
      </div>
    </DashboardLayout>
  )
}
