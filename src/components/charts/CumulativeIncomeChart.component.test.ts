import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { CumulativeIncomeChart } from './CumulativeIncomeChart.component';

describe('CumulativeIncomeChart', () => {
  it('renders an area chart for the cumulative data points', () => {
    const data = [
      { label: '1', cumulative: 0 },
      { label: '2', cumulative: 48 },
      { label: '3', cumulative: 96 },
    ];

    const chart = createElement(CumulativeIncomeChart, { data });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-AreaChart-root')).toBeTruthy();
  });

  it('renders without crashing when data is empty', () => {
    const chart = createElement(CumulativeIncomeChart, { data: [] });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-AreaChart-root')).toBeTruthy();
  });
});
