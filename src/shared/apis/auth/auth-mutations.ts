import { authApi } from '@apis/auth/auth';
import { buildMutation } from '@apis/base/factory';

export const authMutations = {
  login: () => buildMutation(authApi.login),
  signup: () => buildMutation(authApi.signup),
};
