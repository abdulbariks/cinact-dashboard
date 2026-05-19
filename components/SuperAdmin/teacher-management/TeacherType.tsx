import DropDownIcon from "@/components/icons/others/DropDownIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeacherTypeProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function TeacherType({ value, onValueChange }: TeacherTypeProps) {
  return (
    <Select name="type" value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full cursor-pointer border-none bg-[#505B86] py-5 text-white hover:bg-[#5f6a96] data-[placeholder]:text-white data-[state=open]:bg-[#6c78a9] sm:w-48 [&>svg]:hidden">
        <div className="flex w-full items-center justify-between">
          <SelectValue placeholder="Select Type" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980] [&_[data-slot=select-item]]:text-[#777980] [&_[data-slot=select-item][data-highlighted]]:bg-[#5f6ca0] [&_[data-slot=select-item][data-highlighted]]:text-white [&_[data-slot=select-item][data-state=checked]]:text-white">
        <SelectGroup>
          <SelectItem value="all">All Type</SelectItem>
          <SelectItem value="STUDENT">Student</SelectItem>
          <SelectItem value="TEACHER">Teacher</SelectItem>
          <SelectItem value="SU_ADMIN">Super Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
