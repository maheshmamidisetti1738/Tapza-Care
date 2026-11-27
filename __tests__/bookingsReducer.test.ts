import {
  bookingsReducer,
  MyBooking,
} from '../src/features/booking/bookingsReducer';
import { Doctor, Slot } from '../src/types/models';

const doctor: Doctor = {
  id: 'd1',
  name: 'Dr. Lakshmi Reddy',
  specialty: 'General Physician',
  photoUrl: 'https://example.com/photo.jpg',
  feeInr: 300,
  languages: ['English', 'Telugu'],
};

const slot: Slot = {
  id: 'd1-2026-11-27-0930',
  doctorId: 'd1',
  startsAt: '2026-11-27T09:30:00+05:30',
  endsAt: '2026-11-27T10:00:00+05:30',
  available: true,
};

const pendingBooking: MyBooking = {
  localId: 'local-1',
  doctor,
  slot,
  status: 'confirming',
};

describe('bookingsReducer', () => {
  it('shows a new booking straight away as "confirming"', () => {
    const state = bookingsReducer([], {
      type: 'added',
      booking: pendingBooking,
    });

    expect(state).toHaveLength(1);
    expect(state[0].status).toBe('confirming');
  });

  it('marks the booking as confirmed and keeps the server id', () => {
    const state = bookingsReducer([pendingBooking], {
      type: 'confirmed',
      localId: 'local-1',
      bookingId: 'bk-99',
    });

    expect(state[0].status).toBe('confirmed');
    expect(state[0].bookingId).toBe('bk-99');
  });

  it('removes the booking again when the server rejects it', () => {
    const state = bookingsReducer([pendingBooking], {
      type: 'failed',
      localId: 'local-1',
    });

    expect(state).toEqual([]);
  });

  it('only touches the booking it was asked about', () => {
    const other: MyBooking = { ...pendingBooking, localId: 'local-2' };
    const state = bookingsReducer([other, pendingBooking], {
      type: 'failed',
      localId: 'local-1',
    });

    expect(state).toEqual([other]);
  });
});
