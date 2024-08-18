import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav'; // Add a bottom nav component
import LeftSidebar from './LeftSidebar'; // Import the LeftSidebar component

const MainLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="hidden  lg:block w-60 bg-gray-500 ">
        <LeftSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 bg-white overflow-auto">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div className="block lg:hidden fixed bottom-0 w-full bg-white border-t">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
