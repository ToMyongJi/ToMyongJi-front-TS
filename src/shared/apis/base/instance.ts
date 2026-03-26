import { BASE_URL } from '@apis/constants/endpoints';
import axios, { type AxiosInstance } from 'axios';
import useAuthStore from 'src/shared/store/auth-store';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // 주석 해제 및 로직 수정
  instance.interceptors.request.use(async (config) => {
    // Zustand 스토어에서 직접 상태(토큰)를 가져옵니다.
    const authData = useAuthStore.getState().authData;

    if (authData) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }

    return config;
  });

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
