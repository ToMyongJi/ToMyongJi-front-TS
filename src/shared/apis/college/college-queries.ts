import { buildQuery } from '@apis/base/factory';
import { QK } from '@apis/base/key';
import { collegeApi } from '@apis/college/college';

export const collegeQuery = {
  collegeAndClubs: () => buildQuery(QK.collegeAndClubs.all(), () => collegeApi.collegesAndClubs()),
  getAllClub: () => buildQuery(QK.college.getAllClub(), () => collegeApi.getAllClub()),
  getCollegeByClub: (collegeId: number) =>
    buildQuery(QK.college.getCollegeByClub(collegeId), () =>
      collegeApi.getCollegeByClub(collegeId),
    ),
};
