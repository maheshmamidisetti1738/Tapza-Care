import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { api } from '../../api/client';
import { AppText } from '../../components/AppText';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { useRequest } from '../../hooks/useRequest';
import { useRootNavigation } from '../../navigation/hooks';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { Prescription } from '../../types/models';
import { formatDate } from '../../utils/date';

export function PrescriptionsScreen() {
  const styles = useStyles(createStyles);
  const navigation = useRootNavigation();
  const { data, isLoading, hasError, reload } = useRequest(
    () => api.getPrescriptions(),
    [],
  );

  if (isLoading) {
    return <PrescriptionsSkeleton />;
  }

  if (hasError) {
    return (
      <View style={styles.centered}>
        <ErrorState title="Couldn't load prescriptions" onRetry={reload} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="file-text"
          title="No prescriptions yet"
          message="After your visit, the doctor's prescription will show up here."
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Prescription }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        navigation.navigate('PrescriptionDetail', { prescription: item })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardTop}>
        <AppText variant="heading" style={styles.flex}>
          {item.doctorName}
        </AppText>
        <AppText variant="small" color="textSecondary">
          {formatDate(item.issuedAt)}
        </AppText>
      </View>
      <AppText variant="small" color="textSecondary">
        {item.clinicName}
      </AppText>
      <View style={styles.medicineBox}>
        <AppText variant="caption" color="onSecondary">
          {item.medicines.length} medicines
        </AppText>
        <AppText variant="small" color="onSecondary" numberOfLines={2}>
          {item.medicines.map(medicine => medicine.name).join(', ')}
        </AppText>
      </View>
      <AppText variant="bodyBold" color="primary">
        View schedule →
      </AppText>
    </Pressable>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      style={styles.screen}
    />
  );
}

function PrescriptionsSkeleton() {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.screen, styles.list]}>
      {[0, 1, 2].map(index => (
        <View key={index} style={styles.card}>
          <View style={styles.cardTop}>
            <Skeleton width="55%" height={22} />
            <Skeleton width={70} height={16} />
          </View>
          <Skeleton width="80%" height={16} />
          <Skeleton height={56} borderRadius={12} />
          <Skeleton width={120} height={18} />
        </View>
      ))}
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
    list: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    flex: {
      flex: 1,
    },
    card: {
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...theme.card,
    },
    pressed: {
      opacity: 0.85,
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    medicineBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.secondary,
    },
  });
