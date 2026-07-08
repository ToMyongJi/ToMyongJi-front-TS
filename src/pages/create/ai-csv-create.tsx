import { excelMutations } from '@apis/excel/excel-mutations';
import CancelIcon from '@assets/icons/cancel.svg?react';
import CheckIcon from '@assets/icons/check.svg?react';
import ErrorCircleIcon from '@assets/icons/error-circle.svg?react';
import FileIcon from '@assets/icons/file.svg?react';
import BasicCard from '@components/common/basic-card';
import Button from '@components/common/button';
import Spinner from '@components/common/spinner';
import TableHeader from '@components/table/table-header';
import { useModal } from '@hooks/use-modal';
import useUserStore from '@store/user-store';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExcelPreview } from './use-excel-preview';

const HEADER_DATA = [
  { labels: '날짜', width: '20%' },
  { labels: '내용', width: '40%' },
  { labels: '입금', width: '20%' },
  { labels: '출금', width: '20%' },
];

const AiCsvCreate = () => {
  const navigate = useNavigate();
  const { alert } = useModal();
  const { user } = useUserStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const { status, preview, fileName, previewedFile, startPreview, resetPreview } =
    useExcelPreview();
  const confirmMutation = useMutation(excelMutations.confirm());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }
    startPreview(file);
  };

  // 미리보기/실패 화면에서 같은 파일로 다시 시도한다.
  const handleReanalyze = () => {
    const target = previewedFile ?? file;
    resetPreview();
    if (target) {
      startPreview(target);
    }
  };

  const handleSave = () => {
    if (!preview?.requestId || user?.studentClubId == null) {
      return;
    }

    // 저장하기: 미리보기 응답의 requestId 로 확정(S3·DB 저장)한다.
    confirmMutation.mutate(
      { requestId: preview.requestId, studentClubId: user.studentClubId },
      {
        onSuccess: () => {
          resetPreview();
          void alert({
            title: '성공',
            description: '성공적으로 업로드 완료했습니다.',
          });
          navigate('/receipt-create');
        },
        onError: (e: unknown) => {
          void alert({
            title: '저장',
            description: e instanceof Error ? e.message : '저장에 실패했습니다.',
          });
        },
      },
    );
  };

  if (status === 'pending') {
    return (
      <div className="flex w-full flex-col-center gap-[7.2rem] pt-[4.2rem]">
        <div className="flex-col-center gap-[3rem] pt-[6rem]">
          <Spinner />
          <div className="flex-col-center gap-[0.4rem]">
            <p className="W_Title text-black">파일 정리 중</p>
            <p className="W_M15 text-center text-gray-70">
              날짜, 내용, 금액을 자동으로 인식하고 있습니다.
              <br />
              화면을 닫아도 업로드가 진행되며, 결과는 완료 후 10분간 보관됩니다.
            </p>
          </div>
          <div className="flex items-center gap-[0.5rem]">
            <FileIcon className="h-[1.7rem] w-[1.7rem] text-gray-70" />
            <p className="W_M15 text-black">{fileName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex w-full flex-col-center gap-[7.2rem] pt-[4.2rem]">
        <div className="flex-col-center gap-[3rem] pt-[6rem]">
          <ErrorCircleIcon className="h-[6.6rem] w-[6.6rem] text-error" />
          <div className="flex-col-center gap-[1rem]">
            <p className="W_Title text-black">파일 정리 실패</p>
            <p className="W_B17 text-center text-gray-80">
              날짜와 금액이 포함된 파일인지 확인 후 다시 업로드해 주시기 바랍니다.
            </p>
          </div>
          <div className="flex items-center gap-[0.5rem]">
            <FileIcon className="h-[1.7rem] w-[1.7rem] text-gray-70" />
            <p className="W_M15 text-black">{fileName}</p>
          </div>
        </div>
        <div className="flex justify-end gap-[0.8rem]">
          <Button
            variant="gray_outline"
            className="W_M15 px-[4rem] text-gray-90"
            size="md"
            onClick={resetPreview}
          >
            이전으로
          </Button>
          <Button
            variant="primary"
            className="W_M15 px-[3.4rem]"
            size="md"
            onClick={handleReanalyze}
          >
            다시 정리
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'success' && preview) {
    return (
      <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
        <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
          <div className="flex gap-[0.8rem]">
            <CheckIcon className="h-[2.4rem] w-[2.4rem]" />
            <p className="W_Title text-black">Excel 데이터 정리 미리보기</p>
          </div>
          <p className="W_B17 text-gray-80">미리보기 - 상위 {preview.previewData.length}건</p>
          <BasicCard className="flex-col gap-[1rem] px-[2.7rem] py-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HEADER_DATA} />
              <tbody>
                {preview.previewData.map((row, index) => (
                  <tr
                    key={`${row.date}-${index}`}
                    className={
                      index !== preview.previewData.length - 1 ? 'border-gray-20 border-b' : ''
                    }
                  >
                    <td className="W_M15 px-[0.3rem] py-[1rem] text-center text-gray-90">
                      {row.date}
                    </td>
                    <td className="W_M15 px-[0.3rem] py-[1rem] text-center text-gray-90">
                      {row.content}
                    </td>
                    <td className="W_M15 px-[0.3rem] py-[1rem] text-center text-[#3979F1]">
                      + {row.deposit.toLocaleString()}
                    </td>
                    <td className="W_M15 px-[0.3rem] py-[1rem] text-center text-error">
                      - {row.withdrawal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BasicCard>
          <div className="flex items-center gap-[0.5rem]">
            <FileIcon className="h-[1.7rem] w-[1.7rem] text-gray-70" />
            <p className="W_M15 text-black">{fileName}</p>
          </div>

          <div className="mt-[5.4rem] flex justify-end gap-[0.8rem]">
            <Button
              variant="gray_outline"
              className="w-[11rem]"
              size="md"
              onClick={handleReanalyze}
            >
              다시 정리
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-[11rem]"
              disabled={confirmMutation.isPending}
              onClick={handleSave}
            >
              {confirmMutation.isPending ? '저장 중' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-[1.5rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-black">Excel 데이터 추가</p>
        <BasicCard className="flex-col px-[2.6rem] py-[2rem]">
          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 gray-80">Excel 데이터 파일 형식 안내</p>
            <ol className="W_R14 ml-1 list-inside list-disc text-gray-90">
              <li>날짜, 내용, 금액 항목이 포함된 엑셀 파일을 업로드하세요.</li>
              <li>형식에 상관없이 AI가 자동으로 정리합니다.</li>
            </ol>
          </section>
        </BasicCard>

        {!file && (
          <BasicCard className="flex-col gap-[1rem] py-[2rem]">
            <p className="W_M15 text-center text-gray-70">
              엑셀 파일(.xlsx, .xls)만 첨부 가능합니다.
            </p>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex-col-center gap-[1rem]">
                <Button
                  variant="primary_outline"
                  size="md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  파일 선택
                </Button>
              </div>
            </div>
          </BasicCard>
        )}
        {file && (
          <BasicCard className="flex items-center justify-between px-[2.6rem] py-[2rem]">
            <div className="flex items-center gap-[0.5rem]">
              <FileIcon className="text-gray-70" />
              <p className="W_M15">{file.name}</p>
            </div>
            <CancelIcon className="cursor-pointer text-error" onClick={() => setFile(null)} />
          </BasicCard>
        )}
        <div className="mt-[5.4rem] flex justify-end gap-[0.8rem]">
          <Button
            variant="gray_outline"
            className="px-[4rem]"
            size="md"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            variant="primary"
            className="px-[3.4rem]"
            size="md"
            disabled={!file}
            onClick={handleUpload}
          >
            업로드
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiCsvCreate;
