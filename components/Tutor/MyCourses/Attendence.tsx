import { MyCourseClassAttendenceColumns } from "@/components/columns/MyCourseClassAttendenceColumns";
import DynamicTable from "@/components/reusable/DynamicTable";
import attendenceListData from "@/public/demoData/AttendenceListData";
import React from "react";

export default function Attendence() {
  return (
    <div>
      <h3 className="text-2xl text-white my-5">All Attendence</h3>
      <DynamicTable
        columns={MyCourseClassAttendenceColumns}
        data={attendenceListData}
        // currentPage={currentPage}
        // itemsPerPage={itemsPerPage}
        // totalpage={totalPages}
        // totalItems={totalItems}
        // onPageChange={setCurrentPage}
        // setItemsPerPage={setItemsPerPage}
        noDataMessage="No attendance found"
        loading={false}
      />
    </div>
  );
}
