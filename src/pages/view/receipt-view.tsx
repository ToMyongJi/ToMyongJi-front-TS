import {useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {receiptQueries} from '@apis/receipt/receipt-queries';
import {useStudentClubStore} from '@store/sidebar-store';
import { useLayoutStore } from '@store/layout-store';
import { Receipt } from '@apis/receipt/receipt';
import dayjs from 'dayjs';
import InfoIcon from "@assets/icons/info.svg?react";
import MenuIcon from "@assets/icons/menu.svg?react";
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import Chip from '@components/common/chip';
import SearchBar from '@components/common/search-bar';
import PaginationCustom from '@components/pagination-custom';
import Dropdown from '@components/dropdown';

const HeaderData = [
  { labels: "날짜", width: "15.8%" },
  { labels: "내용", width: "51%" },
  { labels: "입금", width: "16.6%" },
  { labels: "출금", width: "16.6%" },
];


const ReceiptView = () => {
  const [year, setYear] = useState("전체(년)");
  const [yearFilter, setYearFilter] = useState(false);
  const [month, setMonth] = useState("전체(월)");
  const [monthFilter, setMonthFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const {toggleSidebar} = useLayoutStore();
  const clubData = useStudentClubStore((state) => state.selectedClub);

  const selectedYear = year === '전체(년)' ? undefined : Number(year.replace('년', ''));
  const selectedMonth = month === '전체(월)' ? undefined : Number(month.replace('월', ''));

  const receiptList = useInfiniteQuery({
    ...receiptQueries.listInfinite(
      clubData?.studentClubId,
      selectedYear,
      selectedMonth,
      10,
      page - 1,
    ),
  });
  const totalPages = receiptList.data?.pages[0]?.data.totalPages ?? 0;
  const receipts = receiptList.data?.pages.flatMap((p) => p.data.receiptDtoList) ?? [];

  const trimmedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredReceipts =
    trimmedSearchTerm.length < 2
      ? receipts
      : receipts.filter((item: Receipt) => {
          const target = `${item.date} ${item.content} ${item.deposit} ${item.withdrawal}`.toLowerCase();
          return target.includes(trimmedSearchTerm);
        });
  const yearOptions =['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`,)];
  const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];

  const handleChipClick = (type: 'YEAR' | 'MONTH') => {
    type === 'YEAR' ? setYearFilter(true) : setMonthFilter(true);
  }

  return (
    <div className="mb-[10rem] flex-col gap-[4.6rem] px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
      <section className="flex-row-between">
        <div className="flex items-center gap-[0.8rem]">
          <p className="W_Header text-black">{clubData?.studentClubName}</p>
          <InfoIcon className="text-gray-20" />
        </div>
        <button type="button" className="cursor-pointer">
          <MenuIcon className='md:hidden' onClick={toggleSidebar} />
        </button>

      </section>
      <div className="flex-col gap-[1rem]">
        <section className="flex-row-between">
          <div className="flex gap-[0.8rem]">
            <div className="relative">
              <Chip label={year} isActive={yearFilter} onClick={() => handleChipClick('YEAR')} />
              {yearFilter &&
                <Dropdown
                  className="absolute top-0"
                  onClick={() => setYearFilter(false)}
                  datas={yearOptions}
                  previewData={year}
                  setPreViewData={setYear} />}
            </div>
            <div className="relative">
              <Chip label={month} isActive={monthFilter} onClick={() => handleChipClick('MONTH')} />
              {monthFilter &&
                <Dropdown
                  className="absolute top-0"
                  onClick={() => setMonthFilter(false)}
                  datas={monthOptions}
                  previewData={month}
                  setPreViewData={setMonth}/>
              }
            </div>
          </div>
          <SearchBar
            placeholder="검색어 2글자 이상 입력"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </section>
        <section className="rounded-[1rem] border border-gray-20 px-[2.6rem] xl:px-[10rem]">
          <div className="pt-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HeaderData} />
              <tbody>
                {filteredReceipts.map((item: Receipt, index: number) => (
                  <TableCell
                    key={item.receiptId}
                    mode="VIEW"
                    isLastRow={index === filteredReceipts.length - 1}
                    {...item}
                  />
                ))}
              </tbody>
            </table>
            <div className="py-[1.6rem]">
              <PaginationCustom
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(pageNumber) => setPage(pageNumber)}/>
            </div>

          </div>
        </section>
      </div>

    </div>
  );
};

export default ReceiptView;