import type { Rsp } from '@apis/constants/statuscode';
import type { ExcelStatusResponseDto } from '@apis/excel/excel';
import { EXCEL_PREVIEW_KEY, excelMutations } from '@apis/excel/excel-mutations';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';

type PreviewSnapshot = {
  status: 'idle' | 'pending' | 'success' | 'error';
  data?: Rsp<ExcelStatusResponseDto>;
  variables?: File;
};

/**
 * Excel 미리보기 생성 요청을 다루는 훅.
 *
 * 업로드 버튼을 누르면 upload(저장된 매핑으로 변환)를 시도하고, 매핑이 없으면
 * analyze(AI 분석)로 폴백하는 하나의 mutation 을 실행한다. 이 mutation 은 mutationKey 로
 * MutationCache 에 저장되므로, 요청 도중 페이지를 이탈해 컴포넌트가 언마운트돼도 요청은
 * 계속 진행되고, 다시 페이지로 돌아오면 `useMutationState` 로 최신 상태(진행 중/완료/실패)를
 * 그대로 복원한다. (전체 새로고침 시에는 인메모리 캐시가 사라져 복원되지 않는다.)
 */

export const useExcelPreview = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(excelMutations.preview());
  const { mutate: mutateAnalyze } = useMutation(excelMutations.reanalyze());

  const snapshots = useMutationState<PreviewSnapshot>({
    filters: { mutationKey: EXCEL_PREVIEW_KEY },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data as Rsp<ExcelStatusResponseDto> | undefined,
      variables: mutation.state.variables as File | undefined,
    }),
  });

  const latest = snapshots[snapshots.length - 1];

  const startPreview = (file: File) => {
    mutate(file);
  };

  // 다시 정리: upload 폴백 없이 곧바로 analyze(AI 분석)로 요청한다.
  const startAnalyze = (file: File) => {
    mutateAnalyze(file);
  };

  const resetPreview = () => {
    const cache = queryClient.getMutationCache();
    cache.findAll({ mutationKey: EXCEL_PREVIEW_KEY }).forEach((mutation) => {
      cache.remove(mutation);
    });
  };

  return {
    status: latest?.status ?? 'idle',
    preview: latest?.data?.data,
    fileName: latest?.variables?.name,
    previewedFile: latest?.variables,
    startPreview,
    startAnalyze,
    resetPreview,
  };
};
