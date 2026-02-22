import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type {Rsp} from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type authLoginRequest = {
  userId: string;
  password: string;
}

export type authLoginResponse = Rsp<{
  grantType: string;
  accessToken: string;
  refreshToken: string;
}>

export type authSignupRequest = {
  userId: string;
  name: string;
  studentNum: string;
  collegeName: string;
  studentClubId: number;
  email: string;
  password: string;
  role: "" | "STU" | "PRESIDENT";
}

export const authApi = {
  login: (body: authLoginRequest) =>
    http.post<authLoginResponse, typeof body>(ENDPOINTS.auth.login, body),
  signup: (body: authSignupRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.signup, body),
}