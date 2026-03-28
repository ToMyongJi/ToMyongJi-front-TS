import { buildMutation } from '@apis/base/factory';
import { adminApi } from './admin';

export const adminMutations = {
  postPresident: () => buildMutation(adminApi.postPresident),
  patchPresident: () => buildMutation(adminApi.patchPresident),
  postMember: () => buildMutation(adminApi.postMember),
  deleteMember: () => buildMutation(adminApi.deleteMember),
};
