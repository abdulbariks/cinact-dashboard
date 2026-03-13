import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MobileSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden flex flex-col items-start gap-4 p-4 w-full ">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground w-full bg-[#0a1929] p-4 rounded-2xl"
      >
        Menu
      </Button>
      {isOpen && (
        <ul className="flex flex-col gap-4 mt-4">
          <li
            className={cn(
              "py-3 px-4 rounded-lg cursor-pointer text-sm font-semibold",
              activeSection === "account"
                ? "bg-gray-300 text-black"
                : "text-muted-foreground hover:bg-muted/30",
            )}
            onClick={() => setActiveSection("personal-info")}
          >
            Personal Info
          </li>
          <li
            className={cn(
              "py-3 px-4 rounded-lg cursor-pointer text-sm font-semibold",
              activeSection === "business"
                ? "bg-gray-300 text-black"
                : "text-muted-foreground hover:bg-muted/30",
            )}
            onClick={() => setActiveSection("business")}
          >
            Business
          </li>
          {/* <li
            className={cn(
              "py-3 px-4 rounded-lg cursor-pointer text-sm font-semibold",
              activeSection === "notifications"
                ? "bg-gray-300 text-black"
                : "text-muted-foreground hover:bg-muted/30",
            )}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </li> */}
          <li
            className={cn(
              "py-3 px-4 rounded-lg cursor-pointer text-sm font-semibold",
              activeSection === "language"
                ? "bg-gray-300 text-black"
                : "text-muted-foreground hover:bg-muted/30",
            )}
            onClick={() => setActiveSection("language")}
          >
            Language
          </li>
          <li
            className={cn(
              "py-3 px-4 rounded-lg cursor-pointer text-sm font-semibold",
              activeSection === "support"
                ? "bg-gray-300 text-black"
                : "text-muted-foreground hover:bg-muted/30",
            )}
            onClick={() => setActiveSection("support")}
          >
            Support
          </li>
        </ul>
      )}
    </div>
  );
}
