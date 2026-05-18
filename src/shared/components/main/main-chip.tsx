interface MainChipProps {
  label: string;
}

const MainChip = ({label}: MainChipProps) => {
  return (
    <div className="w-fit rounded-[3rem] border border-primary bg-white px-[2.2rem] py-[1rem]">
      <p className="W_B15 text-primary-deep">{label}</p>
    </div>
  );
};

export default MainChip;