import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function RolesPermissions() {
  return (
    <div className="container max-w-3xl mx-auto mb-6 p-4">
      <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">
            Roles & Permissions
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0"></CardContent>
      </Card>
    </div>
  );
}
