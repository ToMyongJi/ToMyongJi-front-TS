import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type {Rsp} from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type PaginationList<T> = {
  data: T[];
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

export type ClubReceipt = {
  receiptList: Receipt[];
  balance: number;
}

export type CreateReceiptRequest = {
  userId: string;
  date?: string;
  content?: string;
  deposit?: number;
  withdrawal?: number;
};

export type UpdateReceiptRequest = {
  receiptId: number;
  date?: string;
  content?: string;
  deposit?: number;
  withdrawal?: number;
};


export const receiptApi = {
  list: (clubId?: number, params?: {page?: number; size? : number; year?:number; month?: number}) =>
    http.get<Rsp<PaginationList<Receipt>>>(ENDPOINTS.receipt.paging(clubId), {params}),
  club: (id?: number) =>
    http.get<Rsp<ClubReceipt>>(ENDPOINTS.receipt.club(id)),
  create: (body: CreateReceiptRequest) =>
    http.post<Rsp<Receipt>, CreateReceiptRequest>(ENDPOINTS.receipt.root, body),
  update: (body: UpdateReceiptRequest) =>
    http.put<Rsp<Receipt>, UpdateReceiptRequest>(ENDPOINTS.receipt.root, body),
  delete: (receiptId: number) =>
    http.delete<Rsp<null>>(ENDPOINTS.receipt.specific(receiptId))
}