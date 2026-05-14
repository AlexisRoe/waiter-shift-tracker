import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Shift } from '../../store/types';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ShiftListItem } from './ShiftListItem.component';

const shift: Shift = {
  id: 's1',
  date: '2026-05-10',
  startTime: '18:00',
  endTime: '22:00',
  companyId: 'c1',
  venue: 'River Bar',
  hourlyRate: 12,
  tips: 8,
};

describe('ShiftListItem', () => {
  it('shows venue, time range, and formatted earnings', () => {
    renderWithProviders(
      createElement(ShiftListItem, {
        shift,
        onClick: vi.fn(),
        isLast: true,
      }),
    );

    expect(screen.getByText(/River Bar/)).toBeInTheDocument();
    expect(screen.getByText(/18:00/)).toBeInTheDocument();
    expect(screen.getByText(/22:00/)).toBeInTheDocument();
  });

  it('calls onClick when the row is activated', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(createElement(ShiftListItem, { shift, onClick }));

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders ellipsis when the shift has not ended', () => {
    const open: Shift = { ...shift, endTime: undefined };
    renderWithProviders(createElement(ShiftListItem, { shift: open, onClick: vi.fn() }));

    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });
});
