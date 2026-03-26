import { jsx as _jsx } from "react/jsx-runtime";
const TableHeader = ({ headerData }) => {
    return (_jsx("thead", { children: _jsx("tr", { className: "W_B15 border-gray-70 border-b", children: headerData.map((item, idx) => (_jsx("th", { className: `w-[${item.width}] py-[1rem] text-center`, children: item.labels }, idx))) }) }));
};
export default TableHeader;
