import axios, { AxiosInstance } from 'axios';
import {BASE_URL} from '@apis/constants/endpoints';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
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