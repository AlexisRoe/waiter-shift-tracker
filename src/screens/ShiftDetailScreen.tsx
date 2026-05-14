import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Text,
  Title,
  useMantineTheme,
  Stack,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconChevronLeft, IconClock, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';
import {
  generateGoogleCalendarUrl,
  generateIcsContent,
  downloadIcsFile,
} from '../utils/calendar.util';

export const ShiftDetailScreen = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const shifts = useAppStore((state) => state.shifts);
  const updateShift = useAppStore((state) => state.updateShift);
  const deleteShift = useAppStore((state) => state.deleteShift);

  const shift = shifts.find((s) => s.id === id);

  const form = useForm({
    initialValues: {
      endTime: shift?.endTime || '',
      tips: shift?.tips || 0,
    },
  });

  if (!shift) {
    return <Text p="xl">Shift not found</Text>;
  }

  const isCompleted = !!shift.endTime;

  const duration = calculateDurationHours(shift.startTime, form.values.endTime || shift.endTime);
  const wage = duration * shift.hourlyRate;
  const total = wage + (Number(form.values.tips) || shift.tips || 0);

  const handleComplete = (values: typeof form.values) => {
    updateShift(shift.id, {
      endTime: values.endTime,
      tips: Number(values.tips) || 0,
    });
    navigate(-1);
  };

  const handleDelete = () => {
    deleteShift(shift.id);
    navigate('/shifts');
  };

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Box>
            <Text size="xs" c="dimmed">
              {dayjs(shift.date).format('DD.MM.YYYY')} · {shift.venue}
            </Text>
            <Title order={2}>{isCompleted ? t('shifts.title') : t('shifts.notEnded')}</Title>
          </Box>
        </Group>

        <Box
          style={{
            backgroundColor: theme.colors.teal[8],
            borderRadius: theme.radius.lg,
            padding: 24,
            color: 'white',
            marginBottom: 24,
          }}
        >
          <Text size="sm" opacity={0.8} mb={4}>
            {t('shifts.earningsPreview')}
          </Text>
          <CurrencyDisplay amount={total} fz={42} fw={800} lh={1.1} mb="lg" />

          <Group gap="xl">
            <Group gap={4}>
              <Text size="xs" opacity={0.8}>
                Hours ·{' '}
              </Text>
              <Text size="sm" fw={600}>
                {duration.toFixed(1)}h
              </Text>
            </Group>
            <Group gap={4}>
              <Text size="xs" opacity={0.8}>
                Wage ·{' '}
              </Text>
              <CurrencyDisplay amount={wage} size="sm" fw={600} />
            </Group>
            <Group gap={4}>
              <Text size="xs" opacity={0.8}>
                Tips ·{' '}
              </Text>
              <CurrencyDisplay amount={form.values.tips || shift.tips} size="sm" fw={600} />
            </Group>
          </Group>
        </Box>

        {!isCompleted ? (
          <form onSubmit={form.onSubmit(handleComplete)}>
            <Box
              style={{
                backgroundColor: 'white',
                borderRadius: theme.radius.lg,
                padding: 20,
                border: `1px solid ${theme.colors.gray[2]}`,
                marginBottom: 24,
              }}
            >
              <TimeInput
                label={t('shifts.end')}
                leftSection={<IconClock size={18} />}
                mb="md"
                withAsterisk
                {...form.getInputProps('endTime')}
              />

              <NumberInput
                label={t('shifts.tipsReceived')}
                decimalScale={2}
                leftSection="€"
                {...form.getInputProps('tips')}
              />
            </Box>

            <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth mb="md">
              {t('shifts.completeShift')}
            </Button>
          </form>
        ) : (
          <Stack gap="md" mb="xl">
            <Button
              variant="light"
              color="teal"
              radius="xl"
              onClick={() => window.open(generateGoogleCalendarUrl(shift), '_blank')}
            >
              {t('shifts.addToGoogleCalendar')}
            </Button>
            <Button
              variant="outline"
              color="teal"
              radius="xl"
              onClick={() => downloadIcsFile(generateIcsContent(shift), `shift-${shift.date}`)}
            >
              {t('shifts.downloadIcs')}
            </Button>
          </Stack>
        )}

        <Button
          variant="subtle"
          color="red"
          fullWidth
          radius="xl"
          leftSection={<IconTrash size={18} />}
          onClick={handleDelete}
        >
          {t('shifts.deleteShift')}
        </Button>
      </Container>
    </Box>
  );
};
