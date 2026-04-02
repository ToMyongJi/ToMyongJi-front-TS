import tomyongjiCheck from '@assets/icons/tomyongji-check.svg';

export const TransferStep4 = () => {
  return (
    <div className="h-screen w-full max-w-[47rem]">
      <div className="mt-[10rem] flex flex-col items-center justify-center gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
        <img src={tomyongjiCheck} alt="tomyongji-check" className="h-[6.6rem] w-[6.6rem]" />
        <div className="flex flex-col items-center justify-center gap-[1rem]">
          <p className="W_Title text-black">학생회 이전 완료</p>
          <p className="W_R15 text-center text-gray-90">
            임기 동안 고생많으셨습니다. <br />
            이제 차기 학생회에서 장부와 구성원 정보를 이어서 관리할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
