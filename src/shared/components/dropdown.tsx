import {cn} from '@libs/cn';

interface DropdownProps {
  labels: string[];
  currentYear: string;
  setCurrentYear: (year: string) => void;
}

const Dropdown = ({labels, currentYear, setCurrentYear}: DropdownProps) => {
  return (
    <div className="rounded-[4px] border border-gray-70 bg-white">
      {labels.map((label, idx) => (
        <p key={idx}
           className={cn('W_M14 w-[9.6rem] p-[1rem] hover:bg-background', currentYear === label && 'bg-background')}>{label}</p>
      ))}

    </div>
  );
};

export default Dropdown;