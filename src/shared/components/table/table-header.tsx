type HeaderItem = {
  labels: string;
  width: string;
}

type TableHeaderProps = {
  headerData: HeaderItem[];
}

const TableHeader = ({headerData}: TableHeaderProps) => {
  return (
    <thead>
      <tr className="W_B15 border-b border-gray-70">
        {headerData.map((item, idx) => (
          <th key={idx} className={`w-[${item.width}] text-center py-[1rem]`}>
            {item.labels}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;