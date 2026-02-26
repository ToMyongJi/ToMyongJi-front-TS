import { useState } from 'react';

import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import Footer from '@layouts/footer';

import HeaderLnb from './header-lnb';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClickSearch = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen h-full flex flex-col">
      <HeaderGnb />
      <HeaderLnb onClickSearch={handleClickSearch} />
      <div className="flex flex-1 min-h-0">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;