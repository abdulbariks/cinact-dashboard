"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DropDownIcon from "../../icons/others/DropDownIcon"

export default function CommunityStatus() {
  return (
    <Select name="communityStatus">
      <SelectTrigger className="w-48 py-5 cursor-pointer border-none text-white bg-[#505B86] hover:bg-[#5f6a96] data-[state=open]:bg-[#6c78a9] data-[placeholder]:text-white [&>svg]:hidden">
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="All Type" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#0a1929] text-[#777980] [&_[data-slot=select-item]]:text-[#777980] [&_[data-slot=select-item][data-highlighted]]:bg-[#5f6ca0] [&_[data-slot=select-item][data-highlighted]]:text-white [&_[data-slot=select-item][data-state=checked]]:text-white">
        <SelectGroup>
          <SelectItem value="all-type">All Type</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="request">Request</SelectItem>
          <SelectItem value="flag">Flag</SelectItem>
          <SelectItem value="announcement">Announcement</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
