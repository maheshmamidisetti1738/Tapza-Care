import React, { useState } from 'react';
import {
  Image,
  ImageResizeMode,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useStyles, useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/createTheme';
import { Icon } from './Icon';

interface Props {
  uri: string;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
}

export function RemoteImage({ uri, style, resizeMode = 'cover' }: Props) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholder}>
        <Icon name="image" size={26} color={theme.colors.primary} />
      </View>
      {!failed && (
        <Image
          source={{ uri }}
          resizeMode={resizeMode}
          style={StyleSheet.absoluteFill}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondary,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      opacity: 0.4,
    },
  });
