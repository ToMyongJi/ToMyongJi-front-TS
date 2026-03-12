import { cn } from '@libs/cn';

import CheckBox from '@components/check-box';
import IconButton from '@components/icon-button';


type TableCellProps = {
  type: 'VIEW' | 'EDIT';
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
}


const TableCell = ({type, date, content, deposit, withdrawal}: TableCellProps) => {
  const tdStyle = 'W_M15 text-gray-90 text-center py-[1rem]';
  return (
    <tbody>
    <tr className="border-gray-10 border-b-1">
      {type === 'EDIT' && <td><CheckBox /></td>}
      <td className={tdStyle}>{date}</td>
      <td className={cn(tdStyle, 'text-start')}>{content}</td>
      <td className={cn(tdStyle, "text-success")}>{deposit}</td>
      <td className={cn(tdStyle, "text-error-deep")}>{withdrawal}</td>
      {type === 'EDIT' && <td><IconButton iconType={'edit'} /></td>}
    </tr>

    </tbody>
  );
};

export default TableCell;