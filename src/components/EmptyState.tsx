import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../theme/createTheme';
import { useStyles, useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { Button } from './Button';

interface Props {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={34} color={theme.colors.primary} />
      </View>
      <AppText variant="title" style={styles.centered}>
        {title}
      </AppText>
      <AppText variant="small" color="textSecondary" style={styles.centered}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: theme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    centered: {
      textAlign: 'center',
    },
    button: {
      marginTop: theme.spacing.md,
    },
  });
