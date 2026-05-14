import { ActionIcon, Box, Button, Container, Group, NumberInput, Select, Text, TextInput, ThemeIcon, Title, useMantineTheme, Drawer, UnstyledButton, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconMail, IconUser, IconBriefcase } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { DEFAULT_MAX_MONTHLY_EARNINGS, DEFAULT_MIN_HOURLY_WAGE, DEFAULT_LANGUAGE } from '../constants';

export const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const profile = useAppStore((state) => state.profile);
  const companies = useAppStore((state) => state.companies);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const clearAllData = useAppStore((state) => state.clearAllData);

  const [opened, { open, close }] = useDisclosure(false);

  const defaultCompany = companies.find(c => c.id === profile?.defaultCompanyId) || companies[0];

  const form = useForm({
    initialValues: {
      name: profile?.name || '',
      startingTipBudget: profile?.startingTipBudget || 0,
      language: profile?.language || DEFAULT_LANGUAGE,
      maxMonthlyEarnings: profile?.maxMonthlyEarnings || DEFAULT_MAX_MONTHLY_EARNINGS,
      minHourlyWage: profile?.minHourlyWage || DEFAULT_MIN_HOURLY_WAGE,
    },
  });

  const handleSave = (values: typeof form.values) => {
    updateProfile({
      name: values.name,
      startingTipBudget: Number(values.startingTipBudget),
      language: values.language as 'de' | 'en',
      maxMonthlyEarnings: Number(values.maxMonthlyEarnings),
      minHourlyWage: Number(values.minHourlyWage),
    });
    i18n.changeLanguage(values.language);
  };

  const handleClearData = () => {
    clearAllData();
    close();
    navigate('/onboarding');
  };

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Title order={2}>{t('settings.title')}</Title>
        </Group>

        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 24,
            border: `1px solid ${theme.colors.gray[2]}`,
            marginBottom: 24,
          }}
        >
          <Group wrap="nowrap">
            <ThemeIcon size={64} radius="xl" color="teal.9">
              <Text fw={700} size="xl">
                {profile?.name.substring(0, 2).toUpperCase()}
              </Text>
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">{profile?.name}</Text>
              <Text size="sm" c="dimmed" mb="xs">{profile?.name.toLowerCase().replace(' ', '.')}@email.com</Text>
              <Group gap="xs">
                <Box style={{ backgroundColor: theme.colors.teal[0], color: theme.colors.teal[8], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {defaultCompany?.name || t('settings.noCompany')}
                </Box>
                <Box style={{ backgroundColor: theme.colors.gray[1], color: theme.colors.gray[7], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {t('settings.since', { date: 'Mar 2026' })}
                </Box>
              </Group>
            </Box>
          </Group>
        </Box>

        <form onSubmit={form.onSubmit(handleSave)}>
          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.account')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <TextInput
              variant="unstyled"
              label={t('settings.displayName')}
              leftSection={<IconUser size={18} color={theme.colors.teal[5]} />}
              {...form.getInputProps('name')}
              styles={{ root: { paddingTop: 8, paddingBottom: 8 } }}
            />
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.companies')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '0 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <UnstyledButton 
              onClick={() => navigate('/settings/companies')}
              style={{ width: '100%', padding: '16px 0' }}
            >
              <Group justify="space-between">
                <Group gap="md">
                  <ThemeIcon variant="light" color="teal" size="md">
                    <IconBriefcase size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" fw={600}>{t('settings.manageCompanies')}</Text>
                    <Text size="xs" c="dimmed">{companies.length} {t('settings.companiesCount')}</Text>
                  </Box>
                </Group>
                <IconChevronRight size={18} color={theme.colors.gray[5]} />
              </Group>
            </UnstyledButton>
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.payDefaults')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <NumberInput
              variant="unstyled"
              label={t('settings.startingTipBudget')}
              description={t('settings.cashYouStart')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('startingTipBudget')}
              styles={{ root: { paddingTop: 8, paddingBottom: 8 } }}
            />
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.app')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <Select
              variant="unstyled"
              label={t('settings.language')}
              data={[
                { value: 'de', label: 'Deutsch' },
                { value: 'en', label: 'English' },
              ]}
              {...form.getInputProps('language')}
              styles={{ root: { paddingBottom: 8, paddingTop: 8 } }}
            />
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.advanced')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <NumberInput
              variant="unstyled"
              label={t('settings.maxMonthlyEarnings')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('maxMonthlyEarnings')}
              styles={{ root: { borderBottom: `1px solid ${theme.colors.gray[2]}`, paddingBottom: 16, paddingTop: 8 } }}
            />
            <NumberInput
              variant="unstyled"
              label={t('settings.minHourlyWage')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('minHourlyWage')}
              styles={{ root: { borderBottom: `1px solid ${theme.colors.gray[2]}`, paddingBottom: 16, paddingTop: 8 } }}
            />
            <Box mt="md" mb="sm">
              <Button color="red" variant="light" fullWidth onClick={open} type="button">
                {t('settings.clearAllData')}
              </Button>
            </Box>
          </Box>

          <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth mb="xl">
            {t('common.save')}
          </Button>
        </form>

        <Drawer 
          opened={opened} 
          onClose={close} 
          title={
            <Text fw={700} c="red">{t('settings.clearAllData')}</Text>
          } 
          position="bottom"
          size="auto"
          withinPortal={false}
          padding="xl"
          styles={{
            content: { 
              borderTopLeftRadius: 32, 
              borderTopRightRadius: 32,
              boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Stack gap="xl" pb="xl">
            <Text size="sm" c="dimmed">
              {t('settings.clearAllDataConfirm')}
            </Text>
            
            <Group grow>
              <Button variant="subtle" color="gray" onClick={close} radius="xl">
                {t('settings.cancel')}
              </Button>
              <Button color="red" onClick={handleClearData} radius="xl">
                {t('settings.delete')}
              </Button>
            </Group>
          </Stack>
        </Drawer>

      </Container>
    </Box>
  );
};
