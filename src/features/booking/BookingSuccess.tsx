import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { DoctorAvatar } from '../../components/DoctorAvatar';
import { Icon } from '../../components/Icon';
import { withAlpha } from '../../theme/colorUtils';
import { Theme } from '../../theme/createTheme';
import { useStyles, useTheme } from '../../theme/ThemeContext';
import { Doctor, Slot } from '../../types/models';
import { formatDate, formatTime } from '../../utils/date';
import { formatRupees } from '../../utils/format';

interface Props {
  doctor: Doctor;
  slot: Slot;
  serviceName?: string;
  isConfirmed: boolean;
  onViewBookings: () => void;
  onGoHome: () => void;
}

function Detail({ label, value }: { label: string; value: string }) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.detail}>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      <AppText variant="bodyBold">{value}</AppText>
    </View>
  );
}

export function BookingSuccess({
  doctor,
  slot,
  serviceName,
  isConfirmed,
  onViewBookings,
  onGoHome,
}: Props) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  const badgeScale = useRef(new Animated.Value(0)).current;
  const tickScale = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const cardProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(tickScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(ripple, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardProgress, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [badgeScale, tickScale, ripple, cardProgress]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.top}>
        <View style={styles.badgeArea}>
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: ripple.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.45, 0],
                }),
                transform: [
                  {
                    scale: ripple.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.9],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
          >
            <Animated.View style={{ transform: [{ scale: tickScale }] }}>
              <Icon
                name="check"
                size={38}
                strokeWidth={3}
                color={theme.colors.success}
              />
            </Animated.View>
          </Animated.View>
        </View>

        <AppText variant="display" color="onPrimary" style={styles.centered}>
          {isConfirmed ? 'Booking confirmed' : 'Booking your slot'}
        </AppText>
        <AppText variant="body" color="onPrimary" style={styles.subtitle}>
          {isConfirmed
            ? 'Your appointment is reserved. See you at the clinic.'
            : 'Please wait a moment while the clinic confirms.'}
        </AppText>
      </View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardProgress,
            transform: [
              {
                translateY: cardProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.doctorRow}>
          <DoctorAvatar
            name={doctor.name}
            photoUrl={doctor.photoUrl}
            size={48}
          />
          <View style={styles.doctorInfo}>
            <AppText variant="heading" numberOfLines={1}>
              {doctor.name}
            </AppText>
            <AppText variant="small" color="textSecondary">
              {doctor.specialty}
            </AppText>
          </View>
          <View style={[styles.status, isConfirmed && styles.statusConfirmed]}>
            {isConfirmed ? null : (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            )}
            <AppText
              variant="caption"
              color={isConfirmed ? 'surface' : 'onSecondary'}
            >
              {isConfirmed ? 'Confirmed' : 'Confirming'}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <Detail label="DATE" value={formatDate(slot.startsAt)} />
          <Detail label="TIME" value={formatTime(slot.startsAt)} />
        </View>
        <View style={styles.detailsRow}>
          <Detail label="VISIT" value={serviceName ?? 'Consultation'} />
          <Detail label="FEE" value={formatRupees(doctor.feeInr)} />
        </View>

        <View style={styles.divider} />

        <View style={styles.noteRow}>
          <Icon name="map-pin" size={16} color={theme.colors.primary} />
          <AppText variant="small" color="textSecondary" style={styles.note}>
            Tapza Clinic, Banjara Hills, Hyderabad. Please arrive 10 minutes
            early. The fee is paid at the clinic.
          </AppText>
        </View>
      </Animated.View>

      <View style={styles.buttons}>
        <Button label="View my bookings" onPress={onViewBookings} />
        <Button label="Back to home" variant="secondary" onPress={onGoHome} />
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.colors.background,
    },
    content: {
      flexGrow: 1,
    },
    top: {
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.xl,
      paddingBottom: 72,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: theme.radius.xl + 8,
      borderBottomRightRadius: theme.radius.xl + 8,
    },
    badgeArea: {
      width: 88,
      height: 88,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    ripple: {
      ...StyleSheet.absoluteFill,
      borderRadius: 44,
      backgroundColor: withAlpha(theme.colors.onPrimary, 0.6),
    },
    badge: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadow,
    },
    centered: {
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      opacity: 0.9,
    },
    card: {
      ...theme.card,
      marginTop: -48,
      marginHorizontal: theme.spacing.lg,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    doctorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    doctorInfo: {
      flex: 1,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.secondary,
    },
    statusConfirmed: {
      backgroundColor: theme.colors.success,
    },
    divider: {
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
    },
    detailsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    detail: {
      flex: 1,
      gap: 2,
    },
    noteRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    note: {
      flex: 1,
    },
    buttons: {
      marginTop: 'auto',
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      gap: theme.spacing.md,
    },
  });
