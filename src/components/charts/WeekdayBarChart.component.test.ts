import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { WeekdayBarChart } from './WeekdayBarChart.component';

describe('WeekdayBarChart', () => {
  it('renders a chart for the provided buckets', () => {
    const data = [
      { day: 'M', hours: 2 },
      { day: 'T', hours: 3 },
    ];

    const chart = createElement(WeekdayBarChart, { data });
    const wrapped = createElement('div', { style: { width: 480, height: 200 } }, chart);
    const { container } = renderWithProviders(wrapped);

    expect(container.querySelector('.mantine-BarChart-root')).toBeTruthy();
  });
});
