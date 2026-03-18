import useUserStore from '@store/user-store';

const ReceiptCreate = () => {
  const {user} = useUserStore();

  return (
    <div className="w-full flex-col-center pt-[4.2rem]">
      <div className="w-[100rem]">
        <section className="flex-col gap-[1.2rem]">
          <p className="W_Header">인공지능 학생회</p>
          <div>
            <p className="W_Header"><span className="W_R14 text-gray-80">잔액</span> 800,000</p>
          </div>
        </section>
        <section></section>
        <section></section>
      </div>

    </div>
  );
};

export default ReceiptCreate;