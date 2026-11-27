import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { getMonthName, getWeekday, toDateKey } from '../../utils/date';

interface Props {
  dates: Date[];
  selectedKey: string;
  onSelect: (dateKey: string) => void;
}

export function DateStrip({ dates, selectedKey, onSelect }: Props) {
  const styles = useStyles(createStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {dates.map(date => {
        const key = toDateKey(date);
        const selected = key === selectedKey;
        const textColor = selected ? 'onPrimary' : 'textPrimary';

        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${getWeekday(
              date,
            )} ${date.getDate()} ${getMonthName(date)}`}
            onPress={() => onSelect(key)}
            style={[styles.day, selected && styles.daySelected]}
          >
            <AppText
              variant="small"
              color={selected ? 'onPrimary' : 'textSecondary'}
            >
              {getWeekday(date)}
            </AppText>
            <AppText variant="title" color={textColor}>
              {date.getDate()}
            </AppText>
            <AppText
              variant="caption"
              color={selected ? 'onPrimary' : 'textSecondary'}
            >
              {getMonthName(date)}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    day: {
      width: 62,
      minHeight: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      ...theme.shadow,
      shadowOpacity: 0.05,
      elevation: 1,
    },
    daySelected: {
      backgroundColor: theme.colors.primary,
      shadowOpacity: 0.2,
      elevation: 4,
    },
  });
