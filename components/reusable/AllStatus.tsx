import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import DropDownIcon from "../icons/others/DropDownIcon";

export function AllStatus() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className=" border-none text-white text-sm font-medium cursor-pointer  hover:text-white/90 py-5"
      >
        <Button
          variant="outline"
          className=" flex items-center gap-5 bg-[#505B86] hover:bg-[#505B86]/90"
        >
          All Status <DropDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>All Students</DropdownMenuItem>
        <DropdownMenuItem>Active</DropdownMenuItem>
        <DropdownMenuItem>Alumni</DropdownMenuItem>
        <DropdownMenuItem>Pending</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
