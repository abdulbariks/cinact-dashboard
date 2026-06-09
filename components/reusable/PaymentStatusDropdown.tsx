import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropDownIcon from "../icons/others/DropDownIcon";

type Props = {
  status: string;
  setStatus: (value: string) => void;
};

export function PaymentStatusDropdown({ status, setStatus }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="bg-[#505B86] border-none text-white text-sm font-medium cursor-pointer hover:bg-[#505B86]/90 hover:text-white/90 py-5"
      >
        <Button
          variant="outline"
          className="flex items-center gap-5 bg-[#505B86] hover:bg-[#505B86]/90"
        >
          {status === "SUCCESS"
            ? "Success"
            : status === "FAILED"
            ? "Failed"
            : status === "PENDING"
            ? "Pending"
            : "All Status"} <DropDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setStatus("all")}>
          All Status
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setStatus("SUCCESS")}>
          Success
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setStatus("FAILED")}>
          Failed
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setStatus("PENDING")}>
          Pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}