"use client";

import Image from "next/image";
import React from "react";
import Loader from "./Loader";
import PaginationPage from "./PaginationPage";

interface ColumnConfig {
  label: React.ReactNode;
  width: any;
  accessor: string;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: any;
  data: any[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  totalpage?: number;
  totalItems?: number;
  setItemsPerPage?: (n: number) => void;
  loading?: boolean;
  error?: string;
  border?: boolean;
  renderFooter?: (colSpan: number) => React.ReactNode;
}

export default function DynamicTable({
  columns,
  data,
  currentPage,
  itemsPerPage,
  border = true,
  onPageChange,
  loading,
  onView,
  totalpage,
  onDelete,
  noDataMessage = "No data found !.",
  totalItems,
  setItemsPerPage,
  error,
  renderFooter,
}: DynamicTableProps) {
  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div
        className={`rounded-t-md  
         `}
      >
        {/* ${border ? "border border-gray-200" : ""} */}
        <div className={` overflow-auto  `}>
          {/* ${border ? "p-2" : ""} */}
          <table
            className={`min-w-[1000px] w-full text-left bg-[#07121d] rounded-lg ${border ? "p-2" : ""}`}
          >
            <thead className=" sticky top-0 text-white rounded-2xl! overflow-hidden  p-2 rounded-tl">
              <tr className="">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ width: col.width || "auto" }}
                    className={`${index == 0 ? "rounded-tl-lg" : index === columns.length - 1 ? "rounded-tr-lg" : ""} px-4! bg-[#282e44]   py-3 text-sm text-[#8D9CDC] font-medium uppercase    `}
                  >
                    {col.label}
                  </th>
                ))}
                {(onView || onDelete) && (
                  <th>
                    <div className="px-4  rounded-2xl py-3 text-sm font-medium text-[#4a4c56]    bg-neutral-50">
                      Action
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (onView || onDelete ? 1 : 0)}
                    className="px-4 py-10 text-center text-[#4a4c56] text-sm"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : data?.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className={i !== 0 ? "border-t border-[#141B34]" : ""}
                  >
                    {/* className="border-t border-gray-100" */}
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="px-4 py-3 text-sm text-[#4a4c56]"
                      >
                        {col.formatter
                          ? col.formatter(
                              row[col.accessor],
                              row,
                              (currentPage - 1) * itemsPerPage + i,
                            )
                          : row[col.accessor]}
                      </td>
                    ))}
                    {(onView || onDelete) && (
                      <td className="px-4 py-3 flex gap-4 items-center">
                        {onView && (
                          <span
                            className="text-xs underline text-[#4a4c56]  cursor-pointer"
                            onClick={() => onView(row)}
                          >
                            View details
                          </span>
                        )}
                        {onDelete && (
                          <Image
                            onClick={() => onDelete(row.id)}
                            src="/dashboard/icon/delete.svg"
                            alt="delete"
                            width={16}
                            height={16}
                            className="cursor-pointer"
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onView || onDelete ? 1 : 0)}
                    className="px-4 py-10 text-center text-[#4a4c56] text-sm"
                  >
                    {error ? (
                      <p className="text-red-500 text-xl capitalize font-semibold">
                        {" "}
                        {error + " " + "please login again"}
                      </p>
                    ) : (
                      <p className="text-xl text-gray-500 capitalize font-semibold">
                        {noDataMessage}
                      </p>
                    )}
                  </td>
                </tr>
              )}
              {/* data rows */}
            </tbody>
            {renderFooter && (
              <tfoot>
                {renderFooter(columns.length + (onView || onDelete ? 1 : 0))}
              </tfoot>
            )}
          </table>
        </div>
      </div>
      <div>
        <PaginationPage
          totalPages={totalpage}
          dataLength={data?.length || 0}
          totalItems={totalItems}
          onPageChange={onPageChange}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
}
