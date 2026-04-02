type HeaderItem = {
  labels: string;
  width: React.CSSProperties["width"];
}

type TableHeaderProps = {
  headerData: HeaderItem[];
}

const TableHeader = ({headerData}: TableHeaderProps) => {
  return (
    <thead>
      <tr className="W_B15 border-gray-70 border-b">
        {headerData.map((item) => (
          <th key={item.labels} style={{ width: item.width }} className="py-[1rem] text-center">
            {item.labels}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;