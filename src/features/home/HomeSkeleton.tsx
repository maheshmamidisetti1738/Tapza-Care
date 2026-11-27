import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '../../components/Skeleton';
import { withAlpha } from '../../theme/colorUtils';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';

export function HomeSkeleton() {
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Skeleton width={140} height={28} style={styles.onPrimary} />
      </View>
      <Skeleton height={190} borderRadius={0} />
      <View style={styles.chips}>
        {[0, 1, 2].map(index => (
          <Skeleton key={index} width={110} height={44} borderRadius={22} />
        ))}
      </View>
      <View style={styles.grid}>
        {[0, 1, 2, 3].map(index => (
          <View key={index} style={styles.card}>
            <Skeleton height={110} borderRadius={0} />
            <View style={styles.cardText}>
              <Skeleton height={16} />
              <Skeleton width="50%" height={16} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      height: 120,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
    },
    onPrimary: {
      backgroundColor: withAlpha(theme.colors.onPrimary, 0.35),
    },
    chips: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    card: {
      width: '47.5%',
      flexGrow: 1,
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    },
    cardText: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
  });
