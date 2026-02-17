'use client'

import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Checkbox } from 'primereact/checkbox'
import { Button } from '@/components/ui'
import { SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface GenerateAIDialogProps {
  visible: boolean
  onHide: () => void
  onGenerate: (options: {
    industry?: string
    target_audience?: string
    regenerate?: boolean
  }) => Promise<void>
  strategyName: string
  hasExistingContent: boolean
  isLoading: boolean
}

export function GenerateAIDialog({
  visible,
  onHide,
  onGenerate,
  strategyName,
  hasExistingContent,
  isLoading
}: GenerateAIDialogProps) {
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [regenerate, setRegenerate] = useState(false)

  const handleSubmit = async () => {
    await onGenerate({
      industry: industry || undefined,
      target_audience: targetAudience || undefined,
      regenerate
    })
  }

  const handleHide = () => {
    if (!isLoading) {
      setIndustry('')
      setTargetAudience('')
      setRegenerate(false)
      onHide()
    }
  }

  return (
    <Dialog
      visible={visible}
      style={{ width: '500px' }}
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Generate AI Content</h2>
            <p className="text-sm text-slate-600">{strategyName}</p>
          </div>
        </div>
      }
      modal
      closable={!isLoading}
      onHide={handleHide}
    >
      <div className="space-y-6">
        {/* Warning for regeneration */}
        {hasExistingContent && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning-800">Existing Content Detected</p>
                <p className="text-sm text-warning-700 mt-1">
                  This strategy already has AI-generated content. Regenerating will replace all existing weeks and tasks.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox
                    inputId="regenerate"
                    checked={regenerate}
                    onChange={(e) => setRegenerate(e.checked || false)}
                    disabled={isLoading}
                  />
                  <label htmlFor="regenerate" className="text-sm font-medium text-warning-800 cursor-pointer">
                    I understand, regenerate anyway
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Industry / Sector
            </label>
            <InputText
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full"
              placeholder="e.g. E-commerce, SaaS, Healthcare"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">
              Helps AI tailor strategies to your specific industry
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Audience
            </label>
            <InputTextarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full"
              rows={3}
              placeholder="e.g. Small business owners aged 25-45 in Turkey looking for digital marketing solutions"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">
              Describe your ideal customer for more personalized recommendations
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">What will be generated:</h4>
          <ul className="space-y-1 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-accent-500">•</span>
              Executive summary and SWOT analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-500">•</span>
              13-week strategic plan with focus areas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-500">•</span>
              Actionable tasks for each week
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-500">•</span>
              KPI targets and budget allocation
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleHide}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={(hasExistingContent && !regenerate) || isLoading}
            leftIcon={<SparklesIcon className="w-4 h-4" />}
            className="bg-gradient-to-r from-accent-600 to-primary-600"
          >
            {isLoading ? 'Generating...' : 'Generate Strategy'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default GenerateAIDialog
