var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collegeApi } from '@apis/college/college';
import { myApi } from '@apis/my/my';
import { create } from 'zustand';
const useStudentClubStore = create((set, get) => ({
    clubs: [],
    allClubsFlat: [],
    currentClub: null,
    isLoading: false,
    error: null,
    // 단과대 및 동아리 목록 전체 조회
    fetchClubs: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ isLoading: true });
        try {
            const response = yield collegeApi.collegesAndClubs();
            const clubsData = response.data; // 타입: collegeGetAllResponse['data']
            const flatClubs = clubsData.reduce((acc, collegeItem) => {
                var _a;
                acc.push(...((_a = collegeItem.clubs) !== null && _a !== void 0 ? _a : []));
                return acc;
            }, []);
            set({
                clubs: clubsData,
                allClubsFlat: flatClubs,
                isLoading: false,
                error: null,
            });
        }
        catch (error) {
            set({ error, isLoading: false });
        }
    }),
    // ID로 동아리 이름 찾기
    getClubNameById: (clubId) => {
        const club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
        return club ? club.studentClubName : '알 수 없는 동아리';
    },
    // 현재 선택된 동아리 설정
    setCurrentClub: (clubId) => {
        const club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
        if (club) {
            set({ currentClub: club });
        }
        else {
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
    fetchClubMembers: (clubId) => __awaiter(void 0, void 0, void 0, function* () {
        set({ isLoading: true });
        try {
            const response = yield myApi.viewMember(clubId);
            const membersData = Array.isArray(response.data) ? response.data : [response.data];
            const members = membersData.map((m) => ({
                memeberId: m.memberId,
                studentNum: m.studentNum,
                name: m.name,
            }));
            set((state) => ({
                currentClub: state.currentClub ? Object.assign(Object.assign({}, state.currentClub), { memberInfos: members }) : null,
                isLoading: false,
                error: null,
            }));
        }
        catch (error) {
            set({ error, isLoading: false });
        }
    }),
    // 멤버 추가
    addMember: (memberData) => __awaiter(void 0, void 0, void 0, function* () {
        set({ isLoading: true });
        try {
            // myApi.addMember 호출
            const response = yield myApi.addMember(memberData);
            const newMemberData = response.data;
            const newMember = {
                memeberId: newMemberData.memberId,
                studentNum: newMemberData.studentNum,
                name: newMemberData.name,
            };
            set((state) => {
                if (!state.currentClub)
                    return state;
                return {
                    currentClub: Object.assign(Object.assign({}, state.currentClub), { memberInfos: [...(state.currentClub.memberInfos || []), newMember] }),
                    isLoading: false,
                    error: null,
                };
            });
        }
        catch (error) {
            set({ error, isLoading: false });
        }
    }),
    // 멤버 삭제
    deleteMember: (deletedStudentNumb) => __awaiter(void 0, void 0, void 0, function* () {
        set({ isLoading: true });
        try {
            yield myApi.deleteMember(deletedStudentNumb);
            set((state) => {
                if (!state.currentClub)
                    return state;
                return {
                    currentClub: Object.assign(Object.assign({}, state.currentClub), { memberInfos: (state.currentClub.memberInfos || []).filter((m) => m.memeberId !== deletedStudentNumb) }),
                    isLoading: false,
                    error: null,
                };
            });
        }
        catch (error) {
            set({ error, isLoading: false });
        }
    }),
    // 멤버십 검증
    verifyClubMembership: (clubId, studentNum, name) => __awaiter(void 0, void 0, void 0, function* () {
        set({ isLoading: true });
        try {
            let club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
            if (!club) {
                yield get().fetchClubs();
                club = get().allClubsFlat.find((c) => c.studentClubId === clubId);
            }
            if (!club) {
                throw new Error('클럽을 찾을 수 없습니다.');
            }
            yield get().fetchClubMembers(clubId);
            const currentClub = get().currentClub;
            if (!currentClub || !currentClub.memberInfos) {
                throw new Error('클럽 멤버 정보를 가져올 수 없습니다.');
            }
            const member = currentClub.memberInfos.find((m) => m.studentNum === studentNum && m.name === name);
            set({ isLoading: false, error: null });
            return !!member;
        }
        catch (error) {
            set({ isLoading: false, error });
            throw error;
        }
    }),
}));
useStudentClubStore.getState().fetchClubs();
export default useStudentClubStore;
