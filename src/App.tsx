import { AppShell, Center, Loader } from '@mantine/core';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.component';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_MAX_MONTHLY_EARNINGS,
  DEFAULT_MIN_HOURLY_WAGE,
} from './constants';
import { BalanceView } from './screens/Balance.view';
import { CompanyManagementView } from './screens/CompanyManagement.view';
import { DashboardView } from './screens/Dashboard.view';
import { OnboardingView } from './screens/Onboarding.view';
import { SettingsView } from './screens/Settings.view';
import { ShiftListView } from './screens/ShiftList.view';
import { useAppStore } from './store/app.store';

function App() {
  const hasHydrated = useAppStore((state) => state._hasHydrated);
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

  if (!hasHydrated) {
    return (
      <Center h="100vh" bg="#ffffff">
        <Loader />
      </Center>
    );
  }

  return (
    <BrowserRouter>
      <AppShell
        styles={{
          main: {
            padding: 0,
            backgroundColor: '#ffffff',
          },
        }}
      >
        <AppShell.Main>
          <Routes>
            {!isOnboarded ? (
              <>
                <Route path="/onboarding" element={<OnboardingView />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              <>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardView />} />
                  <Route path="/shifts" element={<ShiftListView />} />
                  <Route path="/balance" element={<BalanceView />} />
                  <Route path="/settings" element={<SettingsView />} />
                  <Route path="/settings/companies" element={<CompanyManagementView />} />
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
