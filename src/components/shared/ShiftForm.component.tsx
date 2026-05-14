import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
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
  IconClock,
  IconMapPin,
  IconTrash,
  IconBrandGoogle,
  IconDownload,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CurrencyDisplay } from './CurrencyDisplay.component';
import { useAppStore } from '../../store/useAppStore';
import {
  downloadIcsFile,
  generateGoogleCalendarUrl,
  generateIcsContent,
} from '../../utils/calendar.util';
import { calculateDurationHours } from '../../utils/date.util';
import type { Shift } from '../../store/types';

interface ShiftFormProps {
  shiftId?: string;
  onClose: () => void;
}

export const ShiftForm = ({ shiftId, onClose }: ShiftFormProps) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const profile = useAppStore((state) => state.profile);
  const companies = useAppStore((state) => state.companies);
  const shifts = useAppStore((state) => state.shifts);
  const addShift = useAppStore((state) => state.addShift);
  const updateShift = useAppStore((state) => state.updateShift);
  const deleteShift = useAppStore((state) => state.deleteShift);

  const existingShift = shiftId ? shifts.find((s) => s.id === shiftId) : null;
  const defaultCompany = companies.find((c) => c.id === profile?.defaultCompanyId) || companies[0];

  const form = useForm({
    initialValues: {
      companyId: existingShift?.companyId || defaultCompany?.id || '',
      venue: existingShift?.venue || defaultCompany?.name || '',
      date: existingShift ? dayjs(existingShift.date).toDate() : new Date(),
      startTime: existingShift?.startTime || '17:00',
      endTime: existingShift?.endTime || '',
      hourlyRate: existingShift?.hourlyRate || defaultCompany?.hourlyRate || 13.5,
      tips: existingShift?.tips || 0,
    },
    validate: {
      companyId: (val: string) => (val ? null : t('common.required')),
      startTime: (val: string) => (val.trim().length > 0 ? null : t('common.required')),
    },
  });

  const duration = calculateDurationHours(form.values.startTime, form.values.endTime);
  const wagePreview = duration * form.values.hourlyRate;
  const totalPreview = wagePreview + (Number(form.values.tips) || 0);

  const handleSubmit = (values: typeof form.values) => {
    const shiftData = {
      date: dayjs(values.date).format('YYYY-MM-DD'),
      startTime: values.startTime,
      endTime: values.endTime || undefined,
      companyId: values.companyId,
      venue: values.venue,
      hourlyRate: Number(values.hourlyRate),
      tips: Number(values.tips) || 0,
    };

    if (existingShift) {
      updateShift(existingShift.id, shiftData);
    } else {
      addShift({
        id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 11),
        ...shiftData,
      });
    }
    onClose();
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

  const handleDelete = () => {
    if (existingShift && window.confirm(t('shifts.deleteConfirm'))) {
      deleteShift(existingShift.id);
      onClose();
    }
  };

  const getShiftDataForCalendar = (): Shift => ({
    id: existingShift?.id || 'temp',
    date: dayjs(form.values.date).format('YYYY-MM-DD'),
    startTime: form.values.startTime,
    endTime: form.values.endTime || undefined,
    companyId: form.values.companyId,
    venue: form.values.venue,
    hourlyRate: Number(form.values.hourlyRate),
    tips: Number(form.values.tips) || 0,
  });

  const minDate = dayjs().subtract(1, 'year').toDate();

  return (
    <Box>
      <Box
        style={{
          width: 40,
          height: 4,
          backgroundColor: theme.colors.gray[3],
          borderRadius: 2,
          margin: '0 auto 20px',
        }}
      />
      
      {companies.length === 0 ? (
        <Box py="xl" ta="center">
          <Text mb="md">{t('shifts.noCompanies') || 'Please add a company first.'}</Text>
          <Button 
            onClick={() => {
              onClose();
              // In a real app we might navigate here, 
              // for now let's just show the message.
            }}
            variant="light"
          >
            {t('common.close')}
          </Button>
        </Box>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
        {existingShift && (
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

            <Group grow>
              <Stack gap={2}>
                <Text size="xs" opacity={0.7} lh={1}>
                  {t('shifts.hours')}
                </Text>
                <Text size="sm" fw={700}>
                  {duration.toFixed(1)}h
                </Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" opacity={0.7} lh={1}>
                  {t('shifts.wage')}
                </Text>
                <CurrencyDisplay amount={wagePreview} size="sm" fw={700} />
              </Stack>
              <Stack gap={2}>
                <Text size="xs" opacity={0.7} lh={1}>
                  {t('shifts.tips')}
                </Text>
                <CurrencyDisplay amount={form.values.tips} size="sm" fw={700} />
              </Stack>
            </Group>
          </Box>
        )}

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
            mb={0}
            {...form.getInputProps('companyId')}
            onChange={handleCompanyChange}
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
            {existingShift && (
              <TimeInput
                label={t('shifts.end')}
                leftSection={<IconClock size={18} />}
                {...form.getInputProps('endTime')}
              />
            )}
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
            mb={existingShift ? 'md' : 0}
            leftSection="€"
            rightSection={
              <Text size="xs" c="dimmed">
                /h
              </Text>
            }
            {...form.getInputProps('hourlyRate')}
          />

          {existingShift && (
            <NumberInput
              label={t('shifts.tipsReceived')}
              description={t('shifts.tipsNote')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('tips')}
            />
          )}
        </Box>

        <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth mb="md">
          {existingShift ? t('common.save') : t('shifts.saveShift')}
        </Button>

        {!existingShift && (
          <Stack gap="md" mb="md">
            <Button
              variant="light"
              color="teal"
              radius="xl"
              leftSection={<IconBrandGoogle size={18} />}
              onClick={() => window.open(generateGoogleCalendarUrl(getShiftDataForCalendar()), '_blank')}
            >
              {t('shifts.addToGoogleCalendar')}
            </Button>
            <Button
              variant="light"
              color="teal"
              radius="xl"
              leftSection={<IconDownload size={18} />}
              onClick={() => {
                const s = getShiftDataForCalendar();
                downloadIcsFile(generateIcsContent(s), `shift-${s.date}`);
              }}
            >
              {t('shifts.downloadIcs')}
            </Button>
          </Stack>
        )}

        {existingShift && (
          <Stack gap="md" mb="xl">
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
          </Stack>
        )}

        <Button variant="subtle" color="gray" fullWidth radius="xl" onClick={onClose} mt="sm">
          {t('settings.cancel')}
        </Button>
        </form>
      )}
    </Box>
  );
};
