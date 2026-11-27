import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppText } from '../../../components/AppText';
import { DoctorAvatar } from '../../../components/DoctorAvatar';
import { useRootNavigation } from '../../../navigation/hooks';
import { withAlpha } from '../../../theme/colorUtils';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { formatRupees } from '../../../utils/format';
import { DoctorCardItem, isDoctorCardItem, pickItems } from './itemTypes';
import { SectionProps } from './types';

const CARD_WIDTH = 236;
const BAND_HEIGHT = 72;
const AVATAR_SIZE = 64;

export function DoctorCarousel({ section }: SectionProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useRootNavigation();
  const doctors = pickItems(section.items, isDoctorCardItem);

  const renderDoctor = ({ item }: { item: DoctorCardItem }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.specialty}. Fee ${formatRupees(
        item.feeInr,
      )}`}
      onPress={() => navigation.navigate('Booking', { doctorId: item.id })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[theme.colors.primary, withAlpha(theme.colors.primary, 0.7)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.band}
      >
        <View style={styles.availablePill}>
          <View style={styles.dot} />
          <AppText variant="caption" color="onPrimary">
            Available today
          </AppText>
        </View>
      </LinearGradient>

      <DoctorAvatar
        soft
        name={item.name}
        photoUrl={item.photoUrl}
        size={AVATAR_SIZE}
        style={styles.avatar}
      />

      <View style={styles.body}>
        <AppText variant="heading" numberOfLines={1}>
          {item.name}
        </AppText>
        <AppText variant="small" color="textSecondary" numberOfLines={1}>
          {item.specialty}
        </AppText>
      </View>

      <View style={styles.footer}>
        <View>
          <AppText variant="caption" color="textSecondary">
            Consultation fee
          </AppText>
          <AppText variant="bodyBold" color="primary">
            {formatRupees(item.feeInr)}
          </AppText>
        </View>
        <View style={styles.bookButton}>
          <AppText variant="bodyBold" color="onPrimary">
            Book
          </AppText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      horizontal
      data={doctors}
      keyExtractor={item => item.id}
      renderItem={renderDoctor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      snapToInterval={CARD_WIDTH + theme.spacing.md}
      decelerationRate="fast"
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.md,
    },
    card: {
      ...theme.card,
      width: CARD_WIDTH,
      borderRadius: theme.radius.xl,
      overflow: 'hidden',
      shadowOpacity: 0.08,
      elevation: 3,
    },
    pressed: {
      opacity: 0.9,
    },
    band: {
      height: BAND_HEIGHT,
      padding: theme.spacing.md,
      alignItems: 'flex-end',
    },
    availablePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 3,
      borderRadius: theme.radius.pill,
      backgroundColor: withAlpha(theme.colors.onPrimary, 0.18),
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.colors.accent,
    },
    avatar: {
      marginTop: -AVATAR_SIZE / 2,
      marginLeft: theme.spacing.lg,
      borderWidth: 3,
      borderColor: theme.colors.surface,
    },
    body: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      gap: 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    bookButton: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
