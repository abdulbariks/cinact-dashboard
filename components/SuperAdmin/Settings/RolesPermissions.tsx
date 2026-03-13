import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function RolesPermissions() {
  const [selected, setSelected] = React.useState("Choose Type");
  return (
    <div className="container max-w-3xl mx-auto mb-6 p-4">
      <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">System Users</CardTitle>
          <hr className="border-[#243b55] mt-3" />
        </CardHeader>

        <CardContent className="px-0">
          <div className=" flex items-center justify-between">
            <div className=" flex items-center gap-2">
              <Image
                src="/admin-dashboard/avatar-1.png"
                alt="avatar"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className=" text-white text-base font-medium mb-1">
                  Sophie Lambert
                </h3>
                <p className=" text-sm text-[#D2D2D5] font-medium">
                  Last login: 2 hours ago
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 rounded-lg w-42 text-left bg-[#3D456680]/50">
                  {selected}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <DropdownMenuItem onClick={() => setSelected("Full Access")}>
                    Full Access
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelected("Course only")}>
                    Course only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelected("Finance only")}>
                    Finance only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="rounded-lg bg-[#3D456680]/50 p-2">
                <User size={18} className="text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
        <hr className="border-[#243b55] mt-3" />
        <CardFooter className="flex justify-end pt-4">
          {/* Save Button */}
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white h-10 rounded-xl"
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
