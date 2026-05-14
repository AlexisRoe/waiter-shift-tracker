import { MantineProvider } from '@mantine/core';
import { type RenderOptions, render } from '@testing-library/react';
import { createElement, type ReactElement, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { theme } from '../theme';

export function withMantineAndI18n(node: ReactNode): ReactElement {
  return createElement(MantineProvider, { theme }, createElement(I18nextProvider, { i18n }, node));
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(withMantineAndI18n(ui), options);
}
