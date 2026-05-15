import { describe, expect, it } from 'vitest';
import { calculateDurationHours, formatDate, groupByMonth } from './date.util';

describe('formatDate', () => {
  it('formats an ISO date with the default pattern', () => {
    expect(formatDate('2026-05-15')).toBe('15.05.2026');
  });

  it('accepts a custom format string', () => {
    expect(formatDate('2026-05-15', 'YYYY-MM-DD')).toBe('2026-05-15');
  });
});

describe('calculateDurationHours', () => {
  it('returns 0 when end time is missing', () => {
    expect(calculateDurationHours('09:00')).toBe(0);
    expect(calculateDurationHours('09:00', undefined)).toBe(0);
  });

  it('returns the difference in hours on the same calendar day', () => {
    expect(calculateDurationHours('10:00', '12:30')).toBe(2.5);
  });

  it('adds a day when the end time is before the start time (overnight shift)', () => {
    expect(calculateDurationHours('22:00', '02:00')).toBe(4);
  });
});

describe('groupByMonth', () => {
  const items = [
    { id: 'a', date: '2026-05-01' },
    { id: 'b', date: '2026-05-15' },
    { id: 'c', date: '2026-04-10' },
  ];

  it('groups items by MMMM YYYY month in uppercase', () => {
    const result = groupByMonth(items, (i) => i.date);
    expect(Object.keys(result)).toHaveLength(2);
  });

  it('puts items in the correct month bucket', () => {
    const result = groupByMonth(items, (i) => i.date);
    const keys = Object.keys(result);
    const mayKey = keys.find((k) => k.includes('2026') && result[k].some((i) => i.id === 'a'));
    const aprKey = keys.find((k) => k.includes('2026') && result[k].some((i) => i.id === 'c'));
    expect(mayKey).toBeTruthy();
    expect(aprKey).toBeTruthy();
    if (!mayKey || !aprKey) return;
    expect(result[mayKey]).toHaveLength(2);
    expect(result[aprKey]).toHaveLength(1);
  });

  it('returns an empty object for an empty array', () => {
    expect(groupByMonth([], (i: { date: string }) => i.date)).toEqual({});
  });
});
