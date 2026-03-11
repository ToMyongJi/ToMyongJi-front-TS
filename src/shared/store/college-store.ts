import { create } from 'zustand';

// 대학 정보에 대한 타입 정의
export interface College {
  collegeId: number;
}

// 스토어의 상태와 액션에 대한 인터페이스 정의
interface CollegeStore {
  colleges: College[];
  setColleges: (colleges: College[]) => void;
  clearColleges: () => void;
  addCollege: (college: College) => void;
  updateCollege: (updatedCollege: College) => void;
  removeCollege: (collegeId: number) => void; // collegeId 타입에 맞게 수정
}

const useCollegeStore = create<CollegeStore>((set) => ({
  colleges: [],
  setColleges: (colleges) => set({ colleges }),
  clearColleges: () => set({ colleges: [] }),
  addCollege: (college) =>
    set((state) => ({
      colleges: [...state.colleges, college],
    })),
  updateCollege: (updatedCollege) =>
    set((state) => ({
      colleges: state.colleges.map((college) =>
        college.collegeId === updatedCollege.collegeId ? updatedCollege : college,
      ),
    })),
  removeCollege: (collegeId) =>
    set((state) => ({
      colleges: state.colleges.filter((college) => college.collegeId !== collegeId),
    })),
}));

export default useCollegeStore;
