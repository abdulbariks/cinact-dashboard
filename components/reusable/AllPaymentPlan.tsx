import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropDownIcon from "../icons/others/DropDownIcon";

export function AllPaymentPlan() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className=" bg-[#505B86] border-none text-white text-sm font-medium cursor-pointer hover:bg-[#505B86]/90 hover:text-white/90 py-5"
      >
        <Button
          variant="outline"
          className=" flex items-center gap-5 bg-[#505B86] hover:bg-[#505B86]/90"
        >
          All Payment Plan <DropDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>All Payment Plan</DropdownMenuItem>
        <DropdownMenuItem>One-Time</DropdownMenuItem>
        <DropdownMenuItem>Monthly Installment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
