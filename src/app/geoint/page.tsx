'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GEOINTPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Preserve query params when redirecting
    const keyword = searchParams.get('keyword')
    const redirectUrl = keyword ? `/geoint/overview?keyword=${keyword}` : '/geoint/overview'
    router.replace(redirectUrl)
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500">Yonlendiriliyor...</p>
      </div>
    </div>
  )
}
