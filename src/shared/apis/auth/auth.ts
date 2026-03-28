import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';
import type Role from '@constants/role';

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
  role: Role;
};

export type idCheckResponse = Rsp<boolean>;

export type sendEmailRequest = {
  email: string;
};

export type emailCheckRequest = {
  email: string;
  code: string;
};

export type clubVerifyRequest = {
  clubId: number;
  studentNum: string;
  role: Role;
};

export type findIdRequest = {
  email: string;
};

export type resetPasswordConfirmRequest = {
  token: string;
  newPassword: string;
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
  delete: () => http.delete<Rsp<null>>(ENDPOINTS.auth.delete),
  clubVerify: (body: clubVerifyRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.verify, body),
  findId: (body: findIdRequest) => http.post<Rsp<string>, typeof body>(ENDPOINTS.auth.findId, body),
  forgotPassword: (body: sendEmailRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.forgotPassword, body),
  resetPasswordSendEmail: (body: sendEmailRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.resetPasswordSendEmail, body),
  resetPassword: (body: resetPasswordConfirmRequest) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.auth.resetPassword, body),
};
