"use client";

import Header from "@/components/reusable/Header";
import Sidebar from "@/components/reusable/Sidebar";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

function AdminMenu({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <div className="relative flex h-full">
        <div
          className={`
            fixed top-0 left-0 h-screen z-30 bg-bgColor border-r border-borderColor
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            xl:relative xl:translate-x-0
            ${isSidebarCollapsed ? "w-20" : "w-[300px]"}
          `}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            onCollapseChange={handleCollapseChange}
          />
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs xl:hidden z-20"
            onClick={closeSidebar}
          />
        )}

        <div className="flex-1 w-full h-full flex flex-col min-h-0">
          <div className="w-full sticky top-0 left-0 z-10">
            <Header sidebarOpen={sidebarOpen} onMenuClick={toggleSidebar} />
          </div>

          <main className="flex-1 overflow-y-auto overflow-x-hidden text-headerColor p-6 bg-[#070707]">
            {children}
            <ToastContainer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;
