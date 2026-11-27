import { DoseTiming } from '../../types/models';

export const TIMINGS: {
  key: DoseTiming;
  label: string;
  icon: string;
  time: string;
}[] = [
  {
    key: 'morning',
    label: 'Morning',
    icon: 'sunrise',
    time: 'After breakfast, around 8 AM',
  },
  {
    key: 'afternoon',
    label: 'Afternoon',
    icon: 'sun',
    time: 'After lunch, around 2 PM',
  },
  {
    key: 'night',
    label: 'Night',
    icon: 'moon',
    time: 'After dinner, around 9 PM',
  },
];
