import dayjs from 'dayjs';
import { useAppStore } from '../store/app.store';
import {
  type CumulativeDataPoint,
  computeStats,
  type DashboardPeriod,
  type DashboardStats,
  filterShiftsByCompany,
  filterShiftsByPeriod,
  generateCumulativeData,
  generateGroupedBarData,
  generateHeatmapData,
  getPreviousPeriodRange,
  type HeatmapCell,
  type IncomeVsTipsDataPoint,
} from '../utils/dashboardCalculations.util';

export type {
  CumulativeDataPoint,
  DashboardPeriod,
  DashboardStats,
  HeatmapCell,
  IncomeVsTipsDataPoint,
};

export const useDashboardStats = (period: DashboardPeriod) => {
  const profile = useAppStore((state) => state.profile);
  const allShifts = useAppStore((state) => state.shifts);
  const tipTransactions = useAppStore((state) => state.tipTransactions);
  const now = dayjs();

  const companyId = profile?.defaultCompanyId ?? '';
  const companyShifts = companyId ? filterShiftsByCompany(allShifts, companyId) : [];

  const periodShifts = filterShiftsByPeriod(companyShifts, period, now);
  const stats = computeStats(periodShifts);

  const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(period, now);
  const prevShifts = companyShifts.filter(
    (s) => !!s.endTime && s.date >= prevStart && s.date <= prevEnd,
  );
  const prevStats = computeStats(prevShifts);

  const earningsChange: number | null =
    prevStats.totalEarnings > 0
      ? Math.round(
          ((stats.totalEarnings - prevStats.totalEarnings) / prevStats.totalEarnings) * 100,
        )
      : null;

  const cumulativeData = generateCumulativeData(periodShifts, period, now);
  const groupedBarData = generateGroupedBarData(periodShifts, period, now, tipTransactions);
  const heatmapData = generateHeatmapData(periodShifts, period, now);

  return {
    profile,
    stats,
    earningsChange,
    cumulativeData,
    groupedBarData,
    heatmapData,
    hasShifts: periodShifts.length > 0,
  };
};
