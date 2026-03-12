import {useState} from 'react';
import dayjs
import InfoIcon from "@assets/icons/info.svg?react";
import MenuIcon from "@assets/icons/menu.svg?react";
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import Chip from '@components/chip';
import SearchBar from '@components/search-bar';
import PaginationCustom from '@components/pagination-custom';
import Dropdown from '@components/dropdown';

const HeaderData = [
  { labels: "날짜", width: "15.8%" },
  { labels: "내용", width: "51%" },
  { labels: "입금", width: "16.6%" },
  { labels: "출금", width: "16.6%" },
];


const ReceiptView = () => {
  const [year, setYear] = useState();
  const [yearFilter, setYearFilter] = useState(false);
  const [month, setMonth] = useState();
  const [monthFilter, setMonthFilter] = useState(false);
  const [page, setPage] = useState(1);

  const handleChipClick = () => {

  }

  return (
    <div className="mb-[10rem] flex-col gap-[4.6rem] px-[9.3rem] pt-[4.2rem]">
      <section className="flex-row-between">
        <div className="flex items-center gap-[0.8rem]">
          <p className="W_Header text-black">인공지능소프트웨어융합대학 학생회</p>
          <InfoIcon className="text-gray-20" />
        </div>
        <MenuIcon className='md:hidden'/>
      </section>
      <div className="flex-col gap-[1rem]">
        <section className="flex-row-between">
          <div className="flex gap-[0.8rem]">
            <Chip label={`${year}년`} isActive={yearFilter}/>
            <Dropdown labels={['2021', '2022', '2023', '2024', '2025']} currentYear={year} setCurrentYear={setYear}/>
            <Chip label={"전체"} isActive={monthFilter} />
          </div>
          <SearchBar
            placeholder="검색어 2글자 이상 입력"
          />
        </section>
        <section className="rounded-[1rem] border border-gray-20 px-[10rem]">
          <div className="pt-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HeaderData} />
              <TableCell type={"VIEW"} />
            </table>
            <div className="py-[1.6rem]">
              <PaginationCustom
                currentPage={page}
                totalPages={10}
                onPageChange={(pageNumber) => setPage(pageNumber)}/>
            </div>

          </div>
        </section>
      </div>

    </div>
  );
};

export default ReceiptView;