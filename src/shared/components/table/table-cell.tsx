import CheckBox from '@components/check-box';
import IconButton from '@components/icon-button';
import { cn } from '@libs/cn';

type CellItem = {
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
}

type TableCellProps = {
  CellData: CellItem;
  type: 'VIEW' | 'EDIT';
}


const TableCell = ({type, CellData}: TableCellProps) => {
  const tdStyle = 'W_M15 text-gray-90 text-center py-[1rem]';
  return (
    <tbody>
    <tr className="border-gray-10 border-b-1">
      {type === 'EDIT' && <td><CheckBox /></td>}
      <td className={tdStyle}>2025-03-25</td>
      <td className={cn(tdStyle, 'text-start')}>학생회비 이월</td>
      <td className={cn(tdStyle, "text-success")}>2025-03-25</td>
      <td className={cn(tdStyle, "text-error-deep")}>2025-03-25</td>
      {type === 'EDIT' && <td><IconButton iconType={'edit'} /></td>}
    </tr>

    </tbody>
  );
};

export default TableCell;