import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import '@mantine/core/styles.css';
import './index.css';

import './i18n'; // Initialize i18n
import { migrateLocalStorageToIndexedDB } from './store/migrateLegacyStorage';
import { theme } from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

void migrateLocalStorageToIndexedDB().then(() =>
  import('./App.tsx').then(({ default: App }) => {
    createRoot(rootElement).render(
      <StrictMode>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </StrictMode>,
    );
  }),
);
