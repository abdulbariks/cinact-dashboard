"use client";

import RedCalender from "@/components/icons/others/RedCalender";
import RedDoller from "@/components/icons/others/RedDoller";
import RedLocation from "@/components/icons/others/RedLocation";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { DatePickerButton } from "@/components/reusable/DatePickerButton";
import DynamicTable from "@/components/reusable/DynamicTable";
import { eventMembersColumns as eventsColumn } from "@/components/columns/EventMembersColumn";
import { eventMembersData as eventsData } from "@/public/demoData/EventMembersData";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { AdminEventService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";

export default function EventDetails() {
  const params = useParams();
  const id = params.id as string;
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [date, setDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await AdminEventService.getEventById(id, token);
        setEventData(response?.data);
      } catch (error) {
        showErrorToast("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  // console.log("eventData==============", eventData);

  if (loading) return <div className="text-white p-10">Loading Event...</div>;
  if (!eventData)
    return <div className="text-white p-10">Event not found.</div>;

  const members = eventData?.data?.members || [];
  const totalItems = eventData.registeredMembersCount || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // console.log("members========", members);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/events"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Event Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Event Details</p>
      </div>

      <div className=" flex items-center justify-between mt-8">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Event Details
        </h2>
        <Link
          href="/dashboard/events/edit-event"
          className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer"
        >
          <PlusIcon />
          Edit Event
        </Link>
      </div>

      <div className=" bg-[#0a1929] p-4 rounded-2xl mt-5">
        <div className=" bg-[#07121d] p-4 rounded-2xl">
          <div>
            <h3 className=" text-white text-base font-semibold">
              {/* Annual Alumni Meetup */}
              {eventData?.data?.name}
            </h3>

            <div className="  space-y-1.5 my-4">
              <div className=" flex items-center gap-1">
                <RedCalender />
                <p className=" text-white text-sm ">
                  {/* 12 July, Monday 󠁯•󠁏󠁏 1:30 PM */}
                  {formatDate(eventData?.data?.date)} at {eventData?.data?.time}
                </p>
              </div>
              <div className=" flex items-center gap-1">
                <RedLocation />
                <p className=" text-white text-sm ">
                  {" "}
                  {eventData?.data?.location}
                </p>
              </div>
              <div className=" flex items-center gap-1">
                <RedDoller />
                <p className=" text-white text-sm ">
                  $ {eventData?.data?.amount}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className=" text-white text-base font-semibold">
              Event Overview
            </h3>
            <p className=" text-sm text-[#D2D2D5] mt-2.5">
              {/* This module develops the actor’s self-awareness, confidence, and
              creativity as a foundation for authentic performance. */}
              {eventData?.data?.overview}
            </p>
          </div>

          <div>
            <h3 className=" text-white text-sm mt-4">Key Learning Outcomes</h3>
            <ul className=" mt-2.5 text-white">
              <li className=" text-sm text-[#D2D2D5]">
                {" "}
                <span className=" text-[#E9201D]">⊹ </span> Gain self-awareness
                and confidence
              </li>
              <li className=" text-sm text-[#D2D2D5]">
                {" "}
                <span className=" text-[#E9201D]">⊹ </span> Boost creativity and
                focus
              </li>
              <li className=" text-sm text-[#D2D2D5]">
                {" "}
                <span className=" text-[#E9201D]">⊹ </span>Improve communication
                skillse
              </li>
            </ul>
          </div>

          <div className=" mt-4">
            <h3 className=" text-white text-sm font-semibold">
              Ticket Information
            </h3>
            <p className=" text-white text-sm mt-2.5">
              {/* Limited tickets available — reserve early! */}
              {eventData?.data?.description}
            </p>
          </div>
        </div>
      </div>

      {/* table */}

      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5">
        <div className=" flex flex-col lg:flex-row items-center justify-between mb-6">
          <h3 className=" text-white text-xl font-semibold">
            Event Members({members.length})
          </h3>
          <div className=" flex flex-col md:flex-row items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                value={search}
                onChange={handleSearchChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56]"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <DatePickerButton date={date} setDate={setDate} />
          </div>
        </div>

        {/* table here */}
        <DynamicTable
          columns={eventsColumn}
          data={members}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalpage={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          noDataMessage="No event members found"
          loading={false}
        />
      </div>
    </div>
  );
}
