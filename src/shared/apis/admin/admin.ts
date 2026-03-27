import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';

const http = new HttpClient(axiosInstance);

export const adminApi = {};
