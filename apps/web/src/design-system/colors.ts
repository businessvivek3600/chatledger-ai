export const colors = {
  // Official White-First Enterprise SaaS Palette
  background: '#F7F8FA', // Primary Background
  surface: '#FFFFFF', // Main Surface
  sidebar: '#FFFFFF', // Sidebar Background
  subtleSurface: '#F2F4F7', // Subtle Surface
  border: '#E6EAF0', // Subtle 1px Border
  borderDark: '#D0D5DD',

  // Core Brand & Accents
  primaryNavy: '#243B5A', // Primary Navy
  primaryBlue: '#356AE6', // Primary Blue
  secondaryBlue: '#6D8ED8', // Secondary Blue

  // Typography Tokens
  textPrimary: '#202938', // Main Text
  textSecondary: '#707B8B', // Secondary Text
  textMuted: '#98A2B3', // Muted Text

  // Semantic Status Tokens
  success: '#23865B', // Verified / Delivered / Paid
  warning: '#B98535', // Follow-up Due / Pending
  danger: '#D64B50', // Escalation / Unresolved
  info: '#4775B8', // System Insights

  // Dark Mode Counterparts (OLED-friendly high-contrast)
  dark: {
    background: '#0B0F19',
    surface: '#111827',
    sidebar: '#0F172A',
    subtleSurface: '#1E293B',
    border: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primaryBlue: '#4F84F8',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
  },
} as const;

export type ColorToken = keyof typeof colors;
