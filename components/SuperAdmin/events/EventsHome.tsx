"use client";
import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import { eventsData } from "@/public/demoData/EventsData";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import LocationIcon from "@/components/icons/others/LocationIcon";
import DollerIcon from "@/components/icons/others/DollerIcon";
import Link from "next/link";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { AdminEventService } from "@/service/user/user.service";

const completedEvents = eventsData.filter(
  (event) => event.status === "completed",
);
const upcomingEvents = eventsData.filter(
  (event) => event.status === "upcoming",
);

interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  amount: string;
}

export default function EventsHome() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  //   console.log("search============", search);

  // Upcoming and Completed based on the date
  const { upcomingEvents, completedEvents } = useMemo(() => {
    const now = new Date();

    const upcoming = events?.filter((e) => new Date(e.date) >= now);
    const completed = events?.filter((e) => new Date(e.date) < now);

    return { upcomingEvents: upcoming, completedEvents: completed };
  }, [events]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await AdminEventService.getEvent({
          token,
          search: search,
        });

        // Assuming response.data returns an array of events
        setEvents(response?.data || []);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message || "Failed to load events",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Helper to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  //   console.log("events=========", events);

  return (
    <div>
      <div className=" flex items-center justify-between">
        <h3 className=" text-white text-xl font-semibold">Events</h3>
        <div className=" flex items-center gap-2">
          <div className=" relative w-80">
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
              placeholder="Search events by name"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
              <SearchIcon />
            </button>
          </div>

          <AllStatus />
        </div>
      </div>

      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5">
        <h3 className=" text-xl text-white font-semibold">Upcoming Events</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {upcomingEvents.map((event) => (
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
                <p className=" py-1 px-2.5 bg-white text-[#E9201D] text-xs font-semibold rounded-full">
                  {/* {event.status} */}
                  Upcoming
                </p>
              </div>

              <div className=" my-5 space-y-1.5">
                <div className=" flex itmes-center gap-1">
                  <CalenderIcon />
                  <p className=" text-white text-sm ">
                    {formatDate(event.date)} at {event.time}
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
                href={`/dashboard/events/${event.id}`}
                className="w-full flex items-center justify-center text-white border border-[#3D4566] py-4 rounded-[12px] cursor-pointer mt-6"
              >
                View Details
              </Link>
            </div>
          ))}

          <Link
            href="/dashboard/events/add-event"
            type="button"
            className="rounded-2xl border border-dashed border-[#3D4566] bg-[#07121d] p-4 flex items-center justify-center gap-2 text-[#8D9CDC] hover:bg-[#0d1b2b] transition-colors min-h-40"
          >
            <PlusIcon />
            <span className="text-base font-medium">Add Event</span>
          </Link>
        </div>
      </div>

      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5 ">
        <h3 className=" text-xl text-white font-semibold">Completed Events</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {completedEvents.map((event) => (
            <div
              key={event.id}
              className="  border border-[#20304A] bg-[#07121d] p-3 rounded-[12px]"
            >
              <div className=" flex items-center gap-2">
                <h3 className=" text-base text-white font-semibold">
                  {event.name}
                </h3>
                <p className=" text-xs text-[#18CC3F] font-medium bg-[#082420] rounded-full py-1 px-2.5">
                  {/* {event.status} */}
                  Completed
                </p>
              </div>
              <div className=" my-5 space-y-1.5">
                <div className=" flex itmes-center gap-1">
                  <CalenderIcon />
                  <p className=" text-white text-sm ">
                    {formatDate(event.date)} at {event.time}
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
                href={`/dashboard/events/${event.id}`}
                className="w-full flex items-center justify-center text-white border border-[#3D4566] py-4 rounded-[12px] cursor-pointer mt-6"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
