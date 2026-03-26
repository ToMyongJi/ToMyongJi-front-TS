import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useStudentClubStore = create()(persist((set) => ({
    selectedClub: null,
    setSelectedClub: (club) => set({ selectedClub: club }),
    clearSelectedClub: () => set({ selectedClub: null }),
}), {
    name: 'student-club-store',
    storage: createJSONStorage(() => localStorage),
}));
