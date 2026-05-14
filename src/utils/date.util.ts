import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/de';

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.locale('de');

/**
 * Formats an ISO date string
 * @param date ISO date string
 * @param format Format string
 * @returns Formatted date
 */
export const formatDate = (date: string, format = 'DD.MM.YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Calculates the duration between start and end time in hours
 * @param startTime Start time "HH:mm"
 * @param endTime End time "HH:mm"
 * @returns Duration in hours
 */
export const calculateDurationHours = (startTime: string, endTime?: string): number => {
  if (!endTime) return 0;

  const start = dayjs(`2000-01-01T${startTime}`);
  let end = dayjs(`2000-01-01T${endTime}`);

  // Handle shifts spanning midnight
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  const diffMinutes = end.diff(start, 'minute');
  return diffMinutes / 60;
};
