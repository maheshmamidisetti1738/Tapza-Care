export type ConfigVariant = 'normal' | 'festival';
export type LatencyMode = 'normal' | 'slow';
export type FailureMode = 'none' | 'network' | 'booking' | 'conflict';

export const mockSettings: {
  configVariant: ConfigVariant;
  latency: LatencyMode;
  failure: FailureMode;
} = {
  configVariant: 'normal',
  latency: 'normal',
  failure: 'none',
};

export const LATENCY_MS: Record<LatencyMode, number> = {
  normal: 600,
  slow: 3500,
};
