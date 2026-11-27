const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function pad(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

export function getNextDays(count: number, from: Date = new Date()): Date[] {
  return Array.from({ length: count }, (_, index) => {
    return new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + index,
    );
  });
}

export function getWeekday(date: Date) {
  return WEEKDAYS[date.getDay()];
}

export function getMonthName(date: Date) {
  return MONTHS[date.getMonth()];
}

export function formatTime(iso: string) {
  const hours = Number(iso.slice(11, 13));
  const minutes = iso.slice(14, 16);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

export function formatDate(iso: string) {
  const day = Number(iso.slice(8, 10));
  const month = MONTHS[Number(iso.slice(5, 7)) - 1];
  return `${day} ${month} ${iso.slice(0, 4)}`;
}
