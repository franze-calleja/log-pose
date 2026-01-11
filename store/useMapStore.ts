import type { Region } from 'react-native-maps';
import { create } from 'zustand';

interface MapState {
  region: Region | null;
  selectedLogId: number | null;
  activeTrip: number | null;
  setRegion: (region: Region) => void;
  setSelectedLogId: (logId: number | null) => void;
  setActiveTrip: (tripId: number | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  region: null,
  selectedLogId: null,
  activeTrip: null,
  setRegion: (region) => set({ region }),
  setSelectedLogId: (logId) => set({ selectedLogId: logId }),
  setActiveTrip: (tripId) => set({ activeTrip: tripId }),
}));
