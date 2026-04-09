interface BottomSheetControllerProps{
  onClick?: () => void;
}

const BottomSheetController = ({onClick}: BottomSheetControllerProps) => {
  return (
    <div className="w-full flex-col-center py-[2rem]">
      <button type="button" onClick={onClick} className="h-[0.5rem] w-[3rem] cursor-pointer rounded-full bg-gray-10" />
    </div>
  );
};

export default BottomSheetController;