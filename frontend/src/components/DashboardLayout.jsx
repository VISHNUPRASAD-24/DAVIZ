import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa] font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 lg:p-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
