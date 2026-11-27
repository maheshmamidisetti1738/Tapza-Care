import { ThemeConfig } from '../config/types';
import { readableTextColor, withAlpha } from './colorUtils';
import { radius, spacing, statusColors, typography } from './tokens';

export function createTheme(config: ThemeConfig) {
  const shadow = {
    shadowColor: config.textPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  };

  return {
    colors: {
      primary: config.primary,
      secondary: config.secondary,
      background: config.background,
      surface: config.surface,
      textPrimary: config.textPrimary,
      textSecondary: config.textSecondary,
      accent: config.accent,
      onPrimary: readableTextColor(
        config.primary,
        config.surface,
        config.textPrimary,
      ),
      onAccent: readableTextColor(
        config.accent,
        config.surface,
        config.textPrimary,
      ),
      onSecondary: readableTextColor(
        config.secondary,
        config.surface,
        config.textPrimary,
      ),
      border: withAlpha(config.textSecondary, 0.18),
      skeleton: withAlpha(config.textSecondary, 0.18),
      backdrop: withAlpha(config.textPrimary, 0.5),
      success: statusColors.success,
      danger: statusColors.danger,
    },
    spacing,
    radius,
    typography,
    shadow,
    card: {
      backgroundColor: config.surface,
      borderRadius: radius.lg,
      ...shadow,
    },
    festival: config.festival,
  };
}

export type Theme = ReturnType<typeof createTheme>;
export type ThemeColor = keyof Theme['colors'];
