import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Bridges NetInfo connectivity into TanStack Query's `onlineManager` so paused
 * queries/mutations resume automatically when the device reconnects. Call once
 * at app startup.
 */
export function configureOnlineManager(): void {
  onlineManager.setEventListener((setOnline) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // `isInternetReachable` can be null while resolving; treat null as online
      // to avoid falsely blocking requests on first launch.
      const reachable = state.isInternetReachable;
      setOnline(Boolean(state.isConnected) && reachable !== false);
    });
    return unsubscribe;
  });
}

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/** Reactive hook for showing offline banners and disabling network actions. */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: 'unknown',
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isConnected: Boolean(state.isConnected),
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });
    return unsubscribe;
  }, []);

  return status;
}
