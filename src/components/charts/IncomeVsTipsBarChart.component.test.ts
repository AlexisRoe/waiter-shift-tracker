import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { IncomeVsTipsBarChart } from './IncomeVsTipsBarChart.component';

describe('IncomeVsTipsBarChart', () => {
  it('renders a stacked bar chart for the income vs tips data', () => {
    const data = [
      { label: 'May 1', income: 48, tips: 20 },
      { label: 'May 2', income: 60, tips: 15 },
    ];

    const chart = createElement(IncomeVsTipsBarChart, { data });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-BarChart-root')).toBeTruthy();
  });

  it('renders without crashing when data is empty', () => {
    const chart = createElement(IncomeVsTipsBarChart, { data: [] });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-BarChart-root')).toBeTruthy();
  });
});
