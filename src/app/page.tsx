'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { BentoCard, BentoGrid } from '@/components/ui'
import { Badge } from '@/components/ui'
import {
  MapPinIcon,
  ChartBarIcon,
  UsersIcon,
  MegaphoneIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-white to-surface-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-accent-500 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                STRATYON
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Giris Yap
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/register')}>
                Ucretsiz Basla
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <Badge variant="brand" intensity="soft" className="mb-6">
              <SparklesIcon className="w-4 h-4 mr-1" />
              Turkiye'nin Ilk Stratejik Istihbarat Platformu
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-surface-900 dark:text-surface-50 mb-6 leading-tight">
              Veriyi <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Stratejiye</span> Donusturen Guc
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
              GEOINT, AI Strateji, Turkce NLP ve Medya Istihbarati ile Turkiye pazarinda
              rakiplerinizin onune gecin. Gercek zamanli verilerle desteklenen otomatik stratejiler.
            </p>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/dashboard')}
                rightIcon={<ArrowTrendingUpIcon className="w-5 h-5" />}
              >
                Dashboard'a Git
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/geoint')}
                leftIcon={<MapPinIcon className="w-5 h-5" />}
              >
                GEOINT'i Kesfet
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-success-500" />
                <span>Guvenli & Uyumlu</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-brand-500" />
                <span>Gercek Zamanli Veri</span>
              </div>
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5 text-accent-500" />
                <span>81 Il Kapsami</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-surface-50 dark:bg-surface-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in-up animation-delay-100">
              <div className="text-5xl font-bold bg-gradient-to-br from-brand-600 to-brand-700 bg-clip-text text-transparent mb-2">
                81
              </div>
              <p className="text-surface-700 dark:text-surface-300 font-medium">Il Duzeyinde Analiz</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Turkiye genelinde detayli veri</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-200">
              <div className="text-5xl font-bold bg-gradient-to-br from-success-500 to-success-600 bg-clip-text text-transparent mb-2">
                ~970
              </div>
              <p className="text-surface-700 dark:text-surface-300 font-medium">Ilce Bazinda Istihbarat</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Mahalle duzeyinde detay</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-300">
              <div className="text-5xl font-bold bg-gradient-to-br from-accent-500 to-accent-600 bg-clip-text text-transparent mb-2">
                TL299
              </div>
              <p className="text-surface-700 dark:text-surface-300 font-medium">Baslangic Fiyati</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Aylik, kurulum ucreti yok</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="brand" intensity="soft" className="mb-4">
              Ozellikler
            </Badge>
            <h2 className="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              Stratejik Istihbaratin Her Yonu
            </h2>
            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              AI destekli araclarla rakiplerinizin onune gecin, pazar firsatlarini kacirmayin
            </p>
          </div>

          <BentoGrid className="animate-fade-in-up animation-delay-200">
            {/* GEOINT - Large Featured Card */}
            <BentoCard
              variant="gradient"
              span={2}
              rowSpan={2}
              className="bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-800 text-white"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <MapPinIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">GEOINT</h3>
                  <p className="text-white/90 text-lg mb-6">
                    Cografi Istihbarat ile il, ilce, mahalle duzeyinde talep analizi.
                    Interaktif harita ve isi haritasi gorsellestirmesi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/geoint')}
                  >
                    Kesfet
                  </Button>
                  <span className="text-sm text-white/80">81 Il - ~970 Ilce - Gercek Zamanli</span>
                </div>
              </div>
            </BentoCard>

            {/* AI Strateji */}
            <BentoCard variant="elevated" className="hover:border-success-300 dark:hover:border-success-700 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900/50 rounded-xl flex items-center justify-center mb-4">
                <CpuChipIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">AI Strateji</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                90 gunluk otomatik strateji olusturma. AI destekli icerik ve eylem planlari.
              </p>
              <Badge variant="success" size="sm">
                Otomatik
              </Badge>
            </BentoCard>

            {/* Rakip Analizi */}
            <BentoCard variant="elevated" className="hover:border-accent-300 dark:hover:border-accent-700 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/50 rounded-xl flex items-center justify-center mb-4">
                <UsersIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">Rakip Analizi</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                Gercek zamanli rakip takibi, keyword gap analizi, pazar payi gorunurlugu.
              </p>
              <Badge variant="info" size="sm">
                Gercek Zamanli
              </Badge>
            </BentoCard>

            {/* Medya Istihbarati */}
            <BentoCard
              variant="gradient"
              className="bg-gradient-to-br from-warning-400 to-warning-600 dark:from-warning-500 dark:to-warning-700 text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <MegaphoneIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Medya Istihbarati</h3>
              <p className="text-white/90 text-sm mb-4">
                PR firsatlari, AI gorunurluk takibi (ChatGPT, Perplexity, Claude).
              </p>
              <Badge variant="warning" size="sm" className="bg-white/20 text-white border-white/30">
                AI Powered
              </Badge>
            </BentoCard>

            {/* Turkce NLP */}
            <BentoCard variant="elevated" className="hover:border-brand-300 dark:hover:border-brand-700 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-xl flex items-center justify-center mb-4">
                <LightBulbIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">Turkce NLP</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                Gelismis Turkce dogal dil isleme. Sentiment analizi ve trend tespiti.
              </p>
              <Badge variant="brand" size="sm">
                Yerli Teknoloji
              </Badge>
            </BentoCard>

            {/* Keyword Arastirma */}
            <BentoCard variant="elevated" className="hover:border-info-300 dark:hover:border-info-700 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-xl flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">Keyword Arastirma</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                Detayli keyword analizi, zorluk skoru, firsat tespiti, siralama takibi.
              </p>
              <Badge variant="info" size="sm">
                SEO Optimized
              </Badge>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-surface-50 dark:bg-surface-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="brand" intensity="soft" className="mb-4">
              Nasil Calisir
            </Badge>
            <h2 className="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              3 Adimda Stratejinizi Olusturun
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up animation-delay-100">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30 dark:shadow-brand-500/20">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">Veri Topla</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Keyword'lerinizi girin, rakiplerinizi ekleyin. Sistem otomatik olarak
                tum Turkiye'deki talep verilerini analiz eder.
              </p>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-200">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30 dark:shadow-accent-500/20">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">AI Analiz</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Gelismis AI algoritmalari cografi talebi, rakip performansini ve
                pazar firsatlarini analiz eder.
              </p>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-300">
              <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success-500/30 dark:shadow-success-500/20">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">Strateji Uygula</h3>
              <p className="text-surface-600 dark:text-surface-400">
                90 gunluk eylem planiniz hazir. Her gun icin icerik onerileri,
                hedef bolgeler ve metrikler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="brand" intensity="soft" className="mb-4">
              Kullanim Senaryolari
            </Badge>
            <h2 className="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              Kimler Kullaniyor?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard variant="elevated" className="animate-fade-in-up animation-delay-100 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RocketLaunchIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">E-Ticaret & SaaS</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    Hangi sehirlerde talep yuksek? Nereye acilmali, nerede reklam vermeli?
                    GEOINT ile cevaplari bulun.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated" className="animate-fade-in-up animation-delay-200 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ChartBarIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Dijital Ajanslar</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    Musterileriniz icin veri destekli stratejiler olusturun. Rakip analizi,
                    keyword arastirma, medya planlamasi.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated" className="animate-fade-in-up animation-delay-300 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Kurumsal Firmalar</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    Bolgesel pazarlama stratejileri, franchise acilis kararlari,
                    medya butcesi optimizasyonu.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="elevated" className="animate-fade-in-up animation-delay-400 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MegaphoneIcon className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Icerik Yaraticilari</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    AI gorunurluk takibi ile ChatGPT, Claude, Perplexity'de markanizin
                    ne kadar gorunur oldugunu olcun.
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-600 to-accent-600 dark:from-brand-700 dark:to-accent-700 text-white">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in-up">
          <SparklesIcon className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Veriyi Stratejiye Donusturmeye Hazir misiniz?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Ucretsiz denemeyle baslayin. Kredi karti gerekmez.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/register')}
              rightIcon={<RocketLaunchIcon className="w-5 h-5" />}
            >
              Ucretsiz Basla
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => router.push('/dashboard')}
            >
              Demo'yu Incele
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-surface-900 dark:bg-surface-950 text-surface-400">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-accent-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">STRATYON</span>
              </div>
              <p className="text-sm text-surface-500">
                Turkiye'nin ilk stratejik istihbarat platformu
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Urun</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/geoint" className="hover:text-white transition-colors">GEOINT</a></li>
                <li><a href="/strategies" className="hover:text-white transition-colors">AI Strateji</a></li>
                <li><a href="/competitors" className="hover:text-white transition-colors">Rakip Analizi</a></li>
                <li><a href="/media" className="hover:text-white transition-colors">Medya Istihbarati</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Sirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Hakkimizda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Iletisim</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanim Sartlari</a></li>
                <li><a href="#" className="hover:text-white transition-colors">KVKK</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-800 text-center text-sm text-surface-500">
            <p>&copy; 2025 Stratyon. Tum haklari saklidir.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
