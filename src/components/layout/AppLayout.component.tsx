import { Box, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconHome, IconCalendarEvent, IconWallet, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: IconHome, label: 'home', path: '/' },
  { icon: IconCalendarEvent, label: 'shifts', path: '/shifts' },
  { icon: IconWallet, label: 'balance', path: '/balance' },
  { icon: IconSettings, label: 'settings', path: '/settings' },
];

export const AppLayout = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Onboarding screens or other full-screen pages might hide navigation
  // For now, assume it's always shown if rendered in AppLayout
  
  return (
    <Box
      style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box style={{ flex: 1, paddingBottom: 80, overflowY: 'auto' }}>
        <Outlet />
      </Box>

      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          height: 80,
          backgroundColor: 'white',
          borderTop: '1px solid #ebecf0',
          borderTopLeftRadius: theme.radius.xl,
          borderTopRightRadius: theme.radius.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 10px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.02)',
          zIndex: 100,
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <UnstyledButton
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                color: isActive ? theme.colors.teal[8] : theme.colors.gray[5],
                transition: 'color 0.2s ease',
              }}
            >
              <item.icon size={24} stroke={isActive ? 2.5 : 2} />
              <Text size="xs" fw={isActive ? 600 : 500} mt={4}>
                {t(`common.${item.label}`)}
              </Text>
            </UnstyledButton>
          );
        })}
      </Box>
    </Box>
  );
};
