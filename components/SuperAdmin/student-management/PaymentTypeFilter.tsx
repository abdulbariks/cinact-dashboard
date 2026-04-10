import DropDownIcon from "@/components/icons/others/DropDownIcon"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
type PaymentTypeFilterProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function PaymentTypeFilter({ value, onValueChange }: PaymentTypeFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48 py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-placeholder:text-white [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select Payment Type" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980]">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="all">All Payment Status</SelectItem>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
       
      
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}