var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BASE_URL } from '@apis/constants/endpoints';
import axios from 'axios';
import useAuthStore from 'src/shared/store/auth-store';
export const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });
    // 주석 해제 및 로직 수정
    instance.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
        // Zustand 스토어에서 직접 상태(토큰)를 가져옵니다.
        const authData = useAuthStore.getState().authData;
        if (authData) {
            config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
        return config;
    }));
    // instance.interceptors.request.use(async (config) => {
    //   if (getToken) {
    //     const token = ;
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //   }
    //   return config;
    // });
    return instance;
};
export const axiosInstance = createAxiosInstance();
