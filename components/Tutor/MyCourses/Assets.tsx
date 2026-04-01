import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, FileText, Trash2, Plus } from "lucide-react";

export default function Assets() {
  const listCardStyles =
    "flex items-center justify-between bg-[#0A121E] border border-[#1E2638] rounded-lg overflow-hidden group hover:border-[#3E4766] transition-all";
  const iconBoxStyles =
    "bg-[#1E2638] p-4 flex items-center justify-center text-[#8D9CDC]";

  return (
    <div className="w-full space-y-4">
      <Accordion type="single" collapsible className="border-none">
        <AccordionItem
          value="module-1"
          className="bg-[#121A2C] rounded-xl border-none overflow-hidden"
        >
          {/* --- Accordion Header --- */}
          <div className="flex items-center bg-[#262B40] px-6 py-4 border-b border-[#1E2638]">
            <AccordionTrigger className="p-0 hover:no-underline grow-0 mr-4 text-[#8D9CDC]">
              {/* Icon is usually handled by shadcn's default, or use a custom one */}
            </AccordionTrigger>
            <div className="flex flex-col text-left">
              <span className="text-[#8D9CDC] text-xs font-medium uppercase tracking-wider">
                Module-1
              </span>
              <h3 className="text-white text-lg font-semibold">
                Personal Development
              </h3>
            </div>
          </div>

          <AccordionContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* --- Videos Column --- */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-red-600 w-fit">
                  <Video className="h-5 w-5 text-white" />
                  <h4 className="text-white font-medium text-lg">Videos</h4>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className={listCardStyles}>
                      <div className="flex items-center">
                        <div className={iconBoxStyles}>
                          <Video className="h-5 w-5" />
                        </div>
                        <span className="ml-4 text-[#A1AAB3] text-sm font-medium">
                          class-1.mp4
                        </span>
                      </div>
                      <button className="mr-4 text-[#EE2D24] hover:scale-110 transition-transform cursor-pointer">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Video Button */}
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-lg py-4 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all cursor-pointer">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Video</span>
                  </button>
                </div>
              </section>

              {/* --- Attachments Column --- */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-red-600 w-fit">
                  <FileText className="h-5 w-5 text-white" />
                  <h4 className="text-white font-medium text-lg">
                    Attachments
                  </h4>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className={listCardStyles}>
                      <div className="flex items-center">
                        <div className={iconBoxStyles}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="ml-4 text-[#A1AAB3] text-sm font-medium">
                          Attachment-006.pdf
                        </span>
                      </div>
                      <button className="mr-4 text-[#EE2D24] hover:scale-110 transition-transform cursor-pointer">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Attachment Button */}
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-lg py-4 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all cursor-pointer">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Attachment</span>
                  </button>
                </div>
              </section>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
