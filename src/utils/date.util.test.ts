import { describe, expect, it } from 'vitest';
import { calculateDurationHours, formatDate } from './date.util';

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
