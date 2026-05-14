import { set } from 'idb-keyval';
import { PERSIST_STORAGE_NAME } from './persistKey';
import type { AppState } from './types';

/** Root-level key on export files; stripped before persisting to IndexedDB. */
export const BACKUP_HASH_KEY = 'hash';

function stableStringify(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') {
    return JSON.stringify(value);
  }
  if (t !== 'object') {
    return JSON.stringify(String(value));
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function pickPersistedSlice(state: AppState) {
  return {
    profile: state.profile,
    companies: state.companies,
    shifts: state.shifts,
    tipTransactions: state.tipTransactions,
    isOnboarded: state.isOnboarded,
  };
}

export function buildPersistPayloadFromState(state: AppState): {
  state: ReturnType<typeof pickPersistedSlice>;
  version: number;
} {
  return { state: pickPersistedSlice(state), version: 0 };
}

export async function buildExportJsonString(state: AppState): Promise<string> {
  const persistPayload = buildPersistPayloadFromState(state);
  const hash = await sha256Hex(stableStringify(persistPayload));
  return JSON.stringify({ ...persistPayload, [BACKUP_HASH_KEY]: hash });
}

export type ImportBackupResult = { ok: true } | { ok: false; errorKey: string };

export type VerifyBackupImportResult =
  | { ok: true; persistJson: string }
  | { ok: false; errorKey: string };

async function parseAndVerifyBackup(raw: string): Promise<VerifyBackupImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, errorKey: 'settings.importInvalidJson' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, errorKey: 'settings.importInvalidJson' };
  }

  const record = parsed as Record<string, unknown>;
  const hash = record[BACKUP_HASH_KEY];
  if (typeof hash !== 'string' || !hash) {
    return { ok: false, errorKey: 'settings.importMissingHash' };
  }

  const state = record.state;
  const version = typeof record.version === 'number' ? record.version : 0;

  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return { ok: false, errorKey: 'settings.importInvalidPayload' };
  }

  const persistPayload = { state, version };
  const expected = await sha256Hex(stableStringify(persistPayload));
  if (expected !== hash) {
    return { ok: false, errorKey: 'settings.importHashMismatch' };
  }

  return { ok: true, persistJson: JSON.stringify(persistPayload) };
}

/** Validates backup JSON (including hash). Does not write to storage. */
export async function verifyBackupJsonForImport(raw: string): Promise<VerifyBackupImportResult> {
  return parseAndVerifyBackup(raw);
}

export async function persistVerifiedBackupJson(persistJson: string): Promise<ImportBackupResult> {
  try {
    await set(PERSIST_STORAGE_NAME, persistJson);
  } catch {
    return { ok: false, errorKey: 'settings.importWriteFailed' };
  }
  return { ok: true };
}

export async function importBackupJsonAndPersist(raw: string): Promise<ImportBackupResult> {
  const verified = await parseAndVerifyBackup(raw);
  if (!verified.ok) {
    return verified;
  }
  return persistVerifiedBackupJson(verified.persistJson);
}
