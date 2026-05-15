import {
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_MAX_MONTHLY_EARNINGS,
  DEFAULT_MIN_HOURLY_WAGE,
} from '../constants';
import { useAppStore } from '../store/app.store';
import { TealPageHeader } from '../components/shared/TealPageHeader.component';
import { IconHandClick } from '@tabler/icons-react';

export const OnboardingView = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setProfile = useAppStore((state) => state.setProfile);

  const form = useForm({
    initialValues: {
      name: '',
      company: '',
      hourlyRate: '' as unknown as number,
      startingTipBudget: 0,
      language: i18n.language.startsWith('en') ? 'en' : DEFAULT_LANGUAGE,
    },
    validate: {
      name: (value: string) => (value.trim().length > 0 ? null : t('common.required')),
      company: (value: string) => (value.trim().length > 0 ? null : t('common.required')),
      hourlyRate: (value: number) => (value > 0 ? null : t('common.invalidNumber')),
    },
  });

  const addCompany = useAppStore((state) => state.addCompany);

  const handleSubmit = (values: typeof form.values) => {
    const companyId =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11);
    const newCompany = {
      id: companyId,
      name: values.company,
      hourlyRate: Number(values.hourlyRate),
      createdAt: new Date().toISOString(),
    };

    addCompany(newCompany);
    i18n.changeLanguage(values.language);

    setProfile({
      name: values.name,
      defaultCompanyId: companyId,
      startingTipBudget: Number(values.startingTipBudget),
      language: values.language as 'de' | 'en',
      maxMonthlyEarnings: DEFAULT_MAX_MONTHLY_EARNINGS,
      minHourlyWage: DEFAULT_MIN_HOURLY_WAGE,
    });
    navigate('/');
  };

  return (
    <Box>
      <TealPageHeader>
        <Group justify="center" align="flex-start">
          <Stack pb="xl">
            <IconHandClick size={64} />
          </Stack>
          <Stack gap={0}>
            <Title order={1} mb={8} c="white">
              {t('onboarding.title')}
            </Title>
            <Text c="white" mb="xl" maw='10rem'>
              {t('onboarding.subtitle')}
            </Text>
          </Stack>
        </Group>
      </TealPageHeader>
      <Container size="sm" p="xl">
        <Box mt="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                withAsterisk
                label={t('onboarding.name')}
                placeholder={t('onboarding.namePlaceholder')}
                {...form.getInputProps('name')}
              />

              <TextInput
                withAsterisk
                label={t('onboarding.company')}
                placeholder={t('onboarding.companyPlaceholder')}
                {...form.getInputProps('company')}
              />

              <NumberInput
                withAsterisk
                label={t('onboarding.hourlyRate')}
                placeholder={t('onboarding.hourlyRatePlaceholder')}
                min={0}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
                leftSection="€"
                rightSection={
                  <Text size="xs" c="dimmed">
                    /h
                  </Text>
                }
                {...form.getInputProps('hourlyRate')}
              />

              <NumberInput
                label={t('onboarding.startingTipBudget')}
                placeholder={t('onboarding.startingTipBudgetPlaceholder')}
                min={0}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
                leftSection="€"
                {...form.getInputProps('startingTipBudget')}
              />

              <Select
                label={t('onboarding.language')}
                data={[
                  { value: 'de', label: 'Deutsch' },
                  { value: 'en', label: 'English' },
                ]}
                {...form.getInputProps('language')}
                onChange={(val) => {
                  form.setFieldValue('language', val || DEFAULT_LANGUAGE);
                  i18n.changeLanguage(val || DEFAULT_LANGUAGE);
                }}
              />

              <Button type="submit" size="lg" mt="xl" color="teal">
                {t('onboarding.start')}
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};
