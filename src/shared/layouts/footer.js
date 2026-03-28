import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppStoreIcon from '@assets/icons/appstore.svg?react';
import InstagramIcon from '@assets/icons/instagram.svg?react';
const Footer = () => {
    const AppStoreUrl = 'https://apps.apple.com/kr/app/%ED%88%AC%EB%AA%85%EC%A7%80/id6743519294';
    const InstagramUrl = 'https://www.instagram.com/tomyongji?igsh=MTY5enQxaDBwNTE2dQ==';
    return (_jsxs("div", { className: "flex items-center justify-between bg-background px-[4rem] py-[3.9rem]", children: [_jsxs("section", { children: [_jsx("p", { className: "W_M14 text-gray-90", children: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68" }), _jsx("p", { className: "W_M14 text-gray-80", children: "Copyright \u24D2 ToMyongJi. All Rights Reserved" }), _jsx("p", { className: "W_M14 text-gray-80", children: "E-mail: tomyongji2024@gmail.com" })] }), _jsxs("section", { className: "flex items-center gap-[2rem]", children: [_jsx(AppStoreIcon, { className: "cursor-pointer text-primary", onClick: () => window.open(AppStoreUrl) }), _jsx(InstagramIcon, { className: "cursor-pointer text-primary", onClick: () => window.open(InstagramUrl) })] })] }));
};
export default Footer;
