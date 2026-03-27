import { collegeQuery } from '@apis/college/college-queries';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import MemberList from '@components/mypage/member-list';
import { useStudentClubStore } from '@store/studentClubStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Management = () => {
  const { clubId: clubIdParam } = useParams<{ clubId: string }>();
  const setSelectedClub = useStudentClubStore((s) => s.setSelectedClub);
  const [newPresidentStudentNum, setNewPresidentStudentNum] = useState('');
  const [newPresidentName, setNewPresidentName] = useState('');
  const [newMemberStudentNum, setNewMemberStudentNum] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  const { data, isLoading } = useQuery(collegeQuery.collegeAndClubs());
  const canChangePresident =
    newPresidentStudentNum.trim().length > 0 && newPresidentName.trim().length > 0;
  const canAddMember = newMemberStudentNum.trim().length > 0 && newMemberName.trim().length > 0;

  const club = useMemo(() => {
    if (!clubIdParam) return null;
    const id = Number(clubIdParam);
    if (!Number.isFinite(id)) return null;
    const flat = data?.data?.flatMap((c) => c.clubs ?? []) ?? [];
    return flat.find((c) => c.studentClubId === id) ?? null;
  }, [clubIdParam, data]);

  useEffect(() => {
    if (!club) return;
    setSelectedClub({
      studentClubId: club.studentClubId,
      studentClubName: club.studentClubName,
      verification: club.verification,
    });
  }, [club, setSelectedClub]);

  if (!clubIdParam) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-[3rem] pt-[4.2rem] text-center xl:px-[9.3rem]">
        <p className="W_B17 text-gray-60">사이드바에서 학생회를 선택해 주세요.</p>
      </div>
    );
  }

  const parsedId = Number(clubIdParam);
  if (!Number.isFinite(parsedId)) {
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

  return (
    <div className="mx-auto w-full max-w-[45rem] px-[1.5rem]">
      <div className="mt-[4.2rem] mb-[42rem] flex flex-col items-center justify-center gap-[1.8rem]">
        <p className="W_Header text-black">{club.studentClubName}</p>
        {/* 회장 관리 */}
        <div className="flex w-full flex-col justify-center gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[1.6rem] py-[2rem] sm:px-[2.6rem] sm:py-[3rem]">
          <p className="W_B17 text-black">회장 관리</p>
          <div className="flex h-[4.4rem] items-center gap-[1.9rem] border-gray-10 border-b">
            <p className="W_SB15 text-black">현재 회장</p>
            <p className="W_SB15 text-gray-90">0000000 김회장</p>
          </div>
          <div className="flex h-[4rem] items-center gap-[1.6rem]">
            <p className="W_SB15 flex-1 text-black">새 회장</p>
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
              disabled={!canChangePresident}
            >
              변경
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
              disabled={!canAddMember}
            >
              추가
            </Button>
          </div>
          <MemberList buttonType="delete" members={[]} emptyText="등록된 부원이 없습니다." />
        </div>
      </div>
    </div>
  );
};
