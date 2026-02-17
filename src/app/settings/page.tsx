'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, BentoCard, BentoGrid } from '@/components/ui'
import { ThemeSelector } from '@/components/ui/ThemeToggle'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
import { Toast } from 'primereact/toast'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  KeyIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  const router = useRouter()
  const toast = useRef<any>(null)
  const { user } = useAuth() as any
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'appearance' | 'integrations' | 'api'>('general')

  const [generalSettings, setGeneralSettings] = useState({
    language: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    currency: 'TRY'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    monthlyReport: false,
    competitorAlerts: true,
    keywordAlerts: true,
    prOpportunities: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    showAnimations: true,
    sidebarCollapsed: false
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'sk_live_••••••••••••••••',
    webhookUrl: '',
    rateLimit: 1000
  })

  const languages = [
    { label: 'Turkce', value: 'tr' },
    { label: 'English', value: 'en' }
  ]

  const timezones = [
    { label: 'Europe/Istanbul (UTC+3)', value: 'Europe/Istanbul' },
    { label: 'Europe/London (UTC+0)', value: 'Europe/London' },
    { label: 'America/New_York (UTC-5)', value: 'America/New_York' }
  ]

  const dateFormats = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
  ]

  const currencies = [
    { label: 'Turkish Lira (TRY)', value: 'TRY' },
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' }
  ]

  const themes = [
    { label: 'Light Mode', value: 'light' },
    { label: 'Dark Mode', value: 'dark' },
    { label: 'System', value: 'system' }
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Ayarlar kaydedildi',
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Ayarlar kaydedilemedi',
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const regenerateApiKey = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Bilgi',
      detail: 'Yeni API anahtari olusturuldu',
      life: 3000
    })
    setApiSettings({ ...apiSettings, apiKey: 'sk_live_' + Math.random().toString(36).substring(2, 18) })
  }

  const sections = [
    { id: 'general', label: 'Genel Ayarlar', icon: <Cog6ToothIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Bildirimler', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'appearance', label: 'Gorunum', icon: <PaintBrushIcon className="w-5 h-5" /> },
    { id: 'integrations', label: 'Entegrasyonlar', icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: 'api', label: 'API Ayarlari', icon: <KeyIcon className="w-5 h-5" /> }
  ]

  return (
    <DashboardLayout>
      <Toast ref={toast} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">Ayarlar</h1>
            <p className="text-surface-600 dark:text-surface-400">Platform ayarlarinizi ve tercihlerinizi yonetin</p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={saving}
            leftIcon={<CheckCircleIcon className="w-5 h-5" />}
          >
            Degisiklikleri Kaydet
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-2 sticky top-20">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                    }`}
                  >
                    <span className={activeSection === section.id ? 'text-brand-600 dark:text-brand-400' : 'text-surface-400 dark:text-surface-500'}>
                      {section.icon}
                    </span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <BentoCard variant="elevated" className="animate-fade-in-up">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
                  <Cog6ToothIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  Genel Ayarlar
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Dil</label>
                      <Dropdown
                        value={generalSettings.language}
                        options={languages}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Saat Dilimi</label>
                      <Dropdown
                        value={generalSettings.timezone}
                        options={timezones}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Tarih Formati</label>
                      <Dropdown
                        value={generalSettings.dateFormat}
                        options={dateFormats}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Para Birimi</label>
                      <Dropdown
                        value={generalSettings.currency}
                        options={currencies}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.value })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </BentoCard>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <BentoCard variant="elevated" className="animate-fade-in-up">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
                  <BellIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  Bildirim Tercihleri
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">E-posta Bildirimleri</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Onemli guncellemeler icin e-posta alin</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Push Bildirimleri</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Tarayici bildirimleri alin</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Haftalik Ozet</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Haftalik performans raporu</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Rakip Uyarilari</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Rakip degisiklikleri icin aninda bildirim</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.competitorAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, competitorAlerts: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Keyword Uyarilari</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Siralama degisiklikleri icin uyari</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.keywordAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, keywordAlerts: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">PR Firsatlari</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Yeni medya firsatlari icin bildirim</p>
                    </div>
                    <InputSwitch
                      checked={notificationSettings.prOpportunities}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, prOpportunities: e.value })}
                    />
                  </div>
                </div>
              </BentoCard>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <BentoCard variant="elevated" className="animate-fade-in-up">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
                  <PaintBrushIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  Gorunum Ayarlari
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Tema</label>
                    <ThemeSelector />
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">Sistem seceneginde cihazinizin tema tercihine gore otomatik degisir.</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Kompakt Mod</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Daha yogun bir kullanici arayuzu</p>
                    </div>
                    <InputSwitch
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">Animasyonlar</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">Sayfa gecis animasyonlarini goster</p>
                    </div>
                    <InputSwitch
                      checked={appearanceSettings.showAnimations}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showAnimations: e.value })}
                    />
                  </div>
                </div>
              </BentoCard>
            )}

            {/* Integrations Settings */}
            {activeSection === 'integrations' && (
              <BentoCard variant="elevated" className="animate-fade-in-up">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
                  <GlobeAltIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  Entegrasyonlar
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-surface-600 dark:text-surface-400" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100">Google Analytics</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Web sitesi trafik verilerini entegre edin</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Bagla</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-surface-600 dark:text-surface-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100">GitHub</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Kaynak kodu entegrasyonu</p>
                      </div>
                    </div>
                    <Badge variant="success">Bagli</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <DocumentTextIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100">Slack</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Bildirimler icin Slack entegrasyonu</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Bagla</Button>
                  </div>
                </div>
              </BentoCard>
            )}

            {/* API Settings */}
            {activeSection === 'api' && (
              <BentoCard variant="elevated" className="animate-fade-in-up">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  API Ayarlari
                </h3>
                <div className="space-y-6">
                  <div className="bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-warning-900 dark:text-warning-300">
                        <p className="font-semibold mb-1">Guvenlik Uyarisi</p>
                        <p>API anahtarinizi guvenli bir yerde saklayin. Bu anahtar hesabiniza tam erisim saglar.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">API Anahtari</label>
                    <div className="flex gap-2">
                      <InputText
                        value={apiSettings.apiKey}
                        className="flex-1 font-mono"
                        readOnly
                      />
                      <Button variant="outline" size="md" onClick={regenerateApiKey} leftIcon={<ArrowPathIcon className="w-4 h-4" />}>
                        Yenile
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Webhook URL</label>
                    <InputText
                      value={apiSettings.webhookUrl}
                      onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
                      className="w-full"
                      placeholder="https://your-app.com/webhooks/stratyon"
                    />
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Olaylari alacaginiz endpoint URL'si</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">API Dokumantasyonu</label>
                    <Button variant="outline" size="md" leftIcon={<DocumentTextIcon className="w-4 h-4" />}>
                      Dokumantasyonu Gor
                    </Button>
                  </div>
                </div>
              </BentoCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
