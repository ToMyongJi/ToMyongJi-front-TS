import Landing1 from '@assets/icons/landing-1.png';
import DescriptionItem from '@components/main/description-item';
import MainChip from '@components/main/main-chip';
import { minTailwindBreakpointForWidth, useElementSize } from '@hooks/use-element-size';
import { cn } from '@libs/cn';

const MainPage = () => {
  const gradient = 'bg-gradient-to-b from-white to-[#DFE8FF]';
  const { ref, width } = useElementSize<HTMLDivElement>();
  const bp = minTailwindBreakpointForWidth(width);
  const isBelowMd = bp === 'none'  || bp === "mr" || bp === 'sm';
  const isBelowXl = bp !== 'xl' && bp !== '2xl';

  return (
    <div
      ref={ref}
      className={cn('flex-col-center gap-[17.5rem]', isBelowXl ? 'px-[3.5rem]' : 'px-0', gradient)}
    >
      <section className="md:mt-[8.2rem]">
        <div
          className={cn('flex gap-[8rem]', isBelowMd ? 'flex-col' : 'flex-row', bp)}
        >
          <div className={cn('mt-[8rem] flex-col gap-[3.5rem] md:mt-[9.9rem]')}>
            <p className={cn('L_Title text-[3.2rem]', bp === 'md' && "text-[3.5rem]" , bp === 'lg' && "text-[4rem]", bp === 'xl' && 'text-[5rem]' )}>
              우리 학과
              <br />
              학생회비는
              <br />
              투명지 🫧
            </p>
            <div className="flex-col gap-[2rem]">
              <MainChip label={'투명한 회비 장부 공개'} />
              <MainChip label={'간편한 회비 장부 작성'} />
            </div>
          </div>
          <img src={Landing1} alt="랜딩 이미지" className={cn( bp === 'md' && "w-180", bp === 'lg' && 'w-245' , bp === 'xl' && 'w-270' )} />
        </div>
      </section>

      <section className="mb-[10rem] flex-col gap-[5.5rem] md:mb-[21.7rem]">
        <div className="w-full flex-row-center">
          <div className="max-w-[51.4rem]">
            <p className="W_Title text-wrap text-center text-black">
              학생회의 장부 작성 부담을 줄이고 장부를 투명하게 운영할 수 있는 투명지 서비스를 소개
              합니다!
            </p>
          </div>
        </div>

        <div className={cn('flex gap-[4rem] rounded-[1.8rem] bg-background px-[3rem] py-[7rem] md:px-[7.2rem] xl:gap-[11.9rem]', isBelowMd ? 'flex-col' : 'flex-row')}>
          <div className="w-full flex-col gap-[3rem]">
            <p className="W_Title text-center text-black">
              <span className="bg-gray-20 p-[0.2rem]">학생회</span>에게 투명지는 어떤 서비스인가요?
            </p>
            <div className="flex-col gap-[1.2rem]">
              <DescriptionItem
                description={'간단한 입력만으로 학생회비 장부를 작성하고 수정할 수 있어요'}
              />
              <DescriptionItem
                description={'엑셀 장부나 토스뱅크 내역을 기반으로 쉽게 시작할 수 있어요'}
              />
              <DescriptionItem
                description={'투명하게 인증된 장부로 학생들에게 신뢰감을 줄 수 있어요'}
              />
              <DescriptionItem
                description={'부원 관리 기능을 통해 여러 부원이 장부를 동시에 관리할 수 있어요'}
              />
            </div>
          </div>
          <div className="w-full flex-col gap-[3rem]">
            <p className="W_Title text-center text-black">
              <span className="bg-gray-20 p-[0.2rem]">학생</span>에게 투명지는 어떤 서비스인가요?
            </p>
            <div className="flex-col gap-[1.2rem]">
              <DescriptionItem description={'모든 학생회의 장부를 한곳에서 확인할 수 있어요'} />
              <DescriptionItem
                description={'각 인스타그램 피드에 흩어진 월별 장부를 모아서 볼 수 있어요'}
              />
              <DescriptionItem description={'웹, 앱 어디서든 간편하게 장부를 조회할 수 있어요'} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
