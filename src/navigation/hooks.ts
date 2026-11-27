import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ItemAction } from '../features/home/sections/itemTypes';
import { showMessage } from '../utils/feedback';
import { RootStackParamList } from './types';

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function useRootNavigation() {
  return useNavigation<RootNavigation>();
}

export function useItemAction() {
  const navigation = useRootNavigation();

  return useCallback(
    (action: ItemAction) => {
      switch (action.type) {
        case 'doctors':
          navigation.navigate('Doctors');
          break;
        case 'tab':
          navigation.navigate('Tabs', { screen: action.screen });
          break;
        default:
          showMessage('Coming soon');
      }
    },
    [navigation],
  );
}
