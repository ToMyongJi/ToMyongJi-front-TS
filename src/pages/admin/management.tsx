import { adminMutations } from '@apis/admin/admin-mutations';
import { adminQueries } from '@apis/admin/admin-queries';
import { collegeQuery } from '@apis/college/college-queries';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import MemberList, { type MemberItem } from '@components/mypage/member-list';
import { useModal } from '@hooks/use-modal';
import { useSidebarStore } from '@store/sidebar-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Management = () => {
  const queryClient = useQueryClient();
  const { clubId: clubIdParam } = useParams<{ clubId: string }>();
  const setSelectedClub = useSidebarStore((s) => s.setSelectedClub);
  const [newPresidentStudentNum, setNewPresidentStudentNum] = useState('');
  const [newPresidentName, setNewPresidentName] = useState('');
  const [newMemberStudentNum, setNewMemberStudentNum] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  const { alert, confirm } = useModal();

  const parsedClubId = useMemo(() => {
    if (!clubIdParam) return null;
    const id = Number(clubIdParam);
    return Number.isFinite(id) ? id : null;
  }, [clubIdParam]);

  const { data, isLoading } = useQuery(collegeQuery.collegeAndClubs());

  const club = useMemo(() => {
    if (parsedClubId === null) return null;
    const flat = data?.data?.flatMap((c) => c.clubs ?? []) ?? [];
    return flat.find((c) => c.studentClubId === parsedClubId) ?? null;
  }, [parsedClubId, data]);

  useEffect(() => {
    if (!club) return;
    setSelectedClub({
      studentClubId: club.studentClubId,
      studentClubName: club.studentClubName,
      verification: club.verification,
    });
  }, [club, setSelectedClub]);

  const presidentQuery = useQuery({
    ...adminQueries.getPresident(parsedClubId ?? 0),
    enabled: parsedClubId !== null && !!club,
  });

  const membersQuery = useQuery({
    ...adminQueries.getMember(parsedClubId ?? 0),
    enabled: parsedClubId !== null && !!club,
  });

  const postPresidentMutation = useMutation({
    ...adminMutations.postPresident(),
    onSuccess: () => {
      if (parsedClubId !== null) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'president', parsedClubId] });
      }
      setNewPresidentStudentNum('');
      setNewPresidentName('');
      alert({ title: '학생회장이 등록되었습니다.', description: '학생회장이 등록되었습니다.' });
    },
    onError: () => {
      alert({
        title: '학생회장 등록에 실패했습니다.',
        description: '학생회장 등록에 실패했습니다.',
      });
    },
  });

  const patchPresidentMutation = useMutation({
    ...adminMutations.patchPresident(),
    onSuccess: () => {
      if (parsedClubId !== null) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'member', parsedClubId] });
      }
      setNewPresidentStudentNum('');
      setNewPresidentName('');
      alert({
        title: '학생회장 정보가 변경되었습니다.',
        description: '학생회장 정보가 변경되었습니다.',
      });
    },
    onError: () => {
      alert({
        title: '학생회장 변경에 실패했습니다.',
        description: '학생회장 변경에 실패했습니다.',
      });
    },
  });

  const postMemberMutation = useMutation({
    ...adminMutations.postMember(),
    onSuccess: () => {
      if (parsedClubId !== null) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'member', parsedClubId] });
      }
      setNewMemberStudentNum('');
      setNewMemberName('');
      alert({ title: '부원이 추가되었습니다.', description: '부원이 추가되었습니다.' });
    },
    onError: () => {
      alert({ title: '부원 추가에 실패했습니다.', description: '부원 추가에 실패했습니다.' });
    },
  });

  const deleteMemberMutation = useMutation({
    ...adminMutations.deleteMember(),
    onSuccess: () => {
      if (parsedClubId !== null) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'member', parsedClubId] });
        alert({
          title: '부원이 삭제되었습니다.',
          description: '부원이 삭제되었습니다.',
          confirmText: '확인',
        });
      }
    },
    onError: () => {
      alert({
        title: '부원 삭제에 실패했습니다.',
        description: '부원 삭제에 실패했습니다.',
        confirmText: '확인',
      });
    },
  });

  const canSubmitPresident =
    newPresidentStudentNum.trim().length > 0 && newPresidentName.trim().length > 0;
  const canAddMember = newMemberStudentNum.trim().length > 0 && newMemberName.trim().length > 0;

  const president = presidentQuery.data?.data;
  const hasPresident = !!(president?.studentNum?.trim() || president?.name?.trim());

  const presidentSubmitBusy = postPresidentMutation.isPending || patchPresidentMutation.isPending;

  const handlePresidentSubmit = () => {
    if (parsedClubId === null || !canSubmitPresident) return;
    const body = {
      clubId: parsedClubId,
      studentNum: newPresidentStudentNum.trim(),
      name: newPresidentName.trim(),
    };
    if (hasPresident) {
      confirm({
        title: '학생회장 수정',
        description: `새 학생회장 ${newPresidentStudentNum} ${newPresidentName} 변경하시겠습니까?`,
        cancelText: '취소',
        confirmText: '확인',
        onConfirm: () => patchPresidentMutation.mutate(body),
      });
    } else {
      postPresidentMutation.mutate(body);
    }
  };

  const handleAddMember = () => {
    if (parsedClubId === null || !canAddMember) return;
    postMemberMutation.mutate({
      clubId: parsedClubId,
      studentNum: newMemberStudentNum.trim(),
      name: newMemberName.trim(),
    });
  };

  const handleDeleteMember = (member: MemberItem) => {
    confirm({
      title: '부원 삭제',
      description: `${member.name} 부원을 정말 삭제하시겠어요?`,
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => deleteMemberMutation.mutate(member.memberId),
    });
  };

  if (!clubIdParam) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-[3rem] pt-[4.2rem] text-center xl:px-[9.3rem]">
        <p className="W_B17 text-gray-60">사이드바에서 학생회를 선택해 주세요.</p>
      </div>
    );
  }

  if (parsedClubId === null) {
    return (
      <div className="px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
        <p className="W_B17 text-gray-90">올바르지 않은 학생회 ID입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
        <p className="W_B17 text-gray-60">불러오는 중…</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
        <p className="W_B17 text-gray-60">해당 학생회를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const members = membersQuery.data?.data ?? [];
  const membersLoading = membersQuery.isPending;
  const presidentLoading = presidentQuery.isPending;

  return (
    <div className="mx-auto w-full max-w-[45rem] px-[1.5rem]">
      <div className="mt-[4.2rem] mb-[42rem] flex flex-col items-center justify-center gap-[1.8rem]">
        <p className="W_Header text-black">{club.studentClubName}</p>
        {/* 회장 관리 */}
        <div className="flex w-full flex-col justify-center gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[1.6rem] py-[2rem] sm:px-[2.6rem] sm:py-[3rem]">
          <p className="W_B17 text-black">회장 관리</p>
          <div className="flex h-[4.4rem] items-center gap-[1.9rem] border-gray-10 border-b">
            <p className="W_SB15 text-black">현재 회장</p>
            {presidentLoading ? (
              <p className="W_SB15 text-gray-90">불러오는 중…</p>
            ) : hasPresident && president ? (
              <p className="W_SB15 text-gray-90">
                {president.studentNum} {president.name}
              </p>
            ) : (
              <p className="W_SB15 text-gray-90">학생회장을 등록해주세요</p>
            )}
          </div>
          <div className="flex h-[4rem] items-center gap-[1.6rem]">
            <p className="W_SB15 flex-1 text-black">{hasPresident ? '새 회장' : '학생회장'}</p>
            <TextField
              placeholder="학번"
              className="flex-1"
              value={newPresidentStudentNum}
              onChange={(e) => setNewPresidentStudentNum(e.target.value)}
            />
            <TextField
              placeholder="이름"
              className="flex-1"
              value={newPresidentName}
              onChange={(e) => setNewPresidentName(e.target.value)}
            />
            <Button
              size="regular"
              variant="primary"
              className="h-[4rem] max-w-[6.3rem] flex-1"
              disabled={!canSubmitPresident || presidentLoading || presidentSubmitBusy}
              onClick={handlePresidentSubmit}
            >
              {hasPresident ? '변경' : '저장'}
            </Button>
          </div>
        </div>
        {/* 소속부원 관리 */}
        <div className="flex w-full flex-col justify-center gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[1.6rem] py-[2rem] sm:px-[2.6rem] sm:py-[3rem]">
          <p className="W_B17 text-black">소속부원 관리</p>
          <div className="flex h-[4rem] items-center gap-[1.6rem]">
            <TextField
              placeholder="학번"
              className="flex-1"
              value={newMemberStudentNum}
              onChange={(e) => setNewMemberStudentNum(e.target.value)}
            />
            <TextField
              placeholder="이름"
              className="flex-1"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <Button
              size="regular"
              variant="primary"
              className="h-[4rem] max-w-[6.3rem] flex-1"
              disabled={!canAddMember || postMemberMutation.isPending}
              onClick={handleAddMember}
            >
              추가
            </Button>
          </div>
          <MemberList
            buttonType="delete"
            members={membersLoading ? [] : members}
            onDelete={handleDeleteMember}
            emptyText={membersLoading ? '불러오는 중…' : '등록된 부원이 없습니다.'}
          />
        </div>
      </div>
    </div>
  );
};
