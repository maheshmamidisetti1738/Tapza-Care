import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConfigProvider, useConfig } from './src/config/ConfigContext';
import { BookingsProvider } from './src/features/booking/BookingsContext';
import { HomeSkeleton } from './src/features/home/HomeSkeleton';
import { DosesProvider } from './src/features/prescriptions/DosesContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const theme = useTheme();
  const { isReady } = useConfig();

  const lightIcons = theme.colors.onPrimary === theme.colors.surface;

  return (
    <>
      <StatusBar barStyle={lightIcons ? 'light-content' : 'dark-content'} />
      {isReady ? <RootNavigator /> : <HomeSkeleton />}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ConfigProvider>
        <ThemeProvider>
          <BookingsProvider>
            <DosesProvider>
              <AppContent />
            </DosesProvider>
          </BookingsProvider>
        </ThemeProvider>
      </ConfigProvider>
    </SafeAreaProvider>
  );
}
