# Waiter Shift Tracker

A mobile-first, offline-capable Progressive Web Application (PWA) for waiters to track their shifts, wages, and tips. All data is securely stored on the local device, ensuring complete privacy.

## Features

- **Shift Tracking** — Log shifts with start/end times, venue, and a per-shift hourly rate. Open (unended) shifts are supported for live tracking.
- **Tips Ledger** — Record tip income and withdrawals via a running tip-transaction log with optional notes, keeping a balance separate from wage earnings.
- **Dashboard & Analytics** — At-a-glance earnings overview filterable by last month, three months, or year, with charts powered by Recharts/Mantine Charts.
- **Balance View** — Unified earnings history across shifts and tips with tab-based filtering (All / Shifts / Tips).
- **Multi-Company Support** — Manage multiple employers, each with their own default hourly rate, and switch the active company at any time.
- **Earnings Guardrails** — Configure a maximum monthly earnings threshold and a minimum hourly wage to spot underpaid shifts at a glance.
- **ICS / Calendar Export** — Export shifts to an `.ics` file for import into any calendar application.
- **Data Backup & Restore** — Export all app data to a JSON file and restore it on a new device — no account needed.
- **Onboarding Flow** — Guided first-run setup covering profile, language, and default company.
- **Internationalization** — Full English and German UI, switchable from Settings.
- **PWA / Offline** — Installable on any device; works entirely offline after the first load. No server, no tracking.

## Architecture & Concept

- **Framework**: React 19 + Vite
- **Styling & UI**: Mantine 9 (Vanilla CSS) + Tabler Icons
- **State Management**: Zustand (with `persist` middleware for `localStorage`)
- **Routing**: React Router DOM (v6/v7)
- **Internationalization (i18n)**: `react-i18next` (Supports English & German)
- **Data Model**: No backend or database. Data resides entirely in the browser's `localStorage` ensuring it's available offline immediately.
- **PWA Capabilities**: Configured via `vite-plugin-pwa` to cache essential assets and font files.

## Prerequisites

- **Node.js** (v18.x or newer recommended)
- **npm** (v9.x or newer)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm run install:secure
   ```

2. **Start the development server:**

   ```bash
   npm run start:dev
   ```

   The application will be available at `http://localhost:5173/`.

   _Tip: To test the mobile-first layout properly on a desktop browser, open Developer Tools and toggle the Device Toolbar (or simply enjoy the centered-frame layout)._

3. **Build for production:**

   ```bash
   npm run build
   ```

   This compiles TypeScript, builds the Vite application, and generates the service worker for PWA functionality in the `dist/` directory.

4. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Starts the Vite dev server.
- `npm run build` - Compiles TS and builds for production.
- `npm run lint` - Runs Biome linter across the codebase.
- `npm run format` - Runs Biome formatter and fixes auto-fixable issues.
- `npm run preview` - Boots up a local server to serve the `dist/` folder.

## Folder Structure

```
src/
├── components/
│   ├── charts/        # Recharts wrappers via @mantine/charts
│   ├── layout/        # App layout components (Bottom nav)
│   └── shared/        # Reusable UI components (StatCards, ShiftItems)
├── i18n/              # Translation files (de.json, en.json)
├── screens/           # Main route views
├── store/             # Zustand state management and TS Interfaces
├── utils/             # Helpers for dates, currency, and ICS/calendar generation
├── App.tsx            # Router definitions
├── main.tsx           # Entry point and Mantine theme provider
└── theme.ts           # Mantine custom theme config
```
