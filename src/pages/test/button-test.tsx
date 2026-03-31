import { Button } from '@components/common/button';
import CheckBox from '@components/common/check-box';
import Chip from '@components/common/chip';
import IconButton from '@components/common/icon-button';
import { ReceiptButton } from '@components/common/receipt-button';
import SearchBar from '@components/common/search-bar';
import SelectButton from '@components/common/select-button';
import TextField from '@components/common/textfield';
import { useModal } from '@hooks/use-modal';
import { useState } from 'react';

export default function ButtonTestPage() {
  const { alert, confirm } = useModal();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleAlertModal = async () => {
    await alert({
      title: '저장 완료',
      description: '정상적으로 저장되었습니다.',
      confirmText: '닫기',
    });
  };

  const handleConfirmModal = async () => {
    const ok = await confirm({
      title: '삭제 확인',
      description: '정말 삭제하시겠어요?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (ok) {
      await alert({
        title: '삭제 완료',
        description: '데이터가 삭제되었습니다.',
      });
    }
  };

  const handleAsyncConfirmSuccess = async () => {
    await confirm({
      title: '비동기 확인(성공 시 닫힘)',
      description: '확인을 누르면 1초 뒤 성공 처리됩니다.',
      onConfirm: async () => {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1000);
        });
        // 여기서 api 함수 사용하면 됨
      },
    });
  };

  const handleKeepOpenExample = async () => {
    await confirm({
      title: '조건 미충족',
      description: '이 케이스는 의도적으로 닫히지 않습니다.',
      onConfirm: () => false,
    });
  };

  return (
    <div className="space-y-12 p-8">
      <h1 className="W_Header text-primary">버튼 컴포넌트 테스트 페이지</h1>

      {/* 1. Primary 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">1. Primary Variant</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">
            작은버튼
          </Button>
          <Button variant="primary" size="save">
            저장하기
          </Button>
          <Button variant="primary" size="save" disabled>
            저장하기(비활성화)
          </Button>
          <Button variant="primary" size="md">
            중간버튼
          </Button>
          <Button variant="primary" size="regular">
            큰버튼
          </Button>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* 2. Primary Outline 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">2. Primary Outline Variant</h2>
        <div className="flex flex-wrap items-center gap-4 rounded-lg p-4">
          <Button variant="primary_outline" size="sm">
            작은버튼
          </Button>
          <Button variant="primary_outline" size="md">
            중간버튼
          </Button>
          <Button variant="primary_outline" size="regular">
            큰버튼
          </Button>
          <Button variant="primary_outline" size="save" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* 3. Danger 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">3. Danger Variant</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="danger" size="sm">
            작은버튼
          </Button>
          <Button variant="danger" size="md">
            중간버튼
          </Button>
          <Button variant="danger" size="regular">
            선택 목록 삭제
          </Button>
          <Button variant="danger" size="md" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* 4. Gray 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">4. Gray Variant</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="gray" size="sm">
            작은버튼
          </Button>
          <Button variant="gray" size="md">
            중간버튼
          </Button>
          <Button variant="gray" size="regular">
            큰버튼
          </Button>
          <Button variant="gray" size="md" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* 5. Gray Outline 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">5. Gray Outline Variant</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="gray_outline" size="sm">
            작은버튼
          </Button>
          <Button variant="gray_outline" size="md">
            중간버튼
          </Button>
          <Button variant="gray_outline" size="regular">
            큰버튼
          </Button>
          <Button variant="gray_outline" size="md" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* 6. Full Width 테스트 */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">6. Full Width 옵션</h2>
        <div className="flex w-[30rem] flex-col gap-4 rounded-lg border border-gray-20 p-4">
          <Button variant="primary" fullWidth>
            Full Width Primary
          </Button>
          <Button variant="primary_outline" fullWidth>
            Full Width Primary Outline
          </Button>
        </div>
      </section>

      {/* 7. Receipt Button */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">7. Receipt Button</h2>
        <div className="flex flex-wrap items-center gap-4">
          <ReceiptButton receiptType="toss" />
          <ReceiptButton receiptType="excel" />
        </div>
      </section>

      {/* 8. Chip */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">8. Chip</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Chip
            label="최신순"
            isActive={isFilterOpen}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>
      </section>

      {/* 9. CheckBox */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">9. CheckBox</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CheckBox checked={isChecked} onChange={setIsChecked} />
        </div>
      </section>

      {/* 10. Icon Button */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">10. Icon Button</h2>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton iconType="edit" onClick={() => console.log('edit')} />
          <IconButton iconType="cancel" onClick={() => console.log('cancel')} />
        </div>
      </section>

      {/* 11. Select Button */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">11. Select Button</h2>
        <div className="flex flex-wrap items-center gap-4">
          <SelectButton placeholder="대학을 선택해주세요" isOpen={false} />

          {/* 2. 열렸을 때 (Pressed) - isOpen이 true이므로 자동으로 회색 배경이 됩니다 */}
          <SelectButton placeholder="대학을 선택해주세요" isOpen={true} />

          {/* 3. 값 선택 완료 (Filled) - value가 존재하므로 자동으로 파란색 테두리가 생깁니다 */}
          <SelectButton value="서울대학교" isOpen={false} />

          <SelectButton
            value={selectedValue}
            placeholder="대학을 선택해주세요"
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </section>

      {/* 12. Search Bar */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">12. Search Bar</h2>
        <div className="flex flex-wrap items-center gap-4">
          <SearchBar
            placeholder="검색어 2글자 이상 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </section>

      {/* 13. Text Field */}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">13. Text Field</h2>
        <div className="flex flex-wrap items-center gap-4">
          <TextField
            placeholder="텍스트필드"
            value={textFieldValue}
            onChange={(e) => setTextFieldValue(e.target.value)}
          />
          <TextField type="price" placeholder="입금" />
          <TextField type="price" placeholder="출금" />
          <TextField placeholder="가격필드(에러)" isError={true} />
        </div>
      </section>

      {/*14. Custom Modal*/}
      <section className="space-y-4">
        <h2 className="W_Title border-b pb-2 text-black">14. CustomModal</h2>
        <p className="W_R15 text-gray-80">
          Alert는 확인 시 즉시 닫히고, Confirm은 onConfirm 결과에 따라 닫힘을 제어할 수 있습니다.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary_outline" size="regular" onClick={handleAlertModal}>
            Alert 기본
          </Button>
          <Button variant="primary_outline" size="regular" onClick={handleConfirmModal}>
            Confirm 기본
          </Button>
          <Button variant="primary_outline" size="regular" onClick={handleAsyncConfirmSuccess}>
            Confirm 비동기 성공
          </Button>
          <Button variant="primary_outline" size="regular" onClick={handleKeepOpenExample}>
            Confirm 닫힘 유지(false)
          </Button>
        </div>
      </section>
    </div>
  );
}
