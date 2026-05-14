import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { withMantineAndI18n } from '../../test/renderWithProviders';
import { AppLayout } from './AppLayout.component';

function renderAppLayout(initialPath = '/') {
  return render(
    withMantineAndI18n(
      createElement(
        MemoryRouter,
        { initialEntries: [initialPath] },
        createElement(
          Routes,
          null,
          createElement(
            Route,
            { element: createElement(AppLayout) },
            createElement(Route, {
              path: '/',
              element: createElement('div', { 'data-testid': 'outlet' }, 'Home'),
            }),
            createElement(Route, {
              path: '/shifts',
              element: createElement('div', { 'data-testid': 'outlet' }, 'Shifts'),
            }),
            createElement(Route, {
              path: '/balance',
              element: createElement('div', { 'data-testid': 'outlet' }, 'Balance'),
            }),
            createElement(Route, {
              path: '/settings',
              element: createElement('div', { 'data-testid': 'outlet' }, 'Settings'),
            }),
          ),
        ),
      ),
    ),
  );
}

describe('AppLayout', () => {
  it('renders the outlet for the active route', () => {
    renderAppLayout('/shifts');
    expect(screen.getByTestId('outlet')).toHaveTextContent('Shifts');
  });

  it('navigates when a tab is pressed', async () => {
    const user = userEvent.setup();
    renderAppLayout('/');

    await user.click(screen.getByText('Bilanz'));
    expect(screen.getByTestId('outlet')).toHaveTextContent('Balance');
  });
});
