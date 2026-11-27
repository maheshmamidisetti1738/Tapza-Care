import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SectionBackground as BackgroundConfig } from '../../../config/types';
import { readableTextColor } from '../../../theme/colorUtils';
import { useTheme } from '../../../theme/ThemeContext';

function getColors(value: string) {
  return value.split(',').map(color => color.trim());
}

export function SectionBackground({
  background,
  overlayColor,
}: {
  background: BackgroundConfig;
  overlayColor?: string;
}) {
  const theme = useTheme();

  if (background.kind === 'gradient') {
    return (
      <LinearGradient
        colors={getColors(background.value)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  if (background.kind === 'image') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.secondary },
        ]}
      >
        <Image
          source={{ uri: background.value }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
        {overlayColor ? (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: background.value }]}
    />
  );
}

export function useSectionTextColor(background: BackgroundConfig) {
  const theme = useTheme();

  if (background.kind === 'image') {
    return theme.colors.textPrimary;
  }
  const firstColor = getColors(background.value)[0];
  return readableTextColor(
    firstColor,
    theme.colors.surface,
    theme.colors.textPrimary,
  );
}
