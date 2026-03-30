import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, ChevronRight, Plus } from "lucide-react";
import { AddAssignmentModal } from "./AddAssignmentModal";

const assignments = [1, 2, 3];

export default function Assignments() {
  return (
    <div>
      <h3 className="text-2xl text-white my-5">All Assignments</h3>
      <Accordion type="single" collapsible className="w-full border-none">
        <AccordionItem
          value="item-1"
          className="bg-[#121A2C] rounded-[12px] border-none overflow-hidden"
        >
          {/* Accordion Header */}
          <div className="flex items-center justify-between bg-[#1E2638] px-6 py-4">
            <div className="flex items-center gap-4">
              <AccordionTrigger className="p-0 hover:no-underline text-white">
                {/* Custom Trigger content */}
              </AccordionTrigger>
              <div className="flex flex-col text-left">
                <span className="text-[#8D9CDC] text-sm font-medium">
                  Class-I
                </span>
                <h3 className="text-white text-lg font-semibold">
                  Voice & Breath Control
                </h3>
              </div>
            </div>
            <button className="text-[#8D9CDC] hover:text-white transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <AccordionContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Assignment Cards */}
              {assignments.map((item) => (
                <div
                  key={item}
                  className="bg-[#0A121E] border border-[#1E2638] p-5 rounded-[12px] hover:border-[#3E4766] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-white font-medium">Assignment 1</h4>
                      <span className="bg-[#FFC107] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Due 2 days
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#8D9CDC] group-hover:text-white transition-colors" />
                  </div>

                  <p className="text-[#A1AAB3] text-sm leading-relaxed mb-4">
                    Write a 500-word reflection on your current confidence level
                    and areas for improvement.
                  </p>

                  <p className="text-[#109334] text-sm font-medium">
                    Submissions: 22 | Graded: 18
                  </p>
                </div>
              ))}

              {/* Add Assignment Dotted Button */}
              {/* <button className="flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-[12px] p-5 min-h-35 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Assignment</span>
              </button> */}
              <AddAssignmentModal />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
