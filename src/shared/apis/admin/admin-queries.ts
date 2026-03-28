import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { adminApi } from './admin';

export const adminQueries = {
  getPresident: (clubId: number) =>
    buildQuery(QK.admin.president(clubId), () => adminApi.getPresident(clubId)),
  getMember: (clubId: number) =>
    buildQuery(QK.admin.member(clubId), () => adminApi.getMember(clubId)),
};
