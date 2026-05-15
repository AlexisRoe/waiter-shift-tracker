import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { BottomDrawer } from './BottomDrawer.component';

describe('BottomDrawer', () => {
  it('renders nothing when closed', () => {
    const { queryByText } = renderWithProviders(
      createElement(
        BottomDrawer,
        { opened: false, onClose: () => {} },
        createElement('span', null, 'Drawer content'),
      ),
    );
    expect(queryByText('Drawer content')).toBeNull();
  });

  it('renders children when opened', () => {
    const { getByText } = renderWithProviders(
      createElement(
        BottomDrawer,
        { opened: true, onClose: () => {} },
        createElement('span', null, 'Drawer content'),
      ),
    );
    expect(getByText('Drawer content')).toBeTruthy();
  });

  it('renders the title when provided', () => {
    const { getByText } = renderWithProviders(
      createElement(
        BottomDrawer,
        { opened: true, onClose: () => {}, title: 'My Drawer' },
        createElement('span', null, 'content'),
      ),
    );
    expect(getByText('My Drawer')).toBeTruthy();
  });
});
