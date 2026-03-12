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
    <div className="flex h-full min-h-screen flex-col">
      <HeaderGnb />
      <HeaderLnb onClickSearch={handleClickSearch} setSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1">
        {isSidebarOpen && <Sidebar />}
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;