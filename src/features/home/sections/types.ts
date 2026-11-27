import { Animated } from 'react-native';
import { SectionConfig } from '../../../config/types';

export interface SectionProps {
  section: SectionConfig;
  scrollY: Animated.Value;
}
