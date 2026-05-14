import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronLeft, IconFilter, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { ShiftListItem } from '../components/shared/ShiftListItem.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const ShiftListScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const shifts = useAppStore((state) => state.shifts);

  // Group shifts by week (mocking the grouping logic slightly for simplicity, based on screenshots)
  // In a real app, we'd use dayjs().week() to group properly

  const currentMonthShifts = shifts
    .filter((s) => dayjs(s.date).isSame(dayjs(), 'month'))
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  const totalHours = currentMonthShifts.reduce(
    (sum, s) => sum + calculateDurationHours(s.startTime, s.endTime),
    0,
  );
  const totalEarnings = currentMonthShifts.reduce((sum, s) => {
    const hours = calculateDurationHours(s.startTime, s.endTime);
    return sum + hours * s.hourlyRate + (s.tips || 0);
  }, 0);

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group justify="space-between" align="center" mt="md" mb="xl">
          <Group gap="xs">
            <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
              <IconChevronLeft size={24} />
            </ActionIcon>
            <Box>
              <Text size="xs" c="dimmed">
                {shifts.length} shifts logged
              </Text>
              <Title order={2}>{t('shifts.title')}</Title>
            </Box>
          </Group>
          <ActionIcon variant="default" radius="xl" size="lg">
            <IconFilter size={20} />
          </ActionIcon>
        </Group>

        <Group grow mb="xl">
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 16,
              border: `1px solid ${theme.colors.gray[2]}`,
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              {t('shifts.thisMonth')}
            </Text>
            <CurrencyDisplay amount={totalEarnings} size="xl" fw={700} c="teal.9" />
          </Box>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 16,
              border: `1px solid ${theme.colors.gray[2]}`,
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              {t('shifts.hours')}
            </Text>
            <Text size="xl" fw={700}>
              {Math.round(totalHours)}h
            </Text>
          </Box>
        </Group>

        <Box>
          <Group justify="space-between" mb="sm">
            <Text fw={700} c="dimmed">
              Recent Shifts
            </Text>
          </Group>

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '0 16px',
              border: `1px solid ${theme.colors.gray[2]}`,
            }}
          >
            {currentMonthShifts.length > 0 ? (
              currentMonthShifts.map((shift) => <ShiftListItem key={shift.id} shift={shift} />)
            ) : (
              <Box py="xl" ta="center">
                <Text c="dimmed">No shifts this month yet.</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      <Button
        size="lg"
        radius="xl"
        color="teal.8"
        leftSection={<IconPlus size={20} />}
        onClick={() => navigate('/shifts/new')}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 'calc(50% - 215px + 20px)', // adjust for max-width
          boxShadow: theme.shadows.md,
          zIndex: 10,
        }}
      >
        {t('shifts.newShift')}
      </Button>
    </Box>
  );
};
