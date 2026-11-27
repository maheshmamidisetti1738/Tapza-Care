import React, { useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Theme } from '../theme/createTheme';
import { useStyles } from '../theme/ThemeContext';
import { AppText } from './AppText';

export function getInitials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

export function DoctorAvatar({
  name,
  photoUrl,
  size = 52,
  style,
  soft = false,
}: {
  name: string;
  photoUrl?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  soft?: boolean;
}) {
  const styles = useStyles(createStyles);
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        soft && styles.soft,
        style,
      ]}
    >
      <AppText variant="heading" color={soft ? 'primary' : 'onPrimary'}>
        {getInitials(name)}
      </AppText>
      {photoUrl && !failed ? (
        <Image
          source={{ uri: photoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    circle: {
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    soft: {
      backgroundColor: theme.colors.secondary,
    },
  });
