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
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TFiles, TGetAssetsResponse, TVideos } from "@/types/tutor.mycourse";

type SelectedAsset = {
  id: string;
  name: string;
};

export default function Assets() {
  const [openItem, setOpenItem] = useState<string>("class-assets");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
  const [assets, setAssets] = useState<TGetAssetsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ classId: string }>();
  const classId = params?.classId;

  const fetchAssets = useCallback(async () => {
    if (!classId) return;

    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.getAllAssetsByClass({
        classId,
        token,
      });

      setAssets(response?.data || null);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const openWarningModal = (asset: SelectedAsset) => {
    setSelectedAsset(asset);
    setIsWarningOpen(true);
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset?.id) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.deleteAssets({
        assetId: selectedAsset.id,
        token,
      });

      showSuccessToast(response?.data?.message || "Asset deleted successfully");
      setIsWarningOpen(false);
      setSelectedAsset(null);
      await fetchAssets();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to delete asset");
    }
  };

  const renderAssetRow = (asset: TVideos | TFiles, icon: React.ReactNode) => {
    const assetUrl = asset.file_path || asset.asset_url || "#";

    return (
      <div
        key={asset.id}
        className="flex items-center justify-between rounded-[10px] border border-[#303650] bg-[#0a1d2e]"
      >
        <a
          href={assetUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-1 items-center gap-2.5"
        >
          <div className="rounded-l-[10px] bg-[#303650] px-4 py-6">
            {icon}
          </div>
          <h4 className="truncate pr-3 text-sm text-[#D2D2D5]">
            {asset.file_name}
          </h4>
        </a>
        <button
          type="button"
          onClick={() => openWarningModal({ id: asset.id, name: asset.file_name })}
          className="cursor-pointer pr-3"
        >
          <TrashIconRed />
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-[12px] bg-[#07121d] p-4">
      <h2 className="mb-4 text-xl font-medium text-white">All Assets</h2>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
        className="flex w-full flex-col gap-3"
      >
        <AccordionItem
          value="class-assets"
          className="rounded-2xl border border-[#3D4566] [&_[data-slot=accordion-trigger]>svg]:hidden"
        >
          <AccordionTrigger className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#262b40] px-4 text-left text-white hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-[#262b40]">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[#8D9CDC]">Class Assets</p>
              <h3 className="text-base font-medium text-white">
                {(assets?.data?.videos?.length || 0) + (assets?.data?.files?.length || 0)} assets
              </h3>
            </div>
          </AccordionTrigger>

          <AccordionContent className="rounded-b-2xl bg-[#081623] px-4 text-[#A5A5AB]">
            {loading ? (
              <p className="p-4 text-sm text-[#A5A5AB]">Loading assets...</p>
            ) : (
              <div className="flex flex-col gap-6 p-4 lg:flex-row">
                <div className="flex-1">
                  <div className="border-b border-[#3D4566]">
                    <div className="inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5">
                      <VideoIcon />
                      <h3 className="text-base font-medium text-white">Videos</h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {assets?.data?.videos?.length ? (
                      assets.data.videos.map((video) =>
                        renderAssetRow(video, <VideoIconSecondary />),
                      )
                    ) : (
                      <p className="text-sm text-[#A5A5AB]">No videos found.</p>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="border-b border-[#3D4566]">
                    <div className="inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5">
                      <PdfIconWhite />
                      <h3 className="text-base font-medium text-white">Attachments</h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {assets?.data?.files?.length ? (
                      assets.data.files.map((file) => renderAssetRow(file, <PdfIcon />))
                    ) : (
                      <p className="text-sm text-[#A5A5AB]">No attachments found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
            <h3 className="mt-4 text-xl font-semibold text-white">Delete Asset?</h3>
            <p className="mt-2 text-sm text-[#B2B5B8]">
              Are you sure you want to delete
              <span className="text-white"> {selectedAsset?.name}</span>?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWarningOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl border border-[#3D4566] px-11 py-4 text-sm font-medium text-white hover:bg-[#5F6CA0]"
              >
                <CrossIcon />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAsset}
                className="flex items-center gap-2.5 rounded-2xl bg-[#E9201D] px-11 py-4 text-sm font-medium text-white hover:bg-[#ff3b1f]"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
