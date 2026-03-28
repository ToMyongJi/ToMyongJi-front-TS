import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
const http = new HttpClient(axiosInstance);
export const myApi = {
    getMyInfo: (id) => http.get(ENDPOINTS.my.view(id)),
    addMember: (body) => http.post(ENDPOINTS.my.add, body),
    viewMember: (id) => http.get(ENDPOINTS.my.viewMember(id)),
    deleteMember: (deletedStudentNumb) => http.delete(ENDPOINTS.my.deleteMember(deletedStudentNumb)),
};
