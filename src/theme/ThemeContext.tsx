import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { useConfig } from '../config/ConfigContext';
import { createTheme, Theme } from './createTheme';

export const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { config } = useConfig();
  const theme = useMemo(() => createTheme(config.theme), [config.theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return theme;
}

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

export function useStyles<T extends NamedStyles>(
  createStyles: (theme: Theme) => T,
): T {
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createStyles(theme), [theme]);
}
