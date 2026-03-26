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
      <tr className="W_B15 border-gray-70 border-b">
        {headerData.map((item, idx) => (
          <th key={idx} className={`w-[${item.width}] py-[1rem] text-center`}>
            {item.labels}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;