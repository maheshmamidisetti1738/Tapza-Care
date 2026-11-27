import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { withAlpha } from '../../../theme/colorUtils';
import { Theme } from '../../../theme/createTheme';
import { useStyles, useTheme } from '../../../theme/ThemeContext';
import { isHeroItem, pickItems } from './itemTypes';
import { SectionBackground } from './SectionBackground';
import { SectionProps } from './types';

const HERO_HEIGHT = 190;
const PARALLAX = HERO_HEIGHT * 0.4;

export function HeroBanner({ section, scrollY }: SectionProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [item] = pickItems(section.items, isHeroItem);

  const backgroundShift = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, PARALLAX],
    extrapolate: 'clamp',
  });
  const contentFade = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const greeting = theme.festival?.greeting ?? item?.greeting ?? 'Namaste';

  return (
    <View style={styles.hero}>
      <Animated.View
        style={[
          styles.background,
          { transform: [{ translateY: backgroundShift }] },
        ]}
      >
        <SectionBackground
          background={section.background}
          overlayColor={withAlpha(theme.colors.primary, 0.6)}
        />
        <View style={[styles.circle, styles.circleBig]} />
        <View style={[styles.circle, styles.circleSmall]} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade }]}>
        {theme.festival ? (
          <View style={styles.festivalPill}>
            <AppText variant="caption" color="onAccent">
              {theme.festival.name.toUpperCase()} SPECIAL
            </AppText>
          </View>
        ) : null}
        <AppText variant="display" color="onPrimary">
          {greeting}
        </AppText>
        {item?.subtitle ? (
          <AppText variant="body" color="onPrimary" style={styles.subtitle}>
            {item.subtitle}
          </AppText>
        ) : null}
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    hero: {
      height: HERO_HEIGHT,
      overflow: 'hidden',
      backgroundColor: theme.colors.primary,
      justifyContent: 'flex-end',
    },
    background: {
      position: 'absolute',
      top: -PARALLAX,
      left: 0,
      right: 0,
      bottom: 0,
    },
    circle: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: withAlpha(theme.colors.onPrimary, 0.07),
    },
    circleBig: {
      width: 220,
      height: 220,
      right: -70,
      top: PARALLAX - 40,
    },
    circleSmall: {
      width: 110,
      height: 110,
      right: 90,
      top: PARALLAX + 90,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    festivalPill: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    subtitle: {
      maxWidth: '85%',
      opacity: 0.92,
    },
  });
