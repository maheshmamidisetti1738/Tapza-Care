import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api/client';
import { bundledConfig } from './bundledConfig';
import { loadCachedConfig, saveConfig } from './configStorage';
import { parseConfig } from './parseConfig';
import { LayoutConfig } from './types';

interface ConfigState {
  config: LayoutConfig;
  isReady: boolean;
  isRefreshing: boolean;
  isOffline: boolean;
  reload: () => Promise<void>;
}

const ConfigContext = createContext<ConfigState | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<LayoutConfig>(bundledConfig);
  const [isReady, setIsReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const reload = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fresh = parseConfig(await api.getConfig());
      setConfig(fresh);
      setIsOffline(false);
      await saveConfig(fresh);
    } catch {
      const cached = await loadCachedConfig();
      setConfig(cached ?? bundledConfig);
      setIsOffline(true);
    } finally {
      setIsRefreshing(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(
    () => ({ config, isReady, isRefreshing, isOffline, reload }),
    [config, isReady, isRefreshing, isOffline, reload],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const value = useContext(ConfigContext);
  if (!value) {
    throw new Error('useConfig must be used inside ConfigProvider');
  }
  return value;
}
