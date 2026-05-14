import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Shift } from '../store/types';
import { useAppStore } from '../store/useAppStore';
import { useShiftStats } from './useShiftStats.hook';

function resetStore() {
  useAppStore.setState({
    profile: null,
    companies: [],
    shifts: [],
    tipTransactions: [],
    isOnboarded: false,
  });
}

describe('useShiftStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sorts shifts newest first', () => {
    const shifts: Shift[] = [
      {
        id: 'old',
        date: '2026-04-01',
        startTime: '10:00',
        endTime: '12:00',
        companyId: 'c',
        venue: 'A',
        hourlyRate: 10,
        tips: 0,
      },
      {
        id: 'new',
        date: '2026-05-02',
        startTime: '10:00',
        endTime: '12:00',
        companyId: 'c',
        venue: 'B',
        hourlyRate: 10,
        tips: 0,
      },
    ];
    useAppStore.setState({ shifts });

    const { result } = renderHook(() => useShiftStats());

    expect(result.current.sortedShifts[0]?.id).toBe('new');
  });

  it('groups shifts by month label', () => {
    const shifts: Shift[] = [
      {
        id: 'a',
        date: '2026-05-01',
        startTime: '10:00',
        endTime: '12:00',
        companyId: 'c',
        venue: 'A',
        hourlyRate: 10,
        tips: 0,
      },
      {
        id: 'b',
        date: '2026-05-03',
        startTime: '10:00',
        endTime: '12:00',
        companyId: 'c',
        venue: 'B',
        hourlyRate: 10,
        tips: 0,
      },
    ];
    useAppStore.setState({ shifts });

    const { result } = renderHook(() => useShiftStats());

    const mayKey = Object.keys(result.current.groupedShifts).find((k) => k.includes('2026'));
    if (!mayKey) {
      throw new Error('expected a month grouping key');
    }
    expect(result.current.groupedShifts[mayKey]).toHaveLength(2);
  });

  it('counts planned vs closed shifts in the current month', () => {
    useAppStore.setState({
      shifts: [
        {
          id: 'open',
          date: '2026-05-10',
          startTime: '18:00',
          companyId: 'c',
          venue: 'V',
          hourlyRate: 10,
          tips: 0,
        },
        {
          id: 'done',
          date: '2026-05-11',
          startTime: '10:00',
          endTime: '12:00',
          companyId: 'c',
          venue: 'V',
          hourlyRate: 10,
          tips: 0,
        },
      ],
    });

    const { result } = renderHook(() => useShiftStats());

    expect(result.current.plannedShifts).toBe(1);
    expect(result.current.closedShifts).toBe(1);
  });
});
