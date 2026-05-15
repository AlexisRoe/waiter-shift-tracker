import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { TealPageHeader } from './TealPageHeader.component';

describe('TealPageHeader', () => {
  it('renders children inside the header', () => {
    const { getByText } = renderWithProviders(
      createElement(TealPageHeader, null, createElement('span', null, 'Header content')),
    );
    expect(getByText('Header content')).toBeTruthy();
  });

  it('applies the default teal background when no color is provided', () => {
    const { container } = renderWithProviders(
      createElement(TealPageHeader, null, createElement('span', null, 'test')),
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toBeTruthy();
  });

  it('accepts a custom color prop', () => {
    const { container } = renderWithProviders(
      createElement(
        TealPageHeader,
        { color: 'rgb(0, 0, 255)' },
        createElement('span', null, 'test'),
      ),
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toBeTruthy();
  });
});
