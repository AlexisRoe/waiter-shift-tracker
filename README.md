# Waiter Shift Tracker

A mobile-first, offline-capable Progressive Web Application (PWA) for waiters to track their shifts, wages, and tips. All data is securely stored on the local device, ensuring complete privacy.

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
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`. 
   
   *Tip: To test the mobile-first layout properly on a desktop browser, open Developer Tools and toggle the Device Toolbar (or simply enjoy the centered-frame layout).*

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
