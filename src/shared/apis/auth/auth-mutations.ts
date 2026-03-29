import { authApi } from '@apis/auth/auth';
import { buildMutation } from '@apis/base/factory';

export const authMutations = {
  login: () => buildMutation(authApi.login),
  signup: () => buildMutation(authApi.signup),
  forgotPassword: () => buildMutation(authApi.forgotPassword),
  sendEmail: () => buildMutation(authApi.sendEmail),
  emailCheck: () => buildMutation(authApi.emailCheck),
  delete: () => buildMutation(authApi.delete),
  clubVerify: () => buildMutation(authApi.clubVerify),
  resetPasswordSendEmail: () => buildMutation(authApi.resetPasswordSendEmail),
  resetPassword: () => buildMutation(authApi.resetPassword),
};
