import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import '@mantine/core/styles.css';
import './index.css';

import './i18n'; // Initialize i18n
import { theme } from './theme';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
