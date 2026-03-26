var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const roleLabel = {
    [Role.PRESIDENT]: '회장',
    [Role.STU]: '부원',
    [Role.ADMIN]: '관리자',
};
const Mypage = () => {
    var _a, _b, _c, _d, _e, _f;
    const queryClient = useQueryClient();
    const { user, clearUser } = useUserStore();
    const { clearAuthData } = useAuthStore();
    const navigate = useNavigate();
    const [newStudentNum, setNewStudentNum] = useState('');
    const [newName, setNewName] = useState('');
    // 내 정보 조회
    const { data: myInfo } = useQuery(Object.assign(Object.assign({}, myQuery.getMyInfo((_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : 0)), { enabled: !!(user === null || user === void 0 ? void 0 : user.id) }));
    // 부원 조회
    const { data: memberData } = useQuery(Object.assign(Object.assign({}, myQuery.viewMember((_b = user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : 0)), { enabled: (user === null || user === void 0 ? void 0 : user.role) === Role.PRESIDENT && !!(user === null || user === void 0 ? void 0 : user.studentClubId) }));
    // 전체 학생회 조회 -> 내 정보 조회로 얻은 studentClubId로 학생회 이름 조회하기 위함.
    const college = useQuery(Object.assign({}, collegeQuery.getAllClub()));
    const studentClubName = (_f = (_e = (_d = (_c = college.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.find((club) => club.studentClubId === (user === null || user === void 0 ? void 0 : user.studentClubId))) === null || _e === void 0 ? void 0 : _e.studentClubName) !== null && _f !== void 0 ? _f : '';
    const addMemberMutation = useMutation(Object.assign(Object.assign({}, myMutations.addMember()), { onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my', 'viewMember'] });
            setNewStudentNum('');
            setNewName('');
            alert('부원 추가에 성공했습니다.');
        }, onError: () => {
            alert('부원 추가에 실패했습니다.');
        } }));
    const deleteMemberMutation = useMutation(Object.assign(Object.assign({}, myMutations.deleteMember()), { onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my', 'viewMember'] });
            alert('부원 삭제에 성공했습니다.');
        }, onError: () => {
            alert('부원 삭제에 실패했습니다.');
        } }));
    const deleteMutation = useMutation(Object.assign(Object.assign({}, authMutations.delete()), { onSuccess: () => {
            clearUser();
            clearAuthData();
            navigate('/login');
        }, onError: () => {
            alert('회원탈퇴에 실패했습니다.');
        } }));
    const handleAddMember = () => {
        if (!newStudentNum || !newName || !(user === null || user === void 0 ? void 0 : user.id))
            return;
        try {
            addMemberMutation.mutate({
                id: user === null || user === void 0 ? void 0 : user.id,
                studentNum: newStudentNum,
                name: newName,
            });
        }
        catch (_a) {
            alert('부원 추가에 실패했습니다.');
        }
    };
    const handleDeleteAccount = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!confirm('정말 탈퇴하시겠습니까?'))
            return;
        deleteMutation.mutate();
    });
    const info = myInfo === null || myInfo === void 0 ? void 0 : myInfo.data;
    const members = Array.isArray(memberData === null || memberData === void 0 ? void 0 : memberData.data) ? memberData.data : [];
    const isPresident = (user === null || user === void 0 ? void 0 : user.role) === Role.PRESIDENT;
    return (_jsx("div", { className: "mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center", children: _jsxs("div", { className: "flex w-full max-w-[42rem] flex-col gap-[3.2rem]", children: [_jsxs("div", { className: "flex flex-col gap-[1.6rem]", children: [_jsx("p", { className: "W_Title text-black", children: "\uB0B4 \uC815\uBCF4" }), _jsx("div", { className: "flex flex-col gap-[1.6rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]", children: [
                                { label: '이름', value: info === null || info === void 0 ? void 0 : info.name },
                                { label: '학번', value: info === null || info === void 0 ? void 0 : info.studentNum },
                                {
                                    label: '소속 이름',
                                    value: studentClubName,
                                },
                                { label: '자격', value: (user === null || user === void 0 ? void 0 : user.role) ? roleLabel[user.role] : '' },
                            ].map(({ label, value }) => (_jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 w-[6rem] shrink-0 text-gray-90", children: label }), _jsx(TextField, { value: value !== null && value !== void 0 ? value : '', disabled: true, className: "flex-1" })] }, label))) })] }), isPresident && (_jsxs("div", { className: "flex flex-col gap-[1.6rem]", children: [_jsx("p", { className: "W_Title text-black", children: "\uC18C\uC18D \uAD00\uB9AC" }), _jsxs("div", { className: "flex flex-col gap-[2rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]", children: [_jsx("div", { className: "flex items-center gap-[1.6rem]", children: _jsx("p", { className: "W_B17 text-black", children: studentClubName }) }), _jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx(TextField, { placeholder: "\uD559\uBC88", value: newStudentNum, onChange: (e) => setNewStudentNum(e.target.value), className: "flex-1" }), _jsx(TextField, { placeholder: "\uC774\uB984", value: newName, onChange: (e) => setNewName(e.target.value), className: "flex-1" }), _jsx(Button, { type: "button", variant: "primary", size: "regular", className: "W_SB15 w-[6.3rem] shrink-0", disabled: !newStudentNum || !newName || addMemberMutation.isPending, onClick: handleAddMember, children: "\uCD94\uAC00" })] }), _jsx(MemberList, { members: members, onDelete: (member) => deleteMemberMutation.mutate(Number(member.studentNum)), buttonType: "delete" })] })] })), _jsxs("div", { className: "flex items-center justify-between", children: [isPresident ? (_jsx(Button, { variant: "primary_outline", size: "md", type: "button", children: "\uD559\uC0DD\uD68C \uC774\uC804" })) : (_jsx("div", {})), _jsx("button", { type: "button", className: "W_R14 text-error hover:underline", onClick: handleDeleteAccount, children: "\uD68C\uC6D0\uD0C8\uD1F4" })] })] }) }));
};
export default Mypage;
