import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Company, Shift, UserProfile } from '../../store/types';
import { useAppStore } from '../../store/useAppStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ShiftForm } from './ShiftForm.component';

const profile: UserProfile = {
  name: 'Alex',
  defaultCompanyId: 'c1',
  startingTipBudget: 0,
  language: 'de',
  maxMonthlyEarnings: 5000,
  minHourlyWage: 12,
};

const company: Company = {
  id: 'c1',
  name: 'Bistro Nord',
  hourlyRate: 13.5,
  createdAt: '2026-01-01',
};

function seedStore(overrides: Partial<ReturnType<typeof useAppStore.getState>> = {}) {
  useAppStore.setState({
    profile,
    companies: [company],
    shifts: [],
    tipTransactions: [],
    isOnboarded: true,
    ...overrides,
  });
}

describe('ShiftForm', () => {
  beforeEach(() => {
    seedStore();
  });

  it('shows a message when there are no companies', () => {
    useAppStore.setState({ companies: [] });

    renderWithProviders(createElement(ShiftForm, { onClose: vi.fn() }));

    expect(screen.getByText('shifts.noCompanies')).toBeInTheDocument();
  });

  it('renders the new-shift flow when companies exist', () => {
    renderWithProviders(createElement(ShiftForm, { onClose: vi.fn() }));

    expect(screen.getByRole('button', { name: 'Schicht speichern' })).toBeInTheDocument();
  });

  it('submits a new shift and closes the sheet', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('fixed-id');

    renderWithProviders(createElement(ShiftForm, { onClose }));

    await user.click(screen.getByRole('button', { name: 'Schicht speichern' }));

    expect(useAppStore.getState().shifts).toHaveLength(1);
    expect(useAppStore.getState().shifts[0]?.id).toBe('fixed-id');
    expect(onClose).toHaveBeenCalled();
  });

  it('prefills earnings fields when editing an existing shift', () => {
    const shift: Shift = {
      id: 's-edit',
      date: '2026-05-01',
      startTime: '11:00',
      endTime: '15:00',
      companyId: 'c1',
      venue: 'Bistro Nord',
      hourlyRate: 14,
      tips: 20,
    };
    useAppStore.setState({ shifts: [shift] });

    renderWithProviders(createElement(ShiftForm, { shiftId: 's-edit', onClose: vi.fn() }));

    expect(screen.getByText('Voraussichtlicher Verdienst')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15:00')).toBeInTheDocument();
  });
});
