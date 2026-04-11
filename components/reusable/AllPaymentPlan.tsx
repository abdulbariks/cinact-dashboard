import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropDownIcon from "../icons/others/DropDownIcon";

type Props = {
  paymentPlan: string;
  setPaymentPlan: (value: string) => void;
};

export function AllPaymentPlan({ paymentPlan, setPaymentPlan }: Props) {
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
          {paymentPlan === "all"
            ? "All Payment Plan"
            : paymentPlan === "one-time"
              ? "One-Time"
              : "Monthly Installment"}{" "}
          <DropDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setPaymentPlan("all")}>
          All Payment Plan
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setPaymentPlan("one-time")}>
          One-Time
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setPaymentPlan("monthly")}>
          Monthly Installment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
