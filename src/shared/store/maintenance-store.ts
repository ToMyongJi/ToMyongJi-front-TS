import { create } from 'zustand';

export interface MaintenanceInfo {
  status: string;
  message: string;
  startTime: string;
  expectedEndTime: string;
}

const isWithinMaintenancePeriod = (startTime: string, expectedEndTime: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(expectedEndTime);
  return now >= start && now <= end;
};

interface MaintenanceState {
  isMaintenance: boolean;
  isNetworkError: boolean;
  info: MaintenanceInfo | null;
  setMaintenance: (info: MaintenanceInfo) => void;
  setNetworkError: (isNetworkError: boolean) => void;
  reset: () => void;
}

const useMaintenanceStore = create<MaintenanceState>((set) => ({
  isMaintenance: false,
  isNetworkError: false,
  info: null,
  setMaintenance: (info) => {
    const isMaintenance = isWithinMaintenancePeriod(info.startTime, info.expectedEndTime);
    set({ isMaintenance, info, isNetworkError: false });
  },
  setNetworkError: (isNetworkError) => set({ isNetworkError }),
  reset: () => set({ isMaintenance: false, isNetworkError: false, info: null }),
}));

export default useMaintenanceStore;