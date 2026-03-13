"use client";

import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";
import ProfileAccount from "./ProfileAccount";
import GeneralSettings from "./GeneralSettings";
import NotificationSettings from "./NotificationSettings";

// Dynamic content based on active section
function getActiveSectionContent(activeSection: string) {
  switch (activeSection) {
    case "profile-account":
      return (
        <div>
          <ProfileAccount />
        </div>
      );
    case "roles":
      return <div>{/* <RolesPermissions /> */}</div>;
    case "payment":
      return <div>{/* <PaymentSetting /> */}</div>;
    case "notifications":
      return <NotificationSettings />;
    case "general-settings":
    default:
      return <GeneralSettings />;
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
