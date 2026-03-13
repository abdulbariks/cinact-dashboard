import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Bell, Shield, CreditCard } from "lucide-react";

export default function MobileSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden flex flex-col items-start gap-4 p-4 w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0a1929] text-white border-none rounded-xl h-11"
      >
        Menu
      </Button>

      {isOpen && (
        <ul className="flex flex-col gap-3 w-full bg-[#0a1929] p-3 rounded-xl">
          {/* Personal Info */}
          <li
            onClick={() => {
              setActiveSection("personal-info");
              setIsOpen(false);
            }}
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

          {/*  Roles & Permissions */}
          <li
            onClick={() => {
              setActiveSection("roles");
              setIsOpen(false);
            }}
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
            onClick={() => {
              setActiveSection("payment");
              setIsOpen(false);
            }}
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
            onClick={() => {
              setActiveSection("notifications");
              setIsOpen(false);
            }}
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
      )}
    </div>
  );
}
