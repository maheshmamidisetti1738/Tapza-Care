import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { api } from '../../api/client';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { useRequest } from '../../hooks/useRequest';
import { useRootNavigation } from '../../navigation/hooks';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { DoctorCard } from './DoctorCard';

export function DoctorsScreen() {
  const styles = useStyles(createStyles);
  const navigation = useRootNavigation();
  const { data, isLoading, hasError, reload } = useRequest(
    () => api.getDoctors(),
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.list]}>
        {[0, 1, 2, 3].map(index => (
          <View key={index} style={styles.skeletonCard}>
            <Skeleton width={56} height={56} borderRadius={28} />
            <View style={styles.skeletonText}>
              <Skeleton width="70%" height={18} />
              <Skeleton width="45%" height={16} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.centered}>
        <ErrorState title="Couldn't load doctors" onRetry={reload} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="stethoscope"
          title="No doctors available"
          message="Doctors will appear here once the clinic adds them."
        />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={doctor => doctor.id}
      style={styles.screen}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <DoctorCard
          doctor={item}
          onPress={() => navigation.navigate('Booking', { doctorId: item.id })}
        />
      )}
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
    skeletonCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
    skeletonText: {
      flex: 1,
      gap: theme.spacing.sm,
    },
  });
