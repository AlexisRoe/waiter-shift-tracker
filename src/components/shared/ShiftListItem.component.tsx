import { Box, Group, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { Shift } from '../../store/types';
import { calculateDurationHours } from '../../utils/date.util';
import { CurrencyDisplay } from './CurrencyDisplay.component';

interface ShiftListItemProps {
  shift: Shift;
  onClick: () => void;
  isLast?: boolean;
}

export const ShiftListItem = ({ shift, onClick, isLast }: ShiftListItemProps) => {
  const theme = useMantineTheme();

  const duration = calculateDurationHours(shift.startTime, shift.endTime);
  const wage = duration * shift.hourlyRate;
  const totalEarned = wage + (shift.tips || 0);

  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '16px 0',
        borderBottom: isLast ? 'none' : `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <Group gap="xs" mb={4}>
            <Box
              style={{
                width: 3,
                height: 16,
                backgroundColor: theme.colors.gray[3],
                borderRadius: 2,
              }}
            />
            <Text fw={600}>{dayjs(shift.date).format('dd, D. MMM')}</Text>
          </Group>
          <Text size="sm" c="dimmed" pl="md">
            {shift.startTime} – {shift.endTime || '...'} · {shift.venue}
          </Text>
        </Box>

        <Box style={{ textAlign: 'right', minWidth: 80 }}>
          <CurrencyDisplay amount={totalEarned} fw={700} />
          <Group justify="flex-end" gap={4}>
            <Text size="xs" c="dimmed">
              {duration.toFixed(1)}h
            </Text>
            {shift.tips > 0 && (
              <CurrencyDisplay size="xs" c="dimmed" amount={shift.tips} showSign />
            )}
          </Group>
        </Box>

        <IconChevronRight size={18} color={theme.colors.gray[4]} stroke={2} />
      </Group>
    </UnstyledButton>
  );
};
