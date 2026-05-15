import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store/app.store';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { SettingsView } from './Settings.view';

function renderView() {
  return render(withMantineAndI18n(createElement(MemoryRouter, null, createElement(SettingsView))));
}

beforeEach(() => {
  useAppStore.setState({
    profile: {
      name: 'Test User',
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

describe('SettingsView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('shows the profile name', () => {
    const { getByText } = renderView();
    expect(getByText('Test User')).toBeTruthy();
  });
});
