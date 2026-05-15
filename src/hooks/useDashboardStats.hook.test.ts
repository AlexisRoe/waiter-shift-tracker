import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../store/app.store';
import type { Company, Shift, UserProfile } from '../store/types';
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

    const { result } = renderHook(() => useDashboardStats('month'));

    expect(result.current.stats.totalHours).toBe(2);
    expect(result.current.stats.totalWage).toBe(24);
    expect(result.current.stats.totalTips).toBe(6);
    expect(result.current.stats.totalEarnings).toBe(30);
  });

  it('generates cumulative data points for the current month (up to today = day 15)', () => {
    const { result } = renderHook(() => useDashboardStats('month'));

    expect(result.current.cumulativeData).toHaveLength(15);
    expect(result.current.cumulativeData[0].label).toBe('1');
    expect(result.current.cumulativeData[14].label).toBe('15');
  });

  it('returns grouped bar data with income and tips buckets for month period', () => {
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

    const { result } = renderHook(() => useDashboardStats('month'));

    const firstBucket = result.current.groupedBarData[0];
    expect(firstBucket?.label).toBe('1');
    expect(firstBucket?.income).toBe(20);
    expect(firstBucket?.tips).toBe(4);
  });

  it('only includes shifts from the default company', () => {
    useAppStore.setState({
      shifts: [
        {
          id: 's1',
          date: '2026-05-10',
          startTime: '10:00',
          endTime: '12:00',
          companyId: 'c1',
          venue: 'Bistro',
          hourlyRate: 12,
          tips: 5,
        },
        {
          id: 's2',
          date: '2026-05-11',
          startTime: '10:00',
          endTime: '12:00',
          companyId: 'other-company',
          venue: 'Other',
          hourlyRate: 15,
          tips: 50,
        },
      ],
    });

    const { result } = renderHook(() => useDashboardStats('month'));

    expect(result.current.stats.totalShifts).toBe(1);
    expect(result.current.stats.totalTips).toBe(5);
  });
});
