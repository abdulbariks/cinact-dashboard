"use client";

import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";

// Dynamic content based on active section
function getActiveSectionContent(activeSection: string) {
  switch (activeSection) {
    case "roles":
      return <div>{/* <RolesPermissions /> */}</div>;
    case "payment":
      return <div>{/* <PaymentSetting /> */}</div>;
    case "notifications":
      return <div>{/* <NotificationSettings /> */}</div>;
    case "personal-info":
    default:
    //   return <PersonalInfo />;
  }
}

export default function AdminSetting() {
  const [activeSection, setActiveSection] = useState("personal-info");

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row">
        <MobileSidebar
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="w-full">{getActiveSectionContent(activeSection)}</div>
      </div>
    </div>
  );
}
