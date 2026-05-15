import dayjs, { type Dayjs } from 'dayjs';
import { MAX_SHIFTS_FOR_ROLLING_AVG, MIN_SHIFTS_FOR_ROLLING_AVG } from '../constants';
import type { DashboardPeriod, Shift, TipTransaction } from '../store/types';
import { calculateDurationHours } from './date.util';

export type { DashboardPeriod };

export interface DashboardStats {
  totalShifts: number;
  totalHours: number;
  totalEarnings: number;
  totalTips: number;
  totalWage: number;
  avgMoneyPerShift: number | null;
  avgTipPerShift: number | null;
  avgHoursPerShift: number | null;
  tipEfficiency: number | null;
}

export interface CumulativeDataPoint {
  label: string;
  cumulative: number;
}

export interface IncomeVsTipsDataPoint {
  label: string;
  income: number;
  tips: number;
}

export interface HeatmapCell {
  label: string;
  value: number;
  date: string;
  isEmpty: boolean;
}

export function filterShiftsByCompany(shifts: Shift[], companyId: string): Shift[] {
  return shifts.filter((s) => s.companyId === companyId);
}

export function filterShiftsByPeriod(
  shifts: Shift[],
  period: DashboardPeriod,
  now: Dayjs = dayjs(),
): Shift[] {
  let startDate: string;
  let endDate: string;

  if (period === 'month') {
    startDate = now.startOf('month').format('YYYY-MM-DD');
    endDate = now.endOf('month').format('YYYY-MM-DD');
  } else if (period === 'three-months') {
    startDate = now.subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
    endDate = now.endOf('month').format('YYYY-MM-DD');
  } else {
    startDate = now.startOf('year').format('YYYY-MM-DD');
    endDate = now.endOf('year').format('YYYY-MM-DD');
  }

  return shifts
    .filter((s) => !!s.endTime && s.date >= startDate && s.date <= endDate)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function calculateRollingAverage(
  values: number[],
  min: number = MIN_SHIFTS_FOR_ROLLING_AVG,
  max: number = MAX_SHIFTS_FOR_ROLLING_AVG,
): number | null {
  if (values.length < min) return null;
  const slice = values.slice(-max);
  return slice.reduce((sum, v) => sum + v, 0) / slice.length;
}

export function computeStats(shifts: Shift[]): DashboardStats {
  const totalShifts = shifts.length;

  const hoursArr = shifts.map((s) => calculateDurationHours(s.startTime, s.endTime));
  const totalHours = hoursArr.reduce((sum, h) => sum + h, 0);

  const tipsArr = shifts.map((s) => s.tips || 0);
  const totalTips = tipsArr.reduce((sum, t) => sum + t, 0);

  const wageArr = shifts.map((s, i) => hoursArr[i] * s.hourlyRate);
  const totalWage = wageArr.reduce((sum, w) => sum + w, 0);

  const totalEarnings = totalWage + totalTips;

  const earningsArr = shifts.map((_s, i) => wageArr[i] + tipsArr[i]);

  const avgMoneyPerShift = calculateRollingAverage(earningsArr);
  const avgTipPerShift = calculateRollingAverage(tipsArr);
  const avgHoursPerShift = calculateRollingAverage(hoursArr);

  const tipEfficiency = totalEarnings === 0 ? null : (totalTips / totalEarnings) * 100;

  return {
    totalShifts,
    totalHours,
    totalEarnings,
    totalTips,
    totalWage,
    avgMoneyPerShift,
    avgTipPerShift,
    avgHoursPerShift,
    tipEfficiency,
  };
}

export function getPreviousPeriodRange(
  period: DashboardPeriod,
  now: Dayjs = dayjs(),
): { start: string; end: string } {
  if (period === 'month') {
    const prev = now.subtract(1, 'month');
    return {
      start: prev.startOf('month').format('YYYY-MM-DD'),
      end: prev.endOf('month').format('YYYY-MM-DD'),
    };
  } else if (period === 'three-months') {
    return {
      start: now.subtract(5, 'month').startOf('month').format('YYYY-MM-DD'),
      end: now.subtract(3, 'month').endOf('month').format('YYYY-MM-DD'),
    };
  } else {
    const prev = now.subtract(1, 'year');
    return {
      start: prev.startOf('year').format('YYYY-MM-DD'),
      end: prev.endOf('year').format('YYYY-MM-DD'),
    };
  }
}

function getISOWeekMonday(date: Dayjs): Dayjs {
  const dow = date.day();
  return date.subtract(dow === 0 ? 6 : dow - 1, 'day').startOf('day');
}

interface Bucket {
  label: string;
  startDate: string;
  endDate: string;
}

function generateBuckets(period: DashboardPeriod, now: Dayjs): Bucket[] {
  if (period === 'month') {
    const buckets: Bucket[] = [];
    const today = now.date();
    for (let day = 1; day <= today; day++) {
      const d = now.date(day);
      const dateStr = d.format('YYYY-MM-DD');
      buckets.push({ label: String(day), startDate: dateStr, endDate: dateStr });
    }
    return buckets;
  }

  if (period === 'three-months') {
    const buckets: Bucket[] = [];
    const periodEnd = now.endOf('month');
    let weekStart = getISOWeekMonday(now.subtract(2, 'month').startOf('month'));

    while (weekStart.isBefore(periodEnd) || weekStart.isSame(periodEnd, 'day')) {
      const weekEnd = weekStart.add(6, 'day').endOf('day');
      buckets.push({
        label: weekStart.format('DD.MM'),
        startDate: weekStart.format('YYYY-MM-DD'),
        endDate: weekEnd.format('YYYY-MM-DD'),
      });
      weekStart = weekStart.add(7, 'day');
    }
    return buckets;
  }

  // year
  const buckets: Bucket[] = [];
  const currentMonth = now.month(); // 0-indexed
  for (let m = 0; m <= currentMonth; m++) {
    const month = now.month(m);
    buckets.push({
      label: month.format('MMM'),
      startDate: month.startOf('month').format('YYYY-MM-DD'),
      endDate: month.endOf('month').format('YYYY-MM-DD'),
    });
  }
  return buckets;
}

export function generateCumulativeData(
  shifts: Shift[],
  period: DashboardPeriod,
  now: Dayjs = dayjs(),
): CumulativeDataPoint[] {
  const buckets = generateBuckets(period, now);
  let cumulative = 0;

  return buckets.map((bucket) => {
    const bucketShifts = shifts.filter(
      (s) => s.date >= bucket.startDate && s.date <= bucket.endDate,
    );
    for (const s of bucketShifts) {
      const hours = calculateDurationHours(s.startTime, s.endTime);
      cumulative += hours * s.hourlyRate + (s.tips || 0);
    }
    return { label: bucket.label, cumulative: Math.round(cumulative * 100) / 100 };
  });
}

export function generateGroupedBarData(
  shifts: Shift[],
  period: DashboardPeriod,
  now: Dayjs = dayjs(),
  tipTransactions: TipTransaction[] = [],
): IncomeVsTipsDataPoint[] {
  const buckets = generateBuckets(period, now);

  return buckets.map((bucket) => {
    const bucketShifts = shifts.filter(
      (s) => s.date >= bucket.startDate && s.date <= bucket.endDate,
    );
    let income = 0;
    let tips = 0;
    for (const s of bucketShifts) {
      const hours = calculateDurationHours(s.startTime, s.endTime);
      income += hours * s.hourlyRate;
      tips += s.tips || 0;
    }
    for (const tx of tipTransactions) {
      if (tx.date >= bucket.startDate && tx.date <= bucket.endDate) {
        tips += tx.amount;
      }
    }
    return { label: bucket.label, income, tips };
  });
}

export function generateHeatmapData(
  shifts: Shift[],
  period: DashboardPeriod,
  now: Dayjs = dayjs(),
): HeatmapCell[] {
  if (period === 'month') {
    const daysInMonth = now.daysInMonth();
    const cells: HeatmapCell[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = now.date(day);
      const dateStr = d.format('YYYY-MM-DD');
      const dayShifts = shifts.filter((s) => s.date === dateStr);
      const value = dayShifts.reduce((sum, s) => sum + (s.tips || 0), 0);
      cells.push({ label: String(day), value, date: dateStr, isEmpty: dayShifts.length === 0 });
    }
    return cells;
  }

  if (period === 'three-months') {
    const cells: HeatmapCell[] = [];
    const periodEnd = now.endOf('month');
    let weekStart = getISOWeekMonday(now.subtract(2, 'month').startOf('month'));

    while (weekStart.isBefore(periodEnd) || weekStart.isSame(periodEnd, 'day')) {
      const weekEndDate = weekStart.add(6, 'day').format('YYYY-MM-DD');
      const weekStartDate = weekStart.format('YYYY-MM-DD');
      const weekShifts = shifts.filter((s) => s.date >= weekStartDate && s.date <= weekEndDate);
      const value = weekShifts.reduce((sum, s) => sum + (s.tips || 0), 0);
      const thursday = weekStart.add(3, 'day');
      const yearStart = dayjs(`${thursday.year()}-01-01`);
      const weekNum = Math.ceil((thursday.diff(yearStart, 'day') + 1) / 7);
      cells.push({
        label: `W${weekNum}`,
        value,
        date: weekStartDate,
        isEmpty: weekShifts.length === 0,
      });
      weekStart = weekStart.add(7, 'day');
    }
    return cells;
  }

  // year: always 12 months (Jan–Dec)
  const cells: HeatmapCell[] = [];
  for (let m = 0; m < 12; m++) {
    const month = now.month(m);
    const startDate = month.startOf('month').format('YYYY-MM-DD');
    const endDate = month.endOf('month').format('YYYY-MM-DD');
    const monthShifts = shifts.filter((s) => s.date >= startDate && s.date <= endDate);
    const value = monthShifts.reduce((sum, s) => sum + (s.tips || 0), 0);
    cells.push({
      label: month.format('MMM'),
      value,
      date: startDate,
      isEmpty: monthShifts.length === 0,
    });
  }
  return cells;
}
