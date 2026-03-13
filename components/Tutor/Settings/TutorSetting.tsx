"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import PersonalInfo from "./PersonalInfo";

// Dynamic content based on active section
function getActiveSectionContent(activeSection: string) {
  switch (activeSection) {
    case "business":
      return <div>{/* <BusinessSetting /> */}</div>;
    // case "notifications":
    //   return (
    //     <div>
    //       <NotificationSettings />
    //     </div>
    //   );
    case "language":
      return <div>{/* <LanguageSettings /> */}</div>;
    case "support":
      return <div>{/* <SupportSettings /> */}</div>;
    case "personal-info":
    default:
      return <PersonalInfo />;
  }
}

export default function TutorSetting() {
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
