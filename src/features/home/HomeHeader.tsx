import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { useRootNavigation } from '../../navigation/hooks';
import { Theme } from '../../theme/createTheme';
import { useStyles, useTheme } from '../../theme/ThemeContext';

const LOCATION_ROW_HEIGHT = 32;
const MAIN_ROW_HEIGHT = 52;
export const HEADER_CONTENT_HEIGHT = LOCATION_ROW_HEIGHT + MAIN_ROW_HEIGHT;

export function HomeHeader({ scrollY }: { scrollY: Animated.Value }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const navigation = useRootNavigation();

  const translateY = scrollY.interpolate({
    inputRange: [0, LOCATION_ROW_HEIGHT],
    outputRange: [0, -LOCATION_ROW_HEIGHT],
    extrapolate: 'clamp',
  });
  const locationOpacity = scrollY.interpolate({
    inputRange: [0, LOCATION_ROW_HEIGHT * 0.8],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          { top: insets.top, transform: [{ translateY }] },
        ]}
      >
        <Animated.View
          style={[styles.locationRow, { opacity: locationOpacity }]}
        >
          <Icon name="map-pin" size={14} color={theme.colors.onPrimary} />
          <AppText variant="small" color="onPrimary" numberOfLines={1}>
            Tapza Clinic, Banjara Hills, Hyderabad
          </AppText>
        </Animated.View>
        <View style={styles.mainRow}>
          <AppText variant="title" color="onPrimary">
            Tapza Care
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => navigation.navigate('Tabs', { screen: 'profile' })}
            style={styles.avatarTouch}
          >
            <View style={styles.avatar}>
              <AppText variant="bodyBold" color="onAccent">
                R
              </AppText>
            </View>
          </Pressable>
        </View>
      </Animated.View>
      <View style={[styles.statusBarCover, { height: insets.top }]} />
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: HEADER_CONTENT_HEIGHT,
      backgroundColor: theme.colors.primary,
      zIndex: 1,
    },
    statusBarCover: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      zIndex: 2,
    },
    locationRow: {
      height: LOCATION_ROW_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
    },
    mainRow: {
      height: MAIN_ROW_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
    },
    avatarTouch: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
