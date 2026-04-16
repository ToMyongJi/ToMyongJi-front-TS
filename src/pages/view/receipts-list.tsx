import {useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {cn} from '@libs/cn';
import {receiptQueries} from '@apis/receipt/receipt-queries';
import { useSidebarStore } from '@store/sidebar-store';
import { useLayoutStore } from '@store/layout-store';
import { minTailwindBreakpointForWidth, useElementSize } from '@hooks/use-element-size';
import type { Receipt } from '@apis/receipt/receipt';
import dayjs from 'dayjs';
import InfoIcon from "@assets/icons/info.svg?react";
import MenuIcon from "@assets/icons/menu.svg?react";
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import TableCellMobile from '@components/table/table-cell-mobile';
import Chip from '@components/common/chip';
import PaginationCustom from '@components/pagination-custom';
import Dropdown from '@components/dropdown';
import TossBankImage from '@assets/icons/toss-bank.png';
import { flattenReceiptDtoPages, groupReceiptsByDate } from '@utils/group-receipts-by-date';

const HeaderData = [
  { labels: "날짜", width: "15.8%" },
  { labels: "내용", width: "51%" },
  { labels: "입금", width: "16.6%" },
  { labels: "출금", width: "16.6%" },
];


const ReceiptsList = () => {
  const [isHover, setIsHover] = useState(false);
  const [year, setYear] = useState("전체(년)");
  const [yearFilter, setYearFilter] = useState(false);
  const [month, setMonth] = useState("전체(월)");
  const [monthFilter, setMonthFilter] = useState(false);
  const [page, setPage] = useState(1);

  const {toggleSidebar} = useLayoutStore();
  const { ref, width } = useElementSize<HTMLDivElement>();
  const bp = minTailwindBreakpointForWidth(width);
  const isBelowMd = bp === 'none'  || bp === "mr" || bp === 'sm';
  const clubData = useSidebarStore((state) => state.selectedClub);

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
  const receipts: Receipt[] = flattenReceiptDtoPages<Receipt>(receiptList.data?.pages);
  const receiptsMobile = groupReceiptsByDate(receipts);
  const yearOptions =['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`,)];
  const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];

  const handleChipClick = (type: 'YEAR' | 'MONTH') => {
    type === 'YEAR' ? setYearFilter(true) : setMonthFilter(true);
  }

  return (
    <div ref={ref} className="mb-[10rem] flex-col gap-[4.6rem] px-[3rem] pt-[4.2rem] xl:px-[9.3rem]">
      <section className="flex-row-between">
        <div className="relative flex items-center gap-[0.8rem]">
          <p className={cn('W_Header text-black', bp === "none" && "W_B17")}>{clubData?.studentClubName}</p>
          <InfoIcon className="cursor-pointer text-gray-20" onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}/>
          {isHover && <div
            className={
            cn('absolute top-14 left-1/2 z-[99] min-w-[38rem] flex-col gap-[0.8rem] rounded-[0.8rem] border border-gray-10 bg-white px-[1.6rem] py-[1.2rem] text-start shadow-[0_0_16px_0_rgba(163,163,163,0.25)]',
              bp === "none" && "left-0 min-w-[32rem]", bp === "mr" && "left-1/6", bp === "sm" && "left-1/3")}>
            <div className="flex items-center gap-[0.8rem]">
              <p className={cn('W_B15', bp === "none" && "W_SB13")}>거래내역서 인증 마크 안내</p>
              <div
                className={cn(
                  'flex w-fit items-center gap-[0.6rem] rounded-[3rem] bg-background px-[1.4rem] py-[0.4rem]',
                  bp === "none" && 'px-[1rem]')}>
                <img src={TossBankImage} className={cn('w-[8.5rem]', bp === "none" && 'w-[6rem]')} alt="토스뱅크 인증 마크" />
                <p className="W_R12 text-gray-90">인증</p>
              </div>
            </div>
            <p className={'W_R12 text-wrap text-gray-90'}>전체 입출금 내역의 30% 이상이 토스뱅크 거래내역서로 인증되면, {bp !== "none" && <br />}
              해당 학생회의 영수증 페이지 조회 시 거래내역서 인증 마크가 추가됩니다.
            </p>
          </div>}
        </div>
        <button type="button" className="cursor-pointer">
          <MenuIcon className="md:hidden" onClick={toggleSidebar} />
        </button>

      </section>
      <div className="flex-col gap-[1rem]">
        <section className="flex gap-[0.8rem]">
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
        </section>

        <section className="flex-col gap-[3.2rem]">
          <div className={cn('rounded-[1rem] border border-gray-20 px-[2.6rem] xl:px-[10rem]', isBelowMd && "pb-[1.6rem]")}>
            <div className="pt-[1.6rem]">
              {isBelowMd ? (
                receiptsMobile.length === 0 ? (
                  <p className="W_M15 py-[14rem] text-center text-gray-70">
                    데이터가 존재하지 않습니다.
                  </p>
                ) : (
                  receiptsMobile.map((receipt) => (
                    <TableCellMobile
                      key={receipt.date}
                      receiptList={receipt.receiptList}
                      date={receipt.date}
                      type='VIEW'
                    />
                  ))
                )
              ) : (
                <table className="w-full table-fixed">
                  <TableHeader headerData={HeaderData} />
                  <tbody>
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="W_M15 py-[4rem] text-center text-gray-70">
                        데이터가 존재하지 않습니다.
                      </td>
                    </tr>
                  ) : (
                    receipts.map((item: Receipt, index: number) => (
                      <TableCell
                        key={item.receiptId}
                        mode="VIEW"
                        isLastRow={index === receipts.length - 1}
                        {...item}
                      />
                    ))
                  )
                  }
                  </tbody>
                </table>
              )}
              {!isBelowMd && totalPages > 0 && (
                <div className="py-[1.6rem]">
                  <PaginationCustom
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => setPage(pageNumber)}
                  />
                </div>
              )}
            </div>
          </div>
          {isBelowMd && totalPages > 0 && <PaginationCustom
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />}

        </section>

      </div>

    </div>
  );
};

export default ReceiptsList;