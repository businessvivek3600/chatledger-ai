export type ThemePreset =
  | 'classic-navy'
  | 'executive-blue'
  | 'slate-pro'
  | 'graphite-minimal'
  | 'soft-neutral';

export type DensityMode = 'compact' | 'comfortable';

export interface ThemeConfig {
  preset: ThemePreset;
  mode: 'light' | 'dark';
  density: DensityMode;
  accentColor: string;
  sidebarStyle: 'white' | 'navy' | 'slate';
  borderRadius: 'sm' | 'md' | 'lg' | 'xl';
  borderIntensity: 'subtle' | 'standard' | 'high';
}

export const THEME_PRESETS: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    primaryNavy: string;
    primaryBlue: string;
    background: string;
    surface: string;
    sidebarBg: string;
    border: string;
    accent: string;
  }
> = {
  'classic-navy': {
    name: 'Classic Navy (Default)',
    description: 'White background, structured navy navigation, restrained blue accents.',
    primaryNavy: '#243B5A',
    primaryBlue: '#356AE6',
    background: '#F7F8FA',
    surface: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    border: '#E6EAF0',
    accent: '#356AE6',
  },
  'executive-blue': {
    name: 'Executive Blue',
    description: 'Cool crisp white, elegant business blue, balanced neutral grey.',
    primaryNavy: '#1E3A5F',
    primaryBlue: '#2563EB',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    sidebarBg: '#F1F5F9',
    border: '#E2E8F0',
    accent: '#2563EB',
  },
  'slate-pro': {
    name: 'Slate Professional',
    description: 'White scaffold, slate grey hierarchy, muted steel blue accents.',
    primaryNavy: '#334155',
    primaryBlue: '#0284C7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#0284C7',
  },
  'graphite-minimal': {
    name: 'Graphite Minimal',
    description: 'White-first minimalism, charcoal typography, restrained micro-accents.',
    primaryNavy: '#18181B',
    primaryBlue: '#3B82F6',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    border: '#E4E4E7',
    accent: '#3B82F6',
  },
  'soft-neutral': {
    name: 'Soft Neutral',
    description: 'Warm off-white, muted warm greys, understated navy elements.',
    primaryNavy: '#292524',
    primaryBlue: '#4F46E5',
    background: '#F5F5F4',
    surface: '#FFFFFF',
    sidebarBg: '#FAFAF9',
    border: '#E7E5E4',
    accent: '#4F46E5',
  },
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  preset: 'classic-navy',
  mode: 'light',
  density: 'comfortable',
  accentColor: '#356AE6',
  sidebarStyle: 'white',
  borderRadius: 'xl',
  borderIntensity: 'subtle',
};
