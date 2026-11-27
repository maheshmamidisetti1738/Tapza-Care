import {
  FestivalConfig,
  LayoutConfig,
  SectionBackground,
  SectionConfig,
  TAB_SCREENS,
  TabConfig,
  TabScreen,
  ThemeConfig,
} from './types';

const BACKGROUND_KINDS = ['color', 'gradient', 'image'];
const THEME_COLOR_KEYS = [
  'primary',
  'secondary',
  'background',
  'surface',
  'textPrimary',
  'textSecondary',
  'accent',
] as const;

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

type AnyObject = Record<string, unknown>;

export class ConfigError extends Error {}

function isObject(value: unknown): value is AnyObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function parseTheme(raw: unknown): ThemeConfig {
  if (!isObject(raw)) {
    throw new ConfigError('theme is missing');
  }

  const colors = {} as Record<(typeof THEME_COLOR_KEYS)[number], string>;
  for (const key of THEME_COLOR_KEYS) {
    const color = raw[key];
    if (typeof color !== 'string' || !HEX_COLOR.test(color)) {
      throw new ConfigError(`theme.${key} must be a #RRGGBB colour`);
    }
    colors[key] = color;
  }

  return { ...colors, festival: parseFestival(raw.festival) };
}

function parseFestival(raw: unknown): FestivalConfig | undefined {
  if (
    isObject(raw) &&
    isString(raw.name) &&
    isString(raw.greeting) &&
    isString(raw.bannerImageUrl)
  ) {
    return {
      name: raw.name,
      greeting: raw.greeting,
      bannerImageUrl: raw.bannerImageUrl,
    };
  }
  return undefined;
}

function parseTabs(raw: unknown): TabConfig[] {
  if (!Array.isArray(raw)) {
    throw new ConfigError('tabs must be an array');
  }

  const tabs: TabConfig[] = [];
  for (const tab of raw) {
    const alreadyUsed =
      isObject(tab) && tabs.some(item => item.screen === tab.screen);
    if (
      !alreadyUsed &&
      isObject(tab) &&
      isString(tab.id) &&
      isString(tab.label) &&
      isString(tab.icon) &&
      (TAB_SCREENS as readonly unknown[]).includes(tab.screen)
    ) {
      tabs.push({
        id: tab.id,
        label: tab.label,
        icon: tab.icon,
        screen: tab.screen as TabScreen,
      });
    }
  }

  if (tabs.length === 0) {
    throw new ConfigError('config has no valid tabs');
  }
  return tabs;
}

function isValidBackground(kind: string, value: string) {
  const colors = value.split(',').map(color => color.trim());
  switch (kind) {
    case 'color':
      return colors.length === 1 && HEX_COLOR.test(colors[0]);
    case 'gradient':
      return colors.length >= 2 && colors.every(color => HEX_COLOR.test(color));
    default:
      return true;
  }
}

function parseBackground(
  raw: unknown,
  fallbackColor: string,
): SectionBackground {
  if (
    isObject(raw) &&
    isString(raw.value) &&
    BACKGROUND_KINDS.includes(raw.kind as string) &&
    isValidBackground(raw.kind as string, raw.value)
  ) {
    return { kind: raw.kind as SectionBackground['kind'], value: raw.value };
  }
  return { kind: 'color', value: fallbackColor };
}

function parseSections(raw: unknown, theme: ThemeConfig): SectionConfig[] {
  if (!Array.isArray(raw)) {
    throw new ConfigError('sections must be an array');
  }

  const sections: SectionConfig[] = [];
  for (const section of raw) {
    if (
      !isObject(section) ||
      !isString(section.id) ||
      !isString(section.type)
    ) {
      continue;
    }
    sections.push({
      id: section.id,
      type: section.type,
      background: parseBackground(section.background, theme.background),
      title: isString(section.title) ? section.title : undefined,
      columns:
        typeof section.columns === 'number' ? section.columns : undefined,
      items: Array.isArray(section.items) ? section.items : [],
    });
  }
  return sections;
}

export function parseConfig(raw: unknown): LayoutConfig {
  if (!isObject(raw)) {
    throw new ConfigError('config is not an object');
  }
  if (typeof raw.version !== 'number') {
    throw new ConfigError('config.version must be a number');
  }

  const theme = parseTheme(raw.theme);
  return {
    version: raw.version,
    theme,
    tabs: parseTabs(raw.tabs),
    sections: parseSections(raw.sections, theme),
  };
}
