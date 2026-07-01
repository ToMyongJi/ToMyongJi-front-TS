import CancelIcon from '@assets/icons/cancel.svg?react';
import CheckIcon from '@assets/icons/check.svg';
import ErrorCircleIcon from '@assets/icons/error-circle.svg?react';
import FileIcon from '@assets/icons/file.svg?react';
import loading from '@assets/icons/loading.svg';
import BasicCard from '@components/common/basic-card';
import Button from '@components/common/button';
import TableHeader from '@components/table/table-header';
import { useModal } from '@hooks/use-modal';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Step = 'upload' | 'loading' | 'preview' | 'error';

type ParsedReceipt = {
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
  isValid: boolean;
};

const HEADER_DATA = [
  { labels: '날짜', width: '20%' },
  { labels: '내용', width: '40%' },
  { labels: '입금', width: '20%' },
  { labels: '출금', width: '20%' },
];

// TODO: API 연동 시 목데이터/타이머 제거하고 실제 파싱 결과로 대체
const MOCK_PARSED_ROWS: ParsedReceipt[] = [
  { date: '2026-03-02', content: '학생회비 입금', deposit: 50000, withdrawal: 0, isValid: true },
  { date: '2026-03-05', content: '간식 구매', deposit: 0, withdrawal: 12000, isValid: true },
  {
    date: '03-08',
    content: '엠티 물품 구매가 너무 많음',
    deposit: 0,
    withdrawal: 35000,
    isValid: false,
  },
  { date: '2026-03-10', content: '회식비', deposit: 0, withdrawal: 80000, isValid: true },
];

// 파일명에 "fail"이 포함되면 실패 화면을, 그 외에는 성공 화면을 보여준다 (데모용)
const mockParseExcel = (file: File): Promise<{ success: boolean; rows: ParsedReceipt[] }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const isFailure = file.name.toLowerCase().includes('fail');
      resolve({ success: !isFailure, rows: MOCK_PARSED_ROWS });
    }, 1200);
  });

const AiCsvCreate = () => {
  const navigate = useNavigate();
  const { alert } = useModal();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>('upload');
  const [parsedRows, setParsedRows] = useState<ParsedReceipt[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const resetToUpload = () => {
    setFile(null);
    setParsedRows([]);
    setStep('upload');
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setStep('loading');
    const result = await mockParseExcel(file);

    if (result.success) {
      setParsedRows(result.rows);
      setStep('preview');
    } else {
      setStep('error');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      void alert({
        title: '성공',
        description: '성공적으로 업로드 완료했습니다.',
      });
      navigate('/receipt-create');
    }, 600);
  };

  if (step === 'loading') {
    return (
      <div className="h-full w-full flex-col-center gap-[3rem] pt-[10rem]">
        <img src={loading} alt="loading" className="h-[16.3rem] w-[12.8rem]" />
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
          <p className="W_M15 text-black">{file?.name}</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
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
            <p className="W_M15 text-black">{file?.name}</p>
          </div>
        </div>
        <div className="flex justify-end gap-[0.8rem]">
          <Button
            variant="gray_outline"
            className="W_M15 px-[4rem] text-gray-90"
            size="md"
            onClick={resetToUpload}
          >
            이전으로
          </Button>
          <Button variant="primary" className="W_M15 px-[3.4rem]" size="md" onClick={resetToUpload}>
            다시 정리
          </Button>
        </div>
        v
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
        <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
          <CheckIcon />
          <p className="W_Title text-black">Excel 데이터 정리 미리보기</p>
          <BasicCard className="flex-col gap-[1rem] px-[2.7rem] py-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HEADER_DATA} />
              <tbody>
                {parsedRows.map((row, index) => (
                  <tr
                    key={`${row.date}-${index}`}
                    className={index !== parsedRows.length - 1 ? 'border-gray-20 border-b' : ''}
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
            <p className="W_M15 text-black">{file?.name}</p>
          </div>

          <div className="mt-[5.4rem] flex justify-end gap-[0.8rem]">
            <Button variant="gray_outline" className="w-[11rem]" size="md" onClick={resetToUpload}>
              다시 정리
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-[11rem]"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? '저장 중' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-black">Excel 데이터 추가</p>
        <BasicCard className="flex-col gap-[3rem] px-[2.6rem] py-[2rem]">
          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 gray-80">Excel 데이터 파일 형식 안내</p>
            <li className="W_R15 ml-1 list-inside list-disc text-gray-90">
              날짜, 내용, 금액 항목이 포함된 엑셀 파일을 업로드하세요.
            </li>
          </section>

          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 text-black">주의사항</p>
            <ol className="W_R15 list-inside list-disc flex-col gap-[0.3rem] text-gray-90">
              <li>.xlsx, .xls 형식의 파일만 업로드 가능합니다.</li>
              <li>날짜와 내용이 같은 줄은 영수증으로 인식되지 않습니다.</li>
              <li>AI가 날짜, 내용, 입금, 출금 항목을 자동으로 인식합니다.</li>
              <li>인식이 잘못된 항목은 미리보기 화면에서 확인 후 저장할 수 있습니다.</li>
            </ol>
          </section>
        </BasicCard>

        {!file && (
          <BasicCard className="flex-col gap-[1rem] py-[2rem]">
            <p className="W_M15 text-center text-gray-70">
              엑셀 파일(.xlsx, .xls)만 첨부 가능합니다.
            </p>
            <p className="W_R12 text-center text-gray-40">
              (데모) 파일명에 "fail"을 포함하면 실패 화면을 확인할 수 있습니다.
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
