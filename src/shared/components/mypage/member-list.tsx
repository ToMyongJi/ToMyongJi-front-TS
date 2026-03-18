import IconButton from '@components/common/icon-button';

interface MemberItem {
  memberId: number;
  studentNum: string;
  name: string;
}

interface MemberListProps {
  members: MemberItem[];
  onDelete: (member: MemberItem) => void;
  isDeleting?: boolean;
}

const MemberList = ({ members, onDelete }: MemberListProps) => {
  if (members.length === 0) {
    return <p className="W_R14 text-center text-gray-70">소속 부원이 없습니다.</p>;
  }

  return (
    <ul className="overflow-hidden">
      {members.map((member, index) => (
        <li
          key={member.memberId}
          className={[
            'mx-[1.6rem] flex h-[4.4rem] items-center justify-between border-gray-10 border-b',
            // index !== members.length - 1 ? 'border-gray-10 border-b' : '',
          ].join(' ')}
        >
          <div className="flex items-center gap-[1.6rem]">
            <span className="W_SB15 w-[1rem] text-black">{index + 1}</span>
            <span className="W_M15 text-gray-90">
              {member.studentNum} {member.name}
            </span>
          </div>

          <IconButton
            iconType="cancel"
            onClick={() => onDelete(member)}
            aria-label={`${member.name} 삭제`}
            className="h-[3rem] w-[3rem]"
          />
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
