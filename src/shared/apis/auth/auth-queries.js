import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { authApi } from './auth';
export const authQueries = {
    idCheck: (userId) => buildQuery(QK.auth.checkUser(userId), () => authApi.idCheck(userId)),
};
