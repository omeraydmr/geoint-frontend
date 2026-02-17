// ─── Color System ───

export type BaseColorVariant = 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type ColorVariant = BaseColorVariant | 'primary' | 'secondary' | 'danger'
export type ColorIntensity = 'subtle' | 'soft' | 'strong'

const variantAliases: Record<string, BaseColorVariant> = {
  primary: 'brand',
  secondary: 'neutral',
  danger: 'error',
  default: 'neutral',
}

export function normalizeVariant(variant: ColorVariant): BaseColorVariant {
  return variantAliases[variant] || (variant as BaseColorVariant)
}

const colorClassMap: Record<BaseColorVariant, Record<ColorIntensity, string>> = {
  brand: {
    subtle: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
    soft: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
    strong: 'bg-brand-600 text-white dark:bg-brand-500',
  },
  accent: {
    subtle: 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300',
    soft: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    strong: 'bg-accent-600 text-white dark:bg-accent-500',
  },
  success: {
    subtle: 'bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300',
    soft: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    strong: 'bg-success-600 text-white dark:bg-success-500',
  },
  warning: {
    subtle: 'bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
    soft: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    strong: 'bg-warning-600 text-white dark:bg-warning-500',
  },
  error: {
    subtle: 'bg-error-50 text-error-700 dark:bg-error-950 dark:text-error-300',
    soft: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
    strong: 'bg-error-600 text-white dark:bg-error-500',
  },
  info: {
    subtle: 'bg-info-50 text-info-700 dark:bg-info-950 dark:text-info-300',
    soft: 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200',
    strong: 'bg-info-600 text-white dark:bg-info-500',
  },
  neutral: {
    subtle: 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    soft: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    strong: 'bg-slate-600 text-white dark:bg-slate-500',
  },
}

export function getColorClasses(variant: ColorVariant, intensity: ColorIntensity = 'subtle'): string {
  const normalized = normalizeVariant(variant)
  return colorClassMap[normalized]?.[intensity] || colorClassMap.neutral[intensity]
}

const iconBgClassMap: Record<BaseColorVariant, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-950 dark:text-accent-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-950 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-950 dark:text-warning-400',
  error: 'bg-error-50 text-error-600 dark:bg-error-950 dark:text-error-400',
  info: 'bg-info-50 text-info-600 dark:bg-info-950 dark:text-info-400',
  neutral: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
}

export function getIconBgClasses(variant: ColorVariant): string {
  const normalized = normalizeVariant(variant)
  return iconBgClassMap[normalized] || iconBgClassMap.neutral
}

// ─── Icon System ───

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const iconSizes: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

export type IconName =
  | 'home'
  | 'search'
  | 'plus'
  | 'minus'
  | 'check'
  | 'x'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'trending-up'
  | 'trending-down'
  | 'settings'
  | 'user'
  | 'users'
  | 'bell'
  | 'mail'
  | 'calendar'
  | 'clock'
  | 'star'
  | 'heart'
  | 'filter'
  | 'sort'
  | 'download'
  | 'upload'
  | 'trash'
  | 'edit'
  | 'eye'
  | 'eye-off'
  | 'copy'
  | 'link'
  | 'external-link'
  | 'refresh'
  | 'loading'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'map'
  | 'globe'
  | 'chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'activity'
  | 'layers'
  | 'target'
  | 'zap'
  | 'shield'
  | 'lock'
  | 'unlock'
  | 'key'
  | 'database'
  | 'server'
  | 'code'
  | 'terminal'
  | 'folder'
  | 'file'
  | 'image'
  | 'menu'
  | 'more-horizontal'
  | 'more-vertical'
  | 'log-out'
  | 'log-in'

export const iconPaths: Record<IconName, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  plus: 'M12 4v16m8-8H4',
  minus: 'M20 12H4',
  check: 'M5 13l4 4L19 7',
  x: 'M6 18L18 6M6 6l12 12',
  'chevron-left': 'M15 19l-7-7 7-7',
  'chevron-right': 'M9 5l7 7-7 7',
  'chevron-up': 'M5 15l7-7 7 7',
  'chevron-down': 'M19 9l-7 7-7-7',
  'arrow-left': 'M10 19l-7-7m0 0l7-7m-7 7h18',
  'arrow-right': 'M14 5l7 7m0 0l-7 7m7-7H3',
  'arrow-up': 'M5 10l7-7m0 0l7 7m-7-7v18',
  'arrow-down': 'M19 14l-7 7m0 0l-7-7m7 7V3',
  'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'trending-down': 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  filter: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
  sort: 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  'eye-off': 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
  copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  'external-link': 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  loading: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  chart: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
  'bar-chart': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'pie-chart': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  layers: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  target: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  unlock: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
  key: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  server: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  terminal: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  file: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  'more-horizontal': 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z',
  'more-vertical': 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
  'log-out': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  'log-in': 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
}
