import Button from '@components/common/button';
import TextField from '@components/common/textfield';

interface TransferStep3Props {
  onPreviousStep: () => void;
  onNextStep: () => void;
  presidentName: string;
  presidentStudentNumber: string;
  onChangePresidentName: (value: string) => void;
  onChangePresidentStudentNumber: (value: string) => void;
}

export const TransferStep3 = ({
  onPreviousStep,
  onNextStep,
  presidentName,
  presidentStudentNumber,
  onChangePresidentName,
  onChangePresidentStudentNumber,
}: TransferStep3Props) => {
  return (
    <div className="w-full max-w-[49rem]">
      <div className="mb-[1.8rem] flex flex-col gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
        <p className="W_B17 text-black">새 회장 설정</p>
        <div className="flex gap-[1.6rem]">
          <TextField
            type="default"
            placeholder="학번"
            value={presidentStudentNumber}
            onChange={(e) => onChangePresidentStudentNumber(e.target.value)}
          />
          <TextField
            type="default"
            placeholder="이름"
            value={presidentName}
            onChange={(e) => onChangePresidentName(e.target.value)}
          />
        </div>
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
          onClick={onNextStep}
        >
          다음
        </Button>
      </div>
    </div>
  );
};
