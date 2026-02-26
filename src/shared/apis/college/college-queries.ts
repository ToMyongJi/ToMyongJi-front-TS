import { QK } from '@apis/base/key';
import { collegeApi } from '@apis/college/college';
import { buildQuery } from '@apis/base/factory';

export const collegeQuery = {
  collegeAndClubs: () => buildQuery(QK.collegeAndClubs.all(), () => collegeApi.collegesAndClubs())
}