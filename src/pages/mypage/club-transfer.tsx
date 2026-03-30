import { collegeApi } from '@apis/college/college';
import { collegeQuery } from '@apis/college/college-queries';
import type { MemberItem } from '@components/mypage/member-list';
import { TransferStep1 } from '@components/mypage/transfer-step1';
import { TransferStep2 } from '@components/mypage/transfer-step2';
import { TransferStep3 } from '@components/mypage/transfer-step3';
import { TransferStep4 } from '@components/mypage/transfer-step4';
import useAuthStore from '@store/auth-store';
import useUserStore from '@store/user-store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ClubTransfer = () => {
  const navigate = useNavigate();
  const { clearAuthData } = useAuthStore();
  const { user, clearUser } = useUserStore();

  const [checkedMembers, setCheckedMembers] = useState<MemberItem[]>([]);
  const [checkedStudentNumbers, setCheckedStudentNumbers] = useState<string[]>([]);
  const [presidentName, setPresidentName] = useState('');
  const [presidentStudentNumber, setPresidentStudentNumber] = useState('');
  const [step, setStep] = useState(1);

  const { data: clubMember } = useQuery(collegeQuery.getClubMember());

  const members = clubMember?.data?.map((member, index) => ({
    memberId: index + 1,
    studentNum: member.studentNum,
    name: member.name,
  }));

  const mutateTransfer = useMutation({
    mutationFn: collegeApi.transferAndUser,
    onSuccess: (data) => {
      console.log(data);
      setStep((prev) => prev + 1);
    },
    onError: (error) => {
      console.log(error);
      alert('학생회 이전에 실패했어요.');
    },
  });

  useEffect(() => {
    if (step !== 4) return;
    const timer = window.setTimeout(() => {
      clearAuthData();
      clearUser();
      navigate('/login', { replace: true });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [step, clearAuthData, clearUser, navigate]);

  const handleCancel = () => {
    if (step === 1) {
      navigate('/mypage');
    }
    if (step === 2) {
      setStep((prev) => prev - 1);
      setCheckedMembers([]);
      setCheckedStudentNumbers([]);
    }
    if (step === 3) {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep((prev) => prev + 1);
      console.log('members', clubMember);
    }
    if (step === 2) {
      setCheckedStudentNumbers(checkedMembers.map((member) => member.studentNum));
      setStep((prev) => prev + 1);
      console.log('체크된 멤버 학번:', checkedStudentNumbers);
    }
    if (step === 3) {
      console.log('회장 이름:', presidentName);
      console.log('회장 학번:', presidentStudentNumber);
      if (user?.studentClubId) {
        mutateTransfer.mutate({
          presidentInfo: {
            clubId: user?.studentClubId,
            studentNum: presidentStudentNumber,
            name: presidentName,
          },
          remainingMemberIds: checkedStudentNumbers,
        });
      }
      if (!user?.studentClubId) {
        alert('소속 학생회를 찾을 수 없어요.');
        return;
      }
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
        {step !== 4 && <p className="W_Title text-black">학생회 이전</p>}
      </div>
      {step === 1 && <TransferStep1 onCancel={handleCancel} onTransfer={handleNext} />}
      {step === 2 && (
        <TransferStep2
          onPreviousStep={handleCancel}
          nextStep={handleNext}
          members={members ?? []}
          // members={mockMembers}
          onCheck={handleCheck}
          selectedMemberIds={checkedMembers.map((member) => member.memberId)}
          emptyText="데이터가 존재하지 않습니다."
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
