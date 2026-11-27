import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseConfig } from './parseConfig';
import { LayoutConfig } from './types';

const CACHE_KEY = 'tapza.lastGoodConfig';

export async function saveConfig(config: LayoutConfig) {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(config));
}

export async function loadCachedConfig(): Promise<LayoutConfig | null> {
  try {
    const saved = await AsyncStorage.getItem(CACHE_KEY);
    return saved ? parseConfig(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}
