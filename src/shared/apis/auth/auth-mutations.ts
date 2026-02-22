import {buildMutation} from '@apis/base/factory';
import {authApi} from '@apis/auth/auth';

export const authMutations = {
  login: () => buildMutation(authApi.login),
  signup: () => buildMutation(authApi.signup),
}