import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { MonthlyEarningsChart } from './MonthlyEarningsChart.component';

describe('MonthlyEarningsChart', () => {
  it('renders a Mantine stacked bar chart for the series data', () => {
    const data = [
      { month: 'Jan', wage: 100, tips: 20 },
      { month: 'Feb', wage: 120, tips: 30 },
    ];

    const chart = createElement(MonthlyEarningsChart, { data });
    const wrapped = createElement('div', { style: { width: 480, height: 320 } }, chart);

    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-BarChart-root')).toBeTruthy();
    expect(container.querySelector('.mantine-BarChart-container')).toBeTruthy();
  });
});
