import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { RootStackParamList } from '../../navigation/types';
import { Theme } from '../../theme/createTheme';
import { useStyles, useTheme } from '../../theme/ThemeContext';
import { MIN_TAP_SIZE } from '../../theme/tokens';
import { formatDate } from '../../utils/date';
import { useDoses } from './DosesContext';
import { ProgressBar } from './ProgressBar';
import { TIMINGS } from './timings';

type Props = NativeStackScreenProps<RootStackParamList, 'PrescriptionDetail'>;

export function PrescriptionDetailScreen({ route }: Props) {
  const { prescription } = route.params;
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { isTaken, toggleDose } = useDoses();

  const totalDoses = prescription.medicines.reduce(
    (sum, medicine) => sum + medicine.timing.length,
    0,
  );
  const takenDoses = prescription.medicines.reduce(
    (sum, medicine) =>
      sum +
      medicine.timing.filter(timing =>
        isTaken(prescription.id, medicine.id, timing),
      ).length,
    0,
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <AppText variant="title">{prescription.doctorName}</AppText>
        <AppText color="textSecondary">{prescription.clinicName}</AppText>
        <AppText variant="small" color="textSecondary">
          Issued on {formatDate(prescription.issuedAt)}
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="heading">Today&apos;s doses</AppText>
        <ProgressBar
          progress={totalDoses === 0 ? 0 : takenDoses / totalDoses}
        />
        <AppText variant="small" color="textSecondary">
          {takenDoses} of {totalDoses} taken
        </AppText>
      </View>

      {TIMINGS.map(timing => {
        const medicines = prescription.medicines.filter(medicine =>
          medicine.timing.includes(timing.key),
        );
        if (medicines.length === 0) {
          return null;
        }

        return (
          <View key={timing.key} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={styles.groupIcon}>
                <Icon
                  name={timing.icon}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <AppText variant="heading">{timing.label}</AppText>
                <AppText variant="small" color="textSecondary">
                  {timing.time}
                </AppText>
              </View>
            </View>

            {medicines.map(medicine => {
              const taken = isTaken(prescription.id, medicine.id, timing.key);
              return (
                <View key={medicine.id} style={styles.medicineRow}>
                  <View style={styles.medicineInfo}>
                    <AppText variant="bodyBold">{medicine.name}</AppText>
                    <AppText variant="small" color="textSecondary">
                      {medicine.dose}
                    </AppText>
                    <AppText variant="caption" color="textSecondary">
                      For {medicine.days} days
                    </AppText>
                  </View>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: taken }}
                    accessibilityLabel={`${medicine.name} ${timing.label} dose`}
                    onPress={() =>
                      toggleDose(prescription.id, medicine.id, timing.key)
                    }
                    style={[styles.doseButton, taken && styles.doseButtonTaken]}
                  >
                    <AppText
                      variant="bodyBold"
                      color={taken ? 'surface' : 'primary'}
                    >
                      {taken ? '✓ Taken' : 'Mark taken'}
                    </AppText>
                  </Pressable>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    card: {
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...theme.card,
    },
    group: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    groupIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    medicineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      ...theme.card,
      borderRadius: theme.radius.md,
      shadowOpacity: 0.06,
      elevation: 2,
    },
    medicineInfo: {
      flex: 1,
    },
    doseButton: {
      minHeight: MIN_TAP_SIZE,
      minWidth: 112,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.pill,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    doseButtonTaken: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
  });
