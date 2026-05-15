import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { HeatmapCell } from '../../utils/dashboardCalculations.util';
import { TipHeatmap } from './TipHeatmap.component';

function makeCell(day: number, tips = 0): HeatmapCell {
  const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
  return { label: String(day), value: tips, date: dateStr, isEmpty: tips === 0 };
}

const monthCells: HeatmapCell[] = Array.from({ length: 31 }, (_, i) => makeCell(i + 1));

describe('TipHeatmap', () => {
  describe('month period', () => {
    it('renders a grid with 7 day-of-week labels', () => {
      const { getAllByText } = renderWithProviders(
        createElement(TipHeatmap, { cells: monthCells, period: 'month' }),
      );
      const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      for (const label of dayLabels) {
        expect(getAllByText(label).length).toBeGreaterThanOrEqual(1);
      }
    });

    it('shows a non-empty cell with a tip value title', () => {
      const cellsWithTip = monthCells.map((c, i) =>
        i === 9 ? { ...c, value: 35, isEmpty: false } : c,
      );
      const { container } = renderWithProviders(
        createElement(TipHeatmap, { cells: cellsWithTip, period: 'month' }),
      );
      const tipCell = container.querySelector('[title="10: €35.00"]');
      expect(tipCell).toBeTruthy();
    });
  });

  describe('year period', () => {
    it('renders 12 month cells', () => {
      const yearCells: HeatmapCell[] = Array.from({ length: 12 }, (_, m) => ({
        label: `Month${m + 1}`,
        value: 0,
        date: `2026-${String(m + 1).padStart(2, '0')}-01`,
        isEmpty: true,
      }));
      const { getAllByText } = renderWithProviders(
        createElement(TipHeatmap, { cells: yearCells, period: 'year' }),
      );
      for (let m = 1; m <= 12; m++) {
        expect(getAllByText(`Month${m}`).length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('three-months period', () => {
    it('renders cells for each week', () => {
      const weekCells: HeatmapCell[] = Array.from({ length: 13 }, (_, i) => ({
        label: `W${i + 1}`,
        value: 0,
        date: `2026-03-${String(i * 7 + 2).padStart(2, '0')}`,
        isEmpty: true,
      }));
      const { getAllByText } = renderWithProviders(
        createElement(TipHeatmap, { cells: weekCells, period: 'three-months' }),
      );
      expect(getAllByText('W1').length).toBeGreaterThanOrEqual(1);
    });
  });
});
