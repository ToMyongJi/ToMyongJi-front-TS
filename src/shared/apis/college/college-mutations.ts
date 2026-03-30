import { buildMutation } from '@apis/base/factory';
import { collegeApi } from './college';

export const collegeMutations = {
  transferCollege: () => buildMutation(collegeApi.transferCollege),
  transferAndUser: () => buildMutation(collegeApi.transferAndUser),
};
