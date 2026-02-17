import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Chips } from 'primereact/chips'
import { Button } from '@/components/ui'
import { strategyAPI } from '@/services/api'
import { Strategy } from '@/types/strategy'

interface EditStrategyDialogProps {
  visible: boolean
  onHide: () => void
  onSuccess: (updatedStrategy: any) => void
  strategy: Strategy | null
  toast: any
}

export default function EditStrategyDialog({ visible, onHide, onSuccess, strategy, toast }: EditStrategyDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    primary_goal: '',
    target_keywords: [] as string[],
    total_budget: null as number | null
  })

  useEffect(() => {
    if (visible && strategy) {
      setFormData({
        name: strategy.name,
        primary_goal: strategy.primary_goal,
        target_keywords: strategy.target_keywords || [],
        total_budget: strategy.total_budget || null
      })
    }
  }, [visible, strategy])

  const handleSubmit = async () => {
    if (!strategy || !formData.name.trim() || !formData.primary_goal.trim()) return

    setLoading(true)
    try {
      const updatedStrategy = await strategyAPI.update(strategy.id, {
        name: formData.name,
        primary_goal: formData.primary_goal,
        target_keywords: formData.target_keywords,
        total_budget: formData.total_budget
      })
      onSuccess(updatedStrategy)
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update strategy'
      toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className="w-full max-w-lg"
      header="Edit Strategy"
      headerClassName="font-display font-bold text-xl text-surface-900 pb-2 border-b border-surface-100"
      contentClassName="p-0"
      modal
      draggable={false}
    >
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Strategy Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all bg-surface-0"
            placeholder="e.g. Q1 2026 Growth Plan"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Primary Goal</label>
          <InputTextarea
            value={formData.primary_goal}
            onChange={(e) => setFormData({ ...formData, primary_goal: e.target.value })}
            className="w-full p-3 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all bg-surface-0"
            rows={4}
            placeholder="Describe what you want to achieve..."
          />
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

        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Total Budget</label>
          <InputNumber
            value={formData.total_budget}
            onValueChange={(e) => setFormData({ ...formData, total_budget: e.value ?? null })}
            mode="currency"
            currency="TRY"
            locale="tr-TR"
            className="w-full"
            inputClassName="w-full p-3 rounded-xl border-surface-200 hover:border-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-surface-0"
            placeholder="₺0.00"
          />
        </div>
      </div>

      <div className="p-6 bg-surface-50 border-t border-surface-100 flex justify-end gap-3 rounded-b-lg">
        <Button variant="ghost" onClick={onHide} disabled={loading} className="text-surface-500 hover:text-surface-700">
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          loading={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
        >
          Save Changes
        </Button>
      </div>
    </Dialog>
  )
}
