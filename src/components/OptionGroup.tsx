import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Theme } from '../theme/createTheme';
import { useStyles } from '../theme/ThemeContext';
import { MIN_TAP_SIZE } from '../theme/tokens';
import { AppText } from './AppText';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  title: string;
  options: Option<T>[];
  selected: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function OptionGroup<T extends string>({
  title,
  options,
  selected,
  onChange,
  disabled = false,
}: Props<T>) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="bodyBold">{title}</AppText>
      <View style={styles.options}>
        {options.map(option => {
          const isSelected = option.value === selected;

          return (
            <Pressable
              key={option.value}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled }}
              onPress={() => onChange(option.value)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                disabled && styles.disabled,
              ]}
            >
              <AppText
                variant="small"
                color={isSelected ? 'onPrimary' : 'textPrimary'}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    option: {
      minHeight: MIN_TAP_SIZE,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
  });
