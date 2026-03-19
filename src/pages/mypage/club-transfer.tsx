import { TransferStep1 } from '@components/mypage/transfer-step1';
import { TransferStep2 } from '@components/mypage/transfer-step2';
import { TransferStep3 } from '@components/mypage/transfer-step3';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ClubTransfer = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const handleCancel = () => {
    navigate('/mypage');
  };

  const handleTransfer = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div className="mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center px-[1.5rem]">
      <div className="mb-[1.8rem] flex w-full max-w-[49rem] flex-col gap-[7.2rem]">
        <p className="W_Title text-black">학생회 이전</p>
      </div>
      {step === 1 && <TransferStep1 onCancel={handleCancel} onTransfer={handleTransfer} />}
      {step === 2 && <TransferStep2 />}
      {step === 3 && <TransferStep3 />}
    </div>
  );
};
