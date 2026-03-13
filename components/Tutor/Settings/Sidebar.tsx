import { cn } from "@/lib/utils";
import { User, Shield, CreditCard, Bell } from "lucide-react";

export default function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  return (
    <div className="w-full sm:w-92 sm:block hidden">
      <div className="bg-[#0a1929] rounded-2xl text-white p-2">
        <ul className="flex flex-col gap-3 ">
          {/* Personal Info */}
          <li
            onClick={() => setActiveSection("personal-info")}
            className={cn(
              "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition",
              activeSection === "personal-info"
                ? "bg-[#5f6ea8] text-white"
                : "text-[#7c8db5] hover:bg-[#13263f]",
            )}
          >
            <User size={18} />
            Personal Info
          </li>

          {/* Roles & Permissions */}
          <li
            onClick={() => setActiveSection("roles")}
            className={cn(
              "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition",
              activeSection === "roles"
                ? "bg-[#5f6ea8] text-white"
                : "text-[#7c8db5] hover:bg-[#13263f]",
            )}
          >
            <Shield size={18} />
            Roles & Permissions
          </li>

          {/* Payment Settings */}
          <li
            onClick={() => setActiveSection("payment")}
            className={cn(
              "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition",
              activeSection === "payment"
                ? "bg-[#5f6ea8] text-white"
                : "text-[#7c8db5] hover:bg-[#13263f]",
            )}
          >
            <CreditCard size={18} />
            Payment Settings
          </li>

          {/* Notifications */}
          <li
            onClick={() => setActiveSection("notifications")}
            className={cn(
              "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition",
              activeSection === "notifications"
                ? "bg-[#5f6ea8] text-white"
                : "text-[#7c8db5] hover:bg-[#13263f]",
            )}
          >
            <Bell size={18} />
            Notifications
          </li>
        </ul>
      </div>
    </div>
  );
}
