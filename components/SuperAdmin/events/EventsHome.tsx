"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import LocationIcon from "@/components/icons/others/LocationIcon";
import DollerIcon from "@/components/icons/others/DollerIcon";
import Link from "next/link";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { AdminEventService } from "@/service/user/user.service";
import PaginationPage from "@/components/reusable/PaginationPage";
import { AllStatus } from "./AllStatus";

interface EventItem {
  id: string;
  name: string;
  description: string;
  start_at: string;
  time: string;
  location: string;
  amount_pence?: number;
  amount: number;
  status: "next" | "upcoming" | "completed" | string;
}

interface EventsResponse {
  success: boolean;
  message: string;
  data: EventItem[];
  meta_data: {
    page: number;
    limit: number;
    total: number;
    search?: string;
  };
}

export default function EventsHome() {
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminEventService.getEvent({
        token,
        search,
        status: status === "all" ? "" : status,
        page: currentPage,
        limit: itemsPerPage,
      });

      setEvents(response?.data || null);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search, status]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const totalItems = events?.meta_data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const eventList = useMemo(() => events?.data || [], [events?.data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const getStatusLabel = (status: string) => {
    if (status === "next") return "Next";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClassName = (status: string) => {
    if (status === "completed") {
      return "text-[#18CC3F] bg-[#082420]";
    }

    if (status === "next") {
      return "text-[#07121D] bg-[#F8C546]";
    }

    return "text-[#E9201D] bg-white";
  };

  // Helper to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className=" flex flex-col md:flex-row gap-3 items-center justify-between">
        <h3 className=" text-white text-xl font-semibold">Events</h3>
        <div className=" flex flex-col md:flex-row items-center gap-2">
          <div className=" relative w-80">
            <input
              type="text"
              name="search"
              value={search}
              onChange={handleSearchChange}
              className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
              placeholder="Search events by name"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
              <SearchIcon />
            </button>
          </div>

          <AllStatus value={status} onValueChange={handleStatusChange} />
        </div>
      </div>

      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5">
        <h3 className=" text-xl text-white font-semibold">Events List</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {loading ? (
            <div className="col-span-full rounded-[12px] border border-[#3D4566] bg-[#07121d] p-10 text-center text-white">
              Loading events...
            </div>
          ) : eventList.length > 0 ? (
            eventList.map((event) => (
              <div
                key={event.id}
                className="rounded-[12px] border border-[#3D4566] p-3"
                style={{
                  background:
                    "radial-gradient(109.25% 89.55% at -41.84% -31.32%, #E9201D 0%, #07121D 100%)",
                }}
              >
                <div className=" flex items-center  gap-2">
                  <h3 className=" text-base text-white font-semibold">
                    {event.name}
                  </h3>
                  <p
                    className={`py-1 px-2.5 text-xs font-semibold rounded-full ${getStatusClassName(
                      event.status,
                    )}`}
                  >
                    {getStatusLabel(event.status)}
                  </p>
                </div>

                <div className=" my-5 space-y-1.5">
                  <div className=" flex itmes-center gap-1">
                    <CalenderIcon />
                    <p className=" text-white text-sm ">
                      {formatDate(event.start_at)} at {event.time}
                    </p>
                  </div>
                  <div className=" flex itmes-center gap-1">
                    <LocationIcon />
                    <p className=" text-white text-sm ">{event.location}</p>
                  </div>
                  <div className=" flex itmes-center gap-1">
                    <DollerIcon />
                    <p className=" text-white text-sm ">$ {event.amount}</p>
                  </div>
                </div>

                <p className=" text-xs text-[#D2D2D5] ">{event.description}</p>

                <Link
                  href={`/dashboard/events/event-details/${event.id}`}
                  className="w-full flex items-center justify-center text-white border border-[#3D4566] py-4 rounded-[12px] cursor-pointer mt-6"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-[12px] border border-[#3D4566] bg-[#07121d] p-10 text-center text-[#D2D2D5]">
              No events found
            </div>
          )}

          <Link
            href="/dashboard/events/add-event"
            type="button"
            className="rounded-2xl border border-dashed border-[#3D4566] bg-[#07121d] p-4 flex items-center justify-center gap-2 text-[#8D9CDC] hover:bg-[#0d1b2b] transition-colors min-h-40"
          >
            <PlusIcon />
            <span className="text-base font-medium">Add Event</span>
          </Link>
        </div>

        <div>
          <PaginationPage
            totalPages={totalPages}
            dataLength={eventList?.length}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>

      {/* <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5 ">
        <h3 className=" text-xl text-white font-semibold">Completed Events</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {completedEvents?.map((event) => (
            <div
              key={event.id}
              className="  border border-[#20304A] bg-[#07121d] p-3 rounded-[12px]"
            >
              <div className=" flex items-center gap-2">
                <h3 className=" text-base text-white font-semibold">
                  {event.name}
                </h3>
                <p className=" text-xs text-[#18CC3F] font-medium bg-[#082420] rounded-full py-1 px-2.5">
                  Completed
                </p>
              </div>
              <div className=" my-5 space-y-1.5">
                <div className=" flex itmes-center gap-1">
                  <CalenderIcon />
                  <p className=" text-white text-sm ">
                    {formatDate(event.start_at)} at {event.time}
                  </p>
                </div>
                <div className=" flex itmes-center gap-1">
                  <LocationIcon />
                  <p className=" text-white text-sm ">{event.location}</p>
                </div>
                <div className=" flex itmes-center gap-1">
                  <DollerIcon />
                  <p className=" text-white text-sm ">{event.amount}</p>
                </div>
              </div>

              <p className=" text-xs text-[#D2D2D5] ">{event.description}</p>

              <Link
                href={`/dashboard/events/event-details/${event.id}`}
                className="w-full flex items-center justify-center text-white border border-[#3D4566] py-4 rounded-[12px] cursor-pointer mt-6"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
