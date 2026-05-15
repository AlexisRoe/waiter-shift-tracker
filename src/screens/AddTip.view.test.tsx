import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store/app.store';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { AddTipView } from './AddTip.view';

function renderView() {
  return render(
    withMantineAndI18n(
      createElement(
        MemoryRouter,
        { initialEntries: ['/add-tip'] },
        createElement(
          Routes,
          null,
          createElement(Route, { path: '/add-tip', element: createElement(AddTipView) }),
        ),
      ),
    ),
  );
}

beforeEach(() => {
  useAppStore.setState({
    profile: null,
    companies: [],
    shifts: [],
    tipTransactions: [],
    isOnboarded: true,
    dashboardPeriod: 'month',
    balanceTab: 'All',
    _hasHydrated: true,
  });
});

describe('AddTipView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('shows a submit button', () => {
    const { container } = renderView();
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeTruthy();
  });
});
