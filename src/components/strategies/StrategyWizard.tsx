import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Chips } from 'primereact/chips'
import { Button, Badge } from '@/components/ui'
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { strategyAPI } from '@/services/api'

type WizardStep = 'basics' | 'keywords' | 'budget' | 'confirm'

interface StrategyWizardProps {
  visible: boolean
  onHide: () => void
  onSuccess: (newStrategy: any) => void
  toast: any
}

export default function StrategyWizard({ visible, onHide, onSuccess, toast }: StrategyWizardProps) {
  const [step, setStep] = useState<WizardStep>('basics')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    primary_goal: '',
    target_keywords: [] as string[],
    total_budget: null as number | null
  })

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (visible) {
      setStep('basics')
      setFormData({ name: '', primary_goal: '', target_keywords: [], total_budget: null })
    }
  }, [visible])

  const steps: { id: WizardStep; label: string; icon: any }[] = [
    { id: 'basics', label: 'Basics', icon: LightBulbIcon },
    { id: 'keywords', label: 'Keywords', icon: ChartBarIcon },
    { id: 'budget', label: 'Budget', icon: CurrencyDollarIcon },
    { id: 'confirm', label: 'Confirm', icon: CheckCircleIcon },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  const canProceed = () => {
    switch (step) {
      case 'basics': return !!formData.name.trim() && !!formData.primary_goal.trim()
      default: return true
    }
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.primary_goal.trim()) return

    setLoading(true)
    try {
      const newStrategy = await strategyAPI.create({
        name: formData.name,
        primary_goal: formData.primary_goal,
        target_keywords: formData.target_keywords,
        total_budget: formData.total_budget
      })
      onSuccess(newStrategy)
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to generate strategy'
      toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const renderStepper = () => (
    <div className="flex items-center justify-between mb-8 px-2 relative">
      {/* Background Line */}
      <div className="absolute top-5 left-0 w-full px-8 flex items-center justify-center -z-0">
         <div className="w-full h-[2px] bg-surface-200 rounded-full"></div>
      </div>
      
      {steps.map((s, index) => {
        const isActive = s.id === step
        const isCompleted = currentStepIndex > index
        const Icon = s.icon

        return (
          <div key={s.id} className="flex flex-col items-center relative z-10 bg-white px-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                ${isActive ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30 scale-110' : 
                  isCompleted ? 'bg-success-500 border-success-500 text-white' : 
                  'bg-surface-0 border-surface-200 text-surface-400'}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors duration-300 
              ${isActive ? 'text-brand-700' : isCompleted ? 'text-success-600' : 'text-surface-400'}`}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )

  const renderContent = () => {
    switch (step) {
      case 'basics':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-surface-50 p-6 rounded-2xl border border-surface-100 text-center">
              <h3 className="text-lg font-bold text-surface-900 mb-2">Strategy Fundamentals</h3>
              <p className="text-surface-500 text-sm">Define the core identity and primary objective of your marketing strategy.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">Strategy Name</label>
                <InputText
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all bg-surface-0"
                  placeholder="e.g. Q1 2026 Growth Plan"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">Primary Goal</label>
                <InputTextarea
                  value={formData.primary_goal}
                  onChange={(e) => setFormData({ ...formData, primary_goal: e.target.value })}
                  className="w-full p-3 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all bg-surface-0"
                  rows={4}
                  placeholder="Describe what you want to achieve (e.g. Increase organic traffic by 50%...)"
                />
              </div>
            </div>
          </div>
        )
      case 'keywords':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex gap-3">
              <SparklesIcon className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-brand-900">
                <p className="font-semibold">AI Tip</p>
                <p className="opacity-90">Adding specific keywords helps our AI tailor the content strategy to your niche.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1.5">Target Keywords</label>
              <Chips
                value={formData.target_keywords}
                onChange={(e) => setFormData({ ...formData, target_keywords: e.value || [] })}
                className="w-full"
                pt={{
                  container: { className: 'w-full p-2 rounded-xl border-surface-200 hover:border-brand-400 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 bg-surface-0' },
                  token: { className: 'bg-brand-100 text-brand-700 rounded-lg' }
                }}
                placeholder="Type and press Enter"
              />
            </div>
          </div>
        )
      case 'budget':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-surface-900">Budget Allocation</h3>
              <p className="text-surface-500 text-sm">Set your total budget for the 90-day period.</p>
            </div>

            <div className="max-w-xs mx-auto">
              <label className="block text-sm font-semibold text-surface-700 mb-1.5 text-center">Total Budget (TRY)</label>
              <InputNumber
                value={formData.total_budget}
                onValueChange={(e) => setFormData({ ...formData, total_budget: e.value ?? null })}
                mode="currency"
                currency="TRY"
                locale="tr-TR"
                className="w-full"
                inputClassName="w-full p-3 text-center text-lg font-bold text-surface-900 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-surface-0"
                placeholder="₺0.00"
              />
            </div>
          </div>
        )
      case 'confirm':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200 space-y-4">
              <div className="flex justify-between items-start border-b border-surface-200 pb-4">
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Strategy Name</p>
                  <h4 className="text-lg font-bold text-surface-900 mt-1">{formData.name}</h4>
                </div>
                {formData.total_budget && (
                  <Badge variant="success" size="lg">
                    {formData.total_budget.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </Badge>
                )}
              </div>
              
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Primary Goal</p>
                <p className="text-surface-700 text-sm leading-relaxed">{formData.primary_goal}</p>
              </div>

              {formData.target_keywords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.target_keywords.map(k => (
                      <span key={k} className="px-2 py-1 bg-surface-200 text-surface-700 text-xs rounded-md font-medium">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-brand-600 to-accent-600 p-4 rounded-xl text-white shadow-lg shadow-brand-500/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Ready to Generate?</p>
                <p className="text-xs text-white/80">Our AI agents will analyze your inputs and craft a detailed 90-day plan.</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className="w-full max-w-2xl"
      header="Create New Strategy"
      headerClassName="font-display font-bold text-xl text-surface-900 pb-2"
      contentClassName="p-0"
      modal
      draggable={false}
    >
      <div className="p-6">
        {renderStepper()}
        <div className="min-h-[300px]">
          {renderContent()}
        </div>
      </div>

      <div className="p-6 bg-surface-50 border-t border-surface-100 flex justify-between rounded-b-lg">
        {step === 'basics' ? (
          <Button variant="ghost" onClick={onHide} disabled={loading} className="text-surface-500 hover:text-surface-700">
            Cancel
          </Button>
        ) : (
          <Button variant="outline" onClick={handleBack} disabled={loading} leftIcon={<ArrowLeftIcon className="w-4 h-4" />}>
            Back
          </Button>
        )}

        {step === 'confirm' ? (
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            loading={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
            leftIcon={<SparklesIcon className="w-4 h-4" />}
          >
            Generate Strategy
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={handleNext} 
            disabled={!canProceed()}
            rightIcon={<ArrowRightIcon className="w-4 h-4" />}
          >
            Continue
          </Button>
        )}
      </div>
    </Dialog>
  )
}
