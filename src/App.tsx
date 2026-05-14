import { AppShell } from '@mantine/core';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.component';
import { useAppStore } from './store/useAppStore';
import { useEffect } from 'react';
import { DEFAULT_MAX_MONTHLY_EARNINGS, DEFAULT_MIN_HOURLY_WAGE, DEFAULT_LANGUAGE } from './constants';

// Screens
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ShiftListScreen } from './screens/ShiftListScreen';
import { AddShiftScreen } from './screens/AddShiftScreen';
import { ShiftDetailScreen } from './screens/ShiftDetailScreen';
import { BalanceScreen } from './screens/BalanceScreen';
import { AddTipScreen } from './screens/AddTipScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function App() {
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  useEffect(() => {
    if (profile) {
      if (
        profile.maxMonthlyEarnings === undefined ||
        profile.minHourlyWage === undefined ||
        profile.language === undefined
      ) {
        updateProfile({
          maxMonthlyEarnings: profile.maxMonthlyEarnings ?? DEFAULT_MAX_MONTHLY_EARNINGS,
          minHourlyWage: profile.minHourlyWage ?? DEFAULT_MIN_HOURLY_WAGE,
          language: profile.language ?? DEFAULT_LANGUAGE,
        });
      }
    }
  }, [profile, updateProfile]);

  return (
    <BrowserRouter>
      <AppShell
        styles={{
          main: {
            padding: 0,
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        <AppShell.Main>
          <Routes>
            {!isOnboarded ? (
              <>
                <Route path="/onboarding" element={<OnboardingScreen />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              <>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardScreen />} />
                  <Route path="/shifts" element={<ShiftListScreen />} />
                  <Route path="/shifts/new" element={<AddShiftScreen />} />
                  <Route path="/shifts/:id" element={<ShiftDetailScreen />} />
                  <Route path="/balance" element={<BalanceScreen />} />
                  <Route path="/balance/tip" element={<AddTipScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                </Route>
                <Route path="/onboarding" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
