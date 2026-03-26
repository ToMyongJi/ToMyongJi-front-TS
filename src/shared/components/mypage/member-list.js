import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';
const MemberList = ({ members, onDelete, buttonType, onCheck, selectedMemberIds, }) => {
    if (members.length === 0) {
        return _jsx("p", { className: "W_R14 text-center text-gray-70", children: "\uC18C\uC18D \uBD80\uC6D0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." });
    }
    return (_jsx("ul", { className: "overflow-hidden", children: members.map((member, index) => {
            var _a;
            return (_jsxs("li", { className: [
                    'mx-[1.6rem] flex h-[4.4rem] items-center justify-between border-gray-10 border-b',
                    // index !== members.length - 1 ? 'border-gray-10 border-b' : '',
                ].join(' '), children: [_jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("span", { className: "W_SB15 w-[1rem] text-black", children: index + 1 }), _jsxs("span", { className: "W_M15 text-gray-90", children: [member.studentNum, " ", member.name] })] }), buttonType === 'delete' && (_jsx(IconButton, { iconType: "cancel", onClick: () => onDelete(member), className: "h-[3rem] w-[3rem]" })), buttonType === 'check' && (_jsx(CheckBox, { checked: (_a = selectedMemberIds === null || selectedMemberIds === void 0 ? void 0 : selectedMemberIds.some((selectedMemberId) => selectedMemberId === member.memberId)) !== null && _a !== void 0 ? _a : false, onChange: (checked) => onCheck === null || onCheck === void 0 ? void 0 : onCheck(member, checked), "aria-label": `${member.name} 체크` }))] }, member.memberId));
        }) }));
};
export default MemberList;
