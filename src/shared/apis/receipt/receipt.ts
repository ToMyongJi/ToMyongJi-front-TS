import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type {Rsp} from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type PaginationList<T> = {
  receiptDtoList: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean
};

export type Receipt = {
  receiptId: number;
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
}

export const receiptApi = {
  list: (clubId?: number, params?: {page?: number; size? : number; year?:number; month?: number}) =>
    http.get<Rsp<PaginationList<Receipt>>>(ENDPOINTS.receipt.paging(clubId), {params})
}