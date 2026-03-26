import Button from '@components/common/button';

interface TransferStep1Props {
  onCancel: () => void;
  onTransfer: () => void;
}

export const TransferStep1 = ({ onCancel, onTransfer }: TransferStep1Props) => {
  return (
    <div className="w-full max-w-[49rem]">
      <div className="flex flex-col gap-[7.2rem]">
        <div className="flex flex-col gap-[0.8rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]">
          <p className="W_B17 text-black">학생회 이전 시 주의사항</p>
          <p className="W_M15 text-gray-90">
            차기 회장이 확정되지 않은 경우에는 학번과 이름을 비워 두셔도 됩니다. <br />
            학생회를 이전하면 회장 포함 기존 부원들의 회원 정보는 모두 초기화되며, <br />
            기존에 업로드된 학생회비 영수증 내역은 이월되어 하나의 통합 영수증으로 압축 표시됩니다.
          </p>
        </div>
        <div className="flex w-full justify-end gap-[0.8rem]">
          <Button
            variant="primary_outline"
            size="regular"
            type="button"
            className="w-[11rem]"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="regular"
            type="button"
            className="w-[11rem]"
            onClick={onTransfer}
          >
            이전하기
          </Button>
        </div>
      </div>
    </div>
  );
};
