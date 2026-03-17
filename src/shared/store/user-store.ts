import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  userId?: string; // 사용자 아이디
  name?: string;
  role?: 'ADMIN' | 'STU' | 'PRESIDENT'; // ADMIN: 관리자, STU: 학생, PRESIDENT: 학생회장
  studentNum?: string; // 학번
  college?: string; // 소속 단과대
  studentClubId?: number; // 학생회 아이디
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
      // TypeScript에서는 storage 객체의 타입을 명시하거나,
      // 기본 localStorage를 사용하는 경우 생략해도 자동으로 처리됩니다.
      // 커스텀 로직이 필요하다면 아래와 같이 작성합니다.
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useUserStore;
