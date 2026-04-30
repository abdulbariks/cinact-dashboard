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
    const confirmMsg = `Are you sure you want to ${action} this post?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      let response;

      switch (action) {
        case "approve":
          response = await AdminCommunityService.approvePost(postId, token);
          break;
        case "reject":
          response = await AdminCommunityService.rejectPost(postId, token);
          break;
        case "flag":
          response = await AdminCommunityService.flagPost(postId, token);
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
  if (isLoading) {
    return (
      <div className="p-10 text-white text-center">Loading post details...</div>
    );
  }

  if (!post) {
    return <div className="p-10 text-white text-center">Post not found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/community"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Community Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Post Details</p>
      </div>

      <div className="p-4 border border-[#383e57] rounded-xl bg-[#030C15]">
        <div className="flex items-start gap-3.5">
          {!post.avatar || avatarError ? (
            <div className="size-10 rounded-full bg-[#1a2432] flex items-center justify-center text-xs text-[#E6E7E8] font-semibold">
              {getNameInitials(post.user_name)}
            </div>
          ) : (
            <Image
              src={post.avatar}
              alt={post.user_name}
              width={40}
              height={40}
              className="rounded-full object-cover size-10"
              onError={() => setAvatarError(true)}
            />
          )}

          <div className="flex-1">
            <h3 className="text-base text-[#A5A5AB] font-medium">
              {post.user_name}
            </h3>

            <div className="flex justify-between items-center gap-5">
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <p
                  className={`text-sm py-0.5 px-1.5 rounded-lg inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}
                >
                  {post.type}
                </p>
                <p
                  className={`text-sm py-0.5 px-1.5 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}
                >
                  {post.status}
                </p>
                <p className="text-sm text-[#777980] py-0.5 px-1.5 inline-block">
                  {post.date}
                </p>
              </div>
              {post.status == "APPROVED" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction("flag")}
                    className="p-1.5 bg-[#0e1825] rounded-lg flex items-center gap-2 text-[#18CC3F]"
                  >
                    <FlagIcon /> Flag
                  </button>
                  <button
                    onClick={() => handleAction("delete")}
                    className="p-1.5 bg-[#0e1825] rounded-lg cursor-pointer flex items-center gap-2 text-red-600"
                  >
                    <TrashIconRed /> Delete
                  </button>
                </div>
              )}

              {post.status == "REQUEST" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction("approve")}
                    className="p-1.5 bg-[#0e1825] rounded-lg flex items-center gap-2 text-[#18CC3F] cursor-pointer"
                  >
                    <GreenTikIcon /> Approve
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    className="p-1.5 bg-[#0e1825] rounded-lg cursor-pointer flex items-center gap-2 text-red-600"
                  >
                    <RedCross /> Reject
                  </button>
                </div>
              )}
            </div>

            <p className="text-[#A5A5AB] text-sm mt-3">{post.content}</p>

            <div className="flex items-center gap-6 mt-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {post.poll_options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-[#0a1726] border border-[#383e57] rounded-xl group hover:border-[#5F6CA0] transition-colors"
              >
                <span className="text-sm text-[#A5A5AB] group-hover:text-white">
                  {option.title}
                </span>
                {/* Optional: Add a circle indicator or vote count if available in API */}
                <div className="size-4 rounded-full border border-[#383e57] group-hover:border-[#5F6CA0]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
