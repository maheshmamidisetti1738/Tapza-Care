import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ConfigVariant,
  FailureMode,
  LatencyMode,
  mockSettings,
} from '../../api/mockSettings';
import { AppText } from '../../components/AppText';
import { OptionGroup } from '../../components/OptionGroup';
import { useConfig } from '../../config/ConfigContext';
import { Theme } from '../../theme/createTheme';
import { useStyles } from '../../theme/ThemeContext';

export function ProfileScreen() {
  const styles = useStyles(createStyles);
  const { isRefreshing, reload } = useConfig();

  const [variant, setVariant] = useState<ConfigVariant>(
    mockSettings.configVariant,
  );
  const [latency, setLatency] = useState<LatencyMode>(mockSettings.latency);
  const [failure, setFailure] = useState<FailureMode>(mockSettings.failure);

  const changeVariant = (value: ConfigVariant) => {
    mockSettings.configVariant = value;
    setVariant(value);
    reload();
  };

  const changeLatency = (value: LatencyMode) => {
    mockSettings.latency = value;
    setLatency(value);
  };

  const changeFailure = (value: FailureMode) => {
    mockSettings.failure = value;
    setFailure(value);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.card, styles.userRow]}>
        <View style={styles.avatar}>
          <AppText variant="title" color="onAccent">
            R
          </AppText>
        </View>
        <View>
          <AppText variant="title">Mahesh</AppText>
          <AppText color="textSecondary">+91 9177502767</AppText>
        </View>
      </View>

      <View style={styles.card}>
        <AppText variant="heading">Mock backend</AppText>

        <OptionGroup
          title="Home layout"
          selected={variant}
          disabled={isRefreshing}
          onChange={changeVariant}
          options={[
            { value: 'normal', label: 'Normal day' },
            { value: 'festival', label: 'Festival (Diwali)' },
          ]}
        />
        <OptionGroup
          title="Network speed"
          selected={latency}
          onChange={changeLatency}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'slow', label: 'Slow (3.5 s)' },
          ]}
        />
        <OptionGroup
          title="Failures"
          selected={failure}
          onChange={changeFailure}
          options={[
            { value: 'none', label: 'None' },
            { value: 'network', label: 'Network down' },
            { value: 'booking', label: 'Booking fails' },
            { value: 'conflict', label: 'Slot taken (409)' },
          ]}
        />
      </View>
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
      gap: theme.spacing.lg,
      ...theme.card,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      textAlign: 'center',
    },
  });
