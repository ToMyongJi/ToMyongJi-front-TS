import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type authLoginRequest = {
  userId: string;
  password: string;
};

export type authLoginResponse = Rsp<{
  grantType: string;
  accessToken: string;
  refreshToken: string;
}>;

export type authSignupRequest = {
  userId: string;
  name: string;
  studentNum: string;
  collegeName: string;
  studentClubId: number;
  email: string;
  password: string;
  role: 'ADMIN' | 'STU' | 'PRESIDENT';
};

export type idCheckResponse = Rsp<boolean>;

export type sendEmailRequest = {
  email: string;
};

export type emailCheckRequest = {
  email: string;
  code: string;
};

export type emailCheckResponse = Rsp<boolean>;
export const authApi = {
  login: (body: authLoginRequest) =>
    http.post<authLoginResponse, typeof body>(ENDPOINTS.auth.login, body),
  signup: (body: authSignupRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.signup, body),
  idCheck: (userId: string) => http.get<idCheckResponse>(ENDPOINTS.auth.check(userId)),
  sendEmail: (body: sendEmailRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.email, body),
  emailCheck: (body: emailCheckRequest) =>
    http.post<emailCheckResponse, typeof body>(ENDPOINTS.auth.emailCheck, body),
};
