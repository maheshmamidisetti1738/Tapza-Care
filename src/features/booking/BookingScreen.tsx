import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { api } from '../../api/client';
import { AppText } from '../../components/AppText';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { useRequest } from '../../hooks/useRequest';
import { RootStackParamList } from '../../navigation/types';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { Slot } from '../../types/models';
import {
  getNextDays,
  getWeekday,
  getMonthName,
  toDateKey,
  formatTime,
} from '../../utils/date';
import { vibrate } from '../../utils/feedback';
import { useBookings } from './BookingsContext';
import { BookingSuccess } from './BookingSuccess';
import { DateStrip } from './DateStrip';
import { DoctorCard } from './DoctorCard';
import { SlotPicker } from './SlotPicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

type Stage = 'picking' | 'confirming' | 'confirmed';

const DAYS_TO_SHOW = 7;

export function BookingScreen({ route, navigation }: Props) {
  const { doctorId, serviceName } = route.params;
  const styles = useStyles(createStyles);
  const { bookSlot } = useBookings();

  const dates = useMemo(() => getNextDays(DAYS_TO_SHOW), []);
  const [dateKey, setDateKey] = useState(toDateKey(dates[0]));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('picking');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const doctors = useRequest(() => api.getDoctors(), []);
  const slots = useRequest(
    () => api.getSlots(doctorId, dateKey),
    [doctorId, dateKey],
  );

  const doctor = doctors.data?.find(item => item.id === doctorId);
  const selectedDate =
    dates.find(date => toDateKey(date) === dateKey) ?? dates[0];

  const changeDate = (newDateKey: string) => {
    setDateKey(newDateKey);
    setSelectedSlot(null);
  };

  const confirmBooking = async () => {
    if (!doctor || !selectedSlot) {
      return;
    }

    setBookingError(null);
    setIsSheetOpen(false);
    setStage('confirming');

    const outcome = await bookSlot(doctor, selectedSlot, serviceName);

    if (outcome === 'confirmed') {
      vibrate();
      setStage('confirmed');
      return;
    }

    setStage('picking');
    if (outcome === 'slot_taken') {
      setBookingError(
        'Sorry, someone just booked that time. Please pick another slot.',
      );
      setSelectedSlot(null);
      slots.reload();
    } else {
      setBookingError("We couldn't complete your booking. Please try again.");
    }
    setIsSheetOpen(true);
  };

  if (doctors.isLoading) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Skeleton height={92} borderRadius={16} />
        <Skeleton width={120} height={22} />
        <View style={styles.skeletonDates}>
          {[0, 1, 2, 3, 4].map(index => (
            <Skeleton key={index} width={62} height={80} borderRadius={16} />
          ))}
        </View>
      </View>
    );
  }

  if (doctors.hasError) {
    return (
      <View style={styles.centered}>
        <ErrorState
          title="Couldn't load doctor details"
          onRetry={doctors.reload}
        />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="stethoscope"
          title="Doctor not found"
          message="This doctor is not available right now."
          actionLabel="Go back"
          onAction={navigation.goBack}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <DoctorCard doctor={doctor} />

        {serviceName ? (
          <View style={styles.serviceBox}>
            <AppText variant="caption" color="onSecondary">
              Booking for
            </AppText>
            <AppText variant="bodyBold" color="onSecondary">
              {serviceName}
            </AppText>
          </View>
        ) : null}

        <AppText variant="heading">Pick a date</AppText>
        <DateStrip dates={dates} selectedKey={dateKey} onSelect={changeDate} />
        <AppText variant="small" color="textSecondary">
          Clinic hours: Mon to Sat, 9 AM to 8 PM. Closed on Sundays.
        </AppText>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Choose a time" onPress={() => setIsSheetOpen(true)} />
      </View>

      <BottomSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={`${getWeekday(
          selectedDate,
        )}, ${selectedDate.getDate()} ${getMonthName(selectedDate)}`}
      >
        <SlotPicker
          slots={slots.data}
          isLoading={slots.isLoading}
          hasError={slots.hasError}
          selectedSlotId={selectedSlot?.id}
          onSelect={slot => {
            setSelectedSlot(slot);
            setBookingError(null);
          }}
          onRetry={slots.reload}
        />
        {bookingError ? (
          <AppText color="danger" variant="bodyBold" style={styles.errorText}>
            {bookingError}
          </AppText>
        ) : null}
        <Button
          label={
            selectedSlot
              ? `Confirm ${formatTime(selectedSlot.startsAt)}`
              : 'Select a time'
          }
          disabled={!selectedSlot}
          onPress={confirmBooking}
          style={styles.confirmButton}
        />
      </BottomSheet>

      {stage !== 'picking' && selectedSlot ? (
        <BookingSuccess
          doctor={doctor}
          slot={selectedSlot}
          serviceName={serviceName}
          isConfirmed={stage === 'confirmed'}
          onViewBookings={() =>
            navigation.navigate('Tabs', { screen: 'bookings' })
          }
          onGoHome={() => navigation.navigate('Tabs', { screen: 'home' })}
        />
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    skeletonDates: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    serviceBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.secondary,
    },
    footer: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    errorText: {
      marginTop: theme.spacing.md,
    },
    confirmButton: {
      marginTop: theme.spacing.lg,
    },
  });
