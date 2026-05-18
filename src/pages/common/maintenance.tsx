import bang from '@assets/icons/bang.svg';

interface MaintenanceProps {
  maintenance: {
    date: string;
    description: string;
  };
}

const Maintenance = ({ maintenance }: MaintenanceProps) => {
  return (
    <div className="h-full w-full flex-col-center items-center justify-center px-[1.5rem]">
      <div className="flex w-full max-w-[42rem] flex-col-center gap-[3rem]">
        <img src={bang} alt="bang" />
        <div className="flex flex-col-center gap-[1rem]">
          <p className="W_Title text-center text-black">서버 점검 안내</p>
          <p className="W_B17 text-gray-80">더 나은 서비스로 곧 돌아오겠습니다.</p>
        </div>
        <div className="flex w-full flex-col gap-[1.6rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
          <div className="W_B15 flex flex-col">
            <p className="pb-[0.4rem] text-black">점검 일시</p>
            <p className="W_M15 text-gray-80">
              {maintenance.date ?? '0월 00일 00:00 ~ 0월 00일 00:00'}
            </p>
          </div>
          <div className="W_B15 flex flex-col">
            <p className="pb-[0.4rem] text-black">점검 내용</p>
            <p className="W_M15 text-gray-80">
              {maintenance.description ?? '서버 성능 개선 및 안정화'}
            </p>
          </div>
          <p className="W_B15 text-error">* 점검 중에는 서비스 이용이 일시 중단됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
