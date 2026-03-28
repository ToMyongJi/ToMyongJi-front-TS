import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useUserStore = create()(persist((set) => ({
    user: null,
    setUser: (user) => {
        set({ user });
    },
    clearUser: () => {
        set({ user: null });
    },
}), {
    name: 'user-storage',
    // TypeScript에서는 storage 객체의 타입을 명시하거나,
    // 기본 localStorage를 사용하는 경우 생략해도 자동으로 처리됩니다.
    // 커스텀 로직이 필요하다면 아래와 같이 작성합니다.
    storage: {
        getItem: (name) => {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
            localStorage.removeItem(name);
        },
    },
}));
export default useUserStore;
