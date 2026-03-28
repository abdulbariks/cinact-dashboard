import DropDownIcon from "@/components/icons/others/DropDownIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MonthStatus() {
  return (
    <Select name="monthStatus">
      <SelectTrigger className="w-48 py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-[placeholder]:text-white [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select type" className="text-white data-placeholder:text-white" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980]">
        <SelectGroup>
          <SelectItem className="text-[#777980] data-highlighted:bg-[#5f6ca0] data-highlighted:text-white data-[state=checked]:text-white" value="all-type">
            All type
          </SelectItem>
          <SelectItem className="text-[#777980] data-highlighted:bg-[#5f6ca0] data-highlighted:text-white data-[state=checked]:text-white" value="this-month">
            This month
          </SelectItem>
          <SelectItem className="text-[#777980] data-highlighted:bg-[#5f6ca0] data-highlighted:text-white data-[state=checked]:text-white" value="last-year">
            Last year
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
