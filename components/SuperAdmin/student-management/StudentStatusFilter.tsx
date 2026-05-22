import DropDownIcon from "@/components/icons/others/DropDownIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
type StudentStatusFilterProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function StudentStatusFilter({ value, onValueChange }: StudentStatusFilterProps) {
  return (
    <Select name="status" value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48 py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-placeholder:text-white [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select Status" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980]">
        <SelectGroup>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
          <SelectItem value="BLOCKED">Blocked</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
