import type { college } from '@apis/college/college';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StudentClub = Pick<college, 'studentClubId' | 'studentClubName' | 'verification'>;

interface StudentClubState {
  selectedClub: StudentClub | null;
  setSelectedClub: (club: StudentClub) => void;
  clearSelectedClub: () => void;
}

export const useStudentClubStore = create<StudentClubState>()(
  persist(
    (set) => ({
      selectedClub: null,
      setSelectedClub: (club) => set({ selectedClub: club }),
      clearSelectedClub: () => set({ selectedClub: null }),
    }),
    {
      name: 'student-club-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
