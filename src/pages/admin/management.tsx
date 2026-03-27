import { collegeQuery } from '@apis/college/college-queries';
import { useStudentClubStore } from '@store/studentClubStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const Management = () => {
  const { clubId: clubIdParam } = useParams<{ clubId: string }>();
  const setSelectedClub = useStudentClubStore((s) => s.setSelectedClub);

  const { data, isLoading } = useQuery(collegeQuery.collegeAndClubs());

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
    <div className="mb-[10rem] px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
      <p className="W_Header text-black">{club.studentClubName}</p>
      <p className="W_B17 mt-[1.6rem] text-gray-60">학생회 관리</p>
    </div>
  );
};
