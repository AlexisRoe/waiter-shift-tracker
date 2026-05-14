import { screen } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { StatCard } from './StatCard.component';

describe('StatCard', () => {
  it('renders label and value', () => {
    renderWithProviders(
      createElement(StatCard, {
        label: 'Stunden',
        value: '12,5',
      }),
    );

    expect(screen.getByText('Stunden')).toBeInTheDocument();
    expect(screen.getByText('12,5')).toBeInTheDocument();
  });
});
