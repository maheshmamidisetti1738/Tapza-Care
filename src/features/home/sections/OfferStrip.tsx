import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Icon } from '../../../components/Icon';
import { Theme } from '../../../theme/createTheme';
import { useStyles } from '../../../theme/ThemeContext';
import { isOfferItem, pickItems } from './itemTypes';
import { useSectionTextColor } from './SectionBackground';
import { SectionProps } from './types';

export function OfferStrip({ section }: SectionProps) {
  const styles = useStyles(createStyles);
  const textColor = useSectionTextColor(section.background);
  const [offer] = pickItems(section.items, isOfferItem);

  if (!offer) {
    return null;
  }

  return (
    <View style={styles.strip}>
      {offer.icon ? (
        <Icon name={offer.icon} size={18} color={textColor} />
      ) : null}
      <AppText
        variant="bodyBold"
        style={[styles.message, { color: textColor }]}
      >
        {offer.message}
      </AppText>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    strip: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    message: {
      flexShrink: 1,
      textAlign: 'center',
    },
  });
