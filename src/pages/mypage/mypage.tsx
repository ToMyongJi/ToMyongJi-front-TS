import { authMutations } from '@apis/auth/auth-mutations';
import { collegeQuery } from '@apis/college/college-queries';
import { myMutations } from '@apis/my/my-mutations';
import { myQuery } from '@apis/my/my-queries';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import MemberList from '@components/mypage/member-list';
import Role from '@constants/role';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'src/shared/store/auth-store';
import useUserStore from 'src/shared/store/user-store';

const roleLabel: Record<string, string> = {
  [Role.PRESIDENT]: '회장',
  [Role.STU]: '부원',
  [Role.ADMIN]: '관리자',
};

const Mypage = () => {
  const queryClient = useQueryClient();
  const { user, clearUser } = useUserStore();
  const { clearAuthData } = useAuthStore();
  const navigate = useNavigate();

  const [newStudentNum, setNewStudentNum] = useState('');
  const [newName, setNewName] = useState('');

  // 소속 이름 조회
  const { data: collegeData } = useQuery({
    ...collegeQuery.getAllClub(),
    enabled: !!user?.studentClubId,
  });

  // 내 정보 조회
  const { data: myInfo } = useQuery({
    ...myQuery.getMyInfo(user?.id ?? 0),
    enabled: !!user?.id,
  });

  // 학생회 이름 매핑
  const collegeName =
    collegeData?.data?.find((college) => college.studentClubId === user?.studentClubId)
      ?.studentClubName ?? '';

  // 소속 부원 조회
  const { data: memberData } = useQuery({
    ...collegeQuery.getClubMember(),
    enabled: !!user?.studentClubId,
  });

  const addMemberMutation = useMutation({
    ...myMutations.addMember(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college', 'getClubMember'] });
      setNewStudentNum('');
      setNewName('');
      alert('부원 추가에 성공했습니다.');
    },
    onError: () => {
      alert('부원 추가에 실패했습니다.');
    },
  });

  const deleteMemberMutation = useMutation({
    ...myMutations.deleteMember(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college', 'getClubMember'] });
      alert('부원 삭제에 성공했습니다.');
    },
    onError: () => {
      alert('부원 삭제에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    ...authMutations.delete(),
    onSuccess: () => {
      clearUser();
      clearAuthData();
      navigate('/login');
    },
    onError: () => {
      alert('회원탈퇴에 실패했습니다.');
    },
  });

  const handleAddMember = () => {
    if (!newStudentNum || !newName || !user?.id) return;
    try {
      addMemberMutation.mutate({
        id: user?.id,
        studentNum: newStudentNum,
        name: newName,
      });
    } catch {
      alert('부원 추가에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    deleteMutation.mutate();
  };

  const info = myInfo?.data;

  const members = memberData?.data?.map((member, index) => ({
    memberId: index + 1,
    studentNum: member.studentNum,
    name: member.name,
  }));
  const isPresident = user?.role === Role.PRESIDENT;

  return (
    <div className="mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center px-[1.5rem]">
      <div className="flex w-full max-w-[42rem] flex-col gap-[3.2rem]">
        {/* 내 정보 */}
        <div className="flex flex-col gap-[1.8rem]">
          <p className="W_Title text-black">내 정보</p>
          <div className="flex flex-col gap-[1.6rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]">
            {[
              { label: '이름', value: info?.name },
              { label: '학번', value: info?.studentNum },
              {
                label: '소속 이름',
                value: collegeName,
              },
              { label: '자격', value: user?.role ? roleLabel[user.role] : '' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-[1.6rem]">
                <p className="W_SB15 w-[6rem] shrink-0 text-gray-90">{label}</p>
                <TextField value={value ?? ''} disabled className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* 소속 관리 (학생회장만) */}
        {isPresident && (
          <div className="flex flex-col gap-[1.6rem]">
            <p className="W_Title text-black">소속 관리</p>
            <div className="flex flex-col gap-[2rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]">
              {/* 소속 이름 */}
              <div className="flex items-center gap-[1.6rem]">
                <p className="W_B17 text-black">{collegeName}</p>
              </div>

              {/* 부원 추가 */}
              <div className="flex items-center gap-[1.6rem]">
                <TextField
                  placeholder="학번"
                  value={newStudentNum}
                  onChange={(e) => setNewStudentNum(e.target.value)}
                  className="flex-1"
                />
                <TextField
                  placeholder="이름"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="regular"
                  className="W_SB15 w-[6.3rem] shrink-0"
                  disabled={!newStudentNum || !newName || addMemberMutation.isPending}
                  onClick={handleAddMember}
                >
                  추가
                </Button>
              </div>

              <MemberList
                members={members ?? []}
                onDelete={(member) => deleteMemberMutation.mutate(Number(member.studentNum))}
                buttonType="delete"
              />
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between">
          {isPresident ? (
            <Button
              variant="primary_outline"
              size="md"
              type="button"
              onClick={() => navigate('/club-transfer')}
            >
              학생회 이전
            </Button>
          ) : (
            <div />
          )}
          <button
            type="button"
            className="W_R14 text-error hover:underline"
            onClick={handleDeleteAccount}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
