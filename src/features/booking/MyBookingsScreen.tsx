import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { EmptyState } from '../../components/EmptyState';
import { useRootNavigation } from '../../navigation/hooks';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { formatDate, formatTime } from '../../utils/date';
import { useBookings } from './BookingsContext';
import { MyBooking } from './bookingsReducer';

export function MyBookingsScreen() {
  const styles = useStyles(createStyles);
  const navigation = useRootNavigation();
  const { bookings } = useBookings();

  if (bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="calendar"
          title="No bookings yet"
          message="Book a visit with one of our doctors and it will show up here."
          actionLabel="Book an appointment"
          onAction={() => navigation.navigate('Doctors')}
        />
      </View>
    );
  }

  const renderBooking = ({ item }: { item: MyBooking }) => {
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <AppText variant="heading" style={styles.flex}>
            {item.doctor.name}
          </AppText>
          <View
            style={[
              styles.statusPill,
              isConfirmed ? styles.confirmed : styles.confirming,
            ]}
          >
            <AppText
              variant="caption"
              color={isConfirmed ? 'surface' : 'onSecondary'}
            >
              {isConfirmed ? 'Confirmed' : 'Confirming...'}
            </AppText>
          </View>
        </View>
        <AppText color="textSecondary">
          {item.serviceName ?? item.doctor.specialty}
        </AppText>
        <AppText variant="bodyBold" color="primary">
          {formatDate(item.slot.startsAt)} at {formatTime(item.slot.startsAt)}
        </AppText>
      </View>
    );
  };

  return (
    <FlatList
      data={bookings}
      keyExtractor={item => item.localId}
      renderItem={renderBooking}
      style={styles.screen}
      contentContainerStyle={styles.list}
    />
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
    list: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    flex: {
      flex: 1,
    },
    card: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
      ...theme.card,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    statusPill: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.pill,
    },
    confirmed: {
      backgroundColor: theme.colors.success,
    },
    confirming: {
      backgroundColor: theme.colors.secondary,
    },
  });
