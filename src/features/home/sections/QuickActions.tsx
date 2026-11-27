import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Icon } from '../../../components/Icon';
import { useItemAction } from '../../../navigation/hooks';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { isActionItem, pickItems } from './itemTypes';
import { SectionProps } from './types';

export function QuickActions({ section }: SectionProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const runAction = useItemAction();
  const actions = pickItems(section.items, isActionItem);

  return (
    <View style={styles.grid}>
      {actions.map(action => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          onPress={() => runAction(action.action)}
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
        >
          <View style={styles.iconCircle}>
            <Icon name={action.icon} size={20} color={theme.colors.primary} />
          </View>
          <AppText variant="bodyBold" style={styles.label} numberOfLines={2}>
            {action.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    tile: {
      ...theme.card,
      width: '47.5%',
      flexGrow: 1,
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      shadowOpacity: 0.06,
      elevation: 2,
    },
    pressed: {
      opacity: 0.85,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      flex: 1,
    },
  });
