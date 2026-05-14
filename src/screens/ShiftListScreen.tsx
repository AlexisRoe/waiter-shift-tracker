import {
  Box,
  Button,
  Container,
  Drawer,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { ShiftForm } from '../components/shared/ShiftForm.component';
import { ShiftListItem } from '../components/shared/ShiftListItem.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const ShiftListScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const shifts = useAppStore((state) => state.shifts);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>();

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

  const handleAddShift = () => {
    setSelectedShiftId(undefined);
    open();
  };

  const handleEditShift = (id: string) => {
    setSelectedShiftId(id);
    open();
  };

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group grow mb="xl" mt="md">
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

        <Box mt="md">

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '0 16px',
              border: `1px solid ${theme.colors.gray[2]}`,
            }}
          >
            {currentMonthShifts.length > 0 ? (
              currentMonthShifts.map((shift) => (
                <ShiftListItem
                  key={shift.id}
                  shift={shift}
                  onClick={() => handleEditShift(shift.id)}
                />
              ))
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
        onClick={handleAddShift}
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

      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="90%"
        radius="lg"
        padding="xl"
        styles={{
          header: { display: 'none' },
        }}
      >
        <ShiftForm shiftId={selectedShiftId} onClose={close} />
      </Drawer>
    </Box>
  );
};
