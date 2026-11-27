export const TAB_SCREENS = [
  'home',
  'bookings',
  'prescriptions',
  'profile',
] as const;
export type TabScreen = (typeof TAB_SCREENS)[number];

export interface FestivalConfig {
  name: string;
  greeting: string;
  bannerImageUrl: string;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival?: FestivalConfig;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  screen: TabScreen;
}

export interface SectionBackground {
  kind: 'color' | 'gradient' | 'image';
  value: string;
}

export interface SectionConfig {
  id: string;
  type: string;
  background: SectionBackground;
  title?: string;
  columns?: number;
  items: unknown[];
}

export interface LayoutConfig {
  version: number;
  theme: ThemeConfig;
  tabs: TabConfig[];
  sections: SectionConfig[];
}
