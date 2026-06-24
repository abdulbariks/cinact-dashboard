"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DropDownIcon from "../../icons/others/DropDownIcon";

type CommunityStatusProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CommunityStatus({
  value,
  onChange,
}: CommunityStatusProps) {
  return (
    <Select name="communityStatus" value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-48 py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-[placeholder]:text-white [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select Status" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980] [&_[data-slot=select-item]]:text-[#777980] [&_[data-slot=select-item][data-highlighted]]:bg-[#5f6ca0] [&_[data-slot=select-item][data-highlighted]]:text-white [&_[data-slot=select-item][data-state=checked]]:text-white">
        <SelectGroup>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="REQUEST">Request</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
          <SelectItem value="FLAGGED">Flagged</SelectItem>
          <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
