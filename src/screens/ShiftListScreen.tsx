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

  const sortedShifts = [...shifts].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
  );

  const groupedShifts = sortedShifts.reduce(
    (acc, shift) => {
      const monthYear = dayjs(shift.date).format('MMMM YYYY');
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(shift);
      return acc;
    },
    {} as Record<string, typeof shifts>,
  );

  const sortedMonths = Array.from(
    new Set(sortedShifts.map((s) => dayjs(s.date).format('MMMM YYYY'))),
  );

  const currentMonthShifts = shifts.filter((s) =>
    dayjs(s.date).isSame(dayjs(), 'month'),
  );

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
        <Box
          mb="xl"
          mt="md"
          style={{
            backgroundColor: theme.colors.teal[8],
            borderRadius: theme.radius.xl,
            padding: '24px 20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(0, 128, 128, 0.15)',
          }}
        >
          <Group grow align="flex-start">
            <Box>
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.thisMonth')}
              </Text>
              <CurrencyDisplay amount={totalEarnings} size="24px" fw={800} c="white" />
            </Box>
            <Box
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                paddingLeft: 20,
              }}
            >
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.hours')}
              </Text>
              <Text size="24px" fw={800}>
                {Math.round(totalHours)}h
              </Text>
            </Box>
          </Group>
        </Box>

        <Box mt="md">
          {sortedMonths.length > 0 ? (
            sortedMonths.map((month) => (
              <Box key={month} mb="xl">
                <Text
                  fw={700}
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  mb="xs"
                  ml="md"
                  lts={1}
                >
                  {month}
                </Text>
                <Box
                  style={{
                    backgroundColor: 'white',
                    borderRadius: theme.radius.xl,
                    padding: '0 16px',
                    border: `1px solid ${theme.colors.gray[2]}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  }}
                >
                  {groupedShifts[month].map((shift, index) => (
                    <ShiftListItem
                      key={shift.id}
                      shift={shift}
                      onClick={() => handleEditShift(shift.id)}
                      isLast={index === groupedShifts[month].length - 1}
                    />
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Box py={60} ta="center">
              <Text c="dimmed" size="lg" fw={500}>
                No shifts tracked yet.
              </Text>
              <Text c="dimmed" size="sm">
                Tap the button below to add your first shift!
              </Text>
            </Box>
          )}
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
        size="auto"
        withinPortal={false}
        padding="xl"
        radius="lg"
        title={
          <Text fw={700} size="lg">
            {selectedShiftId ? t('shifts.editShift') : t('shifts.newShift')}
          </Text>
        }
        styles={{
          content: {
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
          },
        }}
      >
        <ShiftForm shiftId={selectedShiftId} onClose={close} />
      </Drawer>
    </Box>
  );
};
