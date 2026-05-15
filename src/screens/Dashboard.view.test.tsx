import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store/app.store';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { DashboardView } from './Dashboard.view';

function renderView() {
  return render(
    withMantineAndI18n(createElement(MemoryRouter, null, createElement(DashboardView))),
  );
}

beforeEach(() => {
  useAppStore.setState({
    profile: {
      name: 'Test',
      defaultCompanyId: 'c1',
      startingTipBudget: 0,
      language: 'de',
      maxMonthlyEarnings: 603,
      minHourlyWage: 14.6,
    },
    companies: [{ id: 'c1', name: 'Bistro', hourlyRate: 14, createdAt: '2026-01-01' }],
    shifts: [],
    tipTransactions: [],
    isOnboarded: true,
    dashboardPeriod: 'month',
    balanceTab: 'All',
    _hasHydrated: true,
  });
});

describe('DashboardView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('renders the period segmented control', () => {
    const { container } = renderView();
    expect(container.querySelector('.mantine-SegmentedControl-root')).toBeTruthy();
  });
});
