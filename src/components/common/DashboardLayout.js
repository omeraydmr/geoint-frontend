'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import { ThemeToggleCompact } from '@/components/ui/ThemeToggle';
import ChatbotSidebar from '@/components/chatbot/ChatbotSidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isOpen: chatbotOpen, toggleChatbot } = useChatbot();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [geointExpanded, setGeointExpanded] = useState(false);
  const menuRef = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('geointExpanded');
    if (saved !== null) setGeointExpanded(JSON.parse(saved));
    if (pathname.startsWith('/geoint')) setGeointExpanded(true);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem('geointExpanded', JSON.stringify(geointExpanded));
  }, [geointExpanded]);

  if (typeof window !== 'undefined') {
    window.toast = toast.current;
  }

  const geointSubItems = [
    { label: 'Genel Bakis', path: '/geoint/overview', icon: 'chart' },
    { label: 'Isi Haritasi', path: '/geoint/map', icon: 'map' },
    { label: 'Tum Bolgeler', path: '/geoint/regions', icon: 'list' },
    { label: 'Butce Onerileri', path: '/geoint/budget', icon: 'wallet' },
  ];

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'home' },
    { label: 'GEOINT', path: '/geoint', icon: 'globe', subItems: geointSubItems },
    { label: 'Anahtar Kelimeler', path: '/keywords', icon: 'key' },
    { label: 'Stratejiler', path: '/strategies', icon: 'trending' },
    { label: 'Rakipler', path: '/competitors', icon: 'users' },
  ];

  const userMenuItems = [
    { label: 'Profil', icon: 'pi pi-user', command: () => router.push('/profile') },
    { label: 'Ayarlar', icon: 'pi pi-cog', command: () => router.push('/settings') },
    { separator: true },
    { label: 'Cikis Yap', icon: 'pi pi-sign-out', command: logout }
  ];

  const icons = {
    home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    key: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
    trending: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    chart: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    map: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
    list: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    wallet: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    chevron: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  };

  const NavItem = ({ item, isSub = false }) => {
    const isActive = pathname === item.path || (item.subItems && pathname.startsWith('/geoint/'));
    const isSubActive = pathname === item.path;

    if (item.subItems) {
      return (
        <div>
          <button
            onClick={() => setGeointExpanded(!geointExpanded)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-brand-500/20 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {icons[item.icon]}
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <svg className={`w-4 h-4 transition-transform duration-200 ${geointExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-200 ${geointExpanded ? 'max-h-48 mt-1' : 'max-h-0'}`}>
            <div className="pl-4 space-y-1">
              {item.subItems.map((sub, i) => (
                <NavItem key={i} item={sub} isSub />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          router.push(item.path);
          setMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-${isSub ? '2.5' : '3'} rounded-xl transition-all duration-200 ${
          (isSub ? isSubActive : isActive)
            ? isSub ? 'bg-white/10 text-white' : 'bg-brand-500/20 text-white'
            : 'text-white/60 hover:bg-white/5 hover:text-white'
        }`}
      >
        {icons[item.icon]}
        <span className={`font-medium ${isSub ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors">
      <Toast ref={toast} />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
            STRATYON
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggleCompact />
            <button onClick={toggleChatbot} className="p-2 -mr-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-brand-950 to-surface-900 animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-white">STRATYON</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white/60 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item, i) => <NavItem key={i} item={item} />)}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar - Always dark */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-brand-950 to-surface-900">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            <span className="text-xl font-bold text-white tracking-tight">STRATYON</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item, i) => <NavItem key={i} item={item} />)}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div
              onClick={(e) => menuRef.current?.toggle(e)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-medium text-sm">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.full_name || 'Kullanici'}</div>
                <div className="text-xs text-white/50 truncate">{user?.email}</div>
              </div>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <Menu model={userMenuItems} popup ref={menuRef} className="mt-2" />
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 lg:ml-64 min-h-screen transition-all duration-300 ${chatbotOpen ? 'mr-[360px]' : ''}`}>
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 sticky top-0 z-30">
            <div />
            <div className="flex items-center gap-3">
              <ThemeToggleCompact />
              <button
                onClick={toggleChatbot}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  chatbotOpen
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">AI Assistant</span>
                <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-white/20 dark:bg-white/10 rounded">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">
            {children}
          </div>
        </main>

        {/* Chatbot */}
        <ChatbotSidebar />
      </div>

      {/* Mobile FAB */}
      {!chatbotOpen && (
        <button
          onClick={toggleChatbot}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center z-40 active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
}
