import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { receiptMutations } from '@apis/receipt/receipt-mutations';

import BasicCard from '@components/common/basic-card';
import Button from '@components/common/button';

import FileIcon from "@assets/icons/file.svg?react";
import CancelIcon from "@assets/icons/cancel.svg?react";

import useUserStore from '@store/user-store';

const CsvCreate = () => {
  const { user } = useUserStore();

  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadCsv = useMutation(receiptMutations.uploadCsv());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!user || user.userId == null) {
      return;
    }

    if(file){
      uploadCsv.mutate({userIndexId: user.id, file}, {
        onSuccess: () => {
          void alert({
            title: '성공',
            description: '성공적으로 업로드 완료했습니다.',
          });
          navigate('/receipt-create')
        },
        onError: (e: any) => {
          alert(e?.message);
        }
      })
    }
  }

  return (
    <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-black">Excel 데이터 추가</p>
        <BasicCard className="flex-col gap-[3rem] px-[2.6rem] py-[2rem]">
          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 text-black">거래내역서 인증 마크 안내</p>
            <p className="W_M15 text-error"> 엑셀 파일을 다음과 같은 CSV 형식으로 변환해주세요:</p>
            <div className="W_R14 w-fit rounded-[0.8rem] bg-background px-[1.4rem] py-[0.8rem]">
              date, content, deposit, withdrawal
              <br />
              2024-11-01, 회비, 50000, 0
              <br />
              2024-11-06, 간식비, 0, 30000
            </div>
          </section>

          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 text-black">
              엑셀 파일을 CSV로 변환하는 방법
            </p>
            <ol className="W_R15 flex-col gap-[0.3rem] text-gray-90">
              <li>1. 엑셀 파일을 엽니다.</li>
              <li>2. 상단 메뉴에서 [파일] → [다른 이름으로 저장]을 선택합니다.</li>
              <li>3. 파일 형식을 "CSV (쉼표로 분리) (*.csv)"로 선택합니다.</li>
              <li>4. 파일명을 입력하고 [저장]을 클릭합니다.</li>
              <li>5. 저장된 파일을 우클릭한 후 메모장으로 실행합니다.</li>
              <li>6. 메모장에서 편집 → 상단의 파일탭을 클릭 → 다른 이름으로 저장 → 하단의 인코딩 형식을 UTF-8로 변경후 저장합니다.</li>
            </ol>
          </section>

          <section className="flex-col gap-[0.8rem]">
            <p className="W_B17 text-black">
              주의사항
            </p>
            <ol className="W_R15 list-inside list-disc flex-col gap-[0.3rem] text-gray-90">
              <li>위의 형식과 반드시 동일해야 합니다.</li>
              <li>날짜와 내용이 같은 줄은 영수증으로 인식되지 않습니다.</li>
              <li>컬럼 명은 date, content, deposit, withdrawal 이어야 합니다.</li>
              <li>날짜는 YYYY-MM-DD 형식으로 입력해주세요.</li>
              <li>내용은 최대 10자까지 입력해주세요.</li>
              <li>입금과 출금은 숫자만 입력해주세요.(예: 50000 (O), 50,000 (X))</li>
              <li>입금이나 출금이 없는 경우 0으로 입력해주세요.</li>
            </ol>
          </section>
        </BasicCard>

        {!file && <BasicCard className="flex-col gap-[1rem] py-[2rem]">
          <p className="W_M15 text-center text-gray-70">CSV 파일만 첨부 가능합니다.</p>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex-col-center gap-[1rem]">
              <Button variant="primary_outline" size="md" onClick={() => fileInputRef.current?.click()}>
                파일 선택
              </Button>
            </div>
          </div>
        </BasicCard>}
        {file && <BasicCard className="flex items-center justify-between px-[2.6rem] py-[2rem]">
          <div className="flex items-center gap-[0.5rem]">
            <FileIcon className="text-gray-70" />
            <p className="W_M15">{file.name}</p>
          </div>
          <CancelIcon className="cursor-pointer text-error" onClick={() => setFile(null)}/>
        </BasicCard>}
        <div className="mt-[5.4rem] flex justify-end gap-[0.8rem]">
          <Button variant="gray_outline" className="px-[4rem]" size="md" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button variant="primary" className="px-[3.4rem]" size="md" disabled={!file || uploadCsv.isPending} onClick={handleUpload}>
            {uploadCsv.isPending ? "업로드 중" : "업로드"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CsvCreate;