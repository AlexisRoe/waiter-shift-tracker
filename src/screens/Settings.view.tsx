import {
  Box,
  Button,
  Collapse,
  Container,
  Group,
  NumberInput,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBriefcase,
  IconChevronDown,
  IconChevronRight,
  IconDownload,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BottomDrawer } from '../components/shared/BottomDrawer.component';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_MAX_MONTHLY_EARNINGS,
  DEFAULT_MIN_HOURLY_WAGE,
} from '../constants';
import { useAppStore } from '../store/app.store';
import {
  buildExportJsonString,
  persistVerifiedBackupJson,
  verifyBackupJsonForImport,
} from '../store/appDataBackup';
import { TealPageHeader } from '../components/shared/TealPageHeader.component';

export const SettingsView = () => {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const profile = useAppStore((state) => state.profile);
  const companies = useAppStore((state) => state.companies);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const clearAllData = useAppStore((state) => state.clearAllData);

  const [opened, { open, close }] = useDisclosure(false);
  const [advancedOpened, { toggle: toggleAdvanced }] = useDisclosure(false);
  const [importConfirmOpened, { open: openImportConfirm, close: closeImportConfirm }] =
    useDisclosure(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const defaultCompany = companies.find((c) => c.id === profile?.defaultCompanyId) || companies[0];

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

  const handleExportBackup = async () => {
    setImportError(null);
    try {
      const json = await buildExportJsonString(useAppStore.getState());
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `waiter-shift-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setImportError(t('settings.exportFailed'));
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImportError(null);
    let text: string;
    try {
      text = await file.text();
    } catch {
      setImportError(t('settings.importInvalidJson'));
      return;
    }

    const verified = await verifyBackupJsonForImport(text);
    if (!verified.ok) {
      setImportError(t(verified.errorKey));
      return;
    }
    const result = await persistVerifiedBackupJson(verified.persistJson);
    if (result.ok) {
      window.location.reload();
      return;
    }
    setImportError(t(result.errorKey));
  };

  const cancelImportConfirm = () => {
    closeImportConfirm();
  };

  const handleAcknowledgeImportAndPickFile = () => {
    setImportError(null);
    closeImportConfirm();
    window.setTimeout(() => {
      importInputRef.current?.click();
    }, 0);
  };

  return (
    <Box>

      <TealPageHeader>



          <Group wrap="nowrap">
            <ThemeIcon size={64} radius="xl" color="teal.0">
              <Text fw={700} size="xl" c='teal.9'>
                {profile?.name.substring(0, 2).toUpperCase()}
              </Text>
            </ThemeIcon>
            <Box>
              <Title order={3} mb={8} c="white">
                {profile?.name}
              </Title>
              <Group gap="xs">
                <Box
                  style={{
                    backgroundColor: 'white',
                    color: theme.colors.teal[8],
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {defaultCompany?.name || t('settings.noCompany')}
                </Box>
                <Box
                  style={{
                    backgroundColor: 'white',
                    color: theme.colors.teal[8],
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {t('settings.since', { date: 'Mar 2026' })}
                </Box>
              </Group>
            </Box>
          </Group>
              </TealPageHeader>
      <Container size="sm" p="md">


        <form onSubmit={form.onSubmit(handleSave)}>
          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">
            {t('settings.account')}
          </Text>
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

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">
            {t('settings.companies')}
          </Text>
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
                    <Text size="sm" fw={600}>
                      {t('settings.manageCompanies')}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {companies.length} {t('settings.companiesCount')}
                    </Text>
                  </Box>
                </Group>
                <IconChevronRight size={18} color={theme.colors.gray[5]} />
              </Group>
            </UnstyledButton>
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">
            {t('settings.payDefaults')}
          </Text>
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

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">
            {t('settings.app')}
          </Text>
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

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <UnstyledButton
              type="button"
              onClick={toggleAdvanced}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderBottom: advancedOpened ? `1px solid ${theme.colors.gray[2]}` : undefined,
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Text size="sm" fw={600}>
                  {t('settings.advancedExpandHint')}
                </Text>
                <IconChevronDown
                  size={20}
                  color={theme.colors.gray[6]}
                  style={{
                    transform: advancedOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 160ms ease',
                  }}
                />
              </Group>
            </UnstyledButton>
            <Collapse expanded={advancedOpened}>
              <Box px={20} pb="md" pt={4}>
                <Stack gap="sm">
                  <NumberInput
                    variant="unstyled"
                    label={t('settings.maxMonthlyEarnings')}
                    decimalScale={2}
                    leftSection="€"
                    {...form.getInputProps('maxMonthlyEarnings')}
                    styles={{
                      root: {
                        borderBottom: `1px solid ${theme.colors.gray[2]}`,
                        paddingBottom: 16,
                        paddingTop: 8,
                      },
                    }}
                  />
                  <NumberInput
                    variant="unstyled"
                    label={t('settings.minHourlyWage')}
                    decimalScale={2}
                    leftSection="€"
                    {...form.getInputProps('minHourlyWage')}
                    styles={{
                      root: {
                        borderBottom: `1px solid ${theme.colors.gray[2]}`,
                        paddingBottom: 16,
                        paddingTop: 8,
                      },
                    }}
                  />
                  <Box pt="md" pb="md">
                    <Stack gap="sm">
                      <Group grow gap="sm">
                        <Button
                          type="button"
                          variant="light"
                          color="teal"
                          leftSection={<IconDownload size={18} />}
                          onClick={() => void handleExportBackup()}
                        >
                          {t('settings.exportData')}
                        </Button>
                        <Button
                          type="button"
                          variant="light"
                          color="teal"
                          leftSection={<IconUpload size={18} />}
                          onClick={() => {
                            setImportError(null);
                            openImportConfirm();
                          }}
                        >
                          {t('settings.importData')}
                        </Button>
                      </Group>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept="application/json,.json"
                        style={{ display: 'none' }}
                        onChange={(e) => void handleImportFile(e)}
                      />
                      {importError ? (
                        <Text size="sm" c="red">
                          {importError}
                        </Text>
                      ) : null}
                    </Stack>
                  </Box>
                  <Box
                    style={{
                      backgroundColor: 'white',
                      borderRadius: theme.radius.lg,
                      padding: 24,
                      border: `1px solid ${theme.colors.gray[2]}`,
                    }}
                  >
                    <Stack gap={0}>
                      <Text c="dimmed" fz="sm">
                        Build: v{import.meta.env.VITE_APP_VERSION} (
                        {import.meta.env.VITE_COMMIT_HASH})
                      </Text>
                      <Text c="dimmed" fz="sm">
                        Date: {import.meta.env.VITE_BUILD_TIME}
                      </Text>
                    </Stack>
                    <Space h="md" />
                    <Button color="red" variant="light" fullWidth onClick={open} type="button">
                      {t('settings.clearAllData')}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Collapse>
          </Box>

          <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth mb="xl">
            {t('common.save')}
          </Button>
        </form>

        <BottomDrawer
          opened={importConfirmOpened}
          onClose={cancelImportConfirm}
          title={<Text fw={700}>{t('settings.importOverwriteTitle')}</Text>}
        >
          <Stack gap="xl" pb="xl">
            <Text size="sm" c="dimmed">
              {t('settings.importOverwriteMessage')}
            </Text>
            <Group grow>
              <Button variant="subtle" color="gray" onClick={cancelImportConfirm} radius="xl">
                {t('settings.cancel')}
              </Button>
              <Button color="orange" onClick={handleAcknowledgeImportAndPickFile} radius="xl">
                {t('settings.importChooseFile')}
              </Button>
            </Group>
          </Stack>
        </BottomDrawer>

        <BottomDrawer
          opened={opened}
          onClose={close}
          title={
            <Text fw={700} c="red">
              {t('settings.clearAllData')}
            </Text>
          }
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
        </BottomDrawer>
      </Container>
    </Box>
  );
};
