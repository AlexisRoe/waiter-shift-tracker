import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Company, Shift, UserProfile } from '../store/types';
import { useAppStore } from '../store/useAppStore';
import { useDashboardStats } from './useDashboardStats.hook';

const profile: UserProfile = {
  name: 'Alex',
  defaultCompanyId: 'c1',
  startingTipBudget: 0,
  language: 'de',
  maxMonthlyEarnings: 5000,
  minHourlyWage: 12,
};

const company: Company = {
  id: 'c1',
  name: 'Bistro',
  hourlyRate: 12,
  createdAt: '2026-01-01',
};

function resetStore() {
  useAppStore.setState({
    profile,
    companies: [company],
    shifts: [],
    tipTransactions: [],
    isOnboarded: true,
  });
}

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
    resetStore();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('aggregates hours and earnings for the current month', () => {
    const shifts: Shift[] = [
      {
        id: 's1',
        date: '2026-05-10',
        startTime: '10:00',
        endTime: '12:00',
        companyId: 'c1',
        venue: 'Bistro',
        hourlyRate: 12,
        tips: 6,
      },
    ];
    useAppStore.setState({ shifts });

    const { result } = renderHook(() => useDashboardStats());

    expect(result.current.totalHours).toBe(2);
    expect(result.current.monthlyWage).toBe(24);
    expect(result.current.monthlyTips).toBe(6);
    expect(result.current.totalEarnings).toBe(30);
    expect(result.current.avgHourly).toBe(15);
  });

  it('exposes fourteen trend points when randomness is fixed', () => {
    const { result } = renderHook(() => useDashboardStats());

    expect(result.current.trendData).toHaveLength(14);
    expect(result.current.trendData[0]?.value).toBe(100);
  });

  it('includes seven weekday buckets for the chart', () => {
    const { result } = renderHook(() => useDashboardStats());

    expect(result.current.weekdayData).toHaveLength(7);
    expect(result.current.weekdayData.reduce((s, d) => s + d.hours, 0)).toBeGreaterThan(0);
  });

  it('injects live monthly totals into the last chart bar', () => {
    useAppStore.setState({
      shifts: [
        {
          id: 's1',
          date: '2026-05-01',
          startTime: '09:00',
          endTime: '11:00',
          companyId: 'c1',
          venue: 'Bistro',
          hourlyRate: 10,
          tips: 4,
        },
      ],
    });

    const { result } = renderHook(() => useDashboardStats());

    const last = result.current.monthlyChartData.at(-1);
    expect(last?.wage).toBe(20);
    expect(last?.tips).toBe(4);
  });
});
