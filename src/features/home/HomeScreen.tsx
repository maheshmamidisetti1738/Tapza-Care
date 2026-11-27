import React, { useCallback, useRef, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';
import { useConfig } from '../../config/ConfigContext';
import { SectionConfig } from '../../config/types';
import { Theme } from '../../theme/createTheme';
import { useStyles, useTheme } from '../../theme/ThemeContext';
import { HEADER_CONTENT_HEIGHT, HomeHeader } from './HomeHeader';
import { SectionRenderer } from './sections/SectionRenderer';

export function HomeScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { config, isOffline, reload } = useConfig();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [seenSectionIds, setSeenSectionIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { item: unknown }[] }) => {
      const ids = viewableItems.map(({ item }) => (item as SectionConfig).id);
      setSeenSectionIds(previous => Array.from(new Set([...previous, ...ids])));
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 10 }).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
    },
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await reload();
    setIsRefreshing(false);
  }, [reload]);

  const headerHeight = insets.top + HEADER_CONTENT_HEIGHT;

  return (
    <View style={styles.screen}>
      <Animated.FlatList
        data={config.sections}
        keyExtractor={section => section.id}
        extraData={seenSectionIds}
        renderItem={({ item }) => (
          <SectionRenderer
            section={item}
            scrollY={scrollY}
            isVisible={seenSectionIds.includes(item.id)}
          />
        )}
        ListHeaderComponent={
          isOffline ? (
            <View style={styles.offlineNotice}>
              <AppText variant="small" color="onAccent">
                You are offline. Showing your last saved home screen. Pull down
                to retry.
              </AppText>
            </View>
          ) : undefined
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingTop: headerHeight }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
            colors={[theme.colors.primary]}
          />
        }
      />
      <HomeHeader scrollY={scrollY} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    offlineNotice: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.accent,
    },
  });
