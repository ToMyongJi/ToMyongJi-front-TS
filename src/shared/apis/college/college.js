import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
const http = new HttpClient(axiosInstance);
export const collegeApi = {
    collegesAndClubs: () => http.get(ENDPOINTS.college.all),
    getAllClub: () => http.get(ENDPOINTS.club.root),
    getCollegeByClub: (collegeId) => http.get(ENDPOINTS.club.college(collegeId)),
    transferCollege: () => http.post(ENDPOINTS.club.transfer),
};
