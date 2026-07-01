"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoIcon from "@/components/icons/course-management/VideoIcon";
import PdfIcon from "@/components/icons/student-management/PdfIcon";
import PdfIconWhite from "@/components/icons/course-management/PdfIconWhite";
import VideoIconSecondary from "@/components/icons/course-management/VideoIconSecondary";
import TrashIconRed from "@/components/icons/course-management/TrashIconRed";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import TrashIcon from "@/components/icons/others/TrashIcon";
import CrossIcon from "@/components/icons/others/CrossIcon";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TGetAssetsResponse } from "@/types/tutor.mycourse";
import { TutorService } from "@/service/tutor/tutor.service";
import AddAssetsModal from "./modal/AddAssetsModal";

interface AssetsProps {
  classTitle: string | undefined;
  subjectName: string | undefined;
}

export default function Assets({ classTitle, subjectName }: AssetsProps) {
  const [openItem, setOpenItem] = useState<string>("asset-1");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedAssetName, setSelectedAssetName] = useState("");
  const params = useParams<{ id: string; classId: string }>();
  const courseId = params?.id;
  const classId = params?.classId;
  const [isAddAssetsOpen, setIsAddAssetsOpen] = useState(false);
  const [assetsData, setAssetsData] = useState({
    file: null as File | null,
  });

  // console.log("assetsData===========", assetsData);

  // console.log("classId==============", classId);

  const [assets, setAssets] = useState<TGetAssetsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // console.log("assets===========", assets);

  // Memoized fetch function so it can be reused anywhere
  const fetchAssets = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await TutorService.getAllAssetsByClass({
        classId: classId as string,
        token,
      });
      setAssets(response?.data || null);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to load Assets");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Initial load
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleAddAssets = async () => {
    if (!assetsData.file) return;
    const formData = new FormData();
    formData.append("attachments", assetsData.file);
    try {
      const response = await TutorService.uploadAssents({
        classId: classId as string,
        payload: formData,
      });
      showSuccessToast(response?.data?.message || "Assets added successfully!");
      // REFRESH DATA HERE
      await fetchAssets();
      setIsAddAssetsOpen(false);
      setAssetsData({ file: null }); // Reset form
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Error creating assets.",
      );
    }
  };

  const openWarningModal = (assetId: string, assetName: string) => {
    setSelectedAssetId(assetId);
    setSelectedAssetName(assetName);
    setIsWarningOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAssetId) return;
    try {
      await TutorService.deleteAsset({
        assetId: selectedAssetId,
        token: parseCookies().token || parseCookies().accessToken || "",
      });
      showSuccessToast("Asset deleted successfully!");
      await fetchAssets();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to delete asset",
      );
    } finally {
      setIsWarningOpen(false);
      setSelectedAssetId("");
      setSelectedAssetName("");
    }
  };

  if (loading && !assets) {
    return <div>Loading............</div>;
  }

  return (
    <div className=" p-4 bg-[#07121d] rounded-[12px]">
      <h2 className="text-xl font-medium text-white mb-4">All Assets</h2>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
        className="flex w-full flex-col gap-3"
      >
        {/* {assets.map((asset) => ( */}
        <AccordionItem
          // key={asset.id}
          value={`asset-`}
          className="rounded-2xl border border-[#3D4566] [&_[data-slot=accordion-trigger]>svg]:hidden"
        >
          <AccordionTrigger className="flex cursor-pointer items-center justify-between rounded-2xl data-[state=open]:rounded-b-none  px-4 text-left text-white hover:no-underline data-[state=open]:bg-[#262b40] bg-[#262b40]">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[#8D9CDC]">{classTitle}</p>
              <h3 className="text-base font-medium text-white">
                {subjectName}
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 text-[#A5A5AB] bg-[#081623] rounded-b-2xl">
            <div className="p-4 flex gap-6">
              <div className=" flex-1 ">
                <div className=" border-b  border-[#3D4566]">
                  <div className=" inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5">
                    <VideoIcon />
                    <h3 className=" text-base text-white font-medium">
                      Videos
                    </h3>
                  </div>
                </div>
                <div className=" mt-4 space-y-4">
                  {assets?.data?.videos?.map((video) => (
                    <div
                      key={video?.id}
                      className=" flex justify-between items-center border border-[#303650] rounded-[10px] bg-[#0a1d2e]"
                    >
                      <div className=" flex items-center gap-2.5">
                        <div className=" bg-[#303650] rounded-l-[10px] py-6 px-4">
                          <VideoIconSecondary />
                        </div>
                        <div>
                          <h4>{video?.file_name}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openWarningModal(video?.id, video?.file_name)
                        }
                        className=" pr-3 cursor-pointer"
                      >
                        <TrashIconRed />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsAddAssetsOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-lg mt-5 py-4 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Video</span>
                </button>
              </div>
              <div className=" flex-1 ">
                <div className=" border-b  border-[#3D4566]">
                  <div className=" inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5">
                    <PdfIconWhite />

                    <h3 className=" text-base text-white font-medium">
                      Attachments
                    </h3>
                  </div>
                </div>

                <div className=" mt-4 space-y-4">
                  {assets?.data?.files?.map((file) => (
                    <div
                      key={file?.id}
                      className=" flex justify-between items-center border border-[#303650] rounded-[10px] bg-[#0a1d2e]"
                    >
                      <div className=" flex items-center gap-2.5">
                        <div className=" bg-[#303650] rounded-l-[10px] py-6 px-4">
                          <PdfIcon />
                        </div>
                        <div>
                          <h4>{file?.file_name}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openWarningModal(file?.id, file?.file_name)
                        }
                        className=" pr-3 cursor-pointer"
                      >
                        <TrashIconRed />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsAddAssetsOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-lg py-4 mt-5 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Attachment</span>
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent
          hideCloseButton
          className="w-120 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-8 text-white"
        >
          <div className="flex flex-col items-center text-center">
            <Image src={warnigImg} alt="Warning" />
            <h3 className="mt-4 text-xl font-semibold text-white">
              Delete Asset?
            </h3>
            <p className="mt-2 text-sm text-[#B2B5B8]">
              Are you sure you want to delete
              <span className="text-white"> {selectedAssetName}</span>?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWarningOpen(false)}
                className="rounded-2xl  border border-[#3D4566] px-11 py-4 text-sm font-medium text-white hover:bg-[#5F6CA0] flex items-center gap-2.5"
              >
                <CrossIcon />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl bg-[#E9201D] px-11 py-4 text-sm font-medium text-white hover:bg-[#ff3b1f] flex items-center gap-2.5"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddAssetsModal
        open={isAddAssetsOpen}
        onOpenChange={setIsAddAssetsOpen}
        assetsData={assetsData}
        setAssetsData={setAssetsData}
        onAddAssets={handleAddAssets}
      />
    </div>
  );
}
