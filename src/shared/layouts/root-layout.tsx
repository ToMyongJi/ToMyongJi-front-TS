import Footer from '@layouts/footer';
import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderLnb from './header-lnb';

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClickSearch = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <HeaderGnb />
      <HeaderLnb onClickSearch={handleClickSearch} setSidebarOpen={setIsSidebarOpen} />
      <div className="flex min-h-0 flex-1">
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
