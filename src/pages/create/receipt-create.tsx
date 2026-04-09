import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@apis/base/key';
import { receiptMutations } from '@apis/receipt/receipt-mutations';
import { receiptQueries } from '@apis/receipt/receipt-queries';
import { Receipt } from '@apis/receipt/receipt';

import dayjs from 'dayjs';

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
import ReceiptCreateSheet from '@components/bottom-sheet/receipt-create-sheet';
import ReceiptWriteSheet from '@components/bottom-sheet/receipt-write-sheet';
import ReceiptDatePicker from '@components/date-picker/receipt-date-picker';
import { useModal } from '@hooks/use-modal';

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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<number[]>([]);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

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
  const trimmedDebouncedSearch = debouncedSearch.trim();
  const isSearchMode = trimmedDebouncedSearch.length >= 2;

  const searchReceiptQuery = useQuery({
    ...receiptQueries.search(trimmedDebouncedSearch),
    enabled: isSearchMode,
  });

  const totalPages = receiptList.data?.pages[0]?.data.totalPages ?? 0;
  const receipts = flattenInfiniteReceiptPages(receiptList.data?.pages);
  const displayReceipts: Receipt[] = isSearchMode
    ? (searchReceiptQuery.data?.data ?? [])
    : receipts;
  const effectiveTotalPages = isSearchMode ? 1 : totalPages;

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
      void alert({
        title: '성공',
        description: '성공적으로 추가 완료했습니다.',
      });
      setReceiptForm((prev) => ({
        ...prev,
        content: '',
        deposit: '',
        withdrawal: '',
      }));
    },
    onError: () => {
      void alert({
        title: '영수증 추가',
        description: '내역 저장에 실패했습니다.',
      });
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
      void alert({
        title: '영수증 수정',
        description: '내역 수정에 실패했습니다.',
      });
    },
  });

  const exportCsv = useMutation(receiptMutations.exportCsv());

  useEffect(() => {
    if (authData && allClubsFlat.length === 0) {
      fetchClubs();
    }
  }, [authData, allClubsFlat.length, fetchClubs]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    if (isSearchMode) setPage(1);
  }, [isSearchMode]);

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
  const { alert, confirm } = useModal();


  const handleReceiptDelete = async () => {
    const result = await confirm({
      title: '내역 삭제',
      description: '정말로 이 내역을 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          if (selectedReceiptIds.length === 0) {
            await alert({
              title: '내역삭제',
              description: '삭제할 내역을 입력해주세요',
            })
          }
          else{
            for (const receiptId of selectedReceiptIds) {
              await deleteReceipt.mutateAsync(receiptId);
            }

            invalidateReceiptCaches();
            setSelectedReceiptIds([]);
          }
        } catch (error) {
          // TS에서는 catch문의 error 타입이 기본적으로 `unknown`이므로,
          // 실제로 Error 객체인지 확인 후 메시지를 사용합니다.
          if (error instanceof Error) {
            await alert({
              title: '내역삭제',
              description: error.message,
            })
          } else {
            await alert({
              title: '내역삭제',
              description: '알 수 없는 오류가 발생했습니다.',
            })
          }
        }
      }
    });

    if(result) {
      await alert({
        title: '내역 삭제,',
        description: '내역이 삭제되었습니다.'
      })
    }
  };

  const handleSaveClick = () => {
    if (user?.id == null || user.userId == null) {
      return;
    }

    if (receiptForm.date == null) {
      void alert({
        title: '영수증 추가',
        description: '날짜를 선택해주세요',
      });
      return;
    }

    if(receiptForm.deposit === '' && receiptForm.withdrawal === ''){
      void alert({
        title: '영수증 추가',
        description: '입출금 금액을 입력해주세요.',
      });
      return;
    }
    const trimmedContent = receiptForm.content.trim();
    if (!trimmedContent) {
      void alert({
        title: '영수증 추가',
        description: '내용을 입력해 주세요',
      });
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

    if (selectedYear === undefined){
      void alert({
        title: '영수증 추출',
        description: '년도를 선택해주세요',
      });
      return;
    }

    if(selectedMonth === undefined){
      void alert({
        title: '영수증 추출',
        description: '월을 선택해주세요',
      });
      return;
    }

    exportCsv.mutate(
      {
        userId: user?.userId,
        year: selectedYear,
        month: selectedMonth,
      },
      {
        onSuccess: (blob) => {
          downloadBlob(blob, `${selectedYear}년-${selectedMonth}월-영수증.csv`);
        },
        onError: () => {
          void alert({
            title: '실패',
            description: '영수증 추출에 실패했습니다.',
          });
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
              <ReceiptButton receiptType="excel" onClick={() => navigate('/csv-create')}/>
            </div>
          </div>
          <div className="flex-row-center gap-[0.8rem] rounded-[10px] border border-gray-20 p-[2rem]">
            <div className="flex h-[4rem] w-[11.2rem] shrink-0 items-center rounded-[0.8rem] border-[1px] border-gray-20 bg-white px-[1.4rem] py-[0.8rem] transition-colors focus-within:border-primary">
              <ReceiptDatePicker
                selected={receiptForm.date}
                onChange={(date) => {
                  setReceiptForm((prev) => ({ ...prev, date }));
                }}
                dateFormat="yyyy.MM.dd"
                placement="bottom"
                className="W_R15 w-full bg-transparent outline-none"
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
                {displayReceipts.length > 0
                  ? displayReceipts.map((receipt: Receipt, index: number) => (
                      <TableCell
                        key={receipt.receiptId}
                        mode="EDIT"
                        isChecked={selectedReceiptIds.indexOf(receipt.receiptId) !== -1}
                        isLastRow={index === displayReceipts.length - 1}
                        isSavePending={updateReceipt.isPending}
                        onToggleChecked={handleCheckClick}
                        onSave={(body) => updateReceipt.mutateAsync(body)}
                        {...receipt}
                      />
                    ))
                  :  (
                      <tr>
                        <td colSpan={6} className="W_M15 py-[4rem] text-center text-gray-70">
                          데이터가 존재하지 않습니다.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
            {totalPages > 0 && <div className="py-[1.6rem]">
              <PaginationCustom
                currentPage={page}
                totalPages={effectiveTotalPages}
                onPageChange={(pageNumber) => setPage(pageNumber)}
              />
            </div>}
          </div>
        </section>
      </div>
      <ReceiptCreateSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} onClickEdit={() => {
        setSheetOpen(false)
        setEditSheetOpen(true);
      }}/>
      <ReceiptWriteSheet isOpen={editSheetOpen} onClose={() => setEditSheetOpen(false)} buttonLabel={"내역 추가"}/>
    </div>
  );
};

export default ReceiptCreate;