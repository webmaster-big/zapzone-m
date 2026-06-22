import { create } from 'zustand';
import { PREF_KEYS, prefs } from '@/lib/storage/mmkv';
import type { Location } from '@/types/models';
import { analytics, AnalyticsEvent } from '@/lib/analytics/analytics';

interface LocationState {
  selectedLocationId: number | null;
  selectedLocation: Location | null;
  setLocation: (location: Location) => void;
  clear: () => void;
}

const storedId = prefs.getNumber(PREF_KEYS.selectedLocationId) ?? null;

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocationId: storedId,
  selectedLocation: null,
  setLocation: (location) => {
    prefs.setNumber(PREF_KEYS.selectedLocationId, location.id);
    analytics.logEvent(AnalyticsEvent.SelectLocation, {
      location_id: location.id,
      location_name: location.name,
    });
    set({ selectedLocationId: location.id, selectedLocation: location });
  },
  clear: () => {
    prefs.remove(PREF_KEYS.selectedLocationId);
    set({ selectedLocationId: null, selectedLocation: null });
  },
}));
