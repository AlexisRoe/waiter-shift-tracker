import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { EarningsTrendChart } from './EarningsTrendChart.component';

describe('EarningsTrendChart', () => {
  it('renders an area chart for the trend points', () => {
    const data = [
      { date: 'May 1', value: 10 },
      { date: 'May 2', value: 20 },
    ];

    const chart = createElement(EarningsTrendChart, { data });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-AreaChart-root')).toBeTruthy();
  });
});
