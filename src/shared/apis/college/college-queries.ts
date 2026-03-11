import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { collegeApi } from '@apis/college/college';

export const collegeQuery = {
  collegeAndClubs: () => buildQuery(QK.collegeAndClubs.all(), () => collegeApi.collegesAndClubs()),
};
