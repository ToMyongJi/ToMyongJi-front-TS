import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type college = {
  studentClubId: number;
  studentClubName: string;
  verification: boolean;
};

export type collegeGetAllResponse = Rsp<
  {
    collegeId: number;
    collegeName: string;
    clubs: college[];
  }[]
>;

export type getClubResponse = Rsp<
  {
    studentClubId: number;
    studentClubName: string;
    verification: boolean;
  }[]
>;

export const collegeApi = {
  collegesAndClubs: () => http.get<collegeGetAllResponse>(ENDPOINTS.college.all),
  getAllClub: () => http.get<getClubResponse>(ENDPOINTS.club.root),
  getCollegeByClub: (collegeId: number) =>
    http.get<getClubResponse>(ENDPOINTS.club.college(collegeId)),
  transferCollege: () => http.post<collegeGetAllResponse>(ENDPOINTS.club.transfer),
};
