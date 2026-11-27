import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { MIN_TAP_SIZE } from '../../theme/tokens';
import { Slot } from '../../types/models';
import { formatTime } from '../../utils/date';

interface Props {
  slots: Slot[] | null;
  isLoading: boolean;
  hasError: boolean;
  selectedSlotId?: string;
  onSelect: (slot: Slot) => void;
  onRetry: () => void;
}

export function SlotPicker({
  slots,
  isLoading,
  hasError,
  selectedSlotId,
  onSelect,
  onRetry,
}: Props) {
  const styles = useStyles(createStyles);

  if (isLoading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton
            key={index}
            width="30.5%"
            height={MIN_TAP_SIZE + 4}
            borderRadius={12}
          />
        ))}
      </View>
    );
  }

  if (hasError) {
    return <ErrorState title="Couldn't load time slots" onRetry={onRetry} />;
  }

  if (!slots || slots.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No slots on this day"
        message="The clinic is closed or fully booked. Please pick another date."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid} style={styles.scroll}>
      {slots.map(slot => {
        const selected = slot.id === selectedSlotId;

        return (
          <Pressable
            key={slot.id}
            disabled={!slot.available}
            accessibilityRole="button"
            accessibilityState={{ disabled: !slot.available, selected }}
            onPress={() => onSelect(slot)}
            style={[
              styles.slot,
              !slot.available && styles.slotUnavailable,
              selected && styles.slotSelected,
            ]}
          >
            <AppText
              variant="bodyBold"
              color={
                selected
                  ? 'onPrimary'
                  : slot.available
                  ? 'textPrimary'
                  : 'textSecondary'
              }
              style={!slot.available && styles.strikeThrough}
            >
              {formatTime(slot.startsAt)}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 0,
      flexShrink: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    slot: {
      width: '30.5%',
      minHeight: MIN_TAP_SIZE + 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    slotUnavailable: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.skeleton,
    },
    slotSelected: {
      backgroundColor: theme.colors.primary,
    },
    strikeThrough: {
      textDecorationLine: 'line-through',
    },
  });
