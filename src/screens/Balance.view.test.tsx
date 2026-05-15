import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store/app.store';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { BalanceView } from './Balance.view';

function renderView() {
  return render(withMantineAndI18n(createElement(MemoryRouter, null, createElement(BalanceView))));
}

beforeEach(() => {
  useAppStore.setState({
    profile: {
      name: 'Test',
      defaultCompanyId: 'c1',
      startingTipBudget: 50,
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

describe('BalanceView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('renders the tab segmented control', () => {
    const { container } = renderView();
    expect(container.querySelector('.mantine-SegmentedControl-root')).toBeTruthy();
  });
});
