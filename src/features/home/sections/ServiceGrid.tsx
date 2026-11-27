import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Icon } from '../../../components/Icon';
import { RemoteImage } from '../../../components/RemoteImage';
import { useRootNavigation } from '../../../navigation/hooks';
import { withAlpha } from '../../../theme/colorUtils';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { formatRupees } from '../../../utils/format';
import { isServiceItem, pickItems } from './itemTypes';
import { SectionProps } from './types';

export function ServiceGrid({ section }: SectionProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useRootNavigation();
  const { width } = useWindowDimensions();
  const services = pickItems(section.items, isServiceItem);

  const columns = section.columns === 3 ? 3 : 2;
  const gap = theme.spacing.md;
  const cardWidth =
    (width - theme.spacing.lg * 2 - gap * (columns - 1)) / columns;
  const tileHeight = columns === 3 ? cardWidth * 0.8 : cardWidth * 0.62;
  const iconCircleSize = columns === 3 ? 44 : 52;

  return (
    <View style={[styles.grid, { gap }]}>
      {services.map(service => (
        <Pressable
          key={service.id}
          accessibilityRole="button"
          accessibilityLabel={`${service.name}, ${formatRupees(
            service.priceInr,
          )}`}
          onPress={() =>
            navigation.navigate('Booking', {
              doctorId: service.doctorId,
              serviceName: service.name,
            })
          }
          style={({ pressed }) => [
            styles.card,
            { width: cardWidth },
            pressed && styles.pressed,
          ]}
        >
          {service.imageUrl ? (
            <RemoteImage
              uri={service.imageUrl}
              style={{ height: tileHeight }}
            />
          ) : (
            <View style={[styles.tile, { height: tileHeight }]}>
              <View style={styles.tileCircle} />
              <View
                style={[
                  styles.iconCircle,
                  {
                    width: iconCircleSize,
                    height: iconCircleSize,
                    borderRadius: iconCircleSize / 2,
                  },
                ]}
              >
                <Icon
                  name={service.icon ?? 'stethoscope'}
                  size={iconCircleSize * 0.48}
                  color={theme.colors.primary}
                />
              </View>
            </View>
          )}
          {service.badge ? (
            <View style={styles.badge}>
              <AppText variant="caption" color="onAccent">
                {service.badge}
              </AppText>
            </View>
          ) : null}
          <View style={styles.info}>
            <AppText variant="small" style={styles.name} numberOfLines={2}>
              {service.name}
            </AppText>
            <AppText variant="bodyBold" color="primary">
              {formatRupees(service.priceInr)}
            </AppText>
          </View>
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
    },
    card: {
      ...theme.card,
      overflow: 'hidden',
      shadowOpacity: 0.07,
      elevation: 3,
    },
    pressed: {
      opacity: 0.88,
    },
    tile: {
      backgroundColor: theme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    tileCircle: {
      position: 'absolute',
      width: 110,
      height: 110,
      borderRadius: 55,
      right: -30,
      top: -40,
      backgroundColor: withAlpha(theme.colors.primary, 0.1),
    },
    iconCircle: {
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadow,
      shadowOpacity: 0.08,
      elevation: 2,
    },
    badge: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    info: {
      padding: theme.spacing.md,
      gap: 2,
    },
    name: {
      fontWeight: '600',
      minHeight: 36,
    },
  });
