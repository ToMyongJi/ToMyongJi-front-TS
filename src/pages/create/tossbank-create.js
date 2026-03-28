import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { receiptMutations } from '@apis/receipt/receipt-mutations';
import BasicCard from '@components/common/basic-card';
import Button from '@components/common/button';
import TossBankImage from "@assets/icons/toss-bank.png";
import FileIcon from "@assets/icons/file.svg?react";
import CancelIcon from "@assets/icons/cancel.svg?react";
import useUserStore from '@store/user-store';
const TossbankCreate = () => {
    const [file, setFile] = useState(null);
    const [keyword, setKeyword] = useState(" ");
    const { user } = useUserStore();
    const uploadTossBank = useMutation(receiptMutations.uploadToss());
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const handleClick = () => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };
    const handleUpload = () => {
        if ((user === null || user === void 0 ? void 0 : user.userId) == null) {
            alert('로그인 정보를 확인할 수 없습니다.');
            return;
        }
        if (file) {
            uploadTossBank.mutate({ file, userId: user.userId, keyword }, {
                onSuccess: () => {
                    alert("성공적으로 업로드가 되었습니다.");
                    navigate('/receipt-create');
                },
                onError: (e) => {
                    alert(e.message);
                }
            });
        }
        else {
            alert("파일을 선택해주세요");
        }
    };
    return (_jsx("div", { className: "flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]", children: _jsxs("div", { className: "mx-auto w-full max-w-[100rem] flex-col gap-[1.8rem]", children: [_jsx("p", { className: "W_Title text-black", children: "\uD1A0\uC2A4\uBC45\uD06C \uAC70\uB798\uB0B4\uC5ED\uC11C \uC778\uC99D" }), _jsxs(BasicCard, { className: "flex-col gap-[3rem] px-[2.6rem] py-[2rem]", children: [_jsxs("section", { className: "flex-col gap-[0.8rem]", children: [_jsxs("div", { className: "flex items-center gap-[1rem]", children: [_jsx("p", { className: "W_B17 text-black", children: "\uAC70\uB798\uB0B4\uC5ED\uC11C \uC778\uC99D \uB9C8\uD06C \uC548\uB0B4" }), _jsxs("div", { className: "flex w-fit items-center gap-[0.6rem] rounded-[3rem] bg-background px-[1.4rem] py-[0.4rem]", children: [_jsx("img", { src: TossBankImage, className: "w-[8.5rem]", alt: "\uD1A0\uC2A4\uBC45\uD06C \uC778\uC99D \uB9C8\uD06C" }), _jsx("p", { className: "W_R12 text-gray-90", children: "\uC778\uC99D" })] })] }), _jsxs("div", { className: "flex-col gap-[0.4rem]", children: [_jsx("p", { className: "W_R15 text-gray-90", children: "\uC804\uCCB4 \uC785\uCD9C\uAE08 \uB0B4\uC5ED\uC758 30% \uC774\uC0C1\uC774 \uD1A0\uC2A4\uBC45\uD06C \uAC70\uB798\uB0B4\uC5ED\uC11C\uB85C \uC778\uC99D\uB418\uBA74" }), _jsx("p", { className: "W_R15 text-gray-90", children: " \uD574\uB2F9 \uD559\uC0DD\uD68C\uC758 \uC601\uC218\uC99D \uD398\uC774\uC9C0 \uC870\uD68C \uC2DC \uAC70\uB798\uB0B4\uC5ED\uC11C \uC778\uC99D \uB9C8\uD06C\uAC00 \uCD94\uAC00\uB429\uB2C8\uB2E4." })] })] }), _jsxs("section", { className: "flex-col gap-[0.8rem]", children: [_jsx("p", { className: "W_B17 text-black", children: "\uD1A0\uC2A4\uBC45\uD06C\uC5D0\uC11C \uAC70\uB798\uB0B4\uC5ED\uC11C\uB97C \uBC1C\uAE09\uBC1B\uB294 \uBC29\uBC95" }), _jsxs("ol", { className: "W_R15 flex-col gap-[0.3rem] text-gray-90", children: [_jsx("li", { children: "1. \uD1B5\uC7A5 \uD0ED \u2192 \uD1B5\uC7A5\uAD00\uB9AC\uB97C \uC120\uD0DD\uD569\uB2C8\uB2E4." }), _jsx("li", { children: "2. \uBB38\uC11C\uAD00\uB9AC \uCE74\uD14C\uACE0\uB9AC\uC5D0\uC11C \uAC70\uB798\uB0B4\uC5ED\uC11C\uB97C \uC120\uD0DD\uD569\uB2C8\uB2E4." }), _jsx("li", { children: "3. \uBC1C\uAE09\uBC29\uBC95\uC744 'PDF\uB85C \uC800\uC7A5\uD558\uAE30'\uB85C \uC120\uD0DD\uD569\uB2C8\uB2E4." }), _jsx("li", { children: "4. \uC5B8\uC5B4 \uD55C\uAE00 \uC120\uD0DD \u2192 \uAC70\uB798\uB0B4\uC5ED\uC744 \uD655\uC778\uD560 \uACC4\uC88C\uB97C \uC120\uD0DD\uD569\uB2C8\uB2E4." }), _jsx("li", { children: "5. \uAC70\uB798\uB0B4\uC5ED \uAE30\uAC04 \uC120\uD0DD \u2192 '\uC785\uCD9C\uAE08 \uC804\uCCB4' \uC120\uD0DD \uD6C4 \uBC1C\uAE09\uC744 \uC644\uB8CC\uD569\uB2C8\uB2E4." })] })] })] }), !file && _jsxs(BasicCard, { className: "flex-row-center py-[2rem]", children: [_jsx("input", { type: "file", ref: fileInputRef, accept: ".pdf", onChange: handleChange, className: "hidden" }), _jsx("div", { className: "flex-col-center gap-[1rem]", children: _jsx(Button, { variant: "primary_outline", size: "md", onClick: handleClick, children: "\uD30C\uC77C \uC120\uD0DD" }) })] }), file && _jsxs(BasicCard, { className: "flex items-center justify-between px-[2.6rem] py-[2rem]", children: [_jsxs("div", { className: "flex items-center gap-[0.5rem]", children: [_jsx(FileIcon, { className: "text-gray-70" }), _jsx("p", { className: "W_M15", children: file.name })] }), _jsx(CancelIcon, { className: "cursor-pointer text-error", onClick: () => setFile(null) })] }), _jsxs("div", { className: "mt-[5.4rem] flex justify-end gap-[0.8rem]", children: [_jsx(Button, { variant: "gray_outline", className: "px-[4rem]", size: "md", onClick: () => navigate(-1), children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "primary", className: "px-[3.4rem]", size: "md", disabled: !file || uploadTossBank.isPending, onClick: handleUpload, children: uploadTossBank.isPending ? "업로드 중" : "업로드" })] })] }) }));
};
export default TossbankCreate;
