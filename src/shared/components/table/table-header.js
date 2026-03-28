import { jsx as _jsx } from "react/jsx-runtime";
const TableHeader = ({ headerData }) => {
    return (_jsx("thead", { children: _jsx("tr", { className: "W_B15 border-gray-70 border-b", children: headerData.map((item) => (_jsx("th", { style: { width: item.width }, className: "py-[1rem] text-center", children: item.labels }, item.labels))) }) }));
};
export default TableHeader;
