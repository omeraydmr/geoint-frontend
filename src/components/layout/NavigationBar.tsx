'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface NavigationBarProps {
  brandName?: string
  brandLogo?: React.ReactNode
  navItems?: NavItem[]
  userMenu?: {
    name: string
    email?: string
    avatar?: string
    menuItems: {
      label: string
      href?: string
      onClick?: () => void
      icon?: React.ReactNode
      divider?: boolean
    }[]
  }
  className?: string
}

export function NavigationBar({
  brandName = 'STRATYON',
  brandLogo,
  navItems = [],
  userMenu,
  className,
}: NavigationBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <nav className={cn('bg-white border-b border-slate-200 sticky top-0 z-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand + Nav Items */}
          <div className="flex">
            {/* Brand */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 focus:outline-none"
              >
                {brandLogo || (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                )}
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {brandName}
                </span>
              </button>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all relative',
                    {
                      'text-primary-600 bg-primary-50': isActive(item.href),
                      'text-slate-600 hover:text-slate-900 hover:bg-slate-50': !isActive(item.href),
                    }
                  )}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: User Menu + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Notification Bell (Optional) */}
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User Menu */}
            {userMenu && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all"
                >
                  {userMenu.avatar ? (
                    <img src={userMenu.avatar} alt={userMenu.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {userMenu.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-slate-900">{userMenu.name}</div>
                    {userMenu.email && <div className="text-xs text-slate-500">{userMenu.email}</div>}
                  </div>
                  <svg
                    className={cn('w-4 h-4 text-slate-400 transition-transform', {
                      'rotate-180': userMenuOpen,
                    })}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-slate-200 z-20 animate-scale-in">
                      <div className="py-2">
                        {userMenu.menuItems.map((item, index) => (
                          <React.Fragment key={index}>
                            {item.divider ? (
                              <div className="my-2 border-t border-slate-200"></div>
                            ) : (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false)
                                  if (item.onClick) {
                                    item.onClick()
                                  } else if (item.href) {
                                    router.push(item.href)
                                  }
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                {item.icon && <span className="text-slate-400">{item.icon}</span>}
                                {item.label}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  setMobileMenuOpen(false)
                }}
                className={cn(
                  'w-full flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all',
                  {
                    'text-primary-600 bg-primary-50': isActive(item.href),
                    'text-slate-600 hover:text-slate-900 hover:bg-slate-50': !isActive(item.href),
                  }
                )}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
