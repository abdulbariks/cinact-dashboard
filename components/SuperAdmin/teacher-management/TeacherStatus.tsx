import DropDownIcon from "@/components/icons/others/DropDownIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
type TeacherStatusProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function TeacherStatus({ value, onValueChange }: TeacherStatusProps) {
  return (
    <Select name="status" value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-[placeholder]:text-white sm:w-48 [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select Status" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980] [&_[data-slot=select-item]]:text-[#777980] [&_[data-slot=select-item][data-highlighted]]:bg-[#5f6ca0] [&_[data-slot=select-item][data-highlighted]]:text-white [&_[data-slot=select-item][data-state=checked]]:text-white">
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
