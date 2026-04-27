import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationPageProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  dataLength: number;
  currentPage: number;
  setItemsPerPage?: (count: number) => void;
  totalItems?: number;
  itemsPerPage: number;
}

function PaginationPage({
  totalPages,
  onPageChange,
  dataLength,
  currentPage,
  setItemsPerPage,
  totalItems,
  itemsPerPage,
}: PaginationPageProps) {
  const getPagination = () => {
    let pages: (number | string)[] = [];
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        // Near start: 1 2 3 4 ... last
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... last-3 last-2 last-1 last
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        // Middle: 1 current-1 current current+1 ... last (single ellipsis at end)
        pages = [
          1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };
  const effectiveTotalItems =
    typeof totalItems === "number" ? totalItems : dataLength;
  const startIndex = dataLength > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, effectiveTotalItems);

  const handleItemsPerPageChange = (value: number) => {
    if (setItemsPerPage) setItemsPerPage(value);
    // Reset to page 1 on page-size change
    onPageChange(1);
  };

  const originalArray = [1, 5, 10, 25, 50, 100];
  const uniqueArray = [...new Set(originalArray)];
  return (
    <div className="mb-0 text-white">
      <div className=" flex justify-end ">
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center w-full justify-between mt-6 gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 cursor-pointer py-1.5 flex justify-center text-white items-center border border-border rounded disabled:opacity-40 disabled:text-borderColor disabled:border-borderColor"
              >
                <MdArrowBackIosNew size={15} />
              </button>
              {getPagination().map((page, i) => (
                <button
                  key={i}
                  onClick={() => typeof page === "number" && onPageChange(page)}
                  disabled={page === "..."}
                  className={`px-2 py-0.75 rounded cursor-pointer h-full text-sm text-white ${
                    page === currentPage
                      ? "text-white bg-grayColor1 border border-border h-full  font-medium"
                      : "text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer px-2 py-1.5 flex justify-center items-center border border-border text-white rounded disabled:opacity-40 disabled:text-borderColor disabled:border-borderColor"
              >
                <MdArrowForwardIos size={15} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-white">
                Showing {startIndex} to {endIndex} of {effectiveTotalItems}{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-white">Show</label>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) =>
                    handleItemsPerPageChange(Number(value))
                  }
                >
                  <SelectTrigger className="w-15.5 px-1.5!">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueArray.map((opt) => (
                      <SelectItem key={opt} value={String(opt)}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginationPage;
