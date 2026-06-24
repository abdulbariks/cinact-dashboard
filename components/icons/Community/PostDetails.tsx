"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import BreadCrumpRightArrow from "../SuperAdmindashboard/BreadCrumpRightArrow";
import Image from "next/image";
import LikeIcon from "./LikeIcon";
import CommentIcon from "./CommentIcon";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import moment from "moment";
import { AdminCommunityService } from "@/service/user/user.service";
import FlagIcon from "./FlagIcon";
import TrashIconRed from "../course-management/TrashIconRed";
import GreenTikIcon from "./GreenTikIcon";
import RedCross from "./RedCross";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import CrossIcon from "@/components/icons/others/CrossIcon";
import TrashIcon from "@/components/icons/others/TrashIcon";

type postIdProps = { postId: string };

// Define the structure based on your API response
type PostData = {
  id: string;
  user_name: string;
  avatar: string | null;
  type: string;
  status: string;
  date: string;
  likes: number;
  comments: number;
  content: string;
  poll_options?: { id: string; title: string }[];
  attachments?: {
    id: string;
    file_name: string;
    file_path: string;
    type: string;
    mime_type?: string;
  }[];
};

const getNameInitials = (name: string) => {
  const trimmedName = name?.trim() || "";
  if (!trimmedName) return "NA";
  const words = trimmedName.split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
  }
  return trimmedName.slice(0, 2).toUpperCase();
};

const getTypeBadgeColors = (type: string): { bg: string; text: string } => {
  switch (type?.toLowerCase()) {
    case "student":
      return { bg: "bg-[#171c15]", text: "text-[#CC8718]" };
    case "almuni":
      return { bg: "bg-[#06102a]", text: "text-[#6774FF]" };
    case "admin":
      return { bg: "bg-[#1c0b13]", text: "text-[#E9201D]" };
    default:
      return { bg: "bg-[#3d3d3d]", text: "text-[#a5a5ab]" };
  }
};

const getStatusBadgeColors = (status: string): { bg: string; text: string } => {
  switch (status?.toLowerCase()) {
    case "approved":
      return { bg: "bg-[#051f19]", text: "text-[#18cc3f]" };
    case "request":
      return { bg: "bg-[#5a4a1a]", text: "text-[#fbbf24]" };
    case "flagged":
    case "flag":
      return { bg: "bg-[#1c2213]", text: "text-[#FFE205]" };
    default:
      return { bg: "bg-[#3d3d3d]", text: "text-[#a5a5ab]" };
  }
};

export default function PostDetails({ postId }: postIdProps) {
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  // Reusable Fetch Function
  const fetchDetails = useCallback(async () => {
    if (!postId) return;
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCommunityService.getPostDetailsById(
        postId,
        token,
      );

      if (response?.data?.success) {
        const data = response.data.data;
        setPost({
          id: data.id,
          user_name: data.author?.name || "Unknown",
          avatar: data.author?.avatar || null,
          type: data.author?.role_users?.[0]?.role?.title || "User",
          status: data.status,
          date: moment(data.createdAt).format("DD MMM YYYY"),
          likes: data.likes || 0,
          comments: data.comments || 0,
          content: data.content,
          poll_options: data.poll_options || [],
          attachments: data.attachments || [],
        });
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to fetch post details");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // 2. Action Handlers
  const handleAction = async (
    action: "approve" | "reject" | "flag" | "delete",
  ) => {
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      let response;

      switch (action) {
        case "approve":
          response = await AdminCommunityService.statusUpdatePost(
            postId,
            token,
            "APPROVED",
          );
          break;
        case "reject":
          response = await AdminCommunityService.statusUpdatePost(
            postId,
            token,
            "REJECTED",
          );
          break;
        case "flag":
          // Toggle between FLAGGED and UNFLAG/APPROVED
          const newStatus = post?.status === "FLAGGED" ? "APPROVED" : "FLAGGED";
          response = await AdminCommunityService.statusUpdatePost(
            postId,
            token,
            newStatus,
          );
          break;
        case "delete":
          response = await AdminCommunityService.deletePost(postId, token);
          break;
      }

      if (response?.data?.success) {
        showSuccessToast(
          response.data.message || `Post ${action}ed successfully`,
        );
        if (action === "delete") {
          window.location.href = "/dashboard/community";
        } else {
          fetchDetails();
        }
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || `Action failed`);
    }
  };

  // Click handler that only prompts a dialog for delete action
  const onActionClick = (action: "approve" | "reject" | "flag" | "delete") => {
    if (action === "delete") {
      setIsWarningOpen(true);
      return;
    }
    handleAction(action);
  };
  if (isLoading) {
    return (
      <div className="p-6 sm:p-10 text-white text-center">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 sm:p-10 text-white text-center">Post not found.</div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/community"
          className="text-sm sm:text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Community Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-sm sm:text-base font-medium text-[#8D9CDC]">
          Post Details
        </p>
      </div>

      <div className="p-3 sm:p-4 border border-[#383e57] rounded-xl bg-[#030C15]">
        <div className="flex items-start gap-2.5 sm:gap-3.5">
          {!post.avatar || avatarError ? (
            <div className="size-9 sm:size-10 rounded-full bg-[#1a2432] flex items-center justify-center text-xs text-[#E6E7E8] font-semibold">
              {getNameInitials(post.user_name)}
            </div>
          ) : (
            <Image
              src={post.avatar}
              alt={post.user_name}
              width={40}
              height={40}
              className="rounded-full object-cover size-9 sm:size-10"
              unoptimized
              onError={() => setAvatarError(true)}
            />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base text-[#A5A5AB] font-medium">
              {post.user_name}
            </h3>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-2">
                <p
                  className={`text-xs sm:text-sm py-0.5 px-1 rounded-lg inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}
                >
                  {post.type}
                </p>
                <p
                  className={`text-xs sm:text-sm py-0.5 px-1 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}
                >
                  {post.status}
                </p>
                <p className="text-xs sm:text-sm text-[#777980] py-0.5 px-1 inline-block">
                  {post.date}
                </p>
              </div>
              {post.status == "APPROVED" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onActionClick("flag")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg flex items-center gap-1.5 sm:gap-2 text-[#18CC3F] text-xs sm:text-sm"
                  >
                    <FlagIcon /> <span className="hidden sm:inline">Flag</span>
                  </button>
                  <button
                    onClick={() => onActionClick("delete")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg cursor-pointer flex items-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm"
                  >
                    <TrashIconRed />{" "}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
              {post.status == "FLAGGED" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onActionClick("flag")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg flex items-center gap-1.5 sm:gap-2 text-[#18CC3F] text-xs sm:text-sm"
                  >
                    <FlagIcon />{" "}
                    <span className="hidden sm:inline">Unflag</span>
                  </button>
                  <button
                    onClick={() => onActionClick("delete")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg cursor-pointer flex items-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm"
                  >
                    <TrashIconRed />{" "}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
              {post.status == "REQUEST" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onActionClick("approve")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg flex items-center gap-1.5 sm:gap-2 text-[#18CC3F] cursor-pointer text-xs sm:text-sm"
                  >
                    <GreenTikIcon />{" "}
                    <span className="hidden sm:inline">Approve</span>
                  </button>
                  <button
                    onClick={() => onActionClick("reject")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0e1825] rounded-lg cursor-pointer flex items-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm"
                  >
                    <RedCross />{" "}
                    <span className="hidden sm:inline">Reject</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[#A5A5AB] text-xs sm:text-sm mt-2 sm:mt-3">
              {post.content}
            </p>

            <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
              <div className="flex items-center gap-1">
                <LikeIcon />
                <p className="text-xs text-[#B2B5B8] font-medium">
                  {post.likes}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <CommentIcon />
                <p className="text-xs text-[#B2B5B8] font-medium">
                  {post.comments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Poll Options Section */}
        {post.poll_options && post.poll_options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {post.poll_options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#0a1726] border border-[#383e57] rounded-xl group hover:border-[#5F6CA0] transition-colors"
              >
                <span className="text-xs sm:text-sm text-[#A5A5AB] group-hover:text-white">
                  {option.title}
                </span>
                <div className="size-3 sm:size-4 rounded-full border border-[#383e57] group-hover:border-[#5F6CA0]" />
              </div>
            ))}
          </div>
        )}

        {/* Attachments Section */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {post.attachments.map((attachment) => (
              <div key={attachment.id}>
                {attachment.type === "IMAGE" && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0a1726] border border-[#383e57]">
                    <Image
                      src={attachment.file_path}
                      alt="Attachment"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                {attachment.type === "VIDEO" && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0a1726] border border-[#383e57]">
                    <video
                      src={attachment.file_path}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Delete confirmation dialog (only for delete) */}
        <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
          <DialogContent
            hideCloseButton
            className="w-120 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 sm:p-8 text-white"
          >
            <div className="flex flex-col items-center text-center px-4 sm:px-0">
              <Image
                src={warnigImg}
                alt="Warning"
                className="w-16 h-16 sm:w-auto sm:h-auto"
              />
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">
                Delete Post?
              </h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#B2B5B8] px-2 sm:px-0">
                Are you sure you want to delete this post?
              </p>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWarningOpen(false)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-[#3D4566] px-8 sm:px-11 py-2.5 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#5F6CA0]"
                >
                  <CrossIcon />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsWarningOpen(false);
                    await handleAction("delete");
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#E9201D] px-8 sm:px-11 py-2.5 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#ff3b1f]"
                >
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
