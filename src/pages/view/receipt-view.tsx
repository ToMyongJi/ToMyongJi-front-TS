import InfoIcon from "@assets/icons/info.svg?react";
import TableHeader from '@components/table/table-header';
const HeaderData = [
  { labels: "날짜", width: "15.8%" },
  { labels: "내용", width: "51%" },
  { labels: "입금", width: "16.6%" },
  { labels: "출금", width: "16.6%" },
];

const ReceiptView = () => {
  return (
    <div className="pt-[4.2rem] px-[9.3rem]">
      <section className="flex items-center gap-[0.8rem]">
        <p className="W_Header text-black">인공지능소프트웨어융합대학 학생회</p>
        <InfoIcon className="text-gray-20"/>
      </section>
      <section>

      </section>
      <section className="border border-gray-20 rounded-[1rem] px-[10rem]">
        <div className="hidden md:block">
          <table className="w-full table-fixed">
            <TableHeader headerData={HeaderData} />

            <tbody>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReceiptView;