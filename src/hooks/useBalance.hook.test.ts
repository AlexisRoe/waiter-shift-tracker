import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../i18n';
import type { Company, Shift, UserProfile } from '../store/types';
import { useAppStore } from '../store/useAppStore';
import { useBalance } from './useBalance.hook';

const profile: UserProfile = {
  name: 'Alex',
  defaultCompanyId: 'c1',
  startingTipBudget: 20,
  language: 'de',
  maxMonthlyEarnings: 5000,
  minHourlyWage: 12,
};

const company: Company = {
  id: 'c1',
  name: 'Bistro',
  hourlyRate: 10,
  createdAt: '2026-01-01',
};

const endedShift = (overrides: Partial<Shift> = {}): Shift => ({
  id: 's1',
  date: '2026-05-10',
  startTime: '10:00',
  endTime: '14:00',
  companyId: 'c1',
  venue: 'Bistro',
  hourlyRate: 10,
  tips: 8,
  ...overrides,
});

function resetStore() {
  useAppStore.setState({
    profile,
    companies: [company],
    shifts: [],
    tipTransactions: [],
    isOnboarded: true,
  });
}

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(I18nextProvider, { i18n }, children);

describe('useBalance', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('computes monthly wage and tips from shifts in the current month', () => {
    useAppStore.setState({ shifts: [endedShift()] });

    const { result } = renderHook(() => useBalance(), { wrapper });

    expect(result.current.monthlyWage).toBe(40);
    expect(result.current.monthlyTips).toBe(8);
    expect(result.current.monthlyTotal).toBe(48);
  });

  it('computes tip jar balance from starting budget, shift tips, and manual transactions', () => {
    useAppStore.setState({
      shifts: [endedShift({ tips: 5 })],
      tipTransactions: [
        { id: 't1', date: '2026-05-01', amount: 15, note: 'Cash' },
        { id: 't2', date: '2026-05-02', amount: -10, note: 'ATM' },
      ],
    });

    const { result } = renderHook(() => useBalance(), { wrapper });

    expect(result.current.currentPot).toBe(20 + 5 + 15 - 10);
    expect(result.current.totalOut).toBe(-10);
  });

  it('builds unified transactions for completed shifts and tip rows', () => {
    useAppStore.setState({ shifts: [endedShift()] });

    const { result } = renderHook(() => useBalance(), { wrapper });

    const types = result.current.allTransactions.map((t) => t.type);
    expect(types).toContain('wage');
    expect(types).toContain('shiftTip');
  });

  it('omits wage rows for shifts that are not ended', () => {
    useAppStore.setState({
      shifts: [endedShift({ endTime: undefined })],
    });

    const { result } = renderHook(() => useBalance(), { wrapper });

    expect(result.current.allTransactions).toHaveLength(0);
  });

  it('filters transactions by tab', () => {
    useAppStore.setState({ shifts: [endedShift()] });

    const { result } = renderHook(() => useBalance(), { wrapper });

    act(() => {
      result.current.setTab('Shifts');
    });
    expect(result.current.filteredTransactions.every((t) => t.type === 'wage')).toBe(true);

    act(() => {
      result.current.setTab('Tips');
    });
    expect(result.current.filteredTransactions.every((t) => t.type !== 'wage')).toBe(true);
  });
});
