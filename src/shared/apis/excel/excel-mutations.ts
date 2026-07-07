import { buildMutation } from '@apis/base/factory';
import { excelApi } from '@apis/excel/excel';

// 페이지를 이탈했다가 돌아와도 진행 중/완료된 분석 결과를 캐시에서 다시 찾기 위한 고정 키
export const EXCEL_ANALYZE_KEY = ['excel', 'analyze'] as const;

export const excelMutations = {
  upload: () => buildMutation(excelApi.upload),
  analyze: () =>
    buildMutation(excelApi.analyze, {
      mutationKey: EXCEL_ANALYZE_KEY,
      gcTime: 10 * 60 * 1000, // 분석 완료 후 결과를 10분간 캐시에 보관
    }),
  confirm: () => buildMutation(excelApi.confirm),
};
