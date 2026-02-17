'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toast } from 'primereact/toast'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const toast = useRef<any>(null)
  const { register } = useAuth() as any
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Lutfen tum alanlari doldurun',
        life: 3000
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Sifreler eslesmiyor',
        life: 3000
      })
      return
    }

    if (formData.password.length < 8) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Sifre en az 8 karakter olmalidir',
        life: 3000
      })
      return
    }

    if (!acceptedTerms) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Uyari',
        detail: 'Kullanim sartlarini kabul etmelisiniz',
        life: 3000
      })
      return
    }

    setLoading(true)
    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
      })
      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Hesabiniz olusturuldu',
        life: 2000
      })
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: error.message || 'Kayit islemi basarisiz',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <Toast ref={toast} />

      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">STRATYON</span>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-premium border border-surface-200 dark:border-surface-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2 font-display">Hesap Olusturun</h2>
              <p className="text-surface-500 dark:text-surface-400">Ucretsiz denemeyle baslayin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Ad Soyad
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ahmet Yilmaz"
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500 text-surface-900 dark:text-surface-100"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500 text-surface-900 dark:text-surface-100"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Sifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="En az 8 karakter"
                    className="w-full px-4 py-3 pr-12 text-sm bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500 text-surface-900 dark:text-surface-100"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Sifre Tekrar
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Sifrenizi tekrar girin"
                    className="w-full px-4 py-3 pr-12 text-sm bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-surface-400 dark:placeholder:text-surface-500 text-surface-900 dark:text-surface-100"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start pt-2">
                <label className="relative flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-5 h-5 border-2 border-surface-300 dark:border-surface-600 rounded-md peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-all flex items-center justify-center flex-shrink-0 mt-0.5">
                    {acceptedTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-3 text-sm text-surface-600 dark:text-surface-400 leading-tight">
                    <Link href="/terms" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                      Kullanim Sartlari
                    </Link>{' '}
                    ve{' '}
                    <Link href="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                      Gizlilik Politikasi
                    </Link>
                    'ni okudum ve kabul ediyorum
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold rounded-xl hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Ucretsiz Basla
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                Zaten hesabiniz var mi?{' '}
                <Link
                  href="/login"
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
                >
                  Giris Yapin
                </Link>
              </p>
            </div>

            {/* Social Registration */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-200 dark:border-surface-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-surface-900 text-surface-400 dark:text-surface-500">veya</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {}}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-6">
            Kayit olarak platformumuzu 14 gun ucretsiz deneyebilirsiniz.
            <br />
            Kredi karti gerekmez.
          </p>
        </div>
      </div>

      {/* Right Side - Features Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-accent-700 to-brand-700 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-3xl font-bold tracking-tight">STRATYON</span>
          </div>

          {/* Content */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-semibold text-sm">14 Gun Ucretsiz Deneme</span>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight font-display">
              Stratejik Istihbarat ile Buyuyun
            </h1>
            <p className="text-white/80 text-lg mb-10">
              Binlerce sirketin guvendigi platform ile veri destekli kararlar alin,
              rakiplerinizin onune gecin.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                '81 il ve ~970 ilce duzeyinde GEOINT analizi',
                'AI destekli 90 gunluk strateji olusturma',
                'Gercek zamanli rakip takibi ve analiz',
                'Medya izleme ve PR firsatlari',
                'AI gorunurluk takibi (ChatGPT, Claude, vb.)'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">TL299</div>
                <div className="text-white/70 text-sm">Baslangic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-white/70 text-sm">Destek</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-white/70 text-sm">Guvenli</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Sifreleme • KVKK Uyumlu • Kurulum Ucreti Yok</span>
          </div>
        </div>
      </div>
    </div>
  )
}
