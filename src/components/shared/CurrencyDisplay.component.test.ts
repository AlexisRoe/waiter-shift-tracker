import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { CurrencyDisplay } from './CurrencyDisplay.component';

describe('CurrencyDisplay', () => {
  it('renders formatted currency for the amount', () => {
    const { container } = renderWithProviders(createElement(CurrencyDisplay, { amount: 99.5 }));

    expect(container.textContent).toMatch(/99,50/);
    expect(container.textContent).toContain('€');
  });

  it('passes showSign through to formatting', () => {
    const { container } = renderWithProviders(
      createElement(CurrencyDisplay, { amount: 10, showSign: true }),
    );

    expect(container.textContent).toContain('+10,00');
  });
});
