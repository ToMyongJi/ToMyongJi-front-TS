import type { college } from '@apis/college/college';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StudentClub = Pick<college, 'studentClubId' | 'studentClubName' | 'verification'>;

interface SidebarState {
  selectedClub: StudentClub | null;
  setSelectedClub: (club: StudentClub) => void;
  clearSelectedClub: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      selectedClub: null,
      setSelectedClub: (club) => set({ selectedClub: club }),
      clearSelectedClub: () => set({ selectedClub: null }),
    }),
    {
      name: 'sidebar-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
