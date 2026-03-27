import { type college, collegeApi, type collegeGetAllResponse } from '@apis/college/college';
import { type addMemberRequest, myApi } from '@apis/my/my';
import { create } from 'zustand';

export interface ClubMember {
  memeberId: number;
  studentNum: string;
  name: string;
}

export interface CurrentClub extends college {
  memberInfos?: ClubMember[];
}

interface StudentClubState {
  clubs: collegeGetAllResponse['data']; // 단과대와 학생회 목록
  allClubsFlat: college[]; // 모든 동아리 목록
  currentClub: CurrentClub | null;
  isLoading: boolean;
  error: Error | unknown | null;

  // Actions
  fetchClubs: () => Promise<void>;
  getClubNameById: (clubId: number) => string;
  setCurrentClub: (clubId: number) => void;
  fetchClubMembers: (clubId: number) => Promise<void>;
  addMember: (memberData: addMemberRequest) => Promise<void>;
  deleteMember: (deletedStudentNumb: number) => Promise<void>;
  verifyClubMembership: (clubId: number, studentNum: string, name: string) => Promise<boolean>;
}

const useStudentClubStore = create<StudentClubState>((set, get) => ({
  clubs: [],
  allClubsFlat: [],
  currentClub: null,
  isLoading: false,
  error: null,

  // 단과대 및 동아리 목록 전체 조회
  fetchClubs: async () => {
    set({ isLoading: true });
    try {
      const response = await collegeApi.collegesAndClubs();
      const clubsData = response.data; // 타입: collegeGetAllResponse['data']

      const flatClubs = clubsData.reduce<college[]>((acc, collegeItem) => {
        acc.push(...(collegeItem.clubs ?? []));
        return acc;
      }, []);

      set({
        clubs: clubsData,
        allClubsFlat: flatClubs,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  // ID로 동아리 이름 찾기
  getClubNameById: (clubId) => {
    const club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
    return club ? club.studentClubName : '관리자';
  },

  // 현재 선택된 동아리 설정
  setCurrentClub: (clubId) => {
    const club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
    if (club) {
      set({ currentClub: club });
    } else {
      get()
        .fetchClubs()
        .then(() => {
          const updatedClub = get().allClubsFlat.find((c) => c.studentClubId === clubId);
          if (updatedClub) {
            set({ currentClub: updatedClub });
          }
        });
    }
  },

  // 특정 동아리의 멤버 목록 조회
  fetchClubMembers: async (clubId) => {
    set({ isLoading: true });
    try {
      const response = await myApi.viewMember(clubId);

      const membersData = Array.isArray(response.data) ? response.data : [response.data];

      const members: ClubMember[] = membersData.map((m) => ({
        memeberId: m.memberId,
        studentNum: m.studentNum,
        name: m.name,
      }));

      set((state) => ({
        currentClub: state.currentClub ? { ...state.currentClub, memberInfos: members } : null,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  // 멤버 추가
  addMember: async (memberData: addMemberRequest) => {
    set({ isLoading: true });
    try {
      // myApi.addMember 호출
      const response = await myApi.addMember(memberData);
      const newMemberData = response.data;

      const newMember: ClubMember = {
        memeberId: newMemberData.memberId,
        studentNum: newMemberData.studentNum,
        name: newMemberData.name,
      };

      set((state) => {
        if (!state.currentClub) return state;
        return {
          currentClub: {
            ...state.currentClub,
            memberInfos: [...(state.currentClub.memberInfos || []), newMember],
          },
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  // 멤버 삭제
  deleteMember: async (deletedStudentNumb: number) => {
    set({ isLoading: true });
    try {
      await myApi.deleteMember(deletedStudentNumb);

      set((state) => {
        if (!state.currentClub) return state;
        return {
          currentClub: {
            ...state.currentClub,
            memberInfos: (state.currentClub.memberInfos || []).filter(
              (m) => m.memeberId !== deletedStudentNumb,
            ),
          },
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  // 멤버십 검증
  verifyClubMembership: async (clubId, studentNum, name) => {
    set({ isLoading: true });
    try {
      let club = get().allClubsFlat.find((c) => c.studentClubId === clubId);

      if (!club) {
        await get().fetchClubs();
        club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
      }

      if (!club) {
        throw new Error('클럽을 찾을 수 없습니다.');
      }

      await get().fetchClubMembers(clubId);
      const currentClub = get().currentClub;

      if (!currentClub || !currentClub.memberInfos) {
        throw new Error('클럽 멤버 정보를 가져올 수 없습니다.');
      }

      const member = currentClub.memberInfos.find(
        (m) => m.studentNum === studentNum && m.name === name,
      );

      set({ isLoading: false, error: null });
      return !!member;
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },
}));

useStudentClubStore.getState().fetchClubs();

export default useStudentClubStore;
