import { cn } from '@libs/cn';

export type FindAccountTab = 'findId' | 'findPassword';

type FindAccountTabsProps = {
  active: FindAccountTab;
  onChange: (tab: FindAccountTab) => void;
};

const TABS: { id: FindAccountTab; label: string }[] = [
  { id: 'findId', label: '아이디 찾기' },
  { id: 'findPassword', label: '비밀번호 찾기' },
];

const FindAccountTabs = ({ active, onChange }: FindAccountTabsProps) => {
  return (
    <div className="flex gap-[3rem] border-gray-20 border-b">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'w-full cursor-pointer py-[1.6rem]',
              isActive && 'border-primary border-b-2',
            )}
          >
            <p className={cn('W_B17 text-gray-90', isActive && 'text-primary')}>{tab.label}</p>
          </button>
        );
      })}
    </div>
  );
};

export default FindAccountTabs;
