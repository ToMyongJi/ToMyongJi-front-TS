import type { MemberItem } from '@components/mypage/member-list';
import { TransferStep1 } from '@components/mypage/transfer-step1';
import { TransferStep2 } from '@components/mypage/transfer-step2';
import { TransferStep3 } from '@components/mypage/transfer-step3';
import { TransferStep4 } from '@components/mypage/transfer-step4';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ClubTransfer = () => {
  const navigate = useNavigate();

  const [checkedMembers, setCheckedMembers] = useState<MemberItem[]>([]);
  const [presidentName, setPresidentName] = useState('');
  const [presidentStudentNumber, setPresidentStudentNumber] = useState('');
  const [step, setStep] = useState(1);

  const handleCancel = () => {
    if (step === 1) {
      navigate('/mypage');
    }
    if (step === 2) {
      setStep((prev) => prev - 1);
    }
    if (step === 3) {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep((prev) => prev + 1);
    }
    if (step === 2) {
      setStep((prev) => prev + 1);
      console.log('체크된 멤버 이름:', checkedMembers);
    }
    if (step === 3) {
      setStep((prev) => prev + 1);
      console.log('회장 이름:', presidentName);
      console.log('회장 학번:', presidentStudentNumber);
    }
  };

  const isNextDisabled = presidentName.trim() === '' || presidentStudentNumber.trim() === '';

  const handleCheck = (member: MemberItem, checked: boolean) => {
    if (checked) {
      setCheckedMembers((prev) => [...prev, member]);
    } else {
      setCheckedMembers((prev) => prev.filter((m) => m.memberId !== member.memberId));
    }
  };

  return (
    <div className="mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center px-[1.5rem]">
      <div className="mb-[1.8rem] flex w-full max-w-[49rem] flex-col">
        <p className="W_Title text-black">학생회 이전</p>
      </div>
      {step === 1 && <TransferStep1 onCancel={handleCancel} onTransfer={handleNext} />}
      {step === 2 && (
        <TransferStep2
          onPreviousStep={handleCancel}
          nextStep={handleNext}
          members={[
            { memberId: 1, studentNum: '20200000', name: '홍길동' },
            { memberId: 2, studentNum: '20200001', name: '이순신' },
            { memberId: 3, studentNum: '20200002', name: '유관순' },
          ]}
          onCheck={handleCheck}
          selectedMemberIds={checkedMembers.map((member) => member.memberId)}
        />
      )}
      {step === 3 && (
        <TransferStep3
          onPreviousStep={handleCancel}
          onNextStep={handleNext}
          presidentName={presidentName}
          presidentStudentNumber={presidentStudentNumber}
          onChangePresidentName={(value) => setPresidentName(value)}
          onChangePresidentStudentNumber={(value) => setPresidentStudentNumber(value)}
          isNextDisabled={isNextDisabled}
        />
      )}
      {step === 4 && <TransferStep4 />}
    </div>
  );
};
