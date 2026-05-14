import { set } from 'idb-keyval';
import { PERSIST_STORAGE_NAME } from './persistKey';

function isPersistedZustandPayload(raw: string): boolean {
  try {
    const parsed: unknown = JSON.parse(raw);
    return (
      typeof parsed === 'object' &&
      parsed !== null &&
      'state' in parsed &&
      typeof (parsed as { state: unknown }).state === 'object' &&
      (parsed as { state: unknown }).state !== null
    );
  } catch {
    return false;
  }
}

/**
 * If a legacy Zustand `persist` payload still lives in `localStorage`, copies the same JSON
 * string into IndexedDB (what `idb-keyval` + `createJSONStorage` expect), removes the
 * `localStorage` entry, and reloads the document so the app boots once with hydration from IDB.
 *
 * Must run before any module imports `useAppStore`, so the in-memory store never applies
 * defaults on top of unsynced legacy data.
 */
export async function migrateLocalStorageToIndexedDB(): Promise<void> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  const fromLs = localStorage.getItem(PERSIST_STORAGE_NAME);
  if (!fromLs || !isPersistedZustandPayload(fromLs)) {
    return;
  }

  try {
    await set(PERSIST_STORAGE_NAME, fromLs);
    localStorage.removeItem(PERSIST_STORAGE_NAME);
  } catch (e) {
    console.error('[migrateLocalStorageToIndexedDB] Failed to copy legacy data to IndexedDB', e);
    return;
  }

  window.location.reload();
  // Avoid bootstrapping React in the same navigation tick as `reload()` (unload is not always immediate).
  await new Promise<void>(() => {
    /* never resolves */
  });
}
