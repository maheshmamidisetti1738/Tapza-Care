import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { api, ApiError } from '../../api/client';
import { Doctor, Slot } from '../../types/models';
import { bookingsReducer, MyBooking } from './bookingsReducer';

export type BookOutcome = 'confirmed' | 'slot_taken' | 'failed';

interface BookingsState {
  bookings: MyBooking[];
  bookSlot: (
    doctor: Doctor,
    slot: Slot,
    serviceName?: string,
  ) => Promise<BookOutcome>;
}

const BookingsContext = createContext<BookingsState | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, dispatch] = useReducer(bookingsReducer, []);

  const bookSlot = useCallback(
    async (
      doctor: Doctor,
      slot: Slot,
      serviceName?: string,
    ): Promise<BookOutcome> => {
      const localId = `local-${Date.now()}`;

      dispatch({
        type: 'added',
        booking: { localId, doctor, slot, serviceName, status: 'confirming' },
      });

      try {
        const booking = await api.createBooking(doctor.id, slot.id);
        dispatch({ type: 'confirmed', localId, bookingId: booking.id });
        return 'confirmed';
      } catch (error) {
        dispatch({ type: 'failed', localId });
        return error instanceof ApiError && error.status === 409
          ? 'slot_taken'
          : 'failed';
      }
    },
    [],
  );

  const value = useMemo(() => ({ bookings, bookSlot }), [bookings, bookSlot]);

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const value = useContext(BookingsContext);
  if (!value) {
    throw new Error('useBookings must be used inside BookingsProvider');
  }
  return value;
}
