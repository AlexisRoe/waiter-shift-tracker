import dayjs from 'dayjs';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

/**
 * Provides shift list data with grouping and current-month summary stats.
 * Extracted from ShiftListScreen.
 */
export const useShiftStats = () => {
  const shifts = useAppStore((state) => state.shifts);

  const sortedShifts = [...shifts].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
  );

  const groupedShifts = sortedShifts.reduce(
    (acc, shift) => {
      const monthYear = dayjs(shift.date).format('MMMM YYYY');
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(shift);
      return acc;
    },
    {} as Record<string, typeof shifts>,
  );

  const sortedMonths = Array.from(
    new Set(sortedShifts.map((s) => dayjs(s.date).format('MMMM YYYY'))),
  );

  const currentMonthShifts = shifts.filter((s) => dayjs(s.date).isSame(dayjs(), 'month'));

  const totalHours = currentMonthShifts.reduce(
    (sum, s) => sum + calculateDurationHours(s.startTime, s.endTime),
    0,
  );

  const totalEarnings = currentMonthShifts.reduce((sum, s) => {
    const hours = calculateDurationHours(s.startTime, s.endTime);
    return sum + hours * s.hourlyRate + (s.tips || 0);
  }, 0);

  const plannedShifts = currentMonthShifts.filter((s) => !s.endTime).length;
  const closedShifts = currentMonthShifts.filter((s) => !!s.endTime).length;

  return {
    sortedShifts,
    groupedShifts,
    sortedMonths,
    currentMonthShifts,
    totalHours,
    totalEarnings,
    plannedShifts,
    closedShifts,
  };
};
