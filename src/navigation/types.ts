import { NavigatorScreenParams } from '@react-navigation/native';
import { Prescription } from '../types/models';

export type TabParamList = {
  home: undefined;
  bookings: undefined;
  prescriptions: undefined;
  profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Doctors: undefined;
  Booking: { doctorId: string; serviceName?: string };
  PrescriptionDetail: { prescription: Prescription };
};
