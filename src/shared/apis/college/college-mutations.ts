import { buildMutation } from '@apis/base/factory';
import { collegeApi } from './college';

export const collegeMutations = {
  transferAndUser: () => buildMutation(collegeApi.transferAndUser),
};
