import Button from '@components/common/button';
import MemberList, { type MemberItem } from './member-list';

interface TransferStep2Props {
  onPreviousStep: () => void;
  nextStep: () => void;
  members: MemberItem[];
  onCheck: (member: MemberItem, checked: boolean) => void;
  selectedMemberIds: number[];
  emptyText: string;
}

export const TransferStep2 = ({
  onPreviousStep,
  nextStep,
  members,
  onCheck,
  selectedMemberIds,
  emptyText,
}: TransferStep2Props) => {
  return (
    <div className="w-full max-w-[49rem]">
      <div className="mb-[1.8rem] flex flex-col gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
        <p className="W_B17 text-black">잔류 인원 선택</p>
        <MemberList
          members={members ?? []}
          buttonType="check"
          onCheck={onCheck}
          selectedMemberIds={selectedMemberIds}
          emptyText={emptyText}
        />
      </div>
      <div className="flex w-full justify-end gap-[0.8rem]">
        <Button
          variant="gray_outline"
          size="regular"
          type="button"
          className="w-[11rem]"
          onClick={onPreviousStep}
        >
          뒤로
        </Button>
        <Button
          variant="primary"
          size="regular"
          type="button"
          className="w-[11rem]"
          onClick={nextStep}
        >
          다음
        </Button>
      </div>
    </div>
  );
};
