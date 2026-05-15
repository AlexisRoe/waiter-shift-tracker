import { del, get } from 'idb-keyval';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  BACKUP_HASH_KEY,
  buildExportJsonString,
  buildPersistPayloadFromState,
  importBackupJsonAndPersist,
} from './appDataBackup';
import { PERSIST_STORAGE_NAME } from './persistKey';

import type { AppState } from './types';

describe('appDataBackup', () => {
  beforeEach(async () => {
    await del(PERSIST_STORAGE_NAME);
  });

  const minimalState: AppState = {
    profile: null,
    companies: [],
    shifts: [],
    tipTransactions: [],
    isOnboarded: false,
    _hasHydrated: true,
    setHasHydrated: () => {},
    setProfile: () => {},
    updateProfile: () => {},
    addCompany: () => {},
    updateCompany: () => {},
    deleteCompany: () => {},
    setDefaultCompany: () => {},
    addShift: () => {},
    updateShift: () => {},
    deleteShift: () => {},
    addTipTransaction: () => {},
    clearAllData: () => {},
    dashboardPeriod: 'month',
    balanceTab: 'All',
    setDashboardPeriod: () => {},
    setBalanceTab: () => {},
    deleteTipTransaction: () => {},
  };

  it('export then import round-trips to IndexedDB without hash in stored value', async () => {
    const json = await buildExportJsonString(minimalState);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect(typeof parsed[BACKUP_HASH_KEY]).toBe('string');
    expect(parsed.state).toBeDefined();

    const result = await importBackupJsonAndPersist(json);
    expect(result).toEqual({ ok: true });

    const stored = await get(PERSIST_STORAGE_NAME);
    expect(typeof stored).toBe('string');
    const storedObj = JSON.parse(String(stored)) as Record<string, unknown>;
    expect(storedObj[BACKUP_HASH_KEY]).toBeUndefined();
    expect(storedObj.state).toEqual(buildPersistPayloadFromState(minimalState).state);
  });

  it('rejects tampered payload', async () => {
    const json = await buildExportJsonString(minimalState);
    const parsed = JSON.parse(json) as { state: { isOnboarded: boolean }; hash: string };
    parsed.state = { ...parsed.state, isOnboarded: true };
    const tampered = JSON.stringify(parsed);
    const result = await importBackupJsonAndPersist(tampered);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorKey).toBe('settings.importHashMismatch');
    }
  });
});
