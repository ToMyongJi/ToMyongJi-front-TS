import AppStoreIcon from "@assets/icons/appstore.svg?react";
import InstagramIcon from "@assets/icons/instagram.svg?react";

const Footer = () => {
  const AppStoreUrl = "https://apps.apple.com/kr/app/%ED%88%AC%EB%AA%85%EC%A7%80/id6743519294";
  const InstagramUrl = "https://www.instagram.com/tomyongji?igsh=MTY5enQxaDBwNTE2dQ==";
  return (
    <div className="flex items-center justify-between px-[4rem] py-[3.9rem] bg-background">
      <section>
        <p className="W_M14 text-gray-90">개인정보처리방침</p>
        <p className="W_M14 text-gray-80">Copyright ⓒ ToMyongJi. All Rights Reserved</p>
        <p className="W_M14 text-gray-80">E-mail: tomyongji2024@gmail.com</p>
      </section>
      <section className="flex items-center gap-[2rem]">
        <AppStoreIcon className='text-primary cursor-pointer' onClick={() => window.open(AppStoreUrl)}/>
        <InstagramIcon className='text-primary cursor-pointer' onClick={() => window.open(InstagramUrl)}/>
      </section>
    </div>
  );
};

export default Footer;