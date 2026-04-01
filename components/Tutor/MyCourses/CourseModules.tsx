import RedCalender from "@/components/icons/others/RedCalender";
import RedDoller from "@/components/icons/others/RedDoller";
import RedLocation from "@/components/icons/others/RedLocation";
import RightArrowIcon from "@/components/icons/others/RightArrowIcon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AddClassModal } from "./modal/AddClassModal";

const modules = [
  {
    id: "1",
    title: "Personal Development",
    class: [
      {
        className: "Class-1",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
      {
        className: "Class-2",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
      {
        className: "Class-3",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
    ],
  },
  {
    id: "2",
    title: "Script Analysis",
    class: [
      {
        className: "Class-1",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
      {
        className: "Class-2",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
      {
        className: "Class-3",
        classTitle: "Voice & Breath Control",
        status: "Complete",
      },
    ],
  },
];

export default function CourseModules({ classDetails, setClassDetails }) {
  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Accordion key={module.id} type="single" collapsible>
          <AccordionItem
            value={module.id}
            className="border border-[#1c2a3f] rounded-xl bg-[#07121d] px-4"
          >
            <AccordionTrigger className="text-white hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-[#A5A5AB]">
                  Module-{module.id}
                </span>
                <span className="text-sm font-medium">{module.title}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-2">
              <div className=" bg-[#0a1929] p-4 rounded-2xl my-3 border">
                <div>
                  <h3 className=" text-white text-base font-semibold">
                    Module Overview
                  </h3>
                  <p className=" text-sm text-[#D2D2D5] mt-2.5">
                    This module develops the actor’s self-awareness, confidence,
                    and creativity as a foundation for authentic performance.
                  </p>
                </div>
                <div>
                  <h3 className=" text-white text-sm mt-4">
                    Key Learning Outcomes
                  </h3>
                  <ul className=" mt-2.5 text-white">
                    <li className=" text-sm text-[#D2D2D5]">
                      {" "}
                      <span className=" text-[#E9201D]">⊹ </span> Gain
                      self-awareness and confidence
                    </li>
                    <li className=" text-sm text-[#D2D2D5]">
                      {" "}
                      <span className=" text-[#E9201D]">⊹ </span> Boost
                      creativity and focus
                    </li>
                    <li className=" text-sm text-[#D2D2D5]">
                      {" "}
                      <span className=" text-[#E9201D]">⊹ </span>Improve
                      communication skillse
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {module.class?.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setClassDetails(c.className)}
                    className="bg-[#07121d] p-4 rounded-[12px] border-t-[0.5px] border-b-[0.5px] border-r-[0.5px] border-l-3 border-[#8D9CDC] cursor-pointer"
                  >
                    <div className="flex justify-between items-center p-3">
                      {" "}
                      <div>
                        <h2 className=" text-white text-lg font-medium">
                          {c.className}
                          <span className=" py-1 px-2.5 rounded-full text-sm text-[#18CC3F] bg-[#2a3d2e]  ml-2">
                            {c.status}
                          </span>
                        </h2>
                        <p className="text-lg text-white font-medium mt-3">
                          {c.classTitle}
                        </p>
                      </div>
                      <RightArrowIcon />
                    </div>
                  </div>
                ))}

                {/* <button
                  type="button"
                  className=" bg-[#07121d] p-4 rounded-[12px] border border-dashed border-[#505B86] min-h-30 flex  items-center gap-2 justify-center text-center text-white hover:bg-[#0b1b2b] transition-colors cursor-pointer"
                >
                  <span className=" text-3xl leading-none">+</span>
                  <span className=" mt-2 text-lg font-medium">Add Class</span>
                </button> */}
                <AddClassModal />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
