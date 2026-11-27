import { ApiError, buildSlots, handleRequest } from '../src/api/mockServer';
import { mockSettings } from '../src/api/mockSettings';
import { Booking, Slot } from '../src/types/models';
import { toDateKey } from '../src/utils/date';

function nextWeekday() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }
  return toDateKey(date);
}

describe('mock server', () => {
  afterEach(() => {
    mockSettings.failure = 'none';
  });

  it('has no slots on Sunday', () => {
    expect(buildSlots('d1', '2026-11-29')).toEqual([]);
  });

  it('books a slot and then answers 409 if someone tries it again', () => {
    const date = nextWeekday();
    const slots = handleRequest(
      'GET',
      `/slots?doctorId=d1&date=${date}`,
    ) as Slot[];
    const freeSlot = slots.find(slot => slot.available) as Slot;

    const booking = handleRequest('POST', '/bookings', {
      doctorId: 'd1',
      slotId: freeSlot.id,
    }) as Booking;
    expect(booking.slotId).toBe(freeSlot.id);

    let error: unknown;
    try {
      handleRequest('POST', '/bookings', {
        doctorId: 'd1',
        slotId: freeSlot.id,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(409);
  });

  it('can be told to fail every booking', () => {
    mockSettings.failure = 'conflict';

    expect(() =>
      handleRequest('POST', '/bookings', { doctorId: 'd1', slotId: 'x' }),
    ).toThrow('Slot already taken');
  });

  it('answers 404 for unknown routes', () => {
    expect(() => handleRequest('GET', '/nope')).toThrow(ApiError);
  });
});
