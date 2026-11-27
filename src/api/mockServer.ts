import { Booking, Slot } from '../types/models';
import { doctors } from './mock/doctors';
import festivalDayConfig from './mock/festivalDay.config.json';
import normalDayConfig from './mock/normalDay.config.json';
import { prescriptions } from './mock/prescriptions';
import { mockSettings } from './mockSettings';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const bookedSlotIds = new Set<string>();

const MORNING_TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
];
const EVENING_TIMES = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
const SLOT_MINUTES = 30;

function pad(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

function looksBusy(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return hash % 4 === 0;
}

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function buildSlots(doctorId: string, date: string): Slot[] {
  const [year, month, day] = date.split('-').map(Number);
  const isSunday = new Date(year, month - 1, day).getDay() === 0;
  if (isSunday) {
    return [];
  }

  return [...MORNING_TIMES, ...EVENING_TIMES].map(time => {
    const startsAt = `${date}T${time}:00+05:30`;
    const id = `${doctorId}-${date}-${time.replace(':', '')}`;
    const inPast = new Date(startsAt).getTime() < Date.now();
    const available =
      !inPast &&
      !bookedSlotIds.has(id) &&
      !looksBusy(`${doctorId}${date}${time}`);

    return {
      id,
      doctorId,
      startsAt,
      endsAt: `${date}T${addMinutes(time, SLOT_MINUTES)}:00+05:30`,
      available,
    };
  });
}

function parseQuery(query: string) {
  const params: Record<string, string> = {};
  query.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[key] = decodeURIComponent(value ?? '');
    }
  });
  return params;
}

function createBooking(body: { doctorId: string; slotId: string }): Booking {
  if (mockSettings.failure === 'booking') {
    throw new ApiError(500, 'Something went wrong on our side');
  }
  if (mockSettings.failure === 'conflict') {
    throw new ApiError(409, 'Slot already taken');
  }

  const date = body.slotId.slice(
    body.doctorId.length + 1,
    body.doctorId.length + 11,
  );
  const slot = buildSlots(body.doctorId, date).find(s => s.id === body.slotId);

  if (!slot) {
    throw new ApiError(404, 'Slot not found');
  }
  if (!slot.available) {
    throw new ApiError(409, 'Slot already taken');
  }

  bookedSlotIds.add(slot.id);
  return {
    id: `bk-${Date.now()}`,
    doctorId: slot.doctorId,
    slotId: slot.id,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
  };
}

export function handleRequest(
  method: string,
  url: string,
  body?: unknown,
): unknown {
  const [path, query = ''] = url.split('?');
  const route = `${method} ${path}`;

  switch (route) {
    case 'GET /config':
      return mockSettings.configVariant === 'festival'
        ? festivalDayConfig
        : normalDayConfig;
    case 'GET /doctors':
      return doctors;
    case 'GET /slots': {
      const { doctorId, date } = parseQuery(query);
      if (!doctorId || !date) {
        throw new ApiError(400, 'doctorId and date are required');
      }
      return buildSlots(doctorId, date);
    }
    case 'POST /bookings':
      return createBooking(body as { doctorId: string; slotId: string });
    case 'GET /prescriptions':
      return prescriptions;
    default:
      throw new ApiError(404, `No route for ${route}`);
  }
}
