import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { myApi } from './my';
export const myQuery = {
    getMyInfo: (id) => buildQuery(QK.my.getMyInfo(id), () => myApi.getMyInfo(id)),
    viewMember: (id) => buildQuery(QK.my.viewMember(id), () => myApi.viewMember(id)),
};
