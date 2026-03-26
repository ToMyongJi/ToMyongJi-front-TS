import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
const http = new HttpClient(axiosInstance);
export const authApi = {
    login: (body) => http.post(ENDPOINTS.auth.login, body),
    signup: (body) => http.post(ENDPOINTS.auth.signup, body),
    idCheck: (userId) => http.get(ENDPOINTS.auth.check(userId)),
    sendEmail: (body) => http.post(ENDPOINTS.auth.email, body),
    emailCheck: (body) => http.post(ENDPOINTS.auth.emailCheck, body),
    delete: () => http.delete(ENDPOINTS.auth.delete),
    clubVerify: (body) => http.post(ENDPOINTS.auth.verify, body),
    findId: (body) => http.post(ENDPOINTS.auth.findId, body),
};
