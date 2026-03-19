import { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useUserStore from '@store/user-store';

import ReceiptButton from '@components/common/receipt-button';
import TextField from '@components/common/textfield';
import Button from '@components/common/button';
import Chip from '@components/common/chip';
import SearchBar from '@components/common/search-bar';
import Dropdown from '@components/dropdown';
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import PaginationCustom from '@components/pagination-custom';


const HEADER_DATA = [
  { labels: "", width: "8.46%" },
  { labels: "날짜", width: "12.8%" },
  { labels: "내용", width: "41.27%" },
  { labels: "입금", width: "13.42%" },
  { labels: "출금", width: "13.42%" },
  { labels: "", width: "8.46%" },
];


const ReceiptCreate = () => {
  const {user} = useUserStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [year, setYear] = useState('전체(년)');
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const [month, setMonth] = useState('전체(월)');
  const [isMonthFilterOpen, setIsMonthFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<number[]>([]);

  const yearOptions = ['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`)];
  const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];

  const handleChipClick = (type: 'YEAR' | 'MONTH') => {
    if (type === 'YEAR') {
      setIsYearFilterOpen(true);
      return;
    }
    setIsMonthFilterOpen(true);
  };

  const handleCheckClick = (id: number, state: boolean) => {
    setSelectedReceiptIds((prev) =>
      state ? [...prev, id] : prev.filter((receiptId) => receiptId !== id),
    );

    // TODO: 여기에서 id와 state를 사용해서 API 호출 처리
    // 예: state가 true일 때 선택, false일 때 해제 등의 로직
    console.log('checked receipt id:', id, 'state:', state);
  };

  return (
    <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[7.2rem]">
        <section className="flex-col gap-[1.2rem]">
          <p className="W_Header">인공지능 학생회</p>
          <div>
            <p className="W_Header"><span className="W_R14 text-gray-80">잔액</span> 800,000원</p>
          </div>
        </section>
        <section className="flex-col gap-[1rem]">
          <div className="flex items-center justify-between">
            <p className="W_Title">내역 추가</p>
            <div className="flex items-center gap-[0.8rem]">
              <ReceiptButton receiptType="toss" />
              <ReceiptButton receiptType="excel" />
            </div>
          </div>
          <div className="flex-row-center gap-[0.8rem] rounded-[10px] border border-gray-20 p-[2rem]">
            <div className="flex h-[4rem] w-[11.2rem] shrink-0 items-center rounded-[0.8rem] border-[1px] border-gray-20 bg-white px-[1.4rem] py-[0.8rem] transition-colors focus-within:border-primary">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                }}
                dateFormat="yyyy.MM.dd"
                popperPlacement="bottom"
                popperClassName="receipt-datepicker-popper"
                calendarClassName="receipt-datepicker-calendar"
                className="W_R15 w-full bg-transparent outline-none placeholder:text-gray-70"
              />
            </div>
            <TextField placeholder="내용" className="w-[41.4rem]"/>
            <TextField type="price" placeholder="입금" />
            <TextField type="price" placeholder="출금" />
            <Button variant="primary" size="save">저장하기</Button>
          </div>
        </section>
        <section className="flex-col gap-[1rem]">
          <p className="W_Title">학생회비 사용 내역</p>
          <div className="flex-row-between">
            <div className="flex gap-[0.8rem]">
              <div className="relative">
                <Chip label={year} isActive={isYearFilterOpen} onClick={() => handleChipClick('YEAR')} />
                {isYearFilterOpen &&
                  <Dropdown
                    className="absolute top-0"
                    onClick={() => setIsYearFilterOpen(false)}
                    datas={yearOptions}
                    previewData={year}
                    setPreViewData={setYear}
                  />
                }
              </div>
              <div className="relative">
                <Chip label={month} isActive={isMonthFilterOpen} onClick={() => handleChipClick('MONTH')} />
                {isMonthFilterOpen &&
                  <Dropdown
                    className="absolute top-0"
                    onClick={() => setIsMonthFilterOpen(false)}
                    datas={monthOptions}
                    previewData={month}
                    setPreViewData={setMonth}
                  />
                }
              </div>
              <div className="flex gap-[3rem]">
                <Button variant="primary_outline" size="regular">영수증 추출</Button>
                <Button variant="danger" size="regular">선택 목록 삭제</Button>
              </div>
            </div>
            <SearchBar
              placeholder="검색어 2글자 이상 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-[1rem] border border-gray-20 px-[2.7rem] pt-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HEADER_DATA}/>
              <TableCell
                mode="EDIT"
                receiptId={1}
                date={"d"}
                content={"d"}
                deposit={2}
                withdrawal={123}
                isChecked={selectedReceiptIds.indexOf(1) !== -1}
                onToggleChecked={handleCheckClick}
              />
              <TableCell
                mode="EDIT"
                receiptId={2}
                date={"d"}
                content={"d"}
                deposit={2}
                withdrawal={123}
                isChecked={selectedReceiptIds.indexOf(2) !== -1}
                onToggleChecked={handleCheckClick}
              />
            </table>
            <div>
              <PaginationCustom currentPage={page} totalPages={0} onPageChange={(pageNumber) => setPage(pageNumber)}/>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ReceiptCreate;