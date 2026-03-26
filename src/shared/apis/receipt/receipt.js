import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
const http = new HttpClient(axiosInstance);
export const receiptApi = {
    list: (clubId, params) => http.get(ENDPOINTS.receipt.paging(clubId), { params })
};
