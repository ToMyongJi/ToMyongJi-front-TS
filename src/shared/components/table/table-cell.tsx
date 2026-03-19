import { cn } from '@libs/cn';

import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';

type TableCellProps = {
  type: 'VIEW' | 'EDIT';
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
  isLastRow?: boolean;
}


const formatAmount = (value: number) =>
  (value ?? 0).toLocaleString('ko-KR');

const TableCell = ({type, date, content, deposit, withdrawal, isLastRow = false}: TableCellProps) => {
  const tdStyle = 'W_M15 text-gray-90 text-center px-[0.3rem] py-[1rem]';
  return (
    <tbody>
    <tr className={cn('border-gray-10', !isLastRow && 'border-b-1')}>
      {type === 'EDIT' && <td className="text-center"><CheckBox /></td>}
      <td className={tdStyle}>{date}</td>
      <td className={cn(tdStyle, 'text-start')}>{content}</td>
      <td className={cn(tdStyle, "text-success")}>{formatAmount(deposit)}</td>
      <td className={cn(tdStyle, "text-error-deep")}>{formatAmount(withdrawal)}</td>
      {type === 'EDIT' && <td><IconButton iconType={'edit'} /></td>}
    </tr>

    </tbody>
  );
};

export default TableCell;