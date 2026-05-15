import { render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { withMantineAndI18n } from '../test/renderWithProviders';
import { OnboardingView } from './Onboarding.view';

function renderView() {
  return render(
    withMantineAndI18n(createElement(MemoryRouter, null, createElement(OnboardingView))),
  );
}

describe('OnboardingView', () => {
  it('renders without crashing', () => {
    const { container } = renderView();
    expect(container).toBeTruthy();
  });

  it('shows a submit button to start', () => {
    const { container } = renderView();
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeTruthy();
  });
});
