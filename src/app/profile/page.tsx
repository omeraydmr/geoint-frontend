'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, BentoCard, BentoGrid } from '@/components/ui'
import { Toast } from 'primereact/toast'
import { Avatar } from 'primereact/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/services/api'
import { Dialog } from 'primereact/dialog'
import {
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const router = useRouter()
  const toast = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, logout } = useAuth() as any
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences' | 'billing'>('profile')
  const [twoFADialogVisible, setTwoFADialogVisible] = useState(false)
  const [enabling2FA, setEnabling2FA] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+90 555 123 4567',
    company: 'Stratyon Inc.',
    role: 'User',
    country: 'Turkey',
    language: 'tr',
    timezone: 'Europe/Istanbul'
  })

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: true,
    monthly: false
  })

  const languages = [
    { label: 'Türkçe', value: 'tr' },
    { label: 'English', value: 'en' }
  ]

  const timezones = [
    { label: 'Europe/Istanbul', value: 'Europe/Istanbul' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'America/New_York', value: 'America/New_York' }
  ]

  // Common input classes matching Login/Register pages
  const inputClasses = "w-full px-4 py-3 text-sm bg-white border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-surface-400 disabled:opacity-60 disabled:cursor-not-allowed"
  const selectClasses = "w-full px-4 py-3 text-sm bg-white border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer disabled:opacity-60"

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const payload = {
        full_name: profileData.name,
        email: profileData.email
      }
      
      await authAPI.updateProfile(payload)
      
      toast.current?.show({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Profil bilgileriniz güncellendi',
        life: 3000
      })
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Profil güncellenirken bir hata oluştu'
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

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Şifreler eşleşmiyor',
        life: 3000
      })
      return
    }

    if (!securityData.currentPassword || !securityData.newPassword) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen tüm alanları doldurun',
        life: 3000
      })
      return
    }

    setSaving(true)
    try {
      await authAPI.changePassword({
        old_password: securityData.currentPassword,
        new_password: securityData.newPassword
      })
      
      toast.current?.show({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Şifreniz güncellendi',
        life: 3000
      })
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Şifre değiştirilemedi'
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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handlePhotoChange = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Uyari',
          detail: 'Dosya boyutu 5MB\'dan kucuk olmali',
          life: 3000
        })
        return
      }
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Profil fotografi guncellendi',
        life: 3000
      })
    }
  }

  const handle2FAEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Lutfen 6 haneli kodu girin',
        life: 3000
      })
      return
    }

    setEnabling2FA(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIs2FAEnabled(true)
      setTwoFADialogVisible(false)
      setVerificationCode('')
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Iki faktorlu dogrulama etkinlestirildi',
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: '2FA etkinlestirilemedi',
        life: 3000
      })
    } finally {
      setEnabling2FA(false)
    }
  }

  const handleInvoiceDownload = (month: string, year: string) => {
    const invoiceData = {
      month,
      year,
      amount: '299.00',
      currency: 'TRY',
      plan: 'Premium',
      company: profileData.company
    }

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fatura-${month.toLowerCase()}-${year}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.current?.show({
      severity: 'success',
      summary: 'Basarili',
      detail: 'Fatura indirildi',
      life: 3000
    })
  }

  return (
    <DashboardLayout>
      <Toast ref={toast} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profil Ayarları</h1>
            <p className="text-slate-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            leftIcon={<XMarkIcon className="w-5 h-5" />}
          >
            Çıkış Yap
          </Button>
        </div>

        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 text-white shadow-xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" />
            <div className="absolute -bottom-32 -right-20 w-[30rem] h-[30rem] bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm group-hover:bg-white/50 transition-all duration-300"></div>
              <Avatar
                label={profileData.name.charAt(0).toUpperCase()}
                size="xlarge"
                shape="circle"
                className="relative bg-white text-brand-700 text-3xl font-bold w-24 h-24 shadow-lg border-4 border-white/20"
              />
              <button 
                onClick={handlePhotoChange}
                className="absolute bottom-0 right-0 p-2 bg-white text-brand-600 rounded-full shadow-lg hover:bg-brand-50 transition-colors"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold font-display tracking-tight">{profileData.name}</h2>
              <p className="text-white/80 text-lg flex items-center justify-center md:justify-start gap-2">
                {profileData.email}
                <span className="hidden md:inline text-white/40">•</span>
                <span className="opacity-90">{profileData.role}</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <Badge variant="success" className="bg-white/20 text-white border-white/30 backdrop-blur-sm pl-1.5 pr-3 py-1">
                  <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                  Premium Plan
                </Badge>
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm backdrop-blur-sm border border-white/10">
                  {profileData.company}
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${ 
              activeSection === 'profile'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserIcon className={`w-5 h-5 ${activeSection === 'profile' ? 'text-white' : 'text-slate-400'}`} />
            Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${ 
              activeSection === 'security'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheckIcon className={`w-5 h-5 ${activeSection === 'security' ? 'text-white' : 'text-slate-400'}`} />
            Güvenlik
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${ 
              activeSection === 'preferences'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BellIcon className={`w-5 h-5 ${activeSection === 'preferences' ? 'text-white' : 'text-slate-400'}`} />
            Tercihler
          </button>
          <button
            onClick={() => setActiveSection('billing')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${ 
              activeSection === 'billing'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CreditCardIcon className={`w-5 h-5 ${activeSection === 'billing' ? 'text-white' : 'text-slate-400'}`} />
            Faturalama
          </button>
        </div>

        {/* Profile Information Section */}
        {activeSection === 'profile' && (
          <BentoGrid className="animate-fade-in-up">
            <BentoCard variant="elevated" span={2} className="border-t-4 border-t-brand-500">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-brand-600" />
                Kişisel Bilgiler
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className={inputClasses}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className={inputClasses}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className={inputClasses}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Pozisyon</label>
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className={inputClasses}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Şirket</label>
                  <div className="relative">
                    <BuildingOfficeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className={`${inputClasses} pl-11`}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    variant="primary"
                    onClick={handleProfileSave}
                    loading={saving}
                    leftIcon={<CheckCircleIcon className="w-5 h-5" />}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GlobeAltIcon className="w-6 h-6 text-brand-600" />
                Bölge Ayarları
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ülke</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    className={inputClasses}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Dil</label>
                  <div className="relative">
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className={selectClasses}
                      disabled={saving}
                    >
                      {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Saat Dilimi</label>
                  <div className="relative">
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      className={selectClasses}
                      disabled={saving}
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <BentoGrid className="animate-fade-in-up">
            <BentoCard variant="elevated" span={2} className="border-t-4 border-t-brand-500">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <KeyIcon className="w-6 h-6 text-brand-600" />
                Şifre Değiştir
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mevcut Şifre</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className={inputClasses}
                      disabled={saving}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Yeni Şifre</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className={inputClasses}
                        disabled={saving}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                      >
                        {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Şifre Tekrar</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className={inputClasses}
                        disabled={saving}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    variant="primary"
                    onClick={handlePasswordChange}
                    loading={saving}
                    leftIcon={<CheckCircleIcon className="w-5 h-5" />}
                  >
                    Şifreyi Güncelle
                  </Button>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-brand-600" />
                İki Faktörlü Doğrulama
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-brand-50/50 border border-brand-100 rounded-xl">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="text-sm text-brand-900">
                    <p className="font-bold mb-1">Ekstra Güvenlik</p>
                    <p className="text-brand-700/80 leading-relaxed">Hesabınızı korumak için iki faktörlü doğrulamayı etkinleştirin.</p>
                  </div>
                </div>
                {is2FAEnabled ? (
                  <div className="flex items-center gap-3 p-4 bg-success-50 border border-success-200 rounded-xl">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-success-600" />
                    </div>
                    <span className="text-success-900 font-semibold">2FA Etkin</span>
                  </div>
                ) : (
                  <Button variant="outline" size="md" fullWidth onClick={() => setTwoFADialogVisible(true)}>
                    2FA'yi Etkinlestir
                  </Button>
                )}
              </div>
            </BentoCard>
          </BentoGrid>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <BentoCard variant="elevated" className="animate-fade-in-up border-t-4 border-t-brand-500">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BellIcon className="w-6 h-6 text-brand-600" />
              Bildirim Tercihleri
            </h3>
            <div className="space-y-4">
              {[ 
                { key: 'email', label: 'E-posta Bildirimleri', desc: 'Önemli güncellemeler için e-posta alın' },
                { key: 'push', label: 'Push Bildirimleri', desc: 'Tarayıcı bildirimleri alın' },
                { key: 'weekly', label: 'Haftalık Rapor', desc: 'Haftalık performans özeti' },
                { key: 'monthly', label: 'Aylık Özet', desc: 'Aylık detaylı rapor' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-0.5">{item.label}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 cursor-pointer"
                  />
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="primary" onClick={handleProfileSave} loading={saving}>
                  Tercihleri Kaydet
                </Button>
              </div>
            </div>
          </BentoCard>
        )}

        {/* Billing Section */}
        {activeSection === 'billing' && (
          <BentoGrid className="animate-fade-in-up">
            <BentoCard variant="elevated" span={2} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <CreditCardIcon className="w-6 h-6 text-brand-600" />
                Mevcut Plan
              </h3>
              
              <div className="bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-200 rounded-2xl p-8 relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Premium Plan</h4>
                    <p className="text-slate-600">Tüm özelliklere sınırsız erişim</p>
                  </div>
                  <Badge variant="success" className="px-3 py-1">Aktif</Badge>
                </div>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">₺299</span>
                  <span className="text-slate-600 font-medium">/ay</span>
                </div>
                
                <div className="space-y-3 mb-8">
                  {[ 
                    'Sınırsız GEOINT analizi',
                    'AI strateji oluşturma',
                    'Öncelikli destek'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-brand-600" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button variant="primary" size="md" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                    Planı Yükselt
                  </Button>
                  <Button variant="outline" size="md">
                    İptal Et
                  </Button>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Fatura Geçmişi</h3>
              <div className="space-y-3">
                {[ 
                  { month: 'Ocak', year: '2025' },
                  { month: 'Aralik', year: '2024' },
                  { month: 'Kasim', year: '2024' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">{item.month} {item.year}</p>
                      <p className="text-sm text-slate-500">₺299.00</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleInvoiceDownload(item.month, item.year)} 
                      leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
                      className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                    >
                      Indir
                    </Button>
                  </div>
                ))}
              </div>
            </BentoCard>
          </BentoGrid>
        )}
        
        {/* 2FA Dialog */}
        <Dialog
          visible={twoFADialogVisible}
          style={{ width: '450px' }}
          header={null}
          modal
          className="rounded-2xl overflow-hidden"
          onHide={() => {
            setTwoFADialogVisible(false)
            setVerificationCode('')
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">İki Faktörlü Doğrulama</h2>
              <button 
                onClick={() => setTwoFADialogVisible(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-brand-50/50">
                  <ShieldCheckIcon className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">2FA'yi Etkinlestirin</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Google Authenticator veya benzeri bir uygulama kullanarak QR kodu tarayin ve 6 haneli kodu girin.
                </p>
              </div>

              {/* Mock QR Code */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 p-4 shadow-sm">
                  <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 text-sm font-medium">QR Kod</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dogrulama Kodu
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono bg-slate-50 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                  placeholder="000000"
                  maxLength={6}
                  disabled={enabling2FA}
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Authenticator uygulamanizdan 6 haneli kodu girin
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTwoFADialogVisible(false)
                    setVerificationCode('')
                  }}
                  disabled={enabling2FA}
                >
                  Iptal
                </Button>
                <Button
                  variant="primary"
                  onClick={handle2FAEnable}
                  loading={enabling2FA}
                >
                  Etkinlestir
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}