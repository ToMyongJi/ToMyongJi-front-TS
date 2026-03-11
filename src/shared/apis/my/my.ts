import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type myGetMyInfoRequest = {
  id: number;
};

export type myGetMyInfoResponse = Rsp<{
  name: string;
  studentNum: string;
  college: string;
  studentClubId: number;
}>;

export const myApi = {
  getMyInfo: (id: number) => http.get<myGetMyInfoResponse>(ENDPOINTS.my.view(id)),
};
