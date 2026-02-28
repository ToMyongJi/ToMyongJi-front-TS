import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type {Rsp} from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type college = {
  studentClubId: number;
  studentClubName: string;
  verification: boolean;
}

export type collegeGetAllResponse = Rsp<{
  collegeId: number;
  collegeName: string;
  clubs: college[];
}>

export const collegeApi = {
  collegesAndClubs: () =>
    http.get<collegeGetAllResponse>(ENDPOINTS.college.all)
}