import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { ComponentType, useMemo } from 'react';
import { Icon } from '../components/Icon';
import { useConfig } from '../config/ConfigContext';
import { TabScreen } from '../config/types';
import { DoctorsScreen } from '../features/booking/DoctorsScreen';
import { BookingScreen } from '../features/booking/BookingScreen';
import { MyBookingsScreen } from '../features/booking/MyBookingsScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { PrescriptionDetailScreen } from '../features/prescriptions/PrescriptionDetailScreen';
import { PrescriptionsScreen } from '../features/prescriptions/PrescriptionsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabScreens: Record<TabScreen, ComponentType> = {
  home: HomeScreen,
  bookings: MyBookingsScreen,
  prescriptions: PrescriptionsScreen,
  profile: ProfileScreen,
};

const createTabIcon =
  (icon: string) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    (
      <Icon
        name={icon}
        size={22}
        color={color}
        strokeWidth={focused ? 2.4 : 1.8}
      />
    );

function Tabs() {
  const theme = useTheme();
  const { config } = useConfig();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: theme.typography.heading,
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: theme.colors.textPrimary,
        },
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: '600' },
      }}
    >
      {config.tabs.map(tab => (
        <Tab.Screen
          key={tab.id}
          name={tab.screen}
          component={tabScreens[tab.screen]}
          options={{
            title: tab.label,
            headerShown: tab.screen !== 'home',
            tabBarIcon: createTabIcon(tab.icon),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
      },
    }),
    [theme],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
          headerTitleStyle: theme.typography.heading,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{ title: 'Choose a doctor' }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: 'Book appointment' }}
        />
        <Stack.Screen
          name="PrescriptionDetail"
          component={PrescriptionDetailScreen}
          options={{ title: 'Prescription' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
