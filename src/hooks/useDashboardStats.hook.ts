import dayjs from 'dayjs';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface WeekdayDataPoint {
  day: string;
  hours: number;
}

export interface MonthlyChartDataPoint {
  month: string;
  wage: number;
  tips: number;
}

/**
 * Provides all dashboard statistics and chart data.
 * Extracted from DashboardScreen.
 */
export const useDashboardStats = () => {
  const profile = useAppStore((state) => state.profile);
  const shifts = useAppStore((state) => state.shifts);

  const currentMonthShifts = shifts.filter((s) => dayjs(s.date).isSame(dayjs(), 'month'));

  const totalHours = currentMonthShifts.reduce(
    (sum, s) => sum + calculateDurationHours(s.startTime, s.endTime),
    0,
  );

  const totalEarnings = currentMonthShifts.reduce((sum, s) => {
    const hours = calculateDurationHours(s.startTime, s.endTime);
    return sum + hours * s.hourlyRate + (s.tips || 0);
  }, 0);

  const monthlyWage = currentMonthShifts.reduce((sum, s) => {
    return sum + calculateDurationHours(s.startTime, s.endTime) * s.hourlyRate;
  }, 0);

  const monthlyTips = currentMonthShifts.reduce((sum, s) => sum + (s.tips || 0), 0);

  const avgHourly = totalHours > 0 ? totalEarnings / totalHours : 0;

  // Mock data for charts to match screenshots visually
  const trendData: TrendDataPoint[] = Array.from({ length: 14 }).map((_, i) => ({
    date: dayjs()
      .subtract(13 - i, 'day')
      .format('MMM D'),
    value: Math.random() * 100 + 50,
  }));

  const weekdayData: WeekdayDataPoint[] = [
    { day: 'M', hours: 4 },
    { day: 'T', hours: 5 },
    { day: 'W', hours: 2 },
    { day: 'T', hours: 6 },
    { day: 'F', hours: 8 },
    { day: 'S', hours: 10 }, // Sat is best
    { day: 'S', hours: 7 },
  ];

  const monthlyChartData: MonthlyChartDataPoint[] = [
    { month: 'Nov', wage: 270, tips: 100 },
    { month: 'Dec', wage: 330, tips: 139 },
    { month: 'Jan', wage: 400, tips: 130 },
    { month: 'Feb', wage: 320, tips: 78 },
    { month: 'Mar', wage: 200, tips: 46 },
    { month: dayjs().format('MMM'), wage: monthlyWage, tips: monthlyTips },
  ];

  return {
    profile,
    currentMonthShifts,
    totalHours,
    totalEarnings,
    monthlyWage,
    monthlyTips,
    avgHourly,
    trendData,
    weekdayData,
    monthlyChartData,
  };
};
