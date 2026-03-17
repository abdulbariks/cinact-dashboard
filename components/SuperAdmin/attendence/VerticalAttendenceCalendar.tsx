"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DropDownIcon from "@/components/icons/others/DropDownIcon";

type MonthOption = {
  value: number;
  label: string;
};

const monthOptions: MonthOption[] = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

export default function VerticalAttendenceCalendar() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [displayMonth, setDisplayMonth] = useState<Date>(today);
  const listRef = useRef<HTMLDivElement | null>(null);

  const monthDateRows = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const weekDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
      const dateLabel = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      }).format(date);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        date,
        weekDay,
        dateLabel,
      };
    });
  }, [displayMonth]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const selectedRow = container.querySelector<HTMLButtonElement>(`button[data-date-key=\"${selectedKey}\"]`);

    if (selectedRow) {
      selectedRow.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [selectedDate, displayMonth]);

  const handleYearChange = (value: string) => {
    const nextYear = Number(value);
    setDisplayMonth(new Date(nextYear, displayMonth.getMonth(), 1));
  };

  const handleMonthChange = (value: string) => {
    const nextMonth = Number(value);
    setDisplayMonth(new Date(displayMonth.getFullYear(), nextMonth, 1));
  };

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return (
    <div className="bg-[#07121d]   rounded-2xl w-full max-w-80 max-h-[calc(100vh-220px)] flex flex-col overflow-hidden">
      <div className="h-10 px-3 bg-[#2A314C] flex items-center justify-between py-4">
        <Select value={String(displayMonth.getFullYear())} onValueChange={handleYearChange}>
          <SelectTrigger icon={<span />} className="h-8 w-auto gap-1 border-none bg-transparent px-0 text-[#A9B4DE] text-base font-medium shadow-none hover:bg-transparent focus:ring-0 cursor-pointer">
            <span className="inline-flex items-center gap-2">
              <SelectValue placeholder="Year" />
              <DropDownIcon   />
            </span>
          </SelectTrigger>
          <SelectContent className="bg-[#0a1726] border-[#3D4566] text-white min-w-24">
            {yearOptions.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(displayMonth.getMonth())} onValueChange={handleMonthChange}>
          <SelectTrigger icon={<span />} className="h-8 w-auto gap-1 border-none bg-transparent px-0 text-[#A9B4DE] text-base font-medium shadow-none hover:bg-transparent focus:ring-0 cursor-pointer">
            <span className="inline-flex items-center gap-2">
              <SelectValue placeholder="Month" />
              <DropDownIcon  />
            </span>
          </SelectTrigger>
          <SelectContent className="bg-[#0a1726] border-[#3D4566] text-white min-w-36">
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={String(month.value)}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto px-2 py-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2F4A70] [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {monthDateRows.map((item) => {
          const isSelected = selectedDate.toDateString() === item.date.toDateString();
          const isToday = item.key === todayKey;

          return (
            <button
              key={item.key}
              data-date-key={item.key}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "bg-[#8D9CDC] border-[#8D9CDC]"
                  : "  border-[#183459] hover:bg-[#0A1D33]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`leading-none ${isSelected ? "text-xl font-semibold text-[#051425]" : "text-base  text-[#D2D2D5] py-4"}`}>
                    {item.dateLabel}
                  </p>
                  {isSelected && (
                    <p className="mt-1 text-base font-medium leading-none uppercase tracking-wide text-[#030C15]">
                      {item.weekDay}
                    </p>
                  )}
                </div>
                {isToday && (
                  <span className={`mt-1 rounded-full px-3 py-1 text-xs font-medium ${isSelected ? "bg-[#051425] text-white" : "bg-[#0C182C] text-[#E6E7E8]"}`}>
                    Today
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
