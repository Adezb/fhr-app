import { useState, useEffect, useRef } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { performSync, getLastSyncTime } from '../lib/sync';

/**
 * Orchestrates the synchronization process safely.
 * Fixes Bug 1: Prevents infinite loops via strict refs and error backoff.
 */
export function useSync() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs ensure we don't trigger unnecessary useEffect reruns
  const hasSyncedForSession = useRef(false);
  const isCurrentlySyncing = useRef(false);

  // Initial load of last sync time from DB
  useEffect(() => {
    getLastSyncTime().then(setLastSync).catch(console.error);
  }, []);

  // Sync trigger logic: strictly once per network session
  useEffect(() => {
    // Reset session flag when offline so it triggers again on reconnect
    if (!isOnline) {
      hasSyncedForSession.current = false;
      return;
    }

    // Only sync if online, not currently syncing, hasn't synced this session, and no fatal error
    if (isOnline && !hasSyncedForSession.current && !isCurrentlySyncing.current && !error) {
      const executeSync = async () => {
        isCurrentlySyncing.current = true;
        setIsSyncing(true);
        setError(null);
        
        try {
          await performSync();
          const newTime = await getLastSyncTime();
          setLastSync(newTime);
          hasSyncedForSession.current = true; // Mark success
        } catch (err) {
          console.error("Sync failed:", err);
          // Set error state and STOP completely. The !error dependency check above prevents loops.
          setError(err instanceof Error ? err : new Error('Unknown sync error'));
        } finally {
          setIsSyncing(false);
          isCurrentlySyncing.current = false;
        }
      };

      executeSync();
    }
  }, [isOnline, error]); // STRICT dependency array: only network status and error state

  const forceSync = () => {
    if (!isOnline || isCurrentlySyncing.current) return;
    setError(null); // Clear error to re-arm the useEffect trigger
    hasSyncedForSession.current = false;
  };

  return { isSyncing, lastSync, error, forceSync, isOnline };
}
