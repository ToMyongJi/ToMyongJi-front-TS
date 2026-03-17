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

export type addMemberRequest = {
  id: number;
  studentNum: string;
  name: string;
};

export type memberResponse = Rsp<{
  memberId: number;
  studentNum: string;
  name: string;
}>;

export const myApi = {
  getMyInfo: (id: number) => http.get<myGetMyInfoResponse>(ENDPOINTS.my.view(id)),
  addMember: (body: addMemberRequest) =>
    http.post<memberResponse, typeof body>(ENDPOINTS.my.add, body),
  viewMember: (id: number) => http.get<memberResponse>(ENDPOINTS.my.viewMember(id)),
  deleteMember: (deletedStudentNumb: number) =>
    http.delete<memberResponse>(ENDPOINTS.my.deleteMember(deletedStudentNumb)),
};
