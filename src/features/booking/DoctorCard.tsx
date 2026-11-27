import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { DoctorAvatar } from '../../components/DoctorAvatar';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';
import { Doctor } from '../../types/models';
import { formatRupees } from '../../utils/format';

interface Props {
  doctor: Doctor;
  onPress?: () => void;
}

export function DoctorCard({ doctor, onPress }: Props) {
  const styles = useStyles(createStyles);

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} size={52} />
      <View style={styles.info}>
        <AppText variant="heading">{doctor.name}</AppText>
        <AppText variant="small" color="textSecondary">
          {doctor.specialty}
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {doctor.languages.join(', ')}
        </AppText>
      </View>
      <AppText variant="bodyBold" color="primary">
        {formatRupees(doctor.feeInr)}
      </AppText>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      ...theme.card,
    },
    pressed: {
      opacity: 0.85,
    },
    info: {
      flex: 1,
    },
  });
