import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { myApi } from './my';

export const myQuery = {
  getMyInfo: (id: number) => buildQuery(QK.my.getMyInfo(), () => myApi.getMyInfo(id)),
};
