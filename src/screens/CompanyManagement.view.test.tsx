import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store/app.store';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { CompanyManagementView } from './CompanyManagement.view';

function renderView() {
  return render(
    withMantineAndI18n(createElement(MemoryRouter, null, createElement(CompanyManagementView))),
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

describe('CompanyManagementView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('shows the existing company name', () => {
    const { getByText } = renderView();
    expect(getByText('Bistro')).toBeTruthy();
  });
});
