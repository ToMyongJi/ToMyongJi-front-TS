import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/statuscode';

const http = new HttpClient(axiosInstance);

export type ExcelPreviewRow = {
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
};

export type ExcelStatusResponseDto = {
  requestId: string;
  status: string;
  previewData: ExcelPreviewRow[];
  message: string;
  skippedRows: number;
  totalRows: number;
  dateFormatDetected: string;
};

export type UploadExcelRequest = {
  file: File;
};

export type AnalyzeExcelRequest = {
  file: File;
};

export type ConfirmExcelRequest = {
  requestId: string;
  studentClubId: number;
};

export const excelApi = {
  upload: (body: UploadExcelRequest) => {
    const formData = new FormData();
    formData.append('file', body.file);
    return http.postForm<Rsp<ExcelStatusResponseDto>>(ENDPOINTS.excel.upload, formData);
  },

  analyze: (body: AnalyzeExcelRequest) => {
    const formData = new FormData();
    formData.append('file', body.file);
    return http.postForm<Rsp<ExcelStatusResponseDto>>(ENDPOINTS.excel.analyze, formData);
  },

  confirm: (body: ConfirmExcelRequest) =>
    http.post<Rsp<number>, ConfirmExcelRequest>(ENDPOINTS.excel.confirm, body),
};
