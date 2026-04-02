import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';

export interface MemberItem {
  memberId: number;
  studentNum: string;
  name: string;
}

interface MemberListProps {
  members: MemberItem[];
  onDelete?: (member: MemberItem) => void;
  buttonType?: 'delete' | 'check';
  onCheck?: (member: MemberItem, checked: boolean) => void;
  selectedMemberIds?: number[];
  emptyText?: string;
}

const MemberList = ({
  members,
  onDelete,
  buttonType,
  onCheck,
  selectedMemberIds,
  emptyText,
}: MemberListProps) => {
  if (members.length === 0) {
    return (
      <p className="W_M15 flex h-[4.4rem] items-center justify-center text-center text-gray-70">
        {emptyText ?? '소속 부원이 없습니다.'}
      </p>
    );
  }

  return (
    <ul className="overflow-hidden">
      {members.map((member, index) => (
        <li
          key={member.memberId}
          className={[
            'mx-[1.6rem] flex h-[4.4rem] items-center justify-between border-gray-10 border-b',
          ].join(' ')}
        >
          <div className="flex w-full items-center gap-[1.9rem]">
            <div className="flex items-center gap-[1.9rem]">
              <span className="W_SB15 w-[1rem] text-black">{index + 1}</span>
              <span className="W_M15 text-gray-90">
                {member.studentNum} {member.name}
              </span>
            </div>
          </div>

          {buttonType === 'delete' && (
            <IconButton
              iconType="cancel"
              onClick={() => onDelete?.(member)}
              className="h-[3rem] w-[3rem]"
            />
          )}
          {buttonType === 'check' && (
            <CheckBox
              checked={
                selectedMemberIds?.some(
                  (selectedMemberId) => selectedMemberId === member.memberId,
                ) ?? false
              }
              onChange={(checked) => onCheck?.(member, checked)}
              aria-label={`${member.name} 체크`}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
