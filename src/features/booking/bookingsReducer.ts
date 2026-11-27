import { Doctor, Slot } from '../../types/models';

export interface MyBooking {
  localId: string;
  bookingId?: string;
  doctor: Doctor;
  slot: Slot;
  serviceName?: string;
  status: 'confirming' | 'confirmed';
}

export type BookingsAction =
  | { type: 'added'; booking: MyBooking }
  | { type: 'confirmed'; localId: string; bookingId: string }
  | { type: 'failed'; localId: string };

export function bookingsReducer(
  state: MyBooking[],
  action: BookingsAction,
): MyBooking[] {
  switch (action.type) {
    case 'added':
      return [action.booking, ...state];
    case 'confirmed':
      return state.map(booking =>
        booking.localId === action.localId
          ? { ...booking, bookingId: action.bookingId, status: 'confirmed' }
          : booking,
      );
    case 'failed':
      return state.filter(booking => booking.localId !== action.localId);
    default:
      return state;
  }
}
