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

export type collegeGetAllResponse = Rsp<{
  collegeId: number;
  collegeName: string;
  clubs: college[];
}>;

export type transferAndUserRequest = {
  presidentInfo: {
    clubId: number;
    studentNum: string;
    name: string;
  };
  remaingMemberIds: string[];
};

export type transferAndUserResponse = Rsp<{
  studentClubName: string;
  totalDeposit: number;
  netAmount: number;
}>;
export type getClubResponse = Rsp<
  {
    studentClubId: number;
    studentClubName: string;
    verification: boolean;
  }[]
>;

export type getClubMemberResponse = Rsp<
  {
    studentNum: string;
    name: string;
  }[]
>;

export const collegeApi = {
  collegesAndClubs: () => http.get<collegeGetAllResponse>(ENDPOINTS.college.all),
  getAllClub: () => http.get<getClubResponse>(ENDPOINTS.club.root),
  getCollegeByClub: (collegeId: number) =>
    http.get<getClubResponse>(ENDPOINTS.club.college(collegeId)),
  transferCollege: () => http.post<collegeGetAllResponse>(ENDPOINTS.club.transfer),
  transferAndUser: (body: transferAndUserRequest) =>
    http.post<transferAndUserResponse>(ENDPOINTS.club.transferAndUser, body),
  getClubMember: () => http.get<getClubMemberResponse>(ENDPOINTS.club.getClubMember),
};
