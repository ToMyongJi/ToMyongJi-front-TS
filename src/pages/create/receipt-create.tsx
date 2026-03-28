import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@apis/base/key';
import { receiptMutations } from '@apis/receipt/receipt-mutations';
import { receiptQueries } from '@apis/receipt/receipt-queries';
import { Receipt } from '@apis/receipt/receipt';

import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useUserStore from '@store/user-store';
import useStudentClubStore from '@store/student-club-store';
import useAuthStore from '@store/auth-store';

import ReceiptButton from '@components/common/receipt-button';
import TextField from '@components/common/textfield';
import Button from '@components/common/button';
import Chip from '@components/common/chip';
import SearchBar from '@components/common/search-bar';
import Dropdown from '@components/dropdown';
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import PaginationCustom from '@components/pagination-custom';

const parseWonInput = (raw: string) => {
  const digits = raw.replace(/,/g, '').replace(/\D/g, '');
  return digits === '' ? 0 : Number(digits);
};

const flattenInfiniteReceiptPages = (
  pages: Array<{ data: unknown }> | undefined,
): Receipt[] =>
  pages?.reduce((acc, page) => {
    const payload = page.data as unknown as { receiptDtoList?: Receipt[] };
    return acc.concat(payload.receiptDtoList ?? []);
  }, [] as Receipt[]) ?? [];

const filterReceiptsBySearch = (receipts: Receipt[], searchTerm: string): Receipt[] => {
  const needle = searchTerm.trim().toLowerCase();
  if (needle.length < 2) return receipts;
  return receipts.filter((item) => {
    const haystack = `${item.date} ${item.content} ${item.deposit} ${item.withdrawal}`.toLowerCase();
    return haystack.includes(needle);
  });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const HEADER_DATA = [
  { labels: "", width: "8.46%" },
  { labels: "날짜", width: "12.8%" },
  { labels: "내용", width: "41.27%" },
  { labels: "입금", width: "13.42%" },
  { labels: "출금", width: "13.42%" },
  { labels: "", width: "8.46%" },
];


const ReceiptCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useUserStore();
  const { authData } = useAuthStore();
  const { allClubsFlat, getClubNameById, fetchClubs } = useStudentClubStore();
  const { data } = useQuery({ ...receiptQueries.club(user?.id) });

  const [receiptForm, setReceiptForm] = useState({
    date: new Date() as Date | null,
    content: '',
    deposit: '',
    withdrawal: '',
  });
  const [year, setYear] = useState('전체(년)');
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const [month, setMonth] = useState('전체(월)');
  const [isMonthFilterOpen, setIsMonthFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<number[]>([]);

  const yearOptions = ['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`)];
  const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];
  const receiptData = data?.data;
  const selectedYear = year === '전체(년)' ? undefined : Number(year.replace('년', ''));
  const selectedMonth = month === '전체(월)' ? undefined : Number(month.replace('월', ''));

  const receiptList = useInfiniteQuery({
    ...receiptQueries.listInfinite(
      user?.studentClubId,
      selectedYear,
      selectedMonth,
      10,
      page - 1,
    ),
  });
  const totalPages = receiptList.data?.pages[0]?.data.totalPages ?? 0;
  const receipts = flattenInfiniteReceiptPages(receiptList.data?.pages);
  const filteredReceipts = filterReceiptsBySearch(receipts, searchTerm);

  const invalidateReceiptCaches = useCallback(() => {
    if (user?.id != null) {
      queryClient.invalidateQueries({ queryKey: QK.receipt.club(user.id) });
    }
    if (user?.studentClubId != null) {
      queryClient.invalidateQueries({ queryKey: ['receiptList', user.studentClubId] });
    }
  }, [queryClient, user?.id, user?.studentClubId]);

  const createReceipt = useMutation({
    ...receiptMutations.create(),
    onSuccess: () => {
      invalidateReceiptCaches();
      setReceiptForm((prev) => ({
        ...prev,
        content: '',
        deposit: '',
        withdrawal: '',
      }));
    },
    onError: () => {
      alert('내역 저장에 실패했습니다.');
    },
  });

  const deleteReceipt = useMutation({
    ...receiptMutations.delete(),
  });

  const updateReceipt = useMutation({
    ...receiptMutations.update(),
    onSuccess: () => {
      invalidateReceiptCaches();
    },
    onError: () => {
      alert('내역 수정에 실패했습니다.');
    },
  });

  const exportCsv = useMutation(receiptMutations.exportCsv());

  useEffect(() => {
    if (authData && allClubsFlat.length === 0) {
      fetchClubs();
    }
  }, [authData, allClubsFlat.length, fetchClubs]);

  const studentClubName = user?.studentClubId != null ? getClubNameById(user.studentClubId) : '';

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

  };

  const handleReceiptDelete = async () => {
    if (selectedReceiptIds.length === 0) {
      alert('삭제할 내역을 선택해 주세요.');
      return;
    }

    try {
      for (const receiptId of selectedReceiptIds) {
        await deleteReceipt.mutateAsync(receiptId);
      }

      invalidateReceiptCaches();
      setSelectedReceiptIds([]);
      alert('성공적으로 삭제했습니다.');
    } catch {
      alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleSaveClick = () => {
    if (user?.id == null || user.userId == null) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }
    if (receiptForm.date == null) {
      alert('날짜를 선택해 주세요.');
      return;
    }
    const trimmedContent = receiptForm.content.trim();
    if (!trimmedContent) {
      alert('내용을 입력해 주세요.');
      return;
    }

    createReceipt.mutate({
      userId: user.userId,
      date: receiptForm.date.toISOString(),
      content: trimmedContent,
      deposit: parseWonInput(receiptForm.deposit),
      withdrawal: parseWonInput(receiptForm.withdrawal),
    });
  };

  const handleExportCsv = () => {
    if (user?.userId == null) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    if (selectedYear === undefined){
      alert('년도를 선택해주세요')
      return;
    }

    if(selectedMonth === undefined){
      alert('월을 선택해주세요')
      return;
    }

    exportCsv.mutate(
      {
        userId: user.userId,
        year: selectedYear,
        month: selectedMonth,
      },
      {
        onSuccess: (blob) => {
          downloadBlob(blob, `${selectedYear}년-${selectedMonth}월-영수증.csv`);
        },
        onError: () => {
          alert('영수증 추출에 실패했습니다.');
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]">
      <div className="mx-auto w-full max-w-[100rem] flex-col gap-[7.2rem]">
        <section className="flex-col gap-[1.2rem]">
          <p className="W_Header">{studentClubName}</p>
          <div>
            <p className="W_Header"><span className="W_R14 text-gray-80">잔액</span> {(receiptData?.balance ?? 0).toLocaleString()}원</p>
          </div>
        </section>
        <section className="flex-col gap-[1rem]">
          <div className="flex items-center justify-between">
            <p className="W_Title">내역 추가</p>
            <div className="flex items-center gap-[0.8rem]">
              <ReceiptButton receiptType="toss" onClick={() => navigate('/tossbank-create')} />
              <ReceiptButton receiptType="excel" />
            </div>
          </div>
          <div className="flex-row-center gap-[0.8rem] rounded-[10px] border border-gray-20 p-[2rem]">
            <div className="flex h-[4rem] w-[11.2rem] shrink-0 items-center rounded-[0.8rem] border-[1px] border-gray-20 bg-white px-[1.4rem] py-[0.8rem] transition-colors focus-within:border-primary">
              <DatePicker
                selected={receiptForm.date}
                onChange={(date: Date | null) => {
                  setReceiptForm((prev) => ({ ...prev, date }));
                }}
                dateFormat="yyyy.MM.dd"
                popperPlacement="bottom"
                popperClassName="receipt-datepicker-popper"
                calendarClassName="receipt-datepicker-calendar"
                className="W_R15 w-full bg-transparent outline-none placeholder:text-gray-70"
              />
            </div>
            <TextField
              placeholder="내용"
              className="w-[41.4rem]"
              value={receiptForm.content}
              onChange={(e) =>
                setReceiptForm((prev) => ({ ...prev, content: e.target.value }))
              }
            />
            <TextField
              type="price"
              placeholder="입금"
              value={receiptForm.deposit}
              onChange={(e) =>
                setReceiptForm((prev) => ({ ...prev, deposit: e.target.value }))
              }
            />
            <TextField
              type="price"
              placeholder="출금"
              value={receiptForm.withdrawal}
              onChange={(e) =>
                setReceiptForm((prev) => ({ ...prev, withdrawal: e.target.value }))
              }
            />
            <Button
              variant="primary"
              size="save"
              disabled={createReceipt.isPending}
              onClick={handleSaveClick}
            >
              저장하기
            </Button>
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
                <Button
                  variant="primary_outline"
                  size="regular"
                  onClick={handleExportCsv}
                  disabled={exportCsv.isPending}
                >
                  영수증 추출
                </Button>
                <Button
                  variant="danger"
                  size="regular"
                  onClick={handleReceiptDelete}
                  disabled={deleteReceipt.isPending}
                >
                  선택 목록 삭제
                </Button>
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
          </div>
          <div className="rounded-[1rem] border border-gray-20 px-[2.7rem] pt-[1.6rem]">
            <table className="w-full table-fixed">
              <TableHeader headerData={HEADER_DATA} />
              <tbody>
                {filteredReceipts.map((receipt: Receipt, index: number) => (
                  <TableCell
                    key={receipt.receiptId}
                    mode="EDIT"
                    isChecked={selectedReceiptIds.indexOf(receipt.receiptId) !== -1}
                    isLastRow={index === filteredReceipts.length - 1}
                    isSavePending={updateReceipt.isPending}
                    onToggleChecked={handleCheckClick}
                    onSave={(body) => updateReceipt.mutateAsync(body)}
                    {...receipt}
                  />
                ))}
              </tbody>
            </table>
            <div className="py-[1.6rem]">
              <PaginationCustom
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(pageNumber) => setPage(pageNumber)}
              />
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ReceiptCreate;