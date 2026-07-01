"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ModuleDetails from "./ModuleDetails";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast } from "@/lib/hotToast";
import { TGetCourseModulesResponse } from "@/types/tutor.mycourse";

interface CourseModulesProps {
  courseId: string | undefined;
  onClassAdded?: () => void;
}

export default function CourseModules({
  courseId,
  onClassAdded,
}: CourseModulesProps) {
  const [openItem, setOpenItem] = useState<string>("");

  const [modules, setModules] = useState<TGetCourseModulesResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const loadModules = useCallback(async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await TutorService.getAllCourseModules({
        courseId: courseId as string,
        token,
      });

      setModules(response?.data || null);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load modules details",
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      loadModules();
    }
  }, [courseId, loadModules]);

  // console.log("modules===============", modules);

  return (
    <div>
      <h2 className=" text-xl text-white font-medium mb-4">All Module</h2>
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
        className="w-full flex flex-col gap-3"
      >
        {modules?.data?.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.module_title}
            className="border border-[#3D4566] rounded-2xl [&_[data-slot=accordion-trigger]>svg]:hidden"
          >
            <AccordionTrigger className="flex items-center justify-between text-left text-white hover:no-underline cursor-pointer    px-4 data-[state=open]:bg-[#262b40] rounded-t-2xl rounded-b-none  ">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#8D9CDC]">
                  {/* Module-1 */}
                  {module.module_title}
                </p>
                <h3 className="text-base text-white font-medium">
                  {/* Personal Development */}
                  {module.module_name}
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-[#A5A5AB] px-4">
              <ModuleDetails
                module={module}
                onClassAdded={onClassAdded || loadModules}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
