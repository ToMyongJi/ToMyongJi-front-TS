import { Button } from '@components/button';
import Chip from '@components/chip';
import { ReceiptButton } from '@components/receipt-button';
import { useState } from 'react';

export default function ButtonTestPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="p-8 space-y-12">
      <h1 className="W_Header text-primary">버튼 컴포넌트 테스트 페이지</h1>

      {/* 1. Primary 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">1. Primary Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">작은버튼</Button>
          <Button variant="primary" size="save">저장하기</Button>
          <Button variant="primary" size="save" disabled>저장하기(비활성화)</Button>
          <Button variant="primary" size="md">중간버튼</Button>
          <Button variant="primary" size="regular">큰버튼</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
        </div>
      </section>

      {/* 2. Primary Outline 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">2. Primary Outline Variant</h2>
        <div className="flex flex-wrap gap-4 items-center p-4 rounded-lg">
          <Button variant="primary_outline" size="sm">작은버튼</Button>
          <Button variant="primary_outline" size="md">중간버튼</Button>
          <Button variant="primary_outline" size="regular">큰버튼</Button>
          <Button variant="primary_outline" size="save" disabled>Disabled</Button>
        </div>
      </section>

      {/* 3. Danger 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">3. Danger Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="danger" size="sm">작은버튼</Button>
          <Button variant="danger" size="md">중간버튼</Button>
          <Button variant="danger" size="regular">선택 목록 삭제</Button>
          <Button variant="danger" size="md" disabled>Disabled</Button>
        </div>
      </section>

      {/* 4. Gray 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">4. Gray Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="gray" size="sm">작은버튼</Button>
          <Button variant="gray" size="md">중간버튼</Button>
          <Button variant="gray" size="regular">큰버튼</Button>
          <Button variant="gray" size="md" disabled>Disabled</Button>
        </div>
      </section>

      {/* 5. Gray Outline 버튼 그룹 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">5. Gray Outline Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="gray_outline" size="sm">작은버튼</Button>
          <Button variant="gray_outline" size="md">중간버튼</Button>
          <Button variant="gray_outline" size="regular">큰버튼</Button>
          <Button variant="gray_outline" size="md" disabled>Disabled</Button>
        </div>
      </section>

      {/* 6. Full Width 테스트 */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">6. Full Width 옵션</h2>
        <div className="w-[30rem] border border-gray-20 p-4 rounded-lg flex flex-col gap-4">
          <Button variant="primary" fullWidth>Full Width Primary</Button>
          <Button variant="primary_outline" fullWidth>Full Width Primary Outline</Button>
        </div>
      </section>

      {/* 7. Receipt Button */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">7. Receipt Button</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <ReceiptButton receiptType="toss"/>
          <ReceiptButton receiptType="excel"/>
        </div>
      </section>

      {/* 8. Chip */}
      <section className="space-y-4">
        <h2 className="W_Title text-black border-b pb-2">8. Chip</h2>
        <div className="flex flex-wrap gap-4 items-center">
        <Chip 
        label="최신순" 
        isActive={isFilterOpen} 
        onClick={() => setIsFilterOpen(!isFilterOpen)} 
      />
        </div>
      </section>
    </div>
  );
}