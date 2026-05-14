import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  IconBriefcase,
  IconCalendarEvent,
  IconChevronLeft,
  IconClock,
  IconMapPin,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const AddShiftScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const profile = useAppStore((state) => state.profile);
  const companies = useAppStore((state) => state.companies);
  const addShift = useAppStore((state) => state.addShift);

  const defaultCompany = companies.find((c) => c.id === profile?.defaultCompanyId) || companies[0];

  const form = useForm({
    initialValues: {
      companyId: defaultCompany?.id || '',
      venue: defaultCompany?.name || '',
      date: new Date(),
      startTime: '17:00',
      endTime: '',
      hourlyRate: defaultCompany?.hourlyRate || 13.5,
      tips: 0,
    },
    validate: {
      companyId: (val: string) => (val ? null : t('common.required')),
      venue: (val: string) => (val.trim().length > 0 ? null : t('common.required')),
      startTime: (val: string) => (val.trim().length > 0 ? null : t('common.required')),
    },
  });

  const duration = calculateDurationHours(form.values.startTime, form.values.endTime);
  const wagePreview = duration * form.values.hourlyRate;
  const totalPreview = wagePreview + (Number(form.values.tips) || 0);

  const handleSubmit = (values: typeof form.values) => {
    const newShift = {
      id:
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 11),
      date: dayjs(values.date).format('YYYY-MM-DD'),
      startTime: values.startTime,
      endTime: values.endTime || undefined,
      companyId: values.companyId,
      venue: values.venue,
      hourlyRate: Number(values.hourlyRate),
      tips: Number(values.tips) || 0,
    };

    addShift(newShift);
    navigate('/shifts');
  };

  const handleCompanyChange = (id: string | null) => {
    if (!id) return;
    const company = companies.find((c) => c.id === id);
    if (company) {
      form.setValues({
        companyId: id,
        venue: company.name,
        hourlyRate: company.hourlyRate,
      });
    }
  };

  const minDate = dayjs().startOf('month').toDate();

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Title order={2}>{t('shifts.newShift')}</Title>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
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
            <CurrencyDisplay amount={totalPreview} fz={42} fw={800} lh={1.1} mb="lg" />

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
                <CurrencyDisplay amount={wagePreview} size="sm" fw={600} />
              </Group>
              <Group gap={4}>
                <Text size="xs" opacity={0.8}>
                  Tips ·{' '}
                </Text>
                <CurrencyDisplay amount={form.values.tips} size="sm" fw={600} />
              </Group>
            </Group>
          </Box>

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 20,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 16,
            }}
          >
            <Select
              label={t('shifts.company')}
              placeholder={t('shifts.selectCompany')}
              leftSection={<IconBriefcase size={18} />}
              data={companies.map((c) => ({ value: c.id, label: c.name }))}
              mb="md"
              {...form.getInputProps('companyId')}
              onChange={handleCompanyChange}
            />

            <TextInput
              label={t('shifts.venue')}
              leftSection={<IconMapPin size={18} />}
              {...form.getInputProps('venue')}
            />
          </Box>

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 20,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 16,
            }}
          >
            <DatePickerInput
              label={t('shifts.date')}
              leftSection={<IconCalendarEvent size={18} />}
              minDate={minDate}
              mb="md"
              {...form.getInputProps('date')}
            />

            <Group grow>
              <TimeInput
                label={t('shifts.start')}
                leftSection={<IconClock size={18} />}
                {...form.getInputProps('startTime')}
              />
              <TimeInput
                label={t('shifts.end')}
                leftSection={<IconClock size={18} />}
                {...form.getInputProps('endTime')}
              />
            </Group>
          </Box>

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 20,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <NumberInput
              label={t('shifts.hourlyRate')}
              decimalScale={2}
              mb="md"
              leftSection="€"
              rightSection={
                <Text size="xs" c="dimmed">
                  /h
                </Text>
              }
              {...form.getInputProps('hourlyRate')}
            />

            <NumberInput
              label={t('shifts.tipsReceived')}
              description={t('shifts.tipsNote')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('tips')}
            />
          </Box>

          <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth>
            {t('shifts.saveShift')}
          </Button>
        </form>
      </Container>
    </Box>
  );
};
