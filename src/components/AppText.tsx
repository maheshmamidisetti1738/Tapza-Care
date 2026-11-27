import React from 'react';
import { Text, TextProps } from 'react-native';
import { ThemeColor } from '../theme/createTheme';
import { useTheme } from '../theme/ThemeContext';
import { TextVariant } from '../theme/tokens';

interface Props extends TextProps {
  variant?: TextVariant;
  color?: ThemeColor;
}

export function AppText({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Text
      {...rest}
      style={[theme.typography[variant], { color: theme.colors[color] }, style]}
    />
  );
}
