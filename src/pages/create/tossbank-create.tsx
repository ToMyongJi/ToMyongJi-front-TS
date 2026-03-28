import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { receiptMutations } from '@apis/receipt/receipt-mutations';

import BasicCard from '@components/common/basic-card';
import Button from '@components/common/button';

import TossBankImage from "@assets/icons/toss-bank.png";
import FileIcon from "@assets/icons/file.svg?react";
import CancelIcon from "@assets/icons/cancel.svg?react";

import useUserStore from '@store/user-store';

const TossbankCreate = () => {
  const [file, setFile] = useState<File | null>(null);
  const [keyword, setKeyword] = useState<string>(" ");

  const { user } = useUserStore();
  const uploadTossBank = useMutation(receiptMutations.uploadToss());
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (user?.userId == null) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    if(file) {
      uploadTossBank.mutate({file, userId: user.userId, keyword}, {
        onSuccess: () => {
          alert("성공적으로 업로드가 되었습니다.");
          navigate('/receipt-create')
        },
        onError: (e) => {
          alert(e.message);
        }
      })
    } else{
      alert("파일을 선택해주세요")
    }
  }

  return (
    <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-black">토스뱅크 거래내역서 인증</p>
          <BasicCard className="flex-col gap-[3rem] px-[2.6rem] py-[2rem]">
            <section className="flex-col gap-[0.8rem]">
              <div className="flex items-center gap-[1rem]">
                <p className="W_B17 text-black">거래내역서 인증 마크 안내</p>
                <div
                  className="flex w-fit items-center gap-[0.6rem] rounded-[3rem] bg-background px-[1.4rem] py-[0.4rem]">
                  <img src={TossBankImage} className="w-[8.5rem]" alt="토스뱅크 인증 마크" />
                  <p className="W_R12 text-gray-90">인증</p>
                </div>
              </div>
              <div className="flex-col gap-[0.4rem]">
                <p className="W_R15 text-gray-90">전체 입출금 내역의 30% 이상이 토스뱅크 거래내역서로 인증되면</p>
                <p className="W_R15 text-gray-90"> 해당 학생회의 영수증 페이지 조회 시 거래내역서 인증 마크가 추가됩니다.</p>
              </div>

            </section>
            <section className="flex-col gap-[0.8rem]">
              <p className="W_B17 text-black">
                토스뱅크에서 거래내역서를 발급받는 방법
              </p>
              <ol className="W_R15 flex-col gap-[0.3rem] text-gray-90">
                <li>1. 통장 탭 → 통장관리를 선택합니다.</li>
                <li>2. 문서관리 카테고리에서 거래내역서를 선택합니다.</li>
                <li>3. 발급방법을 'PDF로 저장하기'로 선택합니다.</li>
                <li>4. 언어 한글 선택 → 거래내역을 확인할 계좌를 선택합니다.</li>
                <li>
                  5. 거래내역 기간 선택 → '입출금 전체' 선택 후 발급을 완료합니다.
                </li>
              </ol>
            </section>
          </BasicCard>
        {!file && <BasicCard className="flex-row-center py-[2rem]">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex-col-center gap-[1rem]">
            <Button variant="primary_outline" size="md" onClick={handleClick}>
              파일 선택
            </Button>
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
          <Button variant="primary" className="px-[3.4rem]" size="md" disabled={!file || uploadTossBank.isPending} onClick={handleUpload}>
            {uploadTossBank.isPending ? "업로드 중" : "업로드"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TossbankCreate;