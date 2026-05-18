import CheckRoundIcon from "@assets/icons/check-round.svg?react";

interface DescriptionItemProps {
  description: string;
}

const DescriptionItem = ({description}: DescriptionItemProps) => {
  return (
    <div className="flex gap-[1.6rem] rounded-[1rem] bg-white p-[2rem]">
      <CheckRoundIcon className="text-primary"/>
      <p className="W_B15 text-black">{description}</p>
    </div>
  );
};

export default DescriptionItem;