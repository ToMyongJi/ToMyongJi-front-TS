import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type request = {
  clubId: number;
  studentNum: string;
  name: string;
};

export type presidentResponse = Rsp<{
  clubId: number;
  studentNum: string;
  name: string;
}>;

export type memberResponse = Rsp<{
  memberId: number;
  studentNum: string;
  name: string;
}>;

export type getMemberResponse = Rsp<
  {
    memberId: number;
    studentNum: string;
    name: string;
  }[]
>;

export type status = Rsp<{
  status: string;
  message: string;
  startTime: string;
  expectedEndTime: string;
}>;

export const adminApi = {
  postPresident: (body: request) =>
    http.post<presidentResponse, typeof body>(ENDPOINTS.admin.president, body),
  patchPresident: (body: request) =>
    http.patch<presidentResponse, typeof body>(ENDPOINTS.admin.president, body),
  postMember: (body: request) =>
    http.post<memberResponse, typeof body>(ENDPOINTS.admin.member, body),
  getPresident: (clubId: number) =>
    http.get<presidentResponse>(ENDPOINTS.admin.clubPresident(clubId)),
  getMember: (clubId: number) => http.get<getMemberResponse>(ENDPOINTS.admin.clubMember(clubId)),
  deleteMember: (memberId: number) => http.delete<memberResponse>(ENDPOINTS.admin.delete(memberId)),
  setStatus: (body: status) =>
    http.post<null, typeof body>(ENDPOINTS.status.change, body),
  checkStatus: () =>
    http.get<status>(ENDPOINTS.status.check)
};
