import FindAccountTabs, { type FindAccountTab } from '@components/auth/find-account-tabs';
import FindIdForm from '@components/auth/find-id-form';
import FindPasswordForm from '@components/auth/find-password-form';
import { useState } from 'react';

const FindAccount = () => {
  const [tab, setTab] = useState<FindAccountTab>('findId');

  return (
    <div className="flex items-center justify-center">
      <div className="my-[6rem] flex w-full max-w-[35.2rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-left text-black">아이디·비밀번호 찾기</p>
        <FindAccountTabs active={tab} onChange={setTab} />
        {tab === 'findId' ? <FindIdForm /> : <FindPasswordForm />}
      </div>
    </div>
  );
};

export default FindAccount;
