import { buildMutation } from '@apis/base/factory';
import { excelApi } from '@apis/excel/excel';
import axios from 'axios';

// 미리보기(upload 우선, 매핑 없으면 analyze 폴백) 요청의 진행/결과를
// 캐시에서 다시 찾기 위한 고정 키. 페이지를 이탈했다가 돌아와도 이 키로 복원한다.
export const EXCEL_PREVIEW_KEY = ['excel', 'preview'] as const;

export const excelMutations = {
  upload: () => buildMutation(excelApi.upload),
  analyze: () => buildMutation(excelApi.analyze),
  confirm: () => buildMutation(excelApi.confirm),

  // 업로드 버튼: 저장된 변환 매핑으로 바로 변환(upload)을 시도한다.
  // 아직 매핑이 없어 4xx 가 내려오면 analyze 로 폴백해 AI 분석 + 매핑 저장 + 미리보기를 만든다.
  // upload → analyze 를 하나의 mutation 프로미스로 묶어 두어, 도중에 페이지를 이탈해도
  // 끝까지 진행되고 다시 돌아오면 상태가 복원된다.
  preview: () =>
    buildMutation(
      async (file: File) => {
        try {
          const uploaded = await excelApi.upload({ file });
          // 저장된 매핑으로 변환했지만 미리보기가 비어 있으면(매핑이 유효하지 않음) → AI 분석으로 폴백
          if (!uploaded.data?.previewData?.length) {
            return await excelApi.analyze({ file });
          }
          return uploaded;
        } catch (error) {
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;
          // 아직 매핑이 저장되지 않은 경우(4xx) → AI 분석으로 폴백
          if (status !== undefined && status >= 400 && status < 500) {
            return excelApi.analyze({ file });
          }
          throw error;
        }
      },
      {
        mutationKey: EXCEL_PREVIEW_KEY,
        gcTime: 10 * 60 * 1000, // 완료 후 결과를 10분간 캐시에 보관
      },
    ),
};
