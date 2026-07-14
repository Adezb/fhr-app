import { supabase } from './supabase';
import { getDB } from './db';
import type { Chapter, Authority } from '../types';

const SYNC_META_KEY = 'lastSyncTimestamp';

/**
 * Performs a delta sync with Supabase and updates the local IndexedDB.
 */
export async function performSync(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('metadata', 'readonly');
  const metadataStore = tx.objectStore('metadata');
  const lastSync = await metadataStore.get(SYNC_META_KEY);
  await tx.done;

  const now = new Date().toISOString();
  
  // 1. Sync Chapters (Delta Query)
  let chaptersQuery = supabase
    .from('chapters')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (lastSync) {
    chaptersQuery = chaptersQuery.gt('updated_at', lastSync);
  }
  const { data: chaptersData, error: chaptersError } = await chaptersQuery;
  
  if (chaptersError) throw chaptersError;

  // 2. Sync Authorities (Delta Query)
  let authQuery = supabase.from('authorities').select('*');
  if (lastSync) {
    authQuery = authQuery.gt('updated_at', lastSync);
  }
  const { data: authData, error: authError } = await authQuery;

  if (authError) throw authError;

  // 3. Persist to IndexedDB if there are updates
  if ((chaptersData && chaptersData.length > 0) || (authData && authData.length > 0)) {
    const writeTx = db.transaction(['chapters', 'authorities', 'metadata'], 'readwrite');
    
    if (chaptersData) {
      const chapterStore = writeTx.objectStore('chapters');
      for (const chapter of chaptersData as Chapter[]) {
        await chapterStore.put(chapter);
      }
    }

    if (authData) {
      const authStore = writeTx.objectStore('authorities');
      for (const auth of authData as Authority[]) {
        await authStore.put(auth);
      }
    }

    // Update last sync timestamp
    const metaStore = writeTx.objectStore('metadata');
    await metaStore.put(now, SYNC_META_KEY);

    await writeTx.done;
  } else if (!lastSync) {
    // If no data returned but we have no lastSync (e.g. empty database), 
    // we should still record that we successfully checked at this time.
    const writeTx = db.transaction(['metadata'], 'readwrite');
    const metaStore = writeTx.objectStore('metadata');
    await metaStore.put(now, SYNC_META_KEY);
    await writeTx.done;
  }
}

/**
 * Retrieves the timestamp of the last successful sync from IndexedDB.
 */
export async function getLastSyncTime(): Promise<string | null> {
  const db = await getDB();
  const tx = db.transaction('metadata', 'readonly');
  const metadataStore = tx.objectStore('metadata');
  const lastSync = await metadataStore.get(SYNC_META_KEY);
  await tx.done;
  return lastSync || null;
}
