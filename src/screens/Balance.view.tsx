import {
  Box,
  Button,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowDown, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { AddTipForm } from '../components/shared/AddTipForm.component';
import { BottomDrawer } from '../components/shared/BottomDrawer.component';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { TealPageHeader } from '../components/shared/TealPageHeader.component';
import { useBalance } from '../hooks/useBalance.hook';

export const BalanceView = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [withdrawOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false);

  const { tab, setTab, profile, currentPot, totalIn, totalOut, monthlyTotal, grouped } =
    useBalance();

  return (
    <Box pb={100}>
      <TealPageHeader color={theme.colors.teal[9]}>
        <Group align="flex-start" wrap="nowrap" mb="xl">
          <Box
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: `6px solid ${theme.colors.teal[6]}`,
              borderRightColor: theme.colors.teal[8],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              flexShrink: 0,
            }}
          >
            <CurrencyDisplay amount={currentPot} size="sm" fw={800} lh={1} c="dark" noDecimals />
            <Text size="10px" fw={700} c="dimmed" mt={2}>
              {t('balance.inThePot')}
            </Text>
          </Box>

          <Box style={{ flex: 1 }}>
            <Text size="xs" fw={700} c="teal.1" mb={4} style={{ opacity: 0.8 }}>
              {t('balance.tipJar')}
            </Text>
            <Text size="sm" mb="md" lh={1.3} c="white">
              {t('balance.tipJarDesc')}
            </Text>
            <Group gap="xs">
              <Text size="xs" c="teal.1" style={{ opacity: 0.9 }}>
                <Text span fw={600} c="white">
                  +{totalIn.toFixed(2)} €
                </Text>{' '}
                {t('balance.in')}
              </Text>
              <Text size="xs" c="teal.1" style={{ opacity: 0.9 }}>
                <Text span fw={600} c="white">
                  {totalOut.toFixed(2)} €
                </Text>{' '}
                {t('balance.out')}
              </Text>
            </Group>
          </Box>
        </Group>

        {/* Monthly Earnings Card */}
        <Box
          mb="xl"
          p="md"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: theme.radius.md,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Text size="10px" fw={700} c="teal.1" style={{ letterSpacing: 0.5, opacity: 0.8 }}>
                {t('balance.monthlyEarnings').toUpperCase()}
              </Text>
              <Text size="xs" fw={500} c="white" style={{ opacity: 0.9 }}>
                {dayjs().format('MMMM YYYY')} · {t('balance.target')}{' '}
                {profile?.maxMonthlyEarnings || 540}€
              </Text>
            </Stack>
            <CurrencyDisplay amount={monthlyTotal} fz={20} fw={800} lh={1} c="white" />
          </Group>
        </Box>

        <Group grow>
          <Button
            variant="outline"
            color="white"
            radius="xl"
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={openAdd}
            styles={{
              root: {
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              },
            }}
          >
            {t('balance.addTip')}
          </Button>
          <Button
            variant="outline"
            color="white"
            radius="xl"
            size="xs"
            leftSection={<IconArrowDown size={16} />}
            onClick={openWithdraw}
            styles={{
              root: {
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              },
            }}
          >
            {t('balance.withdrawFromPot')}
          </Button>
        </Group>
      </TealPageHeader>

      <Container size="sm" p="md">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          data={[
            { label: t('balance.all'), value: 'All' },
            { label: t('balance.shifts'), value: 'Shifts' },
            { label: t('balance.tipsAndPot'), value: 'Tips' },
          ]}
          fullWidth
          radius="xl"
          mb="xl"
        />

        {Object.keys(grouped).length === 0 ? (
          <Stack align="center" py={40} gap="xs">
            <Text fw={600} c="dimmed">
              {t('balance.noTransactions')}
            </Text>
            <Text size="sm" c="dimmed" ta="center" px="xl">
              {t('balance.emptyState')}
            </Text>
          </Stack>
        ) : (
          Object.entries(grouped).map(([month, txs]) => (
            <Box key={month} mb="xl">
              <Text fw={700} c="dimmed" size="xs" mb="md" style={{ letterSpacing: 1 }}>
                {month}
              </Text>
              <Stack gap="xs">
                {txs.map((tx) => (
                  <Group
                    key={tx.id}
                    justify="space-between"
                    p="md"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.gray[1]}`,
                    }}
                  >
                    <Box>
                      <Text fw={600} size="sm">
                        {tx.label}
                      </Text>
                      <Group gap={6}>
                        <Text size="xs" c="dimmed">
                          {dayjs(tx.date).format('DD.MM.YYYY')}
                        </Text>
                        {tx.subLabel && (
                          <Text size="xs" c="dimmed">
                            · {tx.subLabel}
                          </Text>
                        )}
                      </Group>
                    </Box>
                    <Text fw={700} c={tx.amount < 0 ? 'red.7' : 'teal.8'}>
                      {tx.amount < 0 ? '-' : '+'}
                      {Math.abs(tx.amount).toFixed(2)} €
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Container>

      <BottomDrawer
        opened={addOpened}
        onClose={closeAdd}
        title={<Text fw={700}>{t('addTip.titleDeposit')}</Text>}
      >
        <AddTipForm mode="deposit" onSuccess={closeAdd} onCancel={closeAdd} />
      </BottomDrawer>

      <BottomDrawer
        opened={withdrawOpened}
        onClose={closeWithdraw}
        title={<Text fw={700}>{t('addTip.titleWithdraw')}</Text>}
      >
        <AddTipForm mode="withdraw" onSuccess={closeWithdraw} onCancel={closeWithdraw} />
      </BottomDrawer>
    </Box>
  );
};
