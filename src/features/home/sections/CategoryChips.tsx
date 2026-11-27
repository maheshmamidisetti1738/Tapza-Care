import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Icon } from '../../../components/Icon';
import { useItemAction } from '../../../navigation/hooks';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { MIN_TAP_SIZE } from '../../../theme/tokens';
import { isActionItem, pickItems } from './itemTypes';
import { SectionProps } from './types';

export function CategoryChips({ section }: SectionProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const runAction = useItemAction();
  const chips = pickItems(section.items, isActionItem);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {chips.map(chip => (
        <Pressable
          key={chip.id}
          accessibilityRole="button"
          onPress={() => runAction(chip.action)}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        >
          <Icon name={chip.icon} size={18} color={theme.colors.primary} />
          <AppText variant="bodyBold">{chip.label}</AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.sm,
    },
    chip: {
      minHeight: MIN_TAP_SIZE,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
      ...theme.shadow,
      shadowOpacity: 0.06,
      elevation: 2,
    },
    pressed: {
      backgroundColor: theme.colors.secondary,
    },
  });
