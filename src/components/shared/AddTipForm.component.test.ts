import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../store/useAppStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { AddTipForm } from './AddTipForm.component';

describe('AddTipForm', () => {
  beforeEach(() => {
    useAppStore.setState({ tipTransactions: [] });
  });

  it('renders deposit labels in deposit mode', () => {
    renderWithProviders(
      createElement(AddTipForm, {
        mode: 'deposit',
        onSuccess: vi.fn(),
        onCancel: vi.fn(),
      }),
    );

    expect(screen.getByText('BETRAG')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trinkgeld speichern' })).toBeInTheDocument();
  });

  it('renders withdraw copy in withdraw mode', () => {
    renderWithProviders(
      createElement(AddTipForm, {
        mode: 'withdraw',
        onSuccess: vi.fn(),
        onCancel: vi.fn(),
      }),
    );

    expect(screen.getByRole('button', { name: 'Betrag abheben' })).toBeInTheDocument();
  });

  it('persists a positive tip transaction and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    renderWithProviders(
      createElement(AddTipForm, {
        mode: 'deposit',
        onSuccess,
        onCancel: vi.fn(),
      }),
    );

    await user.type(screen.getByPlaceholderText('0.00'), '25');
    await user.click(screen.getByRole('button', { name: 'Trinkgeld speichern' }));

    expect(onSuccess).toHaveBeenCalled();
    const txs = useAppStore.getState().tipTransactions;
    expect(txs).toHaveLength(1);
    expect(txs[0]?.amount).toBe(25);
  });
});
