import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';

export function ProgressBar({ progress }: { progress: number }) {
  const styles = useStyles(createStyles);
  const animated = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animated, progress]);

  const width = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: theme.colors.skeleton,
    },
    fill: {
      height: '100%',
      borderRadius: 5,
      backgroundColor: theme.colors.success,
    },
  });
