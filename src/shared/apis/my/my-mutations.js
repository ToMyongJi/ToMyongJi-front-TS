import { buildMutation } from '@apis/base/factory';
import { myApi } from './my';
export const myMutations = {
    addMember: () => buildMutation(myApi.addMember),
    viewMember: () => buildMutation(myApi.viewMember),
    deleteMember: () => buildMutation(myApi.deleteMember),
};
