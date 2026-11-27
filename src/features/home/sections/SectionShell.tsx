import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionConfig } from '../../../config/types';
import { withAlpha } from '../../../theme/colorUtils';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { AnimateInView } from './AnimateInView';
import { SectionBackground, useSectionTextColor } from './SectionBackground';

interface Props {
  section: SectionConfig;
  play: boolean;
  thin?: boolean;
  children: ReactNode;
}

export function SectionShell({ section, play, thin = false, children }: Props) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const textColor = useSectionTextColor(section.background);

  return (
    <View style={thin ? styles.thinBand : styles.band}>
      <SectionBackground
        background={section.background}
        overlayColor={withAlpha(theme.colors.background, 0.85)}
      />
      <AnimateInView play={play}>
        {section.title ? (
          <AppText variant="title" style={[styles.title, { color: textColor }]}>
            {section.title}
          </AppText>
        ) : null}
        {children}
      </AnimateInView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    band: {
      paddingVertical: theme.spacing.lg,
    },
    thinBand: {
      paddingVertical: theme.spacing.sm,
    },
    title: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
  });
