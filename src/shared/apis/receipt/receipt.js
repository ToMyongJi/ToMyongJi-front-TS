import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
const http = new HttpClient(axiosInstance);
export const receiptApi = {
    list: (clubId, params) => http.get(ENDPOINTS.receipt.paging(clubId), { params }),
    club: (id) => http.get(ENDPOINTS.receipt.club(id)),
    create: (body) => http.post(ENDPOINTS.receipt.root, body),
    update: (body) => http.put(ENDPOINTS.receipt.root, body),
    delete: (receiptId) => http.delete(ENDPOINTS.receipt.specific(receiptId)),
    search: (keyword) => http.get(ENDPOINTS.receipt.keyword, { params: { keyword } }),
    uploadCsv: (userIndexId) => http.post(ENDPOINTS.csv.upload(userIndexId)),
    exportCsv: (body) => http.post(ENDPOINTS.csv.export, body, { responseType: 'blob' }),
    upLoadToss: (body) => {
        var _a;
        const formData = new FormData();
        formData.append('file', body.file);
        formData.append('userId', body.userId);
        formData.append('keyword', (_a = body.keyword) !== null && _a !== void 0 ? _a : '');
        return http.postForm(ENDPOINTS.parse.breakdown, formData);
    },
};
