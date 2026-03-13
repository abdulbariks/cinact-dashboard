"use client";

import { CookieHelper } from "@/helper/cookie.helper";
import {
  ChevronLeft,
  ChevronRight,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { 
  getMenuItemsByRole, 
  getMenuItemsGroupedByCategory,
  MenuItem, 
  UserRole, 
  isValidRole 
} from "@/config/menuItems";
import { parseCookies } from "nookies";
import CollapseIcon from "../icons/sidebar.tsx/CollapseIcon";
import logo from '@/public/admin-dashboard/mainLogo.png'
import Image from "next/image";
// import '@/app/'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ isOpen, onClose, onCollapseChange }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [groupedMenuItems, setGroupedMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get user role from cookies
    const cookies = parseCookies();
    const userCookie = cookies.user;
    const roleCookie = cookies.userRole;
    
    let role: UserRole = 'viewer';

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        if (isValidRole(userData.role)) {
          role = userData.role;
        }
      } catch (e) {
        if (roleCookie && isValidRole(roleCookie)) {
          role = roleCookie as UserRole;
        }
      }
    } else if (roleCookie && isValidRole(roleCookie)) {
      role = roleCookie as UserRole;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      if (roleParam && isValidRole(roleParam)) {
        role = roleParam as UserRole;
      }
    }

    setUserRole(role);
    // Get menu items grouped by category
    setGroupedMenuItems(getMenuItemsGroupedByCategory(role));
  }, [pathname]);

  const toggleCollapse = () => {
    if (isMobile) return;
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const isActive = (href: string): boolean => {
    if (href === "/" || href === "/dashboard") {
      return pathname === href;
    }
    
    if (pathname.startsWith(href)) {
      const remainingPath = pathname.slice(href.length);
      return remainingPath === '' || remainingPath.startsWith('/');
    }
    
    return false;
  };

  const handleLogout = () => {
    CookieHelper.destroy({ key: "accessToken" });
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    router.push("/");
  };

  const effectiveCollapsed = isMobile ? false : isCollapsed;

  return (
    <div className="h-full    ">
      <div
        className={`
          ${
            isOpen
              ? "z-50 h-full w-full overflow-hidden absolute top-0 left-0"
              : "h-full"
          }
          flex flex-col border-r border-[#343745]
          min-h-[calc(100vh-100px)] 
          ${effectiveCollapsed ? 'w-20' : 'w-[300px]'}
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
           p-6 overflow-y-auto    transition-all duration-300
          bg-[#0a1929] sidebar-scroll background-color
        `}
      >
        {/* Header with Logo and Toggle Button */}
        <div className="flex items-center justify-between mb-9">
          <Link
            href={"/dashboard"}
            className={`flex items-center transition-all duration-300 overflow-hidden ${
              effectiveCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            }`}
          >
            <Image src={logo} alt="logo" />
          </Link>
          
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className={`
                ${effectiveCollapsed ? 'mx-auto' : 'ml-auto'}
                w-8 h-8 
                flex items-center justify-center
              
                transition-all duration-200
                focus:outline-none
                cursor-pointer
                flex-shrink-0
              `}
              title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
          <CollapseIcon/>
            </button>
          )}

          {isMobile && isOpen && (
            <button
              onClick={onClose}
              className="ml-auto w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 text-white"
              title="Close sidebar"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Section with Categories */}
        <div className="flex-1">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              {/* Category Title - Hidden when collapsed on desktop */}
              {!effectiveCollapsed && (
                <h3 className="text-sm uppercase tracking-wider text-[#8C9196]   mb-3 px-3">
                  {category}
                </h3>
              )}
              
              {/* Category Items */}
              <div className="space-y-1">
                {items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center group gap-3 px-3 py-2.5 lg:py-3 rounded-lg 
                        transition-all duration-200 relative 
                        ${active 
                          ? "bg-[#5f6ca0] text-white   "   
                          : "text-[#5F6CA0] hover:bg-[#5F6CA0]/50 hover:text-white"
                        }
                        ${effectiveCollapsed ? 'justify-center' : ''}
                      `}
                      title={effectiveCollapsed ? item.name : ""}
                    >
                      <div className={`flex ${effectiveCollapsed ? '' : 'gap-3'} items-center`}>
                        <div className="w-[30px] h-[30px] flex justify-center items-center flex-shrink-0">
                          <Icon
                            className={`w-5 h-5 transition-all duration-200 ${
                              active ? 'text-blackColor' : 'text-gray-500 group-hover:text-gray-700'
                            }`}
                          isActive={active}
                             />
                        </div>
                        
                        {/* Show text on mobile always, on desktop only when not collapsed */}
                        {(isMobile || !effectiveCollapsed) && (
                          <span className="text-base font-medium whitespace-nowrap">
                            {item.name}
                          </span>
                        )}
                      </div>

                    
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Log out section */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-3 
              w-full rounded-lg 
              transition-all duration-200
              ${effectiveCollapsed ? 'justify-center' : ''}
              text-gray-700 hover:bg-red-50 hover:text-red-600
              group
            `}
            title={effectiveCollapsed ? "Log Out Account" : ""}
            type="button"
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center flex-shrink-0">
              <LogOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            
            {(isMobile || !effectiveCollapsed) && (
              <span className="text-sm font-medium whitespace-nowrap">
                Log Out Account
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;