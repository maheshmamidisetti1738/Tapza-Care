import { Booking, Doctor, Prescription, Slot } from '../types/models';
import { ApiError, handleRequest } from './mockServer';
import { LATENCY_MS, mockSettings } from './mockSettings';

export { ApiError };

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function request<T>(
  method: 'GET' | 'POST',
  url: string,
  body?: unknown,
): Promise<T> {
  await wait(LATENCY_MS[mockSettings.latency]);

  if (mockSettings.failure === 'network') {
    throw new ApiError(0, 'Network request failed');
  }

  const data = handleRequest(method, url, body);
  return JSON.parse(JSON.stringify(data)) as T;
}

export const api = {
  getConfig: () => request<unknown>('GET', '/config'),
  getDoctors: () => request<Doctor[]>('GET', '/doctors'),
  getSlots: (doctorId: string, date: string) =>
    request<Slot[]>('GET', `/slots?doctorId=${doctorId}&date=${date}`),
  createBooking: (doctorId: string, slotId: string) =>
    request<Booking>('POST', '/bookings', { doctorId, slotId }),
  getPrescriptions: () => request<Prescription[]>('GET', '/prescriptions'),
};
