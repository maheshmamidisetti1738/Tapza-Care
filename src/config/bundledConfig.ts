import normalDayConfig from '../api/mock/normalDay.config.json';
import { parseConfig } from './parseConfig';

export const bundledConfig = parseConfig(normalDayConfig);
