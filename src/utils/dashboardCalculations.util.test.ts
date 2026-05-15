import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import type { Shift } from '../store/types';
// Side-effect import to ensure dayjs plugins are initialized
import './date.util';
import {
  calculateRollingAverage,
  computeStats,
  filterShiftsByCompany,
  filterShiftsByPeriod,
  generateCumulativeData,
  generateGroupedBarData,
  generateHeatmapData,
} from './dashboardCalculations.util';

function makeShift(overrides: Partial<Shift> = {}): Shift {
  return {
    id: 'shift-1',
    date: '2026-05-15',
    startTime: '18:00',
    endTime: '22:00',
    companyId: 'company-1',
    venue: 'Venue',
    hourlyRate: 12,
    tips: 20,
    ...overrides,
  };
}

const NOW = dayjs('2026-05-15');

// ---------------------------------------------------------------------------
// filterShiftsByCompany
// ---------------------------------------------------------------------------
describe('filterShiftsByCompany', () => {
  it('returns only shifts matching the given companyId', () => {
    const shifts = [
      makeShift({ id: 'a', companyId: 'company-1' }),
      makeShift({ id: 'b', companyId: 'company-2' }),
      makeShift({ id: 'c', companyId: 'company-1' }),
    ];
    const result = filterShiftsByCompany(shifts, 'company-1');
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.companyId === 'company-1')).toBe(true);
  });

  it('excludes shifts from other companies', () => {
    const shifts = [makeShift({ id: 'a', companyId: 'company-2' })];
    expect(filterShiftsByCompany(shifts, 'company-1')).toHaveLength(0);
  });

  it('returns empty array when no shifts', () => {
    expect(filterShiftsByCompany([], 'company-1')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// filterShiftsByPeriod
// ---------------------------------------------------------------------------
describe('filterShiftsByPeriod', () => {
  describe('month', () => {
    it('includes shifts within the current month (2026-05-01 to 2026-05-31)', () => {
      const shifts = [
        makeShift({ id: 'a', date: '2026-05-01' }),
        makeShift({ id: 'b', date: '2026-05-15' }),
        makeShift({ id: 'c', date: '2026-05-31' }),
      ];
      const result = filterShiftsByPeriod(shifts, 'month', NOW);
      expect(result).toHaveLength(3);
    });

    it('excludes shifts outside the current month', () => {
      const shifts = [
        makeShift({ id: 'before', date: '2026-04-30' }),
        makeShift({ id: 'in', date: '2026-05-15' }),
        makeShift({ id: 'after', date: '2026-06-01' }),
      ];
      const result = filterShiftsByPeriod(shifts, 'month', NOW);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('in');
    });
  });

  describe('three-months', () => {
    it('includes shifts from 2026-03-01 to 2026-05-31', () => {
      const shifts = [
        makeShift({ id: 'a', date: '2026-03-01' }),
        makeShift({ id: 'b', date: '2026-04-15' }),
        makeShift({ id: 'c', date: '2026-05-31' }),
      ];
      const result = filterShiftsByPeriod(shifts, 'three-months', NOW);
      expect(result).toHaveLength(3);
    });

    it('excludes Feb 2026', () => {
      const shifts = [makeShift({ id: 'feb', date: '2026-02-28' })];
      expect(filterShiftsByPeriod(shifts, 'three-months', NOW)).toHaveLength(0);
    });

    it('excludes June 2026', () => {
      const shifts = [makeShift({ id: 'jun', date: '2026-06-01' })];
      expect(filterShiftsByPeriod(shifts, 'three-months', NOW)).toHaveLength(0);
    });
  });

  describe('year', () => {
    it('includes all shifts within 2026', () => {
      const shifts = [
        makeShift({ id: 'jan', date: '2026-01-01' }),
        makeShift({ id: 'dec', date: '2026-12-31' }),
      ];
      const result = filterShiftsByPeriod(shifts, 'year', NOW);
      expect(result).toHaveLength(2);
    });

    it('excludes 2025 shifts', () => {
      const shifts = [makeShift({ id: 'old', date: '2025-12-31' })];
      expect(filterShiftsByPeriod(shifts, 'year', NOW)).toHaveLength(0);
    });
  });

  it('excludes shifts without an endTime', () => {
    const shifts = [
      makeShift({ id: 'open', date: '2026-05-15', endTime: undefined }),
      makeShift({ id: 'closed', date: '2026-05-15', endTime: '22:00' }),
    ];
    const result = filterShiftsByPeriod(shifts, 'month', NOW);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('closed');
  });

  it('sorts results by date ascending', () => {
    const shifts = [
      makeShift({ id: 'c', date: '2026-05-20' }),
      makeShift({ id: 'a', date: '2026-05-01' }),
      makeShift({ id: 'b', date: '2026-05-10' }),
    ];
    const result = filterShiftsByPeriod(shifts, 'month', NOW);
    expect(result.map((s) => s.id)).toEqual(['a', 'b', 'c']);
  });
});

// ---------------------------------------------------------------------------
// calculateRollingAverage
// ---------------------------------------------------------------------------
describe('calculateRollingAverage', () => {
  it('returns null for empty values', () => {
    expect(calculateRollingAverage([])).toBeNull();
  });

  it('returns correct average for exactly 8 values', () => {
    const values = [10, 20, 30, 40, 50, 60, 70, 80];
    const avg = (10 + 20 + 30 + 40 + 50 + 60 + 70 + 80) / 8;
    expect(calculateRollingAverage(values)).toBeCloseTo(avg);
  });

  it('uses only the last 8 values for 10 values', () => {
    // First two (100, 200) should be ignored
    const values = [100, 200, 1, 2, 3, 4, 5, 6, 7, 8];
    const last8 = [1, 2, 3, 4, 5, 6, 7, 8];
    const expected = last8.reduce((s, v) => s + v, 0) / 8;
    expect(calculateRollingAverage(values)).toBeCloseTo(expected);
  });

  it('returns correct average for exactly 8 values', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const expected = values.reduce((s, v) => s + v, 0) / 8;
    expect(calculateRollingAverage(values)).toBeCloseTo(expected);
  });
});

// ---------------------------------------------------------------------------
// computeStats
// ---------------------------------------------------------------------------
describe('computeStats', () => {
  it('counts total shifts correctly', () => {
    const shifts = [makeShift({ id: 'a' }), makeShift({ id: 'b' })];
    expect(computeStats(shifts).totalShifts).toBe(2);
  });

  it('calculates total hours as sum of durations (4h each for 18:00–22:00)', () => {
    const shifts = [makeShift({ id: 'a' }), makeShift({ id: 'b' })];
    expect(computeStats(shifts).totalHours).toBeCloseTo(8);
  });

  it('calculates total tips as sum of shift tips', () => {
    const shifts = [makeShift({ id: 'a', tips: 15 }), makeShift({ id: 'b', tips: 25 })];
    expect(computeStats(shifts).totalTips).toBe(40);
  });

  it('calculates totalWage as hours * hourlyRate', () => {
    // 4 hours * 12 = 48 per shift, 2 shifts = 96
    const shifts = [makeShift({ id: 'a', hourlyRate: 12 }), makeShift({ id: 'b', hourlyRate: 12 })];
    expect(computeStats(shifts).totalWage).toBeCloseTo(96);
  });

  it('calculates totalEarnings as wage + tips', () => {
    // wage: 4*12=48, tips: 20 => 68 per shift, 2 shifts = 136
    const shifts = [makeShift({ id: 'a' }), makeShift({ id: 'b' })];
    const { totalEarnings, totalWage, totalTips } = computeStats(shifts);
    expect(totalEarnings).toBeCloseTo(totalWage + totalTips);
    expect(totalEarnings).toBeCloseTo(136);
  });

  it('avgMoneyPerShift is null for 0 shifts', () => {
    expect(computeStats([]).avgMoneyPerShift).toBeNull();
  });

  it('computes avgMoneyPerShift for any shifts (avg of last 8)', () => {
    // 4 shifts, each earns 4*12+20 = 68
    const shifts = Array.from({ length: 4 }, (_, i) => makeShift({ id: `s${i}` }));
    const { avgMoneyPerShift } = computeStats(shifts);
    expect(avgMoneyPerShift).not.toBeNull();
    expect(avgMoneyPerShift).toBeCloseTo(68);
  });

  it('calculates tipEfficiency as (totalTips/totalEarnings)*100', () => {
    // wage: 4*12=48, tips=20, earnings=68, efficiency=20/68*100
    const shifts = Array.from({ length: 8 }, (_, i) => makeShift({ id: `s${i}` }));
    const { tipEfficiency } = computeStats(shifts);
    const expected = (20 / 68) * 100;
    expect(tipEfficiency).toBeCloseTo(expected);
  });

  it('tipEfficiency is null when totalEarnings is 0', () => {
    const shifts: Shift[] = [];
    expect(computeStats(shifts).tipEfficiency).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// generateCumulativeData
// ---------------------------------------------------------------------------
describe('generateCumulativeData', () => {
  it('month with now=2026-05-15 generates 15 buckets', () => {
    const result = generateCumulativeData([], 'month', NOW);
    expect(result).toHaveLength(15);
  });

  it('values accumulate correctly', () => {
    const shift1 = makeShift({
      date: '2026-05-01',
      startTime: '18:00',
      endTime: '22:00',
      hourlyRate: 10,
      tips: 0,
    });
    const shift2 = makeShift({
      date: '2026-05-02',
      startTime: '18:00',
      endTime: '22:00',
      hourlyRate: 10,
      tips: 0,
    });
    const result = generateCumulativeData([shift1, shift2], 'month', NOW);
    // Day 1: 4h * 10 = 40
    expect(result[0].cumulative).toBeCloseTo(40);
    // Day 2: 40 + 40 = 80
    expect(result[1].cumulative).toBeCloseTo(80);
    // Day 3 onward: still 80
    expect(result[2].cumulative).toBeCloseTo(80);
  });

  it('bucket labels for month are day numbers as strings', () => {
    const result = generateCumulativeData([], 'month', NOW);
    expect(result[0].label).toBe('1');
    expect(result[14].label).toBe('15');
  });
});

// ---------------------------------------------------------------------------
// generateGroupedBarData
// ---------------------------------------------------------------------------
describe('generateGroupedBarData', () => {
  it('generates same number of buckets as cumulative for same period/now', () => {
    const cumulative = generateCumulativeData([], 'month', NOW);
    const grouped = generateGroupedBarData([], 'month', NOW);
    expect(grouped).toHaveLength(cumulative.length);
  });

  it('income and tips per bucket are correct', () => {
    // shift on 2026-05-01: 4h * 12/h = 48 income, tips=20
    const shift = makeShift({
      date: '2026-05-01',
      startTime: '18:00',
      endTime: '22:00',
      hourlyRate: 12,
      tips: 20,
    });
    const result = generateGroupedBarData([shift], 'month', NOW);
    expect(result[0].income).toBeCloseTo(48);
    expect(result[0].tips).toBe(20);
  });

  it('empty buckets have 0 income and 0 tips', () => {
    const result = generateGroupedBarData([], 'month', NOW);
    expect(result.every((b) => b.income === 0 && b.tips === 0)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// generateHeatmapData
// ---------------------------------------------------------------------------
describe('generateHeatmapData', () => {
  it('month: always returns 31 cells for May 2026 (31 days)', () => {
    const result = generateHeatmapData([], 'month', NOW);
    expect(result).toHaveLength(31);
  });

  it('year: always returns 12 cells', () => {
    const result = generateHeatmapData([], 'year', NOW);
    expect(result).toHaveLength(12);
  });

  it('month: cells have correct tip values matching shifts', () => {
    const shift = makeShift({ date: '2026-05-10', tips: 35 });
    const result = generateHeatmapData([shift], 'month', NOW);
    // day 10 is index 9
    expect(result[9].value).toBe(35);
    expect(result[9].isEmpty).toBe(false);
    expect(result[0].isEmpty).toBe(true);
    expect(result[0].value).toBe(0);
  });

  it('year: cell for May has correct tip value', () => {
    const shift = makeShift({ date: '2026-05-15', tips: 50 });
    const result = generateHeatmapData([shift], 'year', NOW);
    // May is index 4 (0-indexed)
    expect(result[4].value).toBe(50);
    expect(result[4].isEmpty).toBe(false);
  });

  it('year: all months are represented regardless of current month', () => {
    const result = generateHeatmapData([], 'year', NOW);
    expect(result).toHaveLength(12);
    // last cell should be December
    expect(result[11].label).toBeTruthy();
  });
});
